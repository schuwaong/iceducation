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
DEFAULT_DATA_DIR = ROOT / "data" / "hkdse-subjects"
DEFAULT_OUTPUT_PATH = ROOT / "generated-hkdse-subject-packs.js"
HKEAA_BASE = "https://www.hkeaa.edu.hk"
SUBJECTS_URL = f"{HKEAA_BASE}/en/hkdse/assessment/subject_information/"
SYLLABUS_NAME = "HKDSE"
DATA_BEGIN = "// BEGIN_IC_EDUCATE_HKDSE_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_HKDSE_PACK_DATA"

SUBJECT_ALIASES = {
    "Chinese Language": "中國語文",
    "English Language": "英國語文",
    "Mathematics": "數學",
    "Citizenship and Social Development": "公民與社會發展",
    "Biology": "生物",
    "Physics": "物理",
    "Economics": "經濟",
    "Geography": "地理",
    "History": "歷史",
    "Visual Arts": "視覺藝術",
}

WANTED_ENGLISH = set(SUBJECT_ALIASES)
DEFAULT_FOCUS = [
    "Assessment framework",
    "Curriculum and Assessment Guide",
    "Public examination format",
    "Question types and command words",
    "School-based assessment where applicable",
    "Sample papers and performance standards",
]


@dataclass(frozen=True)
class HkdseSubject:
    english_label: str
    app_label: str
    href: str

    @property
    def page_url(self) -> str:
        return urllib.parse.urljoin(SUBJECTS_URL, html.unescape(self.href))

    @property
    def slug(self) -> str:
        return slugify(f"{self.english_label}-{self.app_label}")


def safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def slugify(value: Any) -> str:
    text = html.unescape(safe_text(value)).lower()
    text = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "-", text).strip("-")
    return text or "item"


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def fetch_text(url: str, timeout: int = 90) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 IC-Educate/1.0"})
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


def parse_subjects(index_html: str) -> list[HkdseSubject]:
    subjects: list[HkdseSubject] = []
    seen: set[str] = set()
    pattern = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.I | re.S)
    for href, raw_label in pattern.findall(index_html):
        label = clean_line(raw_label)
        if label not in WANTED_ENGLISH:
            continue
        if "category_a_subjects/hkdse_subj.html" not in href:
            continue
        if label in seen:
            continue
        seen.add(label)
        subjects.append(HkdseSubject(english_label=label, app_label=SUBJECT_ALIASES[label], href=href))
    return subjects


def extract_resource_links(page_html: str, page_url: str) -> list[dict[str, str]]:
    resources: list[dict[str, str]] = []
    seen: set[str] = set()
    pattern = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.I | re.S)
    wanted = ["assessment framework", "curriculum and assessment guide", "sample paper", "sample questions", "samples of candidates"]
    for href, raw_label in pattern.findall(page_html):
        label = clean_line(raw_label)
        lower = f"{href} {label}".lower()
        if not any(key in lower for key in wanted):
            continue
        url = urllib.parse.urljoin(page_url, html.unescape(href))
        key = url.lower()
        if key in seen:
            continue
        seen.add(key)
        resources.append({"label": label, "url": url})
        if len(resources) >= 8:
            break
    return resources


def extract_focus_items(resources: list[dict[str, str]], subject: HkdseSubject) -> list[str]:
    items = [safe_text(item.get("label")) for item in resources if safe_text(item.get("label"))]
    out: list[str] = []
    seen: set[str] = set()
    for item in [*items, *DEFAULT_FOCUS]:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= 8:
            break
    return out[:8]


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


def build_pack(subject: HkdseSubject, resources: list[dict[str, str]], focus_items: list[str]) -> dict[str, Any]:
    pack_id = f"official-hkdse-{slugify(subject.app_label)}"
    selected = focus_items[:6]
    resource_points = [f"{item['label']}: {item['url']}" for item in resources[:4]]
    if not resource_points:
        resource_points = [f"Use the HKEAA subject information page: {subject.page_url}"]
    note_cards = [
        {
            "title": "HKEAA subject map",
            "points": [
                f"This pack is built from the official HKEAA HKDSE {subject.english_label} subject information page.",
                f"Use it for {subject.app_label} syllabus and assessment planning.",
                "Start with the assessment framework, then connect practice to the Curriculum and Assessment Guide.",
            ],
        },
        {
            "title": "Official links",
            "points": resource_points,
        },
        {
            "title": "Main focus areas",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "Study loop",
            "points": [
                "Turn each official link into a checklist of examinable content and skills.",
                "Use sample papers or questions to test one focus area at a time.",
                "Record weak areas against the guide wording before choosing the next practice task.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What is the first use of this HKDSE {subject.english_label} pack?", "Mapping official HKEAA guidance into revision priorities", ["Memorising only page titles", "Skipping assessment information"], "The official subject page points to the guide, framework, and sample materials."),
            quiz_question(pack_id, "Foundation", 2, "Which document helps define content coverage?", "The Curriculum and Assessment Guide", ["A random forum post", "Only a final grade"], "The guide is the core source for coverage and expectations."),
            quiz_question(pack_id, "Foundation", 3, "Why check sample materials?", "They show how knowledge and skills are assessed", ["They replace all learning", "They remove the need to practise"], "Sample papers and questions make assessment demands concrete."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should '{selected[0]}' be used?", "Make a checklist and practise one related question type", ["Ignore it unless easy", "Treat it as a school notice only"], "Each official resource should become study actions."),
            quiz_question(pack_id, "Core", 2, "What makes feedback useful?", "It links mistakes back to the guide or framework", ["It only records a score", "It hides recurring errors"], "Useful feedback tells you what to relearn."),
            quiz_question(pack_id, "Core", 3, "How should revision be sequenced?", "Coverage checklist, targeted practice, marking, correction review", ["Practice before reading the task", "Only reread everything"], "A loop keeps revision focused."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a student move beyond recall?", "Apply guide terms to new sample-paper contexts", ["Only copy headings", "Avoid unfamiliar questions"], "Strong answers transfer knowledge into exam tasks."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final check?", "Timed practice followed by corrections linked to the official guide", ["Reading the page title only", "Deleting hard topics"], "Timed practice plus review exposes final gaps."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated weak areas be handled?", "Group them by official focus area and schedule targeted review", ["Assume they are random", "Stop practising"], "Patterns show where revision should go next."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four official HKDSE {subject.english_label} resources or focus areas to check.",
        "Choose one focus area and explain how it affects revision.",
        "Write one practice task based on the Curriculum and Assessment Guide.",
        "Describe how sample papers or questions should be reviewed.",
        "Create two flashcard prompts for one weak area.",
        "Explain one common mistake and link it to the guide or framework.",
        "Plan a two-day review cycle for one official focus area.",
        "Write one exam-style prompt for a selected focus area.",
        "Compare two official resources and explain how they support revision.",
        "Create a mini checklist for the next practice session.",
        "Write a short reflection on which focus area needs the most work.",
        "Plan a timed practice task and state how it will be marked.",
    ]
    for index, prompt in enumerate(prompts, start=1):
        worksheet_questions.append(
            {
                "number": index,
                "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
                "prompt": prompt,
                "marks": 3,
                "answerPoints": [
                    "Use a specific official HKDSE resource or focus area.",
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
        "provider": "official-hkdse-bundle",
        "title": f"{subject.app_label} Study Pack",
        "subtitle": f"HKDSE {subject.english_label} - official HKEAA subject information",
        "hkdse": {
            "englishLabel": subject.english_label,
            "label": subject.app_label,
            "subjectPageUrl": subject.page_url,
            "resources": resources,
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Use the official HKEAA {subject.english_label} subject information page as the source map.",
                "Prioritise the Curriculum and Assessment Guide and assessment framework.",
                "Pair coverage review with sample questions, marking, and correction review.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable overview practice for HKDSE {subject.english_label}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"hkdse-{slugify(subject.app_label)}"],
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
      .replace(/[^a-z0-9\\u4e00-\\u9fff]+/g, "-")
      .replace(/^-|-$/g, "") || "item";
  }}

  function clone(value) {{
    return JSON.parse(JSON.stringify(value));
  }}

  function subjectAliases(subject) {{
    return [
      safeText(subject.label),
      safeText(subject.englishLabel),
      safeText(subject.value)
    ].filter(Boolean).map(slugify);
  }}

  const SUBJECTS = DATA.subjects || [];
  const PACKS = DATA.packs || {{}};
  const SUBJECT_BY_ALIAS = SUBJECTS.reduce((out, subject) => {{
    subjectAliases(subject).forEach((alias) => {{
      out[alias] = subject.id;
    }});
    return out;
  }}, {{}});

  function requestSubjectId(request) {{
    if (safeText(request?.syllabus) !== "HKDSE") {{
      return "";
    }}
    const subject = safeText(request?.topic || request?.subject);
    return SUBJECT_BY_ALIAS[slugify(subject)] || "";
  }}

  function find(request) {{
    const id = requestSubjectId(request);
    if (!id || !PACKS[id]) {{
      return null;
    }}
    return clone(PACKS[id]);
  }}

  function catalogSyllabus() {{
    return {{
      name: "HKDSE",
      levels: ["DSE"],
      subjects: SUBJECTS.map((subject) => ({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        topicPacks: [
          {{
            id: `hkdse-${{slugify(subject.label)}}`,
            title: "Official HKEAA subject information",
            source: "official-hkeaa-hkdse",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }}))
    }};
  }}

  window.IC_EDUCATE_HKDSE_PACKS = {{
    metadata: DATA.metadata || {{}},
    find,
    catalogSyllabus,
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


def sync_subject(subject: HkdseSubject, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    subject_dir = data_dir / subject.slug
    subject_dir.mkdir(parents=True, exist_ok=True)
    html_path = subject_dir / "subject.html"
    text_path = subject_dir / "subject.txt"
    meta_path = subject_dir / "metadata.json"
    if force_download or not html_path.exists():
        page_html = fetch_text(subject.page_url, timeout=timeout)
        html_path.write_text(page_html, encoding="utf-8")
    else:
        page_html = html_path.read_text(encoding="utf-8", errors="replace")
    text_path.write_text(clean_line(page_html), encoding="utf-8")
    resources = extract_resource_links(page_html, subject.page_url)
    focus_items = extract_focus_items(resources, subject)
    subject_id = f"hkdse-{slugify(subject.app_label)}"
    pack = build_pack(subject, resources, focus_items)
    subject_data = {
        "id": subject_id,
        "label": subject.app_label,
        "englishLabel": subject.english_label,
        "subjectPageUrl": subject.page_url,
        "localHtml": str(html_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "resources": resources,
        "focusItems": focus_items,
    }
    meta_path.write_text(json.dumps({**subject_data, "downloadedAt": utc_now()}, indent=2, ensure_ascii=False), encoding="utf-8")
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download official HKEAA HKDSE subject pages and generate packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only", action="append", default=[])
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--sleep", type=float, default=0.1)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    subjects = parse_subjects(fetch_text(SUBJECTS_URL, timeout=args.timeout))
    if args.only:
        wanted = set(args.only)
        subjects = [subject for subject in subjects if subject.english_label in wanted or subject.app_label in wanted]
    data = read_bundle_data(args.output)
    packs = data.setdefault("packs", {})
    existing_ids = set(packs.keys())
    queue = [subject for subject in subjects if args.force or f"hkdse-{slugify(subject.app_label)}" not in existing_ids]
    if args.limit > 0:
        queue = queue[: args.limit]

    print(f"Official HKEAA HKDSE entries selected: {len(subjects)}")
    print(f"Existing generated HKDSE packs: {len(existing_ids)}")
    print(f"Generation/download queue: {len(queue)}")
    if args.dry_run:
        for subject in queue:
            print(f"- {subject.app_label} / {subject.english_label}: {subject.page_url}")
        return 0

    subjects_by_id = {item.get("id"): item for item in data.get("subjects") or [] if item.get("id")}
    failures: list[tuple[HkdseSubject, str]] = []
    for index, subject in enumerate(queue, start=1):
        print(f"[{index}/{len(queue)}] {subject.app_label} / {subject.english_label}")
        try:
            subject_data, pack = sync_subject(subject, args.data_dir, args.timeout, args.force_download)
            subjects_by_id[subject_data["id"]] = subject_data
            packs[subject_data["id"]] = pack
            data["subjects"] = sorted(subjects_by_id.values(), key=lambda item: item["englishLabel"])
            data["metadata"] = {
                "generatedAt": utc_now(),
                "source": "HKEAA official HKDSE subject information pages",
                "sourceUrl": SUBJECTS_URL,
                "officialEntryCount": len(subjects),
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

    print(f"Wrote {len(packs)} official HKDSE pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for subject, error in failures:
            print(f"- {subject.app_label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
