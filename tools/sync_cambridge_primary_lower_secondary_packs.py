#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT / "data" / "cambridge-primary-lower-secondary"
DEFAULT_OUTPUT_PATH = ROOT / "generated-cambridge-primary-lower-secondary-packs.js"
CAMBRIDGE_BASE = "https://www.cambridgeinternational.org"
PRIMARY_URL = f"{CAMBRIDGE_BASE}/programmes-and-qualifications/cambridge-primary/curriculum/"
LOWER_SECONDARY_URL = f"{CAMBRIDGE_BASE}/programmes-and-qualifications/cambridge-lower-secondary/curriculum/"
DATA_BEGIN = "// BEGIN_IC_EDUCATE_CAMBRIDGE_PRIMARY_LOWER_SECONDARY_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_CAMBRIDGE_PRIMARY_LOWER_SECONDARY_PACK_DATA"

DEFAULT_FOCUS = [
    "Curriculum framework",
    "Learning objectives",
    "Knowledge, understanding and skills",
    "Classroom practice",
    "Progression checks",
    "Assessment support",
]


@dataclass(frozen=True)
class CurriculumSubject:
    syllabus: str
    level: str
    label: str
    code: str
    href: str

    @property
    def page_url(self) -> str:
        return urllib.parse.urljoin(CAMBRIDGE_BASE, self.href)

    @property
    def title(self) -> str:
        text = html.unescape(self.label)
        text = re.sub(r"^Cambridge\s+(Primary|Lower Secondary)\s+", "", text)
        text = re.sub(r"\s*\(\d{4}\)\s*$", "", text)
        return " ".join(text.split())

    @property
    def app_label(self) -> str:
        return f"{self.title} - {self.code}"

    @property
    def slug(self) -> str:
        return slugify(f"{self.syllabus}-{self.title}-{self.code}")


def safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def slugify(value: Any) -> str:
    text = html.unescape(safe_text(value)).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "item"


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def fetch_text(url: str, timeout: int = 90) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_line(value: str) -> str:
    text = html.unescape(value)
    text = re.sub(r"<script.*?</script>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" -\t")


def parse_curriculum_subjects(html_text: str, syllabus: str, level: str, path_fragment: str) -> list[CurriculumSubject]:
    subjects: list[CurriculumSubject] = []
    seen_codes: set[str] = set()
    pattern = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.I | re.S)
    for href, raw_label in pattern.findall(html_text):
        label = clean_line(raw_label)
        code_match = re.search(r"\((\d{4})\)\s*$", label)
        if not code_match:
            continue
        if path_fragment not in href:
            continue
        if "/index.aspx" in href.lower():
            continue
        code = code_match.group(1)
        if code in seen_codes:
            continue
        seen_codes.add(code)
        subjects.append(CurriculumSubject(syllabus=syllabus, level=level, label=label, code=code, href=href))
    return subjects


def extract_focus_items(page_html: str, subject: CurriculumSubject) -> list[str]:
    text = page_html
    candidates: list[str] = []
    heading_pattern = re.compile(r"<h[1-4][^>]*>(.*?)</h[1-4]>", re.I | re.S)
    for raw in heading_pattern.findall(text):
        line = clean_line(raw)
        if not line or len(line) < 5 or len(line) > 90:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["cambridge", "cookie", "breadcrumb", "navigation"]):
            continue
        candidates.append(line)
    bullet_pattern = re.compile(r"<li[^>]*>(.*?)</li>", re.I | re.S)
    for raw in bullet_pattern.findall(text):
        line = clean_line(raw)
        if not line or len(line) < 8 or len(line) > 110:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["cambridge", "programmes and qualifications", "resource list", "facebook", "linkedin", "youtube"]):
            continue
        if any(key in lower for key in ["learn", "develop", "skill", "knowledge", "understanding", "assessment", "curriculum", "support", "progress"]):
            candidates.append(line)

    out: list[str] = []
    seen: set[str] = set()
    for item in candidates:
        item = re.sub(r"\s+", " ", item).strip(" .")
        key = item.lower()
        if key in seen:
            continue
        if key == subject.title.lower():
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= 8:
            break
    return out if len(out) >= 4 else DEFAULT_FOCUS[:]


def quiz_question(pack_id: str, lane: str, index: int, prompt: str, correct: str, distractors: list[str], explanation: str) -> dict[str, Any]:
    return {
        "id": f"{pack_id}-{slugify(lane)}-{index}",
        "lane": lane,
        "prompt": prompt,
        "concept": explanation,
        "choices": [correct, *distractors[:2]],
        "answer": 0,
        "explanation": explanation,
    }


def build_pack(subject: CurriculumSubject, focus_items: list[str]) -> dict[str, Any]:
    pack_id = f"official-{slugify(subject.syllabus)}-{subject.code}"
    selected = focus_items[:6] if focus_items else DEFAULT_FOCUS[:6]
    note_cards = [
        {
            "title": "Curriculum map",
            "points": [
                f"This pack is built from the official {subject.syllabus} {subject.title} {subject.code} curriculum page.",
                "Use it as a broad map before deeper stage-level lessons and practice are generated.",
                "Connect each focus area to the learning objectives, classroom tasks, and progress checks.",
            ],
        },
        {
            "title": "Main focus areas",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "How to study it",
            "points": [
                "Turn each curriculum focus area into one explain-out-loud prompt.",
                "Create short practice tasks that show knowledge, understanding, and skill.",
                "Use mistakes to decide which learning objective needs another example.",
            ],
        },
        {
            "title": "Progress loop",
            "points": [
                "Start with a small retrieval task before rereading.",
                "Use examples from classwork or a learner resource to check understanding.",
                "End by naming one thing to practise again in two days.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What is the first use of this {subject.title} curriculum pack?", "Mapping the official curriculum into revision priorities", ["Memorising the web address", "Skipping the learning objectives"], "The curriculum map shows what to learn and practise."),
            quiz_question(pack_id, "Foundation", 2, "Which action makes revision active?", "Explain one focus area in your own words", ["Only stare at the heading", "Avoid checking examples"], "Active explanation reveals gaps quickly."),
            quiz_question(pack_id, "Foundation", 3, "Why track progress?", "To see which learning objective needs more practice", ["To remove all hard topics", "To replace classroom tasks"], "Progress checks guide the next practice task."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should '{selected[0]}' be revised?", "Make notes, examples, and a short practice task for it", ["Ignore it until the end of term", "Treat it only as a title"], "Each focus area needs retrieval plus application."),
            quiz_question(pack_id, "Core", 2, "What makes feedback useful?", "It points to the exact skill or objective to improve", ["It only gives a score", "It hides repeated mistakes"], "Good feedback tells you what to do next."),
            quiz_question(pack_id, "Core", 3, "What should a learner do after a mistake?", "Link it to a focus area and retry with a new example", ["Assume the topic is finished", "Delete the work"], "Retrying with feedback improves transfer."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a learner go beyond recall?", "Use the focus area in a new example or problem", ["Only copy headings", "Avoid unfamiliar contexts"], "New contexts show whether understanding is flexible."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final check?", "Explain the focus area without notes and complete a timed task", ["Read the page title only", "Switch topics whenever one feels hard"], "Timed practice tests recall under pressure."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated weak areas be handled?", "Group them and schedule targeted review", ["Treat them as random", "Stop practising"], "Patterns in mistakes point to the next best lesson target."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four focus areas from the {subject.syllabus} {subject.title} curriculum.",
        "Choose one focus area and explain it in your own words.",
        "Write one short practice task for a selected focus area.",
        "Describe how you would check whether the task was successful.",
        "Create two flashcard prompts for a weak focus area.",
        "Explain one mistake a learner might make and how to fix it.",
        "Plan a two-day review cycle for one focus area.",
        "Write one example that applies the focus area in a new context.",
        "Compare two focus areas and explain how they connect.",
        "Create a mini checklist for the next lesson or revision session.",
        "Write a short reflection on which focus area needs the most work.",
        "Plan a timed practice task and state how it will be reviewed.",
    ]
    for index, prompt in enumerate(prompts, start=1):
        worksheet_questions.append(
            {
                "number": index,
                "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
                "prompt": prompt,
                "marks": 3,
                "answerPoints": [
                    "Use a specific curriculum focus area.",
                    "Give a clear example or practice action.",
                    "Explain how progress will be checked or improved.",
                ],
            }
        )
    answer_key_lines = [
        f"Q{item['number']} ({item['lane']}, {item['marks']} marks) - {item['prompt']}\n"
        + "\n".join(f"- {point}" for point in item["answerPoints"])
        for item in worksheet_questions
    ]
    return {
        "id": pack_id,
        "generatedAt": utc_now(),
        "provider": "official-cambridge-curriculum-bundle",
        "title": f"{subject.title} Study Pack",
        "subtitle": f"{subject.syllabus} {subject.code} - official curriculum overview",
        "cambridgeCurriculum": {
            "syllabus": subject.syllabus,
            "level": subject.level,
            "code": subject.code,
            "label": subject.app_label,
            "sourceUrl": subject.page_url,
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Use the official {subject.syllabus} {subject.title} curriculum page as the coverage checklist.",
                "Prioritise focus areas that are weak or frequently missed.",
                "Pair each area with active recall, a short practice task, and feedback review.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable overview practice for {subject.syllabus} {subject.title} {subject.code}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"curriculum-{subject.code}"],
            "topicMatches": [],
            "libraryMatches": [],
        },
    }


def bundle_template(data: dict[str, Any]) -> str:
    json_blob = json.dumps(data, ensure_ascii=True, indent=2, sort_keys=True)
    return f"""(function () {{
  if (typeof window === "undefined") {{
    return;
  }}

{DATA_BEGIN}
  const DATA = {json_blob};
{DATA_END}

  function safeText(value, fallback = "") {{
    return String(value ?? fallback).trim();
  }}

  function slugify(value) {{
    return safeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item";
  }}

  function clone(value) {{
    return JSON.parse(JSON.stringify(value));
  }}

  function subjectAliases(subject) {{
    const code = safeText(subject.code);
    return [
      safeText(subject.label),
      safeText(subject.title),
      `${{safeText(subject.title)}} - ${{code}}`,
      code
    ].filter(Boolean).map(slugify);
  }}

  const SUBJECTS = DATA.subjects || [];
  const PACKS = DATA.packs || {{}};
  const SUBJECT_BY_SYLLABUS_ALIAS = SUBJECTS.reduce((out, subject) => {{
    const syllabus = safeText(subject.syllabus);
    if (!out[syllabus]) {{
      out[syllabus] = {{}};
    }}
    subjectAliases(subject).forEach((alias) => {{
      out[syllabus][alias] = subject.id;
    }});
    return out;
  }}, {{}});

  function requestSubjectId(request) {{
    const syllabus = safeText(request?.syllabus);
    const subject = safeText(request?.topic || request?.subject);
    return SUBJECT_BY_SYLLABUS_ALIAS[syllabus]?.[slugify(subject)] || "";
  }}

  function find(request) {{
    const id = requestSubjectId(request);
    if (!id || !PACKS[id]) {{
      return null;
    }}
    return clone(PACKS[id]);
  }}

  function catalogSyllabi() {{
    const byName = {{}};
    SUBJECTS.forEach((subject) => {{
      const syllabus = safeText(subject.syllabus);
      if (!byName[syllabus]) {{
        byName[syllabus] = {{
          name: syllabus,
          levels: [safeText(subject.level, "Standard")],
          subjects: []
        }};
      }}
      byName[syllabus].subjects.push({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        topicPacks: [
          {{
            id: `curriculum-${{safeText(subject.code)}}`,
            title: "Official curriculum overview",
            source: "official-cambridge-curriculum",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }});
    }});
    return Object.values(byName);
  }}

  window.IC_EDUCATE_CAMBRIDGE_PRIMARY_LOWER_SECONDARY_PACKS = {{
    metadata: DATA.metadata || {{}},
    find,
    catalogSyllabi,
    count: () => Object.keys(PACKS).length,
    subjects: () => clone(SUBJECTS)
  }};
}})();
"""


def read_bundle_data(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"metadata": {}, "subjects": [], "packs": {}}
    text = path.read_text(encoding="utf-8")
    match = re.search(
        re.escape(DATA_BEGIN) + r"\s*const DATA = (\{.*?\});\s*" + re.escape(DATA_END),
        text,
        flags=re.S,
    )
    if not match:
        return {"metadata": {}, "subjects": [], "packs": {}}
    return json.loads(match.group(1))


def write_bundle(path: Path, data: dict[str, Any]) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(bundle_template(data), encoding="utf-8")
    tmp.replace(path)


def sync_subject(subject: CurriculumSubject, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    subject_dir = data_dir / subject.slug
    subject_dir.mkdir(parents=True, exist_ok=True)
    html_path = subject_dir / "page.html"
    text_path = subject_dir / "page.txt"
    meta_path = subject_dir / "metadata.json"
    if force_download or not html_path.exists():
        page_html = fetch_text(subject.page_url, timeout=timeout)
        html_path.write_text(page_html, encoding="utf-8")
    else:
        page_html = html_path.read_text(encoding="utf-8", errors="replace")
    page_text = clean_line(page_html)
    text_path.write_text(page_text, encoding="utf-8")
    focus_items = extract_focus_items(page_html, subject)
    pack = build_pack(subject, focus_items)
    subject_id = f"{slugify(subject.syllabus)}-{subject.code}"
    subject_data = {
        "id": subject_id,
        "syllabus": subject.syllabus,
        "level": subject.level,
        "label": subject.app_label,
        "title": subject.title,
        "code": subject.code,
        "sourceUrl": subject.page_url,
        "localHtml": str(html_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "focusItems": focus_items,
    }
    metadata = {
        **subject_data,
        "downloadedAt": utc_now(),
    }
    meta_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")
    return subject_data, pack


def discover_subjects(timeout: int) -> list[CurriculumSubject]:
    primary = parse_curriculum_subjects(
        fetch_text(PRIMARY_URL, timeout=timeout),
        "Cambridge Primary",
        "Standard",
        "/programmes-and-qualifications/cambridge-primary/curriculum/",
    )
    lower = parse_curriculum_subjects(
        fetch_text(LOWER_SECONDARY_URL, timeout=timeout),
        "Cambridge Lower Secondary",
        "Standard",
        "/programmes-and-qualifications/cambridge-lower-secondary/curriculum/",
    )
    return [*primary, *lower]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download official Cambridge Primary and Lower Secondary curriculum pages and generate packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only-code", action="append", default=[])
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--sleep", type=float, default=0.1)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    official_subjects = discover_subjects(args.timeout)
    if args.only_code:
        wanted = set(args.only_code)
        official_subjects = [subject for subject in official_subjects if subject.code in wanted]
    data = read_bundle_data(args.output)
    packs = data.setdefault("packs", {})
    existing_ids = set(packs.keys())
    queue = [
        subject
        for subject in official_subjects
        if args.force or f"{slugify(subject.syllabus)}-{subject.code}" not in existing_ids
    ]
    if args.limit > 0:
        queue = queue[: args.limit]

    print(f"Official Cambridge Primary/Lower Secondary entries found: {len(official_subjects)}")
    print(f"Existing generated curriculum packs: {len(existing_ids)}")
    print(f"Generation/download queue: {len(queue)}")
    if args.dry_run:
        for subject in queue:
            print(f"- {subject.syllabus} {subject.app_label}: {subject.page_url}")
        return 0

    subjects_by_id = {item.get("id"): item for item in data.get("subjects") or [] if item.get("id")}
    failures: list[tuple[CurriculumSubject, str]] = []
    for index, subject in enumerate(queue, start=1):
        print(f"[{index}/{len(queue)}] {subject.syllabus} {subject.app_label}")
        try:
            subject_data, pack = sync_subject(subject, args.data_dir, args.timeout, args.force_download)
            subjects_by_id[subject_data["id"]] = subject_data
            packs[subject_data["id"]] = pack
            data["subjects"] = sorted(subjects_by_id.values(), key=lambda item: (item["syllabus"], item["label"]))
            data["metadata"] = {
                "generatedAt": utc_now(),
                "source": "Cambridge International official Primary and Lower Secondary curriculum pages",
                "sourceUrls": [PRIMARY_URL, LOWER_SECONDARY_URL],
                "officialEntryCount": len(official_subjects),
                "packCount": len(packs),
            }
            write_bundle(args.output, data)
        except Exception as exc:
            failures.append((subject, str(exc)))
            print(f"  failed: {str(exc)[:500]}")
            if not args.continue_on_error:
                raise
        if args.sleep:
            time.sleep(args.sleep)

    print(f"Wrote {len(packs)} official Cambridge Primary/Lower Secondary pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for subject, error in failures:
            print(f"- {subject.syllabus} {subject.app_label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
