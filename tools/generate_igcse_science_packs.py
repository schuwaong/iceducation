#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT / "backend"
SNAPSHOT_PATH = ROOT / "library-snapshot.js"
DEFAULT_OUTPUT_PATH = ROOT / "generated-science-study-packs.js"

SYLLABUS_NAME = "Cambridge IGCSE"
LEVEL_NAME = "IGCSE"
SCIENCE_SUBJECTS = ("Physics", "Chemistry", "Biology")
BIOLOGY_14_IDS = {"14.1", "14.2", "14.3", "14.4", "14.5"}
WHOLE_CHAPTER_VALUE = "__whole_chapter__"

DATA_BEGIN = "// BEGIN_IC_EDUCATE_GENERATED_SCIENCE_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_GENERATED_SCIENCE_PACK_DATA"


@dataclass(frozen=True)
class SubtopicRow:
    subject: str
    chapter_id: str
    chapter_title: str
    subtopic_id: str
    subtopic_title: str

    @property
    def key(self) -> str:
        return "::".join(
            [
                "cambridge-igcse",
                slugify(self.subject),
                self.chapter_id,
                self.subtopic_id,
                slugify(self.subtopic_title),
            ]
        )

    @property
    def alias_key(self) -> str:
        return "::".join(["cambridge-igcse", slugify(self.subject), self.chapter_id, self.subtopic_id])

    @property
    def is_prebuilt_biology14(self) -> bool:
        return self.subject == "Biology" and self.chapter_id == "14" and self.subtopic_id in BIOLOGY_14_IDS

    @property
    def coverage_label(self) -> str:
        return f"{self.chapter_id}. {self.chapter_title}: {self.subtopic_id} {self.subtopic_title}"


def safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def slugify(value: Any) -> str:
    text = safe_text(value).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "item"


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_env_file(path: Path) -> None:
    if not path.exists():
        raise SystemExit(f"Env file not found: {path}")
    for raw_line in path.read_text(errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :].strip()
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def parse_snapshot(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"window\.IC_EDUCATE_SNAPSHOT\s*=\s*(\{.*\});\s*$", text, flags=re.S)
    if not match:
        raise SystemExit(f"Could not parse snapshot JS assignment: {path}")
    return json.loads(match.group(1))


def science_rows(snapshot: dict[str, Any]) -> list[SubtopicRow]:
    syllabi = snapshot.get("catalog", {}).get("syllabi") or []
    igcse = next((item for item in syllabi if item.get("name") == SYLLABUS_NAME), None)
    if not igcse:
        raise SystemExit(f"{SYLLABUS_NAME} was not found in {SNAPSHOT_PATH}")

    rows: list[SubtopicRow] = []
    for subject in igcse.get("subjects") or []:
        subject_name = safe_text(subject.get("label") or subject.get("value"))
        if subject_name not in SCIENCE_SUBJECTS:
            continue
        for chapter in subject.get("topicPacks") or []:
            chapter_id = safe_text(chapter.get("id"))
            chapter_title = safe_text(chapter.get("title"))
            for subtopic in chapter.get("subtopics") or []:
                subtopic_id = safe_text(subtopic.get("id"))
                subtopic_title = safe_text(subtopic.get("title"))
                if not chapter_id or not subtopic_id or not subtopic_title:
                    continue
                rows.append(SubtopicRow(subject_name, chapter_id, chapter_title, subtopic_id, subtopic_title))
    return rows


def unique_rows(rows: list[SubtopicRow]) -> list[SubtopicRow]:
    seen: set[str] = set()
    out: list[SubtopicRow] = []
    for row in rows:
        if row.key in seen:
            continue
        seen.add(row.key)
        out.append(row)
    return out


def bundle_template(data: dict[str, Any]) -> str:
    json_blob = json.dumps(data, ensure_ascii=True, indent=2, sort_keys=True)
    return f"""(function () {{
  if (typeof window === "undefined") {{
    return;
  }}

{DATA_BEGIN}
  const DATA = {json_blob};
{DATA_END}

  const WHOLE_CHAPTER_VALUE = "__whole_chapter__";
  const LANES = ["Foundation", "Core", "Stretch"];

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

  function aliasKey(subject, chapterId, subtopicId) {{
    return ["cambridge-igcse", slugify(subject), safeText(chapterId), safeText(subtopicId)].join("::");
  }}

  function packSubject(pack) {{
    return safeText(pack?.staticBundle?.subject || pack?.request?.subject || pack?.request?.topic);
  }}

  function chapterIndexKey(subject, chapterId) {{
    return ["cambridge-igcse", slugify(subject), safeText(chapterId)].join("::");
  }}

  const CHAPTER_INDEX = Object.keys(DATA.packs || {{}}).reduce((index, key) => {{
    const pack = DATA.packs[key];
    const subject = packSubject(pack);
    const chapterId = safeText(pack?.staticBundle?.chapterId || pack?.request?.chapterId);
    if (!subject || !chapterId) {{
      return index;
    }}
    const itemKey = chapterIndexKey(subject, chapterId);
    if (!index[itemKey]) {{
      index[itemKey] = [];
    }}
    index[itemKey].push(key);
    return index;
  }}, {{}});

  function requestSubject(request) {{
    return safeText(request?.topic || request?.subject);
  }}

  function requestIsScience(request) {{
    if (safeText(request?.syllabus) !== "Cambridge IGCSE") {{
      return false;
    }}
    return ["biology", "chemistry", "physics"].includes(slugify(requestSubject(request)));
  }}

  function addSubtopicRef(refs, subject, chapterId, subtopicId) {{
    const cleanChapter = safeText(chapterId);
    const cleanSubtopic = safeText(subtopicId);
    if (!cleanChapter || !cleanSubtopic || cleanSubtopic === WHOLE_CHAPTER_VALUE) {{
      return;
    }}
    refs.push({{ subject, chapterId: cleanChapter, subtopicId: cleanSubtopic }});
  }}

  function idFromLabel(label) {{
    const text = safeText(label);
    const match = text.match(/^[A-Za-z]?\\d+(?:\\.\\d+)*/);
    return match ? match[0] : "";
  }}

  function requestedRefs(request) {{
    const subject = requestSubject(request);
    const refs = [];
    const coverage = Array.isArray(request?.selectedSyllabusCoverage) ? request.selectedSyllabusCoverage : [];

    coverage.forEach((item) => {{
      const chapterId = safeText(item?.chapterId || item?.id);
      const subtopicId = safeText(item?.subtopicId);
      if (subtopicId === WHOLE_CHAPTER_VALUE) {{
        const subtopics = Array.isArray(item?.subtopics) ? item.subtopics : [];
        if (subtopics.length) {{
          subtopics.forEach((label) => addSubtopicRef(refs, subject, chapterId, idFromLabel(label)));
        }} else if (CHAPTER_INDEX[chapterIndexKey(subject, chapterId)]) {{
          refs.push({{ subject, chapterId, wholeChapter: true }});
        }}
        return;
      }}
      addSubtopicRef(refs, subject, chapterId, subtopicId);
    }});

    const rawIds = Array.isArray(request?.subtopicIds) ? request.subtopicIds : [];
    rawIds.forEach((value) => {{
      const text = safeText(value);
      if (!text) {{
        return;
      }}
      if (text.startsWith(`${{WHOLE_CHAPTER_VALUE}}:`)) {{
        refs.push({{ subject, chapterId: text.slice(WHOLE_CHAPTER_VALUE.length + 1), wholeChapter: true }});
        return;
      }}
      const parts = text.split(":");
      if (parts.length >= 2) {{
        addSubtopicRef(refs, subject, parts[0], parts.slice(1).join(":"));
      }}
    }});

    if (!refs.length && safeText(request?.chapterId) && safeText(request?.subtopicId)) {{
      addSubtopicRef(refs, subject, request.chapterId, request.subtopicId);
    }}

    const seen = new Set();
    return refs.filter((ref) => {{
      const key = [slugify(ref.subject), ref.chapterId, ref.subtopicId || "*"].join("::");
      if (seen.has(key)) {{
        return false;
      }}
      seen.add(key);
      return true;
    }});
  }}

  function keysForRequest(request) {{
    if (!requestIsScience(request)) {{
      return [];
    }}
    const keys = [];
    requestedRefs(request).forEach((ref) => {{
      if (ref.wholeChapter) {{
        keys.push(...(CHAPTER_INDEX[chapterIndexKey(ref.subject, ref.chapterId)] || []));
        return;
      }}
      const mapped = DATA.aliases?.[aliasKey(ref.subject, ref.chapterId, ref.subtopicId)];
      if (mapped) {{
        keys.push(mapped);
      }}
    }});
    const seen = new Set();
    return keys.filter((key) => {{
      if (!DATA.packs?.[key] || seen.has(key)) {{
        return false;
      }}
      seen.add(key);
      return true;
    }});
  }}

  function prefixQuestion(question, pack, index) {{
    const next = clone(question);
    const subtopic = safeText(pack?.staticBundle?.subtopicId);
    next.id = `${{safeText(next.id, "q")}}-generated-${{index + 1}}`;
    if (subtopic && !safeText(next.concept).startsWith(subtopic)) {{
      next.concept = `${{subtopic}} ${{safeText(pack?.staticBundle?.subtopicTitle)}}: ${{safeText(next.concept)}}`;
    }}
    return next;
  }}

  function combineNotes(packs) {{
    const focusItems = [];
    const importantPoints = [];
    const noteCards = [];
    packs.forEach((pack) => {{
      (pack?.notes?.focusItems || []).forEach((item) => focusItems.push(item));
      (pack?.notes?.importantPoints || []).forEach((item) => importantPoints.push(item));
      (pack?.notes?.noteCards || []).forEach((card) => noteCards.push(card));
    }});
    return {{
      focusItems: [...new Set(focusItems)].slice(0, 24),
      importantPoints: [...new Set(importantPoints)].slice(0, 24),
      noteCards: noteCards.slice(0, 30)
    }};
  }}

  function combineQuiz(packs) {{
    const lanes = {{ Foundation: [], Core: [], Stretch: [] }};
    LANES.forEach((lane) => {{
      packs.forEach((pack, packIndex) => {{
        (pack?.quiz?.lanes?.[lane] || []).forEach((question) => {{
          lanes[lane].push(prefixQuestion(question, pack, packIndex));
        }});
      }});
    }});
    return {{
      lanes,
      totalQuestions: LANES.reduce((total, lane) => total + lanes[lane].length, 0)
    }};
  }}

  function combineWorksheet(packs, request) {{
    const target = Math.max(1, Math.min(30, Number(request?.worksheetLength) || 12));
    const pools = packs.map((pack) => Array.isArray(pack?.worksheet?.questions) ? pack.worksheet.questions : []);
    const questions = [];

    pools.forEach((pool, poolIndex) => {{
      if (pool[0]) {{
        const question = clone(pool[0]);
        question.sourcePackIndex = poolIndex;
        questions.push(question);
      }}
    }});

    let offset = 1;
    while (questions.length < target) {{
      let added = false;
      pools.forEach((pool, poolIndex) => {{
        if (questions.length >= target) {{
          return;
        }}
        if (pool[offset]) {{
          const question = clone(pool[offset]);
          question.sourcePackIndex = poolIndex;
          questions.push(question);
          added = true;
        }}
      }});
      if (!added) {{
        break;
      }}
      offset += 1;
    }}

    const normalized = questions.slice(0, target).map((question, index) => {{
      const pack = packs[Number(question.sourcePackIndex) || 0] || packs[0];
      const subtopic = safeText(pack?.staticBundle?.subtopicId);
      return {{
        ...question,
        number: index + 1,
        prompt: subtopic && !safeText(question.prompt).startsWith(subtopic)
          ? `${{subtopic}} ${{safeText(pack?.staticBundle?.subtopicTitle)}}: ${{safeText(question.prompt)}}`
          : safeText(question.prompt)
      }};
    }});

    const answerKeyLines = normalized.map((question) => {{
      const points = (question.answerPoints || []).map((point) => `- ${{point}}`).join("\\n");
      return `Q${{question.number}} (${{safeText(question.lane, "Foundation")}}, ${{Number(question.marks) || 1}} marks) - ${{safeText(question.prompt)}}\\n${{points}}`;
    }});

    return {{
      intro: "Generated IGCSE science practice from the selected syllabus subtopics.",
      questions: normalized,
      answerKeyLines,
      rubricText: answerKeyLines.join("\\n\\n")
    }};
  }}

  function composePacks(keys, request) {{
    const packs = keys.map((key) => clone(DATA.packs[key])).filter(Boolean);
    if (!packs.length) {{
      return null;
    }}
    if (packs.length === 1) {{
      return packs[0];
    }}
    const subject = requestSubject(request);
    const first = packs[0]?.staticBundle || {{}};
    const notes = combineNotes(packs);
    const quiz = combineQuiz(packs);
    const worksheet = combineWorksheet(packs, request);
    return {{
      id: `generated-science-combo-${{Date.now()}}`,
      generatedAt: DATA.metadata?.generatedAt || "",
      provider: "generated-science-bundle",
      title: `${{subject}} Combined Study Pack`,
      subtitle: `Cambridge IGCSE - ${{subject}} - ${{packs.length}} generated subtopics`,
      staticBundle: {{
        subject,
        chapterId: safeText(first.chapterId),
        subtopicId: "multiple",
        subtopicTitle: `${{packs.length}} selected subtopics`
      }},
      notes,
      quiz,
      worksheet,
      recommendations: {{
        recommendedFocus: packs.map((pack) => `${{safeText(pack?.staticBundle?.subtopicId)}} ${{safeText(pack?.staticBundle?.subtopicTitle)}}`).filter(Boolean),
        recommendedTopicIds: [...new Set(packs.map((pack) => safeText(pack?.staticBundle?.chapterId)).filter(Boolean))],
        topicMatches: [],
        libraryMatches: []
      }}
    }};
  }}

  function find(request) {{
    return composePacks(keysForRequest(request), request);
  }}

  window.IC_EDUCATE_GENERATED_PACKS = {{
    metadata: DATA.metadata || {{}},
    find,
    keys: () => Object.keys(DATA.packs || {{}}),
    count: () => Object.keys(DATA.packs || {{}}).length
  }};
}})();
"""


def empty_bundle(snapshot: dict[str, Any], rows: list[SubtopicRow]) -> dict[str, Any]:
    return {
        "metadata": {
            "generatedAt": "",
            "sourceSnapshotGeneratedAt": safe_text(snapshot.get("generatedAt")),
            "syllabus": SYLLABUS_NAME,
            "level": LEVEL_NAME,
            "provider": "",
            "model": "",
            "rawScienceSubtopics": len(rows),
            "uniqueScienceSubtopics": len(unique_rows(rows)),
            "prebuiltBiology14Subtopics": sum(1 for row in unique_rows(rows) if row.is_prebuilt_biology14),
            "subjectCounts": subject_counts(rows),
        },
        "aliases": {},
        "packs": {},
    }


def extract_bundle_data(path: Path, snapshot: dict[str, Any], rows: list[SubtopicRow]) -> dict[str, Any]:
    if not path.exists():
        return empty_bundle(snapshot, rows)
    text = path.read_text(encoding="utf-8")
    match = re.search(
        re.escape(DATA_BEGIN) + r"\s*const DATA = (\{.*?\});\s*" + re.escape(DATA_END),
        text,
        flags=re.S,
    )
    if not match:
        return empty_bundle(snapshot, rows)
    data = json.loads(match.group(1))
    if not isinstance(data, dict):
        return empty_bundle(snapshot, rows)
    data.setdefault("metadata", {})
    data.setdefault("aliases", {})
    data.setdefault("packs", {})
    return data


def subject_counts(rows: list[SubtopicRow]) -> dict[str, dict[str, int]]:
    counts: dict[str, dict[str, int]] = {}
    unique_by_subject: dict[str, set[str]] = {}
    for row in rows:
        counts.setdefault(row.subject, {"raw": 0, "unique": 0})
        unique_by_subject.setdefault(row.subject, set())
        counts[row.subject]["raw"] += 1
        unique_by_subject[row.subject].add(row.key)
    for subject, keys in unique_by_subject.items():
        counts[subject]["unique"] = len(keys)
    return counts


def rebuild_aliases(data: dict[str, Any], rows: list[SubtopicRow]) -> None:
    aliases: dict[str, str] = {}
    packs = data.setdefault("packs", {})
    for key in packs:
        aliases[key] = key
    for row in rows:
        if row.key in packs:
            aliases[row.alias_key] = row.key
            aliases[row.key] = row.key
    data["aliases"] = aliases


def write_bundle(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(bundle_template(data), encoding="utf-8")
    tmp.replace(path)


def build_request(row: SubtopicRow, worksheet_length: int) -> dict[str, Any]:
    target = f"Learn {row.subtopic_id} {row.subtopic_title} in {row.chapter_id}. {row.chapter_title}."
    coverage_instruction = f"Cover every selected syllabus point without gaps: {row.coverage_label}."
    return {
        "syllabus": SYLLABUS_NAME,
        "curriculum": SYLLABUS_NAME,
        "level": LEVEL_NAME,
        "topic": row.chapter_title,
        "subject": row.subject,
        "chapterIds": [row.chapter_id],
        "chapterId": row.chapter_id,
        "chapterTitle": row.chapter_title,
        "subtopicIds": [f"{row.chapter_id}:{row.subtopic_id}"],
        "subtopicId": f"{row.chapter_id}:{row.subtopic_id}",
        "subtopic": f"{row.subtopic_id} {row.subtopic_title}",
        "selectedSyllabusCoverage": [
            {
                "chapterId": row.chapter_id,
                "chapterTitle": row.chapter_title,
                "subtopicId": row.subtopic_id,
                "subtopicTitle": row.subtopic_title,
            }
        ],
        "coverageLabels": [row.coverage_label],
        "learningTargets": [target],
        "learningTarget": target,
        "goal": f"{target} {coverage_instruction}",
        "description": f"{target} {coverage_instruction}",
        "focus": "",
        "pace": "balanced",
        "worksheetLength": worksheet_length,
        "topicIds": [row.chapter_id],
        "recommendedFocus": [f"{row.subtopic_id} {row.subtopic_title}"],
        "preferredProvider": "deepseek",
        "createdAt": utc_now(),
    }


def validate_pack(pack: dict[str, Any], row: SubtopicRow) -> None:
    note_cards = pack.get("notes", {}).get("noteCards") or []
    if len(note_cards) < 4:
        raise ValueError(f"{row.key}: expected at least 4 note cards")
    if not any(card.get("points") for card in note_cards if isinstance(card, dict)):
        raise ValueError(f"{row.key}: no note card points")

    lanes = pack.get("quiz", {}).get("lanes") or {}
    for lane in ("Foundation", "Core", "Stretch"):
        questions = lanes.get(lane) or []
        if len(questions) < 3:
            raise ValueError(f"{row.key}: expected 3 {lane} quiz questions")
        for question in questions[:3]:
            choices = question.get("choices") or []
            if len(choices) < 3:
                raise ValueError(f"{row.key}: {lane} question has fewer than 3 choices")

    worksheet_questions = pack.get("worksheet", {}).get("questions") or []
    if not worksheet_questions:
        raise ValueError(f"{row.key}: no worksheet questions")


def enrich_pack(pack: dict[str, Any], row: SubtopicRow) -> dict[str, Any]:
    out = dict(pack)
    out["staticBundle"] = {
        "key": row.key,
        "subject": row.subject,
        "chapterId": row.chapter_id,
        "chapterTitle": row.chapter_title,
        "subtopicId": row.subtopic_id,
        "subtopicTitle": row.subtopic_title,
        "coverageLabel": row.coverage_label,
    }
    return out


def generate_with_local_backend(payload: dict[str, Any]) -> dict[str, Any]:
    sys.path.insert(0, str(BACKEND_DIR))
    try:
        from app import generate_ai_study_pack  # type: ignore
    except ImportError as exc:
        raise RuntimeError(f"Could not import backend generator: {exc}") from exc
    return generate_ai_study_pack(payload)


def generate_with_api(api_base: str, payload: dict[str, Any], timeout: int) -> dict[str, Any]:
    url = api_base.rstrip("/") + "/api/study-pack/generate"
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"API generation failed with HTTP {exc.code}: {body[:500]}") from exc


def inventory_lines(rows: list[SubtopicRow], data: dict[str, Any], include_prebuilt: bool) -> list[str]:
    packs = data.get("packs") or {}
    lines = ["Cambridge IGCSE science inventory"]
    total_queue = 0
    total_existing = 0
    total_unique = 0
    total_raw = 0
    for subject in SCIENCE_SUBJECTS:
        subject_rows = [row for row in rows if row.subject == subject]
        subject_unique = unique_rows(subject_rows)
        if not include_prebuilt:
            subject_unique = [row for row in subject_unique if not row.is_prebuilt_biology14]
        existing = sum(1 for row in subject_unique if row.key in packs)
        queue = len(subject_unique) - existing
        total_raw += len(subject_rows)
        total_unique += len(subject_unique)
        total_existing += existing
        total_queue += queue
        lines.append(
            f"- {subject}: raw={len(subject_rows)}, unique={len(unique_rows(subject_rows))}, "
            f"existing={existing}, queue={queue}"
        )
    skipped = sum(1 for row in unique_rows(rows) if row.is_prebuilt_biology14)
    lines.append(f"- Existing Biology Chapter 14 prebuilt subtopics skipped: {skipped if not include_prebuilt else 0}")
    lines.append(f"- Raw science subtopic rows: {total_raw}")
    lines.append(f"- Unique generation candidates: {total_unique}")
    lines.append(f"- Existing generated packs: {total_existing}")
    lines.append(f"- Unique generation queue: {total_queue}")
    return lines


def select_queue(
    rows: list[SubtopicRow],
    data: dict[str, Any],
    subjects: list[str],
    include_prebuilt: bool,
    force: bool,
    smoke_test: bool,
    limit: int,
) -> list[SubtopicRow]:
    subject_set = set(subjects)
    packs = data.get("packs") or {}
    queue = [
        row
        for row in unique_rows(rows)
        if row.subject in subject_set
        and (include_prebuilt or not row.is_prebuilt_biology14)
        and (force or row.key not in packs)
    ]
    if smoke_test:
        selected: list[SubtopicRow] = []
        for subject in SCIENCE_SUBJECTS:
            if subject not in subject_set:
                continue
            found = next((row for row in queue if row.subject == subject), None)
            if found:
                selected.append(found)
        return selected
    if limit > 0:
        return queue[:limit]
    return queue


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate static Cambridge IGCSE science study packs.")
    parser.add_argument("--snapshot", type=Path, default=SNAPSHOT_PATH)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--env-file", type=Path, action="append", default=[])
    parser.add_argument("--api-base", default="", help="Optional existing IC Educate API base URL.")
    parser.add_argument("--timeout", type=int, default=180)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--sleep", type=float, default=0.2)
    parser.add_argument("--worksheet-length", type=int, default=12)
    parser.add_argument("--subjects", nargs="+", choices=SCIENCE_SUBJECTS, default=list(SCIENCE_SUBJECTS))
    parser.add_argument("--include-prebuilt-biology14", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--list-missing", action="store_true")
    parser.add_argument("--init-empty", action="store_true", help="Write an empty generated bundle and exit.")
    parser.add_argument("--continue-on-error", action="store_true")
    parser.add_argument("--smoke-test", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    for env_file in args.env_file:
        load_env_file(env_file)

    snapshot = parse_snapshot(args.snapshot)
    rows = science_rows(snapshot)
    data = extract_bundle_data(args.output, snapshot, rows)
    rebuild_aliases(data, rows)

    print("\n".join(inventory_lines(rows, data, args.include_prebuilt_biology14)))
    if args.list_missing:
        queue = select_queue(
            rows,
            data,
            args.subjects,
            args.include_prebuilt_biology14,
            args.force,
            args.smoke_test,
            args.limit,
        )
        for row in queue:
            print(f"- {row.subject} {row.chapter_id}. {row.chapter_title} :: {row.subtopic_id} {row.subtopic_title}")
        return 0
    if args.dry_run:
        return 0
    if args.init_empty:
        data["metadata"].update(
            {
                "generatedAt": data["metadata"].get("generatedAt") or "",
                "sourceSnapshotGeneratedAt": safe_text(snapshot.get("generatedAt")),
                "syllabus": SYLLABUS_NAME,
                "level": LEVEL_NAME,
                "rawScienceSubtopics": len(rows),
                "uniqueScienceSubtopics": len(unique_rows(rows)),
                "prebuiltBiology14Subtopics": sum(1 for item in unique_rows(rows) if item.is_prebuilt_biology14),
                "subjectCounts": subject_counts(rows),
            }
        )
        rebuild_aliases(data, rows)
        write_bundle(args.output, data)
        print(f"Wrote initial generated bundle to {args.output}")
        return 0

    queue = select_queue(
        rows,
        data,
        args.subjects,
        args.include_prebuilt_biology14,
        args.force,
        args.smoke_test,
        args.limit,
    )
    if not queue:
        print("No packs to generate.")
        data["metadata"].update(
            {
                "generatedAt": data["metadata"].get("generatedAt") or utc_now(),
                "sourceSnapshotGeneratedAt": safe_text(snapshot.get("generatedAt")),
                "subjectCounts": subject_counts(rows),
            }
        )
        rebuild_aliases(data, rows)
        write_bundle(args.output, data)
        return 0

    if not args.api_base and not os.environ.get("DEEPSEEK_API_KEY"):
        raise SystemExit("Missing DEEPSEEK_API_KEY. Set it, pass --env-file, or pass --api-base.")

    provider = "hosted-api" if args.api_base else "deepseek"
    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")
    print(f"Generating {len(queue)} pack(s) using {provider}...")

    packs = data.setdefault("packs", {})
    failures: list[tuple[SubtopicRow, str]] = []
    for index, row in enumerate(queue, start=1):
        print(f"[{index}/{len(queue)}] {row.subject} {row.chapter_id} {row.subtopic_id} {row.subtopic_title}")
        payload = build_request(row, max(1, min(30, args.worksheet_length)))
        last_error = ""
        pack: dict[str, Any] | None = None
        for attempt in range(max(1, args.retries + 1)):
            try:
                if args.api_base:
                    pack = generate_with_api(args.api_base, payload, args.timeout)
                else:
                    pack = generate_with_local_backend(payload)
                validate_pack(pack, row)
                break
            except Exception as exc:
                last_error = str(exc)
                if attempt < args.retries:
                    wait_seconds = max(1.0, args.sleep) * (attempt + 1)
                    print(f"  retry {attempt + 1}/{args.retries} after error: {last_error[:240]}")
                    time.sleep(wait_seconds)
        if pack is None:
            failures.append((row, last_error))
            print(f"  failed: {last_error[:500]}")
            if args.continue_on_error:
                continue
            raise RuntimeError(last_error)
        packs[row.key] = enrich_pack(pack, row)
        rebuild_aliases(data, rows)
        data["metadata"].update(
            {
                "generatedAt": utc_now(),
                "sourceSnapshotGeneratedAt": safe_text(snapshot.get("generatedAt")),
                "syllabus": SYLLABUS_NAME,
                "level": LEVEL_NAME,
                "provider": provider,
                "model": model,
                "rawScienceSubtopics": len(rows),
                "uniqueScienceSubtopics": len(unique_rows(rows)),
                "prebuiltBiology14Subtopics": sum(1 for item in unique_rows(rows) if item.is_prebuilt_biology14),
                "subjectCounts": subject_counts(rows),
            }
        )
        write_bundle(args.output, data)
        if args.sleep:
            time.sleep(args.sleep)

    print(f"Wrote {len(packs)} generated pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for row, error in failures:
            print(f"- {row.key}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
