#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import time
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT / "data" / "oxfordaqa-syllabuses"
DEFAULT_OUTPUT_PATH = ROOT / "generated-oxfordaqa-packs.js"
SYLLABUS_NAME = "Oxford AQA International GCSE & A Level"
DATA_BEGIN = "// BEGIN_IC_EDUCATE_OXFORDAQA_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_OXFORDAQA_PACK_DATA"


@dataclass(frozen=True)
class OxfordAqaSpec:
    label: str
    subject: str
    level: str
    page_url: str
    pdf_url: str

    @property
    def slug(self) -> str:
        return slugify(self.label)


SPECS = [
    OxfordAqaSpec(
        label="International GCSE Mathematics",
        subject="Mathematics",
        level="International GCSE",
        page_url="https://www.oxfordaqa.com/qualifications/international-gcse-mathematics/",
        pdf_url="https://www.oxfordaqa.com/wp-content/uploads/2022/06/oxfordaqa-gcse-mathematics-specification.pdf",
    )
]

DEFAULT_FOCUS = [
    "Specification at a glance",
    "Subject content",
    "Assessment objectives",
    "Paper structure",
    "Mathematical skills",
    "Revision priorities",
]


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


def fetch_bytes(url: str, timeout: int = 120) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def extract_pdf_text(path: Path, max_pages: int = 36) -> str:
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


def extract_focus_items(text: str) -> list[str]:
    lines = [clean_line(line) for line in text.splitlines()]
    candidates: list[str] = []
    for line in lines:
        if not line or len(line) < 5 or len(line) > 96:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["oxfordaqa", "international gcse", "copyright", "version"]):
            continue
        match = re.match(r"^(\d+(?:\.\d+)*)\s+(.+)$", line)
        if match:
            label = clean_line(match.group(2))
            if 4 <= len(label) <= 84 and not label.lower().startswith("paper "):
                candidates.append(label)
            continue
        if re.match(r"^[A-Z][A-Za-z0-9,&()'/: -]{6,80}$", line) and len(line.split()) <= 9:
            candidates.append(line)
    out: list[str] = []
    seen: set[str] = set()
    for item in candidates:
        item = re.sub(r"^\d+(?:\.\d+)*\s*", "", item)
        key = item.lower()
        if key in seen:
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


def build_pack(spec: OxfordAqaSpec, focus_items: list[str]) -> dict[str, Any]:
    pack_id = f"official-oxfordaqa-{slugify(spec.label)}"
    selected = focus_items[:6] if focus_items else DEFAULT_FOCUS[:6]
    note_cards = [
        {
            "title": "Specification map",
            "points": [
                f"This pack is built from the official OxfordAQA {spec.label} specification PDF.",
                "Use it as the coverage checklist before detailed topic practice.",
                "Connect every revision task to subject content, assessment objectives, and paper structure.",
            ],
        },
        {
            "title": "Main focus areas",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "How to revise",
            "points": [
                "Turn each specification heading into one worked example and one exam-style question.",
                "Keep a correction log by specification area instead of by score only.",
                "Use paper structure and command words to decide answer depth.",
            ],
        },
        {
            "title": "Practice loop",
            "points": [
                "Read a specification point, attempt a related problem, then mark it immediately.",
                "Write down the exact skill that caused any error.",
                "Revisit weak areas after two days with a new question.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What should you use the {spec.label} specification for first?", "Mapping official content into revision priorities", ["Memorising the PDF URL", "Skipping assessment objectives"], "The specification defines the content and assessment expectations."),
            quiz_question(pack_id, "Foundation", 2, "Which action makes revision active?", "Turn a specification point into a worked example", ["Only highlight headings", "Avoid checking answers"], "Worked examples force understanding."),
            quiz_question(pack_id, "Foundation", 3, "Why check paper structure?", "It shows how content and skills are assessed", ["It replaces content knowledge", "It removes the need for practice"], "Paper structure shapes timing and answer depth."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should '{selected[0]}' be revised?", "Make notes, examples, and exam-style practice for it", ["Ignore it unless easy", "Treat it only as a title"], "Every focus area should become practice."),
            quiz_question(pack_id, "Core", 2, "What makes a correction log useful?", "It links mistakes to exact specification areas", ["It stores only total marks", "It hides repeated weak skills"], "The log should show what to relearn next."),
            quiz_question(pack_id, "Core", 3, "When should marking happen?", "After an independent attempt", ["Before reading the question", "Only after all topics are finished"], "Marking after an attempt reveals real gaps."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a learner move beyond recall?", "Apply the specification area in unfamiliar questions", ["Copy headings only", "Avoid multi-step problems"], "Transfer to unfamiliar questions is the real test."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final check?", "Timed practice followed by corrections linked to the specification", ["Reading the cover page", "Deleting hard topics"], "Timed practice plus review closes final gaps."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated errors be handled?", "Group them by specification area and schedule targeted review", ["Assume they are random", "Stop practising"], "Patterns identify the next study target."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four focus areas from the {spec.label} specification.",
        "Choose one focus area and write a worked-example plan.",
        "Write one exam-style question for a selected focus area.",
        "Explain how paper structure affects revision.",
        "Create two flashcard prompts for one weak area.",
        "Describe one common mistake and link it to the specification.",
        "Plan a two-day review cycle for one focus area.",
        "Write a timed-practice plan for one paper section.",
        "Compare two focus areas and explain how they connect.",
        "Create a mini checklist for the next practice session.",
        "Write a reflection on which specification area needs the most work.",
        "State how you would mark and correct the timed task.",
    ]
    for index, prompt in enumerate(prompts, start=1):
        worksheet_questions.append(
            {
                "number": index,
                "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
                "prompt": prompt,
                "marks": 3,
                "answerPoints": [
                    "Use a specific specification area or skill.",
                    "Give a clear worked example or practice action.",
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
        "provider": "official-oxfordaqa-bundle",
        "title": f"{spec.label} Study Pack",
        "subtitle": "OxfordAQA official specification overview",
        "oxfordAqa": {
            "label": spec.label,
            "subject": spec.subject,
            "level": spec.level,
            "pageUrl": spec.page_url,
            "pdfUrl": spec.pdf_url,
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                "Use the official OxfordAQA specification as the coverage checklist.",
                "Prioritise weak specification areas before broad rereading.",
                "Pair each area with worked examples, exam-style practice, and correction review.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable overview practice for {spec.label}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"oxfordaqa-{slugify(spec.label)}"],
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

  const SUBJECTS = DATA.subjects || [];
  const PACKS = DATA.packs || {{}};
  const SUBJECT_BY_ALIAS = SUBJECTS.reduce((out, subject) => {{
    [subject.label, subject.subject, subject.value].filter(Boolean).map(slugify).forEach((alias) => {{
      out[alias] = subject.id;
    }});
    return out;
  }}, {{}});

  function requestSubjectId(request) {{
    if (safeText(request?.syllabus) !== "Oxford AQA International GCSE & A Level") {{
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
      name: "Oxford AQA International GCSE & A Level",
      levels: ["Standard"],
      subjects: SUBJECTS.map((subject) => ({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        topicPacks: [
          {{
            id: `oxfordaqa-${{slugify(subject.label)}}`,
            title: "Official specification overview",
            source: "official-oxfordaqa-specification",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }}))
    }};
  }}

  window.IC_EDUCATE_OXFORDAQA_PACKS = {{
    metadata: DATA.metadata || {{}},
    find,
    catalogSyllabus,
    count: () => Object.keys(PACKS).length,
    subjects: () => clone(SUBJECTS)
  }};
}})();
"""


def write_bundle(path: Path, data: dict[str, Any]) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(bundle_template(data), encoding="utf-8")
    tmp.replace(path)


def sync_spec(spec: OxfordAqaSpec, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    spec_dir = data_dir / spec.slug
    spec_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = spec_dir / "specification.pdf"
    text_path = spec_dir / "specification.txt"
    meta_path = spec_dir / "metadata.json"
    if force_download or not pdf_path.exists():
        pdf_path.write_bytes(fetch_bytes(spec.pdf_url, timeout=timeout))
    if force_download or not text_path.exists():
        text = extract_pdf_text(pdf_path)
        text_path.write_text(text, encoding="utf-8")
    else:
        text = text_path.read_text(encoding="utf-8", errors="replace")
    focus_items = extract_focus_items(text)
    spec_id = f"oxfordaqa-{slugify(spec.label)}"
    pack = build_pack(spec, focus_items)
    subject_data = {
        "id": spec_id,
        "label": spec.label,
        "value": spec.label,
        "subject": spec.subject,
        "level": spec.level,
        "pageUrl": spec.page_url,
        "pdfUrl": spec.pdf_url,
        "localPdf": str(pdf_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "focusItems": focus_items,
    }
    meta_path.write_text(json.dumps({**subject_data, "downloadedAt": utc_now()}, indent=2, ensure_ascii=False), encoding="utf-8")
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download official OxfordAQA specifications and generate packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    print(f"Official OxfordAQA specs selected: {len(SPECS)}")
    if args.dry_run:
        for spec in SPECS:
            print(f"- {spec.label}: {spec.pdf_url}")
        return 0
    subjects: list[dict[str, Any]] = []
    packs: dict[str, Any] = {}
    failures: list[tuple[OxfordAqaSpec, str]] = []
    for index, spec in enumerate(SPECS, start=1):
        print(f"[{index}/{len(SPECS)}] {spec.label}")
        try:
            subject_data, pack = sync_spec(spec, args.data_dir, args.timeout, args.force_download)
            subjects.append(subject_data)
            packs[subject_data["id"]] = pack
        except Exception as exc:
            failures.append((spec, str(exc)))
            print(f"  failed: {str(exc)[:500]}")
            if not args.continue_on_error:
                raise
        time.sleep(0.05)
    data = {
        "metadata": {
            "generatedAt": utc_now(),
            "source": "OxfordAQA official specifications",
            "packCount": len(packs),
        },
        "subjects": sorted(subjects, key=lambda item: item["label"]),
        "packs": packs,
    }
    write_bundle(args.output, data)
    print(f"Wrote {len(packs)} OxfordAQA pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for spec, error in failures:
            print(f"- {spec.label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
