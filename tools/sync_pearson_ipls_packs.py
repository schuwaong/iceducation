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

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT / "data" / "pearson-ipls"
DEFAULT_OUTPUT_PATH = ROOT / "generated-pearson-ipls-packs.js"
SYLLABUS_NAME = "Pearson Edexcel i Primary i Lower Secondary"
DATA_BEGIN = "// BEGIN_IC_EDUCATE_PEARSON_IPLS_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_PEARSON_IPLS_PACK_DATA"

GUIDE_PDF_URL = "https://qualifications.pearson.com/content/dam/pdf/International-Lower-Secondary-Curriculum/pearson-ipls-guide.pdf"

PROGRAMMES = [
    {
        "id": "i-primary",
        "label": "i Primary",
        "title": "Pearson Edexcel iPrimary",
        "page_url": "https://qualifications.pearson.com/en/qualifications/edexcel-international-primary-curriculum.html",
        "guide_url": GUIDE_PDF_URL,
    },
    {
        "id": "i-lower-secondary",
        "label": "i Lower Secondary",
        "title": "Pearson Edexcel iLowerSecondary",
        "page_url": "https://qualifications.pearson.com/en/qualifications/edexcel-international-lower-secondary-curriculum.html",
        "guide_url": GUIDE_PDF_URL,
    },
]

PROGRAMME_FOCUS = {
    "i-primary": [
        "Complete teaching and learning programme for ages 3 to 11",
        "Foundation for progression to iLowerSecondary and International GCSE",
        "British best practice tailored for international learners",
        "Full schemes of work and lesson plans",
        "Comprehensive teacher support and professional development",
        "Internal progress tests and external achievement tests",
        "Mapped published resources for iPrimary",
        "iPrimary English, Mathematics, Science, Computing and Global Citizenship",
    ],
    "i-lower-secondary": [
        "Complete teaching and learning programme for ages 11 to 14",
        "Foundation for progression to International GCSE and beyond",
        "British best practice tailored for international learners",
        "Full schemes of work and lesson plans",
        "Comprehensive teacher support and professional development",
        "Internal progress tests and external achievement tests",
        "Mapped published resources for iLowerSecondary",
        "iLowerSecondary English, Mathematics, Science, Computing and Global Citizenship",
    ],
}

DEFAULT_FOCUS = [
    "Official curriculum overview",
    "Resource families",
    "Assessment guidance",
    "Progression and consistency",
    "Classroom practice",
    "Revision and review",
]


@dataclass(frozen=True)
class PearsonProgramme:
    id: str
    label: str
    title: str
    page_url: str
    guide_url: str

    @property
    def slug(self) -> str:
        return slugify(f"{self.label}-{self.id}")


def safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def slugify(value: Any) -> str:
    text = html.unescape(safe_text(value)).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "item"


def unique_items(items: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for item in items:
        text = re.sub(r"\s+", " ", safe_text(item)).strip(" .")
        key = text.lower()
        if not text or key in seen:
            continue
        seen.add(key)
        out.append(text)
    return out


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def fetch_text(url: str, timeout: int = 90) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def fetch_bytes(url: str, timeout: int = 120) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def clean_line(value: str) -> str:
    text = html.unescape(value)
    text = re.sub(r"<script.*?</script>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" -\t")


def extract_page_focus_items(page_html: str) -> list[str]:
    candidates: list[str] = []
    for raw in re.findall(r"<h[1-4][^>]*>(.*?)</h[1-4]>", page_html, re.I | re.S):
        line = clean_line(raw)
        if line and 4 <= len(line) <= 120:
            candidates.append(line)
    for href, raw_label in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', page_html, re.I | re.S):
        label = clean_line(raw_label)
        lower = f"{href} {label}".lower()
        if any(key in lower for key in ["resource", "guide", "assessment", "curriculum", "maths", "science", "english", "computing"]):
            candidates.append(label)
    out: list[str] = []
    seen: set[str] = set()
    for item in candidates:
        item = re.sub(r"\s+", " ", item).strip(" .")
        lower = item.lower()
        if not item or lower in seen:
            continue
        if any(skip in lower for skip in ["are you sure", "{{", "next steps", "see also", "expand all", "collapse all", "find out more"]):
            continue
        if lower in {"overview", "download", "show more", "back", "search"}:
            continue
        seen.add(lower)
        out.append(item)
        if len(out) >= 10:
            break
    return out if len(out) >= 4 else DEFAULT_FOCUS[:]


def extract_pdf_focus_items(pdf_path: Path) -> list[str]:
    try:
        reader = PdfReader(str(pdf_path))
    except Exception:
        return []
    lines: list[str] = []
    for page in reader.pages[:12]:
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        for raw in text.splitlines():
            line = clean_line(raw)
            if 6 <= len(line) <= 120:
                lower = line.lower()
                if any(skip in lower for skip in ["pearson", "copyright", "page", "guide"]):
                    continue
                if any(key in lower for key in ["curriculum", "assessment", "resource", "science", "maths", "english", "computing", "global citizenship", "progression"]):
                    lines.append(line)
    out: list[str] = []
    seen: set[str] = set()
    for item in lines:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= 8:
            break
    return out


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


def build_pack(programme: PearsonProgramme, focus_items: list[str], pdf_focus: list[str]) -> dict[str, Any]:
    pack_id = f"official-pearson-ipls-{programme.id}"
    selected = (focus_items + pdf_focus + DEFAULT_FOCUS)[:6]
    notes = [
        {
            "title": "Programme map",
            "points": [
                f"This pack is built from the official {programme.title} programme page.",
                "Use the Pearson guide and resource pages as the coverage checklist.",
                "Start with the curriculum overview, then match it to the published resources.",
            ],
        },
        {
            "title": "Resource families",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "How to revise",
            "points": [
                "Turn each resource family into one short explanation prompt and one practice task.",
                "Keep a correction list by resource or curriculum area.",
                "Review weak points with a fresh example after two days.",
            ],
        },
        {
            "title": "Practice loop",
            "points": [
                "Read the official programme page, do a small retrieval task, then mark it.",
                "Tie every error to one curriculum or resource area.",
                "Finish by naming the next lesson or revision target.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What should you use this {programme.label} pack for first?", "Mapping the official Pearson programme into revision priorities", ["Memorising only the page title", "Skipping the resource families"], "The programme page and guide tell you what the curriculum supports."),
            quiz_question(pack_id, "Foundation", 2, "Which action makes revision active?", "Turn a resource family into a short explanation and task", ["Only open the web page", "Ignore examples"], "Active recall beats passive reading."),
            quiz_question(pack_id, "Foundation", 3, "Why use the guide PDF?", "It helps connect resources to curriculum and progression", ["It replaces the lessons", "It is only for decoration"], "The guide turns the programme page into usable study steps."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should '{selected[0]}' be used?", "Make notes, examples, and a practice task for it", ["Ignore it unless it is tested", "Treat it only as a heading"], "Each resource area should become learning and practice."),
            quiz_question(pack_id, "Core", 2, "What makes a correction log useful?", "It links mistakes to exact curriculum or resource areas", ["It stores only a score", "It hides repeated weak spots"], "The log should show what to relearn next."),
            quiz_question(pack_id, "Core", 3, "What is a strong review sequence?", "Curriculum overview, active practice, marking, correction review", ["Practice before reading the topic", "Only reread everything"], "A simple loop keeps revision focused."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a learner move beyond recall?", "Apply the Pearson resource area in a new context", ["Copy headings only", "Avoid unfamiliar examples"], "Transfer to new contexts shows understanding."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final check?", "Timed practice followed by targeted corrections", ["Reading the cover page only", "Switching topics whenever one feels hard"], "Timed practice plus review exposes final gaps."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated weak areas be handled?", "Group them by curriculum area and schedule targeted review", ["Assume they are random", "Stop practising"], "Patterns in mistakes point to the next best step."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four official Pearson {programme.label} focus areas or resources.",
        "Choose one focus area and explain how it supports learning.",
        "Write one practice task for a selected resource family.",
        "Describe how the guide PDF should be used during revision.",
        "Create two flashcard prompts for one weak area.",
        "Explain one common mistake and how to correct it.",
        "Plan a two-day review cycle for one focus area.",
        "Write one example that uses the focus area in a new context.",
        "Compare two resource families and explain how they connect.",
        "Create a mini checklist for the next lesson or revision session.",
        "Write a reflection on which focus area needs the most work.",
        "Plan a timed practice task and state how it will be checked.",
    ]
    for index, prompt in enumerate(prompts, start=1):
        worksheet_questions.append(
            {
                "number": index,
                "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
                "prompt": prompt,
                "marks": 3,
                "answerPoints": [
                    "Use a specific Pearson curriculum or resource area.",
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
        "provider": "official-pearson-ipls",
        "title": f"{programme.label} Study Pack",
        "subtitle": f"{programme.title} - official curriculum and resource overview",
        "pearsonIpls": {
            "programme": programme.label,
            "title": programme.title,
            "pageUrl": programme.page_url,
            "guideUrl": programme.guide_url,
            "focusItems": focus_items,
            "guideFocusItems": pdf_focus,
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Use the official {programme.title} page as the coverage checklist.",
                "Prioritise the curriculum overview and the named resource families.",
                "Pair each area with active recall, a practice task, and correction review.",
            ],
            "noteCards": notes,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable overview practice for {programme.title}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"pearson-ipls-{programme.id}"],
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
    [subject.label, subject.value, subject.title].filter(Boolean).map(slugify).forEach((alias) => {{
      out[alias] = subject.id;
    }});
    return out;
  }}, {{}});

  function requestSubjectId(request) {{
    if (safeText(request?.syllabus) !== "{SYLLABUS_NAME}") {{
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
      name: "{SYLLABUS_NAME}",
      levels: ["Standard"],
      subjects: SUBJECTS.map((subject) => ({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        topicPacks: [
          {{
            id: `pearson-ipls-${{safeText(subject.id)}}`,
            title: "Official Pearson programme overview",
            source: "official-pearson-ipls",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }}))
    }};
  }}

  window.IC_EDUCATE_PEARSON_IPLS_PACKS = {{
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


def sync_programme(programme: PearsonProgramme, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    prog_dir = data_dir / programme.slug
    prog_dir.mkdir(parents=True, exist_ok=True)
    html_path = prog_dir / "page.html"
    text_path = prog_dir / "page.txt"
    pdf_path = prog_dir / "guide.pdf"
    pdf_text_path = prog_dir / "guide.txt"
    meta_path = prog_dir / "metadata.json"

    if force_download or not html_path.exists():
        page_html = fetch_text(programme.page_url, timeout=timeout)
        html_path.write_text(page_html, encoding="utf-8")
    else:
        page_html = html_path.read_text(encoding="utf-8", errors="replace")
    text_path.write_text(clean_line(page_html), encoding="utf-8")

    if force_download or not pdf_path.exists():
        pdf_path.write_bytes(fetch_bytes(programme.guide_url, timeout=timeout))
    if force_download or not pdf_text_path.exists():
        try:
            reader = PdfReader(str(pdf_path))
            parts: list[str] = []
            for page in reader.pages[:20]:
                try:
                    text = page.extract_text() or ""
                except Exception:
                    text = ""
                if text:
                    parts.append(text)
            pdf_text = "\n".join(parts)
        except Exception:
            pdf_text = ""
        pdf_text_path.write_text(pdf_text, encoding="utf-8")
    else:
        pdf_text = pdf_text_path.read_text(encoding="utf-8", errors="replace")

    extracted_focus_items = extract_page_focus_items(page_html)
    focus_items = unique_items(PROGRAMME_FOCUS.get(programme.id, []) + extracted_focus_items)[:10]
    pdf_focus = extract_pdf_focus_items(pdf_path)
    subject_id = programme.id
    subject_data = {
        "id": subject_id,
        "label": programme.label,
        "value": programme.label,
        "title": programme.title,
        "pageUrl": programme.page_url,
        "guideUrl": programme.guide_url,
        "localHtml": str(html_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "localPdf": str(pdf_path.relative_to(ROOT)),
        "localPdfText": str(pdf_text_path.relative_to(ROOT)),
        "focusItems": focus_items,
        "guideFocusItems": pdf_focus,
    }
    meta_path.write_text(json.dumps({**subject_data, "downloadedAt": utc_now()}, indent=2, ensure_ascii=False), encoding="utf-8")
    pack = build_pack(programme, focus_items, pdf_focus)
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download official Pearson iPrimary/iLowerSecondary programme pages and generate packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    programmes = [PearsonProgramme(**item) for item in PROGRAMMES]
    print(f"Official Pearson IPLS programmes selected: {len(programmes)}")
    if args.dry_run:
        for programme in programmes:
            print(f"- {programme.label}: {programme.page_url}")
        return 0
    data = read_bundle_data(args.output)
    subjects: list[dict[str, Any]] = []
    packs: dict[str, Any] = {}
    failures: list[tuple[PearsonProgramme, str]] = []
    for index, programme in enumerate(programmes, start=1):
        print(f"[{index}/{len(programmes)}] {programme.label}")
        try:
            subject_data, pack = sync_programme(programme, args.data_dir, args.timeout, args.force_download)
            subjects.append(subject_data)
            packs[subject_data["id"]] = pack
        except Exception as exc:
            failures.append((programme, str(exc)))
            print(f"  failed: {str(exc)[:500]}")
            if not args.continue_on_error:
                raise
        time.sleep(0.05)
    data.update(
        {
            "metadata": {
                "generatedAt": utc_now(),
                "source": "Pearson official iPrimary and iLowerSecondary programme pages",
                "packCount": len(packs),
            },
            "subjects": sorted(subjects, key=lambda item: item["label"]),
            "packs": packs,
        }
    )
    write_bundle(args.output, data)
    print(f"Wrote {len(packs)} Pearson IPLS pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for programme, error in failures:
            print(f"- {programme.label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
