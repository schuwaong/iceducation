#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "library-snapshot.js"
DEFAULT_DATA_DIR = ROOT / "data" / "igcse-syllabuses"
DEFAULT_OUTPUT_PATH = ROOT / "generated-igcse-subject-packs.js"

OFFICIAL_SUBJECTS_URL = (
    "https://www.cambridgeinternational.org/programmes-and-qualifications/"
    "cambridge-upper-secondary/cambridge-igcse/subjects/"
)
CAMBRIDGE_BASE = "https://www.cambridgeinternational.org"
SYLLABUS_NAME = "Cambridge IGCSE"
LEVEL_NAME = "IGCSE"

DATA_BEGIN = "// BEGIN_IC_EDUCATE_OFFICIAL_IGCSE_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_OFFICIAL_IGCSE_PACK_DATA"

EXISTING_CODES = {
    "0580",  # Mathematics
    "0606",  # Additional Mathematics
    "0610",  # Biology
    "0620",  # Chemistry
    "0625",  # Physics
}

DEFAULT_FOCUS = [
    "Subject aims and learning outcomes",
    "Core syllabus content",
    "Assessment objectives",
    "Question styles and command words",
    "Revision priorities",
    "Exam practice and feedback",
]


@dataclass(frozen=True)
class OfficialSubject:
    label: str
    code: str
    href: str

    @property
    def page_url(self) -> str:
        return urllib.parse.urljoin(CAMBRIDGE_BASE, self.href)

    @property
    def slug(self) -> str:
        return slugify(f"{self.label}-{self.code}")

    @property
    def app_label(self) -> str:
        return f"{subject_name_without_code(self.label)} - {self.code}"


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


def fetch_text(url: str, timeout: int = 60) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_bytes(url: str, timeout: int = 120) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def parse_official_subjects(html_text: str) -> list[OfficialSubject]:
    subjects: list[OfficialSubject] = []
    seen_codes: set[str] = set()
    pattern = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>\s*([^<]+?)\s*</a>', re.I)
    for match in pattern.finditer(html_text):
        href, raw_label = match.groups()
        label = " ".join(html.unescape(raw_label).split())
        code_match = re.search(r"(\d{4})\)?$", label)
        if not code_match:
            continue
        if "/programmes-and-qualifications/cambridge-igcse-" not in href:
            continue
        code = code_match.group(1)
        if code in seen_codes:
            continue
        seen_codes.add(code)
        subjects.append(OfficialSubject(label=label, code=code, href=href))
    return subjects


def subject_name_without_code(label: str) -> str:
    text = html.unescape(label)
    text = text.replace("–", "-")
    text = re.sub(r"\s*-\s*\d{4}\)?$", "", text)
    text = re.sub(r"\s*\(\d{4}\)$", "", text)
    text = re.sub(r"\s+\d{4}$", "", text)
    text = text.replace("&amp;", "&")
    return " ".join(text.split())


def parse_snapshot_subject_labels(path: Path) -> set[str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"window\.IC_EDUCATE_SNAPSHOT\s*=\s*(\{.*\});\s*$", text, flags=re.S)
    if not match:
        return set()
    snapshot = json.loads(match.group(1))
    syllabi = snapshot.get("catalog", {}).get("syllabi") or []
    igcse = next((item for item in syllabi if item.get("name") == SYLLABUS_NAME), None)
    if not igcse:
        return set()
    return {safe_text(subject.get("label") or subject.get("value")) for subject in igcse.get("subjects") or []}


def choose_syllabus_pdf(page_html: str) -> tuple[str, str] | None:
    links: list[tuple[str, str]] = []
    pattern = re.compile(r'<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>(.*?)</a>', re.I | re.S)
    for match in pattern.finditer(page_html):
        href, raw_label = match.groups()
        label = " ".join(re.sub(r"<.*?>", " ", html.unescape(raw_label)).split())
        lower = f"{href} {label}".lower()
        if "syllabus" not in lower or "update" in lower:
            continue
        links.append((label, urllib.parse.urljoin(CAMBRIDGE_BASE, href)))
    preferred = [item for item in links if re.search(r"\b2026\b", item[0]) or "2026-syllabus" in item[1]]
    if preferred:
        return preferred[0]
    current = [item for item in links if "2027" not in item[0] and "2023" not in item[0]]
    if current:
        return current[0]
    return links[0] if links else None


def extract_pdf_text(path: Path, max_pages: int = 28) -> str:
    reader = PdfReader(str(path))
    parts: list[str] = []
    for page in reader.pages[:max_pages]:
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        if text:
            parts.append(text)
    return "\n".join(parts)


def clean_line(value: str) -> str:
    text = html.unescape(value)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" -\t")


def interesting_section(text: str) -> str:
    lower = text.lower()
    starts = [
        lower.find("subject content"),
        lower.find("syllabus content"),
        lower.find("content overview"),
        lower.find("assessment objectives"),
    ]
    starts = [item for item in starts if item >= 0]
    if not starts:
        return text[:20000]
    start = min(starts)
    ends = [
        lower.find("details of the assessment", start + 100),
        lower.find("command words", start + 100),
        lower.find("appendix", start + 100),
    ]
    ends = [item for item in ends if item > start]
    end = min(ends) if ends else start + 22000
    return text[start:end]


def extract_focus_items(text: str, subject_label: str) -> list[str]:
    section = interesting_section(text)
    lines = [clean_line(line) for line in section.splitlines()]
    candidates: list[str] = []
    for line in lines:
        if not line or len(line) < 5 or len(line) > 96:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["cambridge igcse", "syllabus", "www.", "copyright", "back to contents"]):
            continue
        match = re.match(r"^(\d+(?:\.\d+)*|[A-Z]\d+(?:\.\d+)*)[.)]?\s+(.+)$", line)
        if match:
            label = clean_line(match.group(2))
            if 4 <= len(label) <= 84 and not label.lower().startswith("paper "):
                candidates.append(label)
            continue
        if re.match(r"^[A-Z][A-Za-z0-9,&()'/: -]{7,80}$", line) and len(line.split()) <= 9:
            candidates.append(line)

    out: list[str] = []
    seen: set[str] = set()
    for item in candidates:
        item = re.sub(r"^\d+(?:\.\d+)*\s*", "", item)
        key = item.lower()
        if key in seen:
            continue
        if subject_label.lower().split(" - ")[0] == key:
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= 10:
            break
    return out if len(out) >= 4 else DEFAULT_FOCUS[:]


def quiz_question(pack_id: str, lane: str, index: int, prompt: str, correct: str, distractors: list[str], explanation: str) -> dict[str, Any]:
    choices = [correct, *distractors[:2]]
    return {
        "id": f"{pack_id}-{slugify(lane)}-{index}",
        "lane": lane,
        "prompt": prompt,
        "concept": explanation,
        "choices": choices,
        "answer": 0,
        "explanation": explanation,
    }


def build_pack(subject: OfficialSubject, pdf_url: str, focus_items: list[str]) -> dict[str, Any]:
    subject_name = subject_name_without_code(subject.label)
    pack_id = f"official-igcse-{subject.code}"
    selected = focus_items[:6] if focus_items else DEFAULT_FOCUS[:6]
    note_cards = [
        {
            "title": "Syllabus map",
            "points": [
                f"This pack is built from the official Cambridge IGCSE {subject_name} {subject.code} syllabus PDF.",
                "Use it as a first-pass map before deeper topic packs are generated.",
                "Start with the content areas, then connect each one to assessment objectives.",
            ],
        },
        {
            "title": "Main content areas",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "How to revise",
            "points": [
                "Turn each syllabus area into a short explain-out-loud prompt.",
                "Make one flashcard for definitions, one for examples, and one for common mistakes.",
                "After practice, mark weak areas against the syllabus wording instead of rereading everything.",
            ],
        },
        {
            "title": "Exam practice loop",
            "points": [
                "Read the command word before choosing the depth of answer.",
                "Use syllabus terms in every response, then add an example or evidence where useful.",
                "Keep a correction list of missed content areas and revisit it after two days.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What should you use this {subject_name} pack for first?", "Mapping the official syllabus into revision priorities", ["Memorising page numbers only", "Skipping the syllabus and guessing topics"], "A syllabus map tells you what content and skills need coverage."),
            quiz_question(pack_id, "Foundation", 2, f"Which item is a useful first revision move for {subject_name}?", "Turn a content area into a plain-language explanation", ["Only copy the PDF title", "Avoid practice until the exam week"], "Active explanation is stronger than passive rereading."),
            quiz_question(pack_id, "Foundation", 3, "Why are command words important?", "They show the kind and depth of answer required", ["They replace subject knowledge", "They only matter after marking"], "Command words guide how much to state, describe, explain, or evaluate."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should a student use the content area '{selected[0]}'?", "Make notes, examples, and practice questions for that area", ["Ignore it unless it appears in past papers", "Treat it as a grade boundary"], "Each content area should become notes plus retrieval practice."),
            quiz_question(pack_id, "Core", 2, "What makes a correction list useful?", "It links mistakes back to exact syllabus areas", ["It stores only final scores", "It hides repeated weak topics"], "A correction list should show what to relearn next."),
            quiz_question(pack_id, "Core", 3, "When should practice questions be marked?", "After attempting them independently, using answer points or a mark scheme", ["Before reading the question", "Only after all topics are finished"], "Marking after an attempt reveals real gaps."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a student move beyond recall?", "Connect syllabus terms to examples, evidence, or worked reasoning", ["Only highlight headings", "Remove examples from answers"], "Higher performance usually needs application, not just recognition."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final revision check?", "Explain each selected content area without notes and then do timed practice", ["Read the PDF cover only", "Switch topics whenever one feels hard"], "Timed practice tests whether recall survives pressure."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated mistakes be handled?", "Group them by syllabus area and schedule targeted review", ["Assume they are random", "Delete them from the notes"], "Patterns in mistakes point to the next best study target."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four syllabus areas that need revision for {subject_name}.",
        f"Choose one {subject_name} content area and write a clear definition or summary.",
        "Explain why command words change the shape of an exam answer.",
        "Create a two-day revision plan for the weakest content area.",
        "Write one practice question for a selected content area.",
        "Mark a sample answer by identifying what is missing.",
        "Explain how you would use the official syllabus PDF during revision.",
        "Make a mini checklist for the next practice session.",
        "Describe one common mistake and how to avoid it.",
        "Write a short reflection on which content area needs the most work.",
        "Turn one syllabus area into three flashcard prompts.",
        "Plan a timed practice session and state how it will be reviewed.",
    ]
    for index, prompt in enumerate(prompts, start=1):
        worksheet_questions.append(
            {
                "number": index,
                "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
                "prompt": prompt,
                "marks": 3,
                "answerPoints": [
                    "Use a specific syllabus area or skill.",
                    "Give a clear example or revision action.",
                    "Explain how the answer will be checked or improved.",
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
        "provider": "official-syllabus-bundle",
        "title": f"{subject_name} Study Pack",
        "subtitle": f"Cambridge IGCSE {subject.code} - official 2026 syllabus overview",
        "officialIgcse": {
            "code": subject.code,
            "label": subject.app_label,
            "subjectPageUrl": subject.page_url,
            "syllabusPdfUrl": pdf_url,
            "source": "Cambridge International",
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Use the official Cambridge IGCSE {subject_name} syllabus as the coverage checklist.",
                "Prioritise weak content areas before broad rereading.",
                "Pair each topic with active recall, exam-style practice, and correction review.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable overview practice for Cambridge IGCSE {subject_name} {subject.code}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"syllabus-{subject.code}"],
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
  const SUBJECT_BY_ALIAS = SUBJECTS.reduce((out, subject) => {{
    subjectAliases(subject).forEach((alias) => {{
      out[alias] = subject.code;
    }});
    return out;
  }}, {{}});

  function requestSubjectCode(request) {{
    if (safeText(request?.syllabus) !== "Cambridge IGCSE") {{
      return "";
    }}
    const subject = safeText(request?.topic || request?.subject);
    return SUBJECT_BY_ALIAS[slugify(subject)] || "";
  }}

  function find(request) {{
    const code = requestSubjectCode(request);
    if (!code || !PACKS[code]) {{
      return null;
    }}
    return clone(PACKS[code]);
  }}

  function catalogSubjects() {{
    return SUBJECTS.map((subject) => ({{
      label: safeText(subject.label),
      value: safeText(subject.label),
      topicPacks: [
        {{
          id: `syllabus-${{safeText(subject.code)}}`,
          title: "2026 syllabus overview",
          source: "official-cambridge-syllabus",
          subtopics: (subject.focusItems || []).map((title, index) => ({{
            id: String(index + 1),
            title: safeText(title)
          }}))
        }}
      ]
    }}));
  }}

  window.IC_EDUCATE_OFFICIAL_IGCSE_SUBJECT_PACKS = {{
    metadata: DATA.metadata || {{}},
    find,
    catalogSubjects,
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


def sync_subject(
    subject: OfficialSubject,
    data_dir: Path,
    timeout: int,
    force_download: bool,
) -> tuple[dict[str, Any], dict[str, Any]]:
    subject_dir = data_dir / f"{subject.code}-{subject.slug}"
    subject_dir.mkdir(parents=True, exist_ok=True)
    meta_path = subject_dir / "metadata.json"
    pdf_path = subject_dir / "2026-syllabus.pdf"
    text_path = subject_dir / "2026-syllabus.txt"

    page_html = fetch_text(subject.page_url, timeout=timeout)
    pdf_link = choose_syllabus_pdf(page_html)
    if not pdf_link:
        raise RuntimeError(f"No syllabus PDF found for {subject.label}")
    pdf_label, pdf_url = pdf_link

    if force_download or not pdf_path.exists():
        pdf_path.write_bytes(fetch_bytes(pdf_url, timeout=timeout))
    if force_download or not text_path.exists():
        text = extract_pdf_text(pdf_path)
        text_path.write_text(text, encoding="utf-8")
    else:
        text = text_path.read_text(encoding="utf-8", errors="replace")

    focus_items = extract_focus_items(text, subject.app_label)
    pack = build_pack(subject, pdf_url, focus_items)
    subject_data = {
        "label": subject.app_label,
        "title": subject_name_without_code(subject.label),
        "code": subject.code,
        "subjectPageUrl": subject.page_url,
        "syllabusPdfUrl": pdf_url,
        "localPdf": str(pdf_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "focusItems": focus_items,
    }
    metadata = {
        "label": subject.label,
        "appLabel": subject.app_label,
        "code": subject.code,
        "subjectPageUrl": subject.page_url,
        "syllabusPdfUrl": pdf_url,
        "syllabusPdfLabel": pdf_label,
        "downloadedAt": utc_now(),
        "focusItems": focus_items,
    }
    meta_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download missing official Cambridge IGCSE syllabuses and generate subject packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only-code", action="append", default=[])
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--sleep", type=float, default=0.2)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force", action="store_true", help="Regenerate packs that are already in the bundle.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--list-missing", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    official_subjects = parse_official_subjects(fetch_text(OFFICIAL_SUBJECTS_URL, timeout=args.timeout))
    local_labels = parse_snapshot_subject_labels(SNAPSHOT_PATH)
    missing = [subject for subject in official_subjects if subject.code not in EXISTING_CODES]
    if args.only_code:
        wanted = set(args.only_code)
        missing = [subject for subject in missing if subject.code in wanted]
    data = read_bundle_data(args.output)
    packs = data.setdefault("packs", {})
    existing_codes = set(packs.keys())
    queue = [subject for subject in missing if args.force or subject.code not in existing_codes]
    if args.limit > 0:
        queue = queue[: args.limit]

    print(f"Official Cambridge IGCSE entries found: {len(official_subjects)}")
    print(f"Current local IGCSE subjects: {', '.join(sorted(local_labels))}")
    print(f"Existing local IGCSE codes treated as present: {', '.join(sorted(EXISTING_CODES))}")
    print(f"Official entries missing from local IGCSE folder: {len(missing)}")
    print(f"Existing generated official packs: {len(existing_codes)}")
    print(f"Generation/download queue: {len(queue)}")

    if args.list_missing or args.dry_run:
        for subject in queue:
            print(f"- {subject.app_label}: {subject.page_url}")
        return 0

    subjects_by_code = {item.get("code"): item for item in data.get("subjects") or [] if item.get("code")}
    failures: list[tuple[OfficialSubject, str]] = []
    for index, subject in enumerate(queue, start=1):
        print(f"[{index}/{len(queue)}] {subject.app_label}")
        try:
            subject_data, pack = sync_subject(subject, args.data_dir, args.timeout, args.force_download)
            subjects_by_code[subject.code] = subject_data
            packs[subject.code] = pack
            data["subjects"] = sorted(subjects_by_code.values(), key=lambda item: item["label"])
            data["metadata"] = {
                "generatedAt": utc_now(),
                "source": "Cambridge International official IGCSE subjects page",
                "sourceUrl": OFFICIAL_SUBJECTS_URL,
                "syllabusYear": 2026,
                "officialEntryCount": len(official_subjects),
                "missingEntryCount": len(missing),
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

    print(f"Wrote {len(packs)} official IGCSE subject pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for subject, error in failures:
            print(f"- {subject.app_label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
