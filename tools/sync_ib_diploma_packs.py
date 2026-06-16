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
DEFAULT_DATA_DIR = ROOT / "data" / "ib-diploma-subject-briefs"
DEFAULT_OUTPUT_PATH = ROOT / "generated-ib-diploma-packs.js"
SYLLABUS_NAME = "IB Diploma"
DATA_BEGIN = "// BEGIN_IC_EDUCATE_IB_DIPLOMA_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_IB_DIPLOMA_PACK_DATA"

COMMON_LEVELS = ["SL", "HL"]

SUBJECTS = [
    {
        "id": "mathematics",
        "label": "Mathematics",
        "title": "Mathematics: Analysis and Approaches / Applications and Interpretations",
        "group": "Mathematics",
        "levels": COMMON_LEVELS,
        "officialUrls": [
            "https://www.ibo.org/contentassets/5895a05412144fe890312bad52b17044/subject-brief-dp-math-analysis-and-approaches-en.pdf",
            "https://www.ibo.org/contentassets/5895a05412144fe890312bad52b17044/subject-brief-dp-math-applications-and-interpretations-en.pdf",
        ],
        "sourceUrls": [
            "https://img.nordangliaeducation.com/resources/asia/_filecache/140/8fd/237922-group-5--mathematics.pdf",
        ],
        "focus": [
            "Mathematics: analysis and approaches",
            "Mathematics: applications and interpretation",
            "Number and algebra",
            "Functions",
            "Geometry and trigonometry",
            "Statistics and probability",
            "Calculus",
            "Mathematical exploration and internal assessment",
        ],
    },
    {
        "id": "biology",
        "label": "Biology",
        "title": "Biology",
        "group": "Sciences",
        "levels": COMMON_LEVELS,
        "officialUrls": [
            "https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_biology_subject-brief_jan_2022_e.pdf",
        ],
        "sourceUrls": [
            "https://viborgkatedralskole.dk/wp-content/uploads/2025/11/dp_sciences_biology_subject-brief_jan_2022_e.pdf",
        ],
        "focus": [
            "Unity and diversity",
            "Form and function",
            "Interaction and interdependence",
            "Continuity and change",
            "Experimental programme",
            "Collaborative sciences project",
            "Scientific investigation",
            "External assessment practice",
        ],
    },
    {
        "id": "chemistry",
        "label": "Chemistry",
        "title": "Chemistry",
        "group": "Sciences",
        "levels": COMMON_LEVELS,
        "officialUrls": [
            "https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_chemistry_subject-brief_jan_2022_e.pdf",
        ],
        "sourceUrls": [
            "https://viborgkatedralskole.dk/wp-content/uploads/2025/11/dp_sciences_chemistry_subject-brief_jan_2022_e.pdf",
            "https://www.icsv.at/assets/subject-brief/dp_sciences_chemistry_subject-brief_jan_2022_e.pdf",
        ],
        "focus": [
            "Structure 1: models of the particulate nature of matter",
            "Structure 2: models of bonding and structure",
            "Structure 3: classification of matter",
            "Reactivity 1: what drives chemical reactions",
            "Reactivity 2: how much, how fast and how far",
            "Reactivity 3: mechanisms of chemical change",
            "Experimental programme",
            "Scientific investigation",
        ],
    },
    {
        "id": "physics",
        "label": "Physics",
        "title": "Physics",
        "group": "Sciences",
        "levels": COMMON_LEVELS,
        "officialUrls": [
            "https://www.ibo.org/globalassets/new-structure/recognition/pdfs/dp_sciences_physics_subject-brief_jan_2022_e.pdf",
        ],
        "sourceUrls": [
            "https://viborgkatedralskole.dk/wp-content/uploads/2025/11/dp_sciences_physics_subject-brief_jan_2022_e.pdf",
        ],
        "focus": [
            "Space, time and motion",
            "The particulate nature of matter",
            "Wave behaviour",
            "Fields",
            "Nuclear and quantum physics",
            "Experimental programme",
            "Collaborative sciences project",
            "Scientific investigation",
        ],
    },
    {
        "id": "economics",
        "label": "Economics",
        "title": "Economics",
        "group": "Individuals and societies",
        "levels": COMMON_LEVELS,
        "officialUrls": [
            "https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/hl-economics-en.pdf",
            "https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/sl-economics-en.pdf",
        ],
        "sourceUrls": [
            "https://img.nordangliaeducation.com/resources/asia/_filecache/524/fd1/237920-group-3--individuals-and-societies.pdf",
        ],
        "focus": [
            "Introduction to economics",
            "Microeconomics",
            "Macroeconomics",
            "The global economy",
            "Economic models and real-world examples",
            "Data response and policy evaluation",
            "Internal assessment commentary",
            "HL extension practice where applicable",
        ],
    },
    {
        "id": "business",
        "label": "Business",
        "title": "Business Management",
        "group": "Individuals and societies",
        "levels": ["HL"],
        "officialUrls": [
            "https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/business-management-hl-subject-brief-en.pdf",
            "https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/business-management-sl-subject-brief-en.pdf",
        ],
        "sourceUrls": [
            "https://sites.google.com/ccsbali.com/ibdiploma/ib-diploma/group3/business-management",
        ],
        "focus": [
            "Business organization and environment",
            "Human resource management",
            "Finance and accounts",
            "Marketing",
            "Operations management",
            "Creativity, change, ethics and sustainability",
            "Decision-making tools",
            "Internal assessment business research",
        ],
    },
    {
        "id": "english",
        "label": "English",
        "title": "Language A: Language and Literature",
        "group": "Studies in language and literature",
        "levels": ["SL"],
        "officialUrls": [
            "https://www.ibo.org/contentassets/5895a05412144fe890312bad52b17044/curriculum.brief-languagea.language.and.literature-eng.pdf",
        ],
        "sourceUrls": [
            "https://resources.finalsite.net/images/v1571337277/unis/y7cf9mbiwmfuqri5qj4e/Class2021firstexams-LanguageALanguage_LiteratureHL_SL.pdf",
        ],
        "focus": [
            "Readers, writers and texts",
            "Time and space",
            "Intertextuality: connecting texts",
            "Analysis of literary and non-literary texts",
            "Individual oral",
            "Higher level essay awareness",
            "Paper 1 guided textual analysis",
            "Paper 2 comparative essay practice",
        ],
    },
]

DEFAULT_FOCUS = [
    "Course aims and syllabus components",
    "Standard level and higher level expectations",
    "Assessment objectives",
    "Internal assessment",
    "External assessment practice",
    "Command terms and feedback",
]


@dataclass(frozen=True)
class IbSubject:
    id: str
    label: str
    title: str
    group: str
    levels: list[str]
    officialUrls: list[str]
    sourceUrls: list[str]
    focus: list[str]

    @property
    def slug(self) -> str:
        return slugify(self.label)


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


def fetch_bytes(url: str, timeout: int = 120) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def fetch_text(url: str, timeout: int = 120) -> str:
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


def extract_pdf_text(path: Path, max_pages: int = 24) -> str:
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


def extract_focus_items(text: str) -> list[str]:
    lines = [clean_line(line) for line in text.splitlines()]
    candidates: list[str] = []
    for line in lines:
        if not line or len(line) < 5 or len(line) > 110:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["international baccalaureate", "diploma programme", "copyright", "ibo.org", "page "]):
            continue
        if re.match(r"^([A-Z][A-Za-z0-9,&()'/: -]{5,90}|[A-Z][a-z]+(?: [a-z]+){1,8})$", line) and len(line.split()) <= 10:
            candidates.append(line)
            continue
        match = re.match(r"^(\d+(?:\.\d+)*|[A-Z]\d+(?:\.\d+)*)[.)]?\s+(.+)$", line)
        if match:
            label = clean_line(match.group(2))
            if 4 <= len(label) <= 90:
                candidates.append(label)
    return unique_items(candidates)[:10]


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


def build_pack(subject: IbSubject, focus_items: list[str]) -> dict[str, Any]:
    pack_id = f"official-ib-diploma-{subject.id}"
    selected = unique_items(subject.focus + focus_items + DEFAULT_FOCUS)[:8]
    level_text = "/".join(subject.levels)
    note_cards = [
        {
            "title": "IB subject map",
            "points": [
                f"This pack is built from public IB Diploma subject-brief material for {subject.label}.",
                f"It is intended for {level_text} planning in the {subject.group} group.",
                "Use the subject brief as a coverage checklist before detailed topic practice.",
            ],
        },
        {
            "title": "Main focus areas",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "Assessment loop",
            "points": [
                "Match each topic to the relevant assessment objective and command terms.",
                "Pair every notes session with one short response, data, experiment, or text-analysis task.",
                "Keep corrections tagged by syllabus component instead of by score only.",
            ],
        },
        {
            "title": "IA and exam practice",
            "points": [
                "Separate internal assessment planning from timed external assessment practice.",
                "For HL, identify the additional depth or extension before practising.",
                "After marking, rewrite one weak answer using subject-specific vocabulary.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"What should this IB {subject.label} pack be used for first?", "Mapping subject-brief coverage into revision priorities", ["Memorising only the source URL", "Skipping assessment objectives"], "The subject brief gives the course map and assessment shape."),
            quiz_question(pack_id, "Foundation", 2, "What makes revision active?", "Turning one focus area into a short practice task", ["Only reading headings", "Avoiding corrections"], "Practice plus feedback is the core study loop."),
            quiz_question(pack_id, "Foundation", 3, "Why separate IA and exam practice?", "They assess different products and skills", ["They are identical tasks", "IA replaces timed practice"], "IB courses usually combine internal and external assessment demands."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"How should '{selected[0]}' be revised?", "Make notes, practise a task, then mark against the assessment demand", ["Ignore it unless easy", "Treat it only as a title"], "Every focus area should become action."),
            quiz_question(pack_id, "Core", 2, "What makes a correction log useful?", "It links mistakes to a component, command term, or concept", ["It records only a score", "It hides repeated weak skills"], "Useful logs show what to relearn next."),
            quiz_question(pack_id, "Core", 3, "What should HL students check?", "The extra depth, extension, or assessment expectation for HL", ["Only SL tasks", "No difference from SL"], "HL normally requires extra depth or content."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "How can a learner move beyond recall?", "Apply concepts to unfamiliar data, text, scenario, or problem contexts", ["Copy headings only", "Avoid unfamiliar examples"], "Transfer is central to IB assessment."),
            quiz_question(pack_id, "Stretch", 2, "What is a strong final check?", "Timed practice followed by targeted corrections", ["Reading a title page only", "Dropping hard components"], "Timed work plus correction exposes final gaps."),
            quiz_question(pack_id, "Stretch", 3, "How should repeated weak areas be handled?", "Group them by syllabus component and schedule focused review", ["Assume they are random", "Stop practising"], "Patterns point to the next best study action."),
        ],
    }
    worksheet_questions = []
    prompts = [
        f"List four IB {subject.label} focus areas or assessment components.",
        "Choose one focus area and explain how it shapes revision.",
        "Write one practice task for a selected focus area.",
        "Describe how IA work differs from timed exam practice.",
        "Create two flashcard prompts for one weak area.",
        "Explain one common mistake and link it to a command term or concept.",
        "Plan a two-day review cycle for one focus area.",
        "Write one transfer task using an unfamiliar context.",
        "Compare two focus areas and explain how they connect.",
        "Create a mini checklist for the next practice session.",
        "Write a reflection on which component needs the most work.",
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
                    "Use a specific IB subject focus area or assessment component.",
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
        "provider": "official-ib-diploma",
        "title": f"IB Diploma {subject.title} Study Pack",
        "subtitle": f"{level_text} - public subject brief overview",
        "ibDiploma": {
            "subject": subject.label,
            "title": subject.title,
            "group": subject.group,
            "levels": subject.levels,
            "officialUrls": subject.officialUrls,
            "sourceUrls": subject.sourceUrls,
            "focusItems": selected,
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Use the IB Diploma {subject.label} subject brief as the course map.",
                "Connect each focus area to assessment objectives, IA requirements, and timed practice.",
                "For HL selections, add the required extra depth before attempting timed tasks.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": lanes,
            "totalQuestions": sum(len(items) for items in lanes.values()),
        },
        "worksheet": {
            "intro": f"Printable IB Diploma {subject.label} overview practice.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"ib-diploma-{subject.id}"],
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
    [subject.label, subject.value, subject.title, ...(subject.aliases || []), subject.id].filter(Boolean).map(slugify).forEach((alias) => {{
      out[alias] = subject.id;
    }});
    return out;
  }}, {{ business: "business", "business-management": "business", maths: "mathematics", "language-a-language-and-literature": "english" }});

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
    const subject = SUBJECTS.find((item) => item.id === id);
    const level = safeText(request?.level);
    if (subject?.levels?.length && level && !subject.levels.includes(level)) {{
      return null;
    }}
    return clone(PACKS[id]);
  }}

  function catalogSyllabus() {{
    const levels = DATA.levels || ["SL", "HL"];
    return {{
      name: "{SYLLABUS_NAME}",
      levels,
      subjects: SUBJECTS.map((subject) => ({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        title: safeText(subject.title || subject.label),
        levels: subject.levels || levels,
        topicPacks: [
          {{
            id: `ib-diploma-${{safeText(subject.id)}}`,
            title: "IB subject brief overview",
            source: "official-ib-diploma",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }}))
    }};
  }}

  window.IC_EDUCATE_IB_DIPLOMA_PACKS = {{
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


def save_source(subject: IbSubject, data_dir: Path, timeout: int, force_download: bool) -> tuple[list[str], list[str]]:
    subject_dir = data_dir / subject.slug
    subject_dir.mkdir(parents=True, exist_ok=True)
    local_sources: list[str] = []
    extracted_texts: list[str] = []
    for index, url in enumerate(subject.sourceUrls, start=1):
        suffix = ".pdf" if ".pdf" in url.lower() else ".html"
        source_path = subject_dir / f"source-{index}{suffix}"
        text_path = subject_dir / f"source-{index}.txt"
        if force_download or not source_path.exists():
            if suffix == ".pdf":
                source_path.write_bytes(fetch_bytes(url, timeout=timeout))
            else:
                source_path.write_text(fetch_text(url, timeout=timeout), encoding="utf-8")
        if force_download or not text_path.exists():
            if suffix == ".pdf":
                try:
                    text = extract_pdf_text(source_path)
                except Exception:
                    text = ""
            else:
                text = clean_line(source_path.read_text(encoding="utf-8", errors="replace"))
            text_path.write_text(text, encoding="utf-8")
        else:
            text = text_path.read_text(encoding="utf-8", errors="replace")
        local_sources.append(str(source_path.relative_to(ROOT)))
        extracted_texts.append(text)
    return local_sources, extracted_texts


def sync_subject(subject: IbSubject, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    local_sources, texts = save_source(subject, data_dir, timeout, force_download)
    extracted_focus = []
    for text in texts:
        extracted_focus.extend(extract_focus_items(text))
    focus_items = unique_items(subject.focus + extracted_focus + DEFAULT_FOCUS)[:10]
    subject_data = {
        "id": subject.id,
        "label": subject.label,
        "value": subject.label,
        "title": subject.title,
        "aliases": [subject.title],
        "group": subject.group,
        "levels": subject.levels,
        "officialUrls": subject.officialUrls,
        "sourceUrls": subject.sourceUrls,
        "localSources": local_sources,
        "focusItems": focus_items,
    }
    meta_path = data_dir / subject.slug / "metadata.json"
    meta_path.write_text(json.dumps({**subject_data, "downloadedAt": utc_now()}, indent=2, ensure_ascii=False), encoding="utf-8")
    pack = build_pack(subject, focus_items)
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download public IB Diploma subject briefs and generate packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    subjects = [IbSubject(**item) for item in SUBJECTS]
    print(f"IB Diploma subjects selected: {len(subjects)}")
    if args.dry_run:
        for subject in subjects:
            print(f"- {subject.label}: {', '.join(subject.levels)}")
            for url in subject.sourceUrls:
                print(f"  source: {url}")
        return 0
    data = read_bundle_data(args.output)
    subject_rows: list[dict[str, Any]] = []
    packs: dict[str, Any] = {}
    failures: list[tuple[IbSubject, str]] = []
    for index, subject in enumerate(subjects, start=1):
        print(f"[{index}/{len(subjects)}] {subject.label}")
        try:
            subject_data, pack = sync_subject(subject, args.data_dir, args.timeout, args.force_download)
            subject_rows.append(subject_data)
            packs[subject.id] = pack
        except Exception as exc:
            failures.append((subject, str(exc)))
            print(f"  failed: {str(exc)[:500]}")
            if not args.continue_on_error:
                raise
        time.sleep(0.05)
    data.update(
        {
            "metadata": {
                "generatedAt": utc_now(),
                "source": "IB Diploma public subject brief PDFs and accessible public mirrors",
                "packCount": len(packs),
                "note": "Official ibo.org PDF URLs are recorded; source mirrors are used when ibo.org blocks terminal downloads.",
            },
            "levels": COMMON_LEVELS,
            "subjects": sorted(subject_rows, key=lambda item: item["label"]),
            "packs": packs,
        }
    )
    write_bundle(args.output, data)
    print(f"Wrote {len(packs)} IB Diploma pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for subject, error in failures:
            print(f"- {subject.label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
