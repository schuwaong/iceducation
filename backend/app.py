from __future__ import annotations

import os
import re
import uuid
from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS

from deepseek_client import DeepSeekClient, DeepSeekError


DEFAULT_SYLLABUS = "Cambridge IGCSE"
DEFAULT_LEVEL = "IGCSE"

app = Flask(__name__)
CORS(app)


def _safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def _safe_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _safe_string_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [_safe_text(item) for item in value if _safe_text(item)]
    text = _safe_text(value)
    return [text] if text else []


def _slug_key(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "-", _safe_text(value).lower()).strip("-")


def _coverage_item_label(item: dict[str, Any]) -> str:
    chapter_id = _safe_text(item.get("chapterId"))
    chapter_title = _safe_text(item.get("chapterTitle"))
    subtopic_id = _safe_text(item.get("subtopicId"))
    subtopic_title = _safe_text(item.get("subtopicTitle"))
    chapter = f"{chapter_id}. {chapter_title}".strip(". ").strip()
    if subtopic_id and subtopic_title:
        return f"{chapter}: {subtopic_id} {subtopic_title}".strip()
    if subtopic_title:
        return f"{chapter}: {subtopic_title}".strip(": ")
    return chapter


def _study_pack_coverage(payload: dict[str, Any]) -> list[dict[str, Any]]:
    raw = payload.get("selectedSyllabusCoverage")
    if not isinstance(raw, list):
        return []
    coverage: list[dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        coverage.append(
            {
                "chapterId": _safe_text(item.get("chapterId") or item.get("id")),
                "chapterTitle": _safe_text(item.get("chapterTitle") or item.get("title")),
                "subtopicId": _safe_text(item.get("subtopicId")),
                "subtopicTitle": _safe_text(item.get("subtopicTitle")),
                "subtopics": _safe_string_list(item.get("subtopics")),
            }
        )
    return coverage


def _study_pack_request(payload: dict[str, Any]) -> dict[str, Any]:
    coverage = _study_pack_coverage(payload)
    coverage_labels = _safe_string_list(payload.get("coverageLabels")) or [
        _coverage_item_label(item) for item in coverage if _coverage_item_label(item)
    ]
    return {
        "syllabus": _safe_text(payload.get("syllabus") or payload.get("curriculum"), DEFAULT_SYLLABUS),
        "level": _safe_text(payload.get("level"), DEFAULT_LEVEL),
        "topic": _safe_text(payload.get("topic") or payload.get("subject"), "Selected topic"),
        "subtopic": _safe_text(payload.get("subtopic")),
        "chapterIds": _safe_string_list(payload.get("chapterIds")),
        "chapterTitle": _safe_text(payload.get("chapterTitle")),
        "subtopicIds": _safe_string_list(payload.get("subtopicIds")),
        "selectedSyllabusCoverage": coverage,
        "coverageLabels": coverage_labels,
        "learningTargets": _safe_string_list(payload.get("learningTargets")),
        "goal": _safe_text(payload.get("goal") or payload.get("description"), "Build a clear study pack for this topic."),
        "focus": _safe_text(payload.get("focus")),
        "pace": _safe_text(payload.get("pace"), "balanced"),
        "worksheetLength": max(6, min(30, _safe_int(payload.get("worksheetLength"), 12))),
    }


def _suggest_focus_terms(payload: dict[str, Any]) -> list[str]:
    request_data = _study_pack_request(payload)
    terms = []
    terms.extend(request_data["coverageLabels"])
    terms.extend(_safe_string_list(payload.get("recommendedFocus")))
    terms.extend(_safe_string_list(request_data["focus"].split(",")))
    deduped: list[str] = []
    seen: set[str] = set()
    for item in terms:
        text = _safe_text(item)
        key = text.lower()
        if len(text) < 4 or key in seen:
            continue
        seen.add(key)
        deduped.append(text)
    return deduped[:6]


def _study_pack_prompt(payload: dict[str, Any], *, retry_index: int = 0) -> str:
    request_data = _study_pack_request(payload)
    coverage_summary = "\n".join(f"- {item}" for item in request_data["coverageLabels"]) or "- (none provided)"
    learning_target_summary = "; ".join(request_data["learningTargets"]) if request_data["learningTargets"] else request_data["goal"]
    suggested_focus = _suggest_focus_terms(payload)
    retry_block = ""
    if retry_index > 0:
        retry_block = """

Retry note:
- The previous attempt was incomplete or invalid.
- Return one valid JSON object only.
- Do not wrap the JSON in markdown.
- Use double quotes for every JSON key and string value.
- Keep every string short and plain.
""".rstrip()
    return f"""
Create a simple study pack for a tutoring website. Keep it clear, practical, and exam-focused.
The website has 3 tabs only:
1. Notes
2. Quiz
3. Worksheet

The design goal is simple, gamified, and not overloaded.
Use 3 difficulty lanes in the quiz:
- Foundation
- Core
- Stretch

Student request:
- Syllabus: {request_data["syllabus"]}
- Level: {request_data["level"]}
- Topic: {request_data["topic"]}
- Chapter ids: {", ".join(request_data["chapterIds"]) if request_data["chapterIds"] else "(none selected)"}
- Chapter title: {request_data["chapterTitle"] or request_data["topic"]}
- Subtopic: {request_data["subtopic"] or "(whole topic)"}
- Subtopic ids: {", ".join(request_data["subtopicIds"]) if request_data["subtopicIds"] else "(none selected)"}
- Required syllabus coverage:
{coverage_summary}
- Selected learning targets: {learning_target_summary}
- Goal: {request_data["goal"]}
- Extra focus: {request_data["focus"] or "(none provided)"}
- Pace: {request_data["pace"]}
- Worksheet length: {request_data["worksheetLength"]} questions
- Priority weak areas: {", ".join(suggested_focus) if suggested_focus else "(none provided)"}

Return JSON only with this exact top-level shape:
{{
  "title": "string",
  "subtitle": "string",
  "focusItems": ["string"],
  "importantPoints": ["string"],
  "noteCards": [
    {{"title": "string", "points": ["string"]}}
  ],
  "quizLanes": {{
    "Foundation": [
      {{
        "prompt": "string",
        "concept": "string",
        "choices": ["string", "string", "string"],
        "answer": 0,
        "explanation": "string"
      }}
    ],
    "Core": [
      {{
        "prompt": "string",
        "concept": "string",
        "choices": ["string", "string", "string"],
        "answer": 0,
        "explanation": "string"
      }}
    ],
    "Stretch": [
      {{
        "prompt": "string",
        "concept": "string",
        "choices": ["string", "string", "string"],
        "answer": 0,
        "explanation": "string"
      }}
    ]
  }},
  "worksheet": {{
    "intro": "string",
    "questions": [
      {{
        "lane": "Foundation",
        "prompt": "string",
        "marks": 2,
        "answerPoints": ["string"]
      }}
    ]
  }}
}}

Rules:
- Keep language concise and student-friendly.
- Make the notes high-yield, not long essays.
- Required syllabus coverage is non-negotiable: cover every item listed above without skipping any selected subtopic.
- If a whole chapter is selected, cover each listed subtopic inside that chapter, not only a chapter overview.
- The first note card should act as a coverage checklist or learning map for the selected syllabus points.
- Include every selected coverage item at least once across focusItems, importantPoints, quiz concepts/prompts, and worksheet questions.
- Make quiz explanations teach the method, not just the answer.
- Make worksheet questions suitable for PDF practice.
- Ensure all answer indexes are valid for the choices array.
- Return exactly 4 note cards.
- Keep each note card to 3-4 short points.
- Return exactly 3 quiz questions per lane.
- Keep each quiz explanation to 1-2 short sentences.
- Return exactly the requested worksheet length.
- Keep each worksheet answerPoints list to 3 short points maximum.
{retry_block}
""".strip()


def _normalize_string_list(items: Any, *, minimum: int = 0) -> list[str]:
    out = [_safe_text(item) for item in (items or []) if _safe_text(item)]
    return out if len(out) >= minimum else out


def _normalize_note_cards(items: Any) -> list[dict[str, Any]]:
    cards: list[dict[str, Any]] = []
    for item in items or []:
        if not isinstance(item, dict):
            continue
        title = _safe_text(item.get("title"), "Notes card")
        points = _normalize_string_list(item.get("points"), minimum=1)
        if points:
            cards.append({"title": title, "points": points[:4]})
    return cards


def _normalize_quiz_lanes(items: Any) -> dict[str, list[dict[str, Any]]]:
    lanes: dict[str, list[dict[str, Any]]] = {"Foundation": [], "Core": [], "Stretch": []}
    if not isinstance(items, dict):
        return lanes
    for lane in lanes:
        for index, question in enumerate(items.get(lane) or []):
            if not isinstance(question, dict):
                continue
            choices = _normalize_string_list(question.get("choices"), minimum=3)[:3]
            if len(choices) < 3:
                continue
            answer = _safe_int(question.get("answer"), 0)
            if answer < 0 or answer >= len(choices):
                answer = 0
            lanes[lane].append(
                {
                    "id": f"{_slug_key(lane)}-{index + 1}",
                    "prompt": _safe_text(question.get("prompt"), f"{lane} question {index + 1}"),
                    "concept": _safe_text(question.get("concept"), "Use the concept before locking in the answer."),
                    "choices": choices,
                    "answer": answer,
                    "explanation": _safe_text(question.get("explanation"), "Review the method before moving on."),
                }
            )
    return lanes


def _normalize_worksheet_questions(items: Any) -> list[dict[str, Any]]:
    questions: list[dict[str, Any]] = []
    for index, question in enumerate(items or []):
        if not isinstance(question, dict):
            continue
        lane = _safe_text(question.get("lane"), "Foundation")
        if lane not in {"Foundation", "Core", "Stretch"}:
            lane = "Foundation"
        marks = max(1, min(8, _safe_int(question.get("marks"), 2)))
        answer_points = _normalize_string_list(question.get("answerPoints"), minimum=1)
        if not answer_points:
            answer_points = [
                "State the key idea clearly.",
                "Show the method or reasoning.",
                "Finish with a checked answer.",
            ]
        questions.append(
            {
                "number": index + 1,
                "lane": lane,
                "prompt": _safe_text(question.get("prompt"), f"Practice question {index + 1}"),
                "marks": marks,
                "answerPoints": answer_points[:3],
            }
        )
    return questions


def _build_study_pack_answer_key_lines(questions: list[dict[str, Any]]) -> list[str]:
    lines: list[str] = []
    for question in questions:
        marks = _safe_int(question.get("marks"), 0)
        lane = _safe_text(question.get("lane"))
        prompt = _safe_text(question.get("prompt"))
        points = _normalize_string_list(question.get("answerPoints"))
        line = [f"Q{_safe_int(question.get('number'), 0)} ({lane}, {marks} marks) - {prompt}"]
        line.extend(f"- {point}" for point in points)
        lines.append("\n".join(line))
    return lines


def _deepseek_client() -> DeepSeekClient:
    return DeepSeekClient(
        api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
        base_url=os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),
        model=os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash"),
    )


def _generate_study_pack_with_deepseek(payload: dict[str, Any], *, retry_index: int = 0) -> dict[str, Any]:
    client = _deepseek_client()
    parsed = client.chat_json(
        [
            {"role": "system", "content": "You are an education content generator. Return JSON only."},
            {"role": "user", "content": _study_pack_prompt(payload, retry_index=retry_index)},
        ],
        temperature=0.15 if retry_index == 0 else 0.0,
    )
    parsed["provider"] = "deepseek"
    return parsed


def _build_study_pack_response(ai_payload: dict[str, Any], request_data: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    note_cards = _normalize_note_cards(ai_payload.get("noteCards"))[:4]
    important_points = _normalize_string_list(ai_payload.get("importantPoints"))
    focus_items = _normalize_string_list(ai_payload.get("focusItems"))
    quiz_lanes = {lane: items[:3] for lane, items in _normalize_quiz_lanes(ai_payload.get("quizLanes")).items()}
    worksheet_questions = _normalize_worksheet_questions((ai_payload.get("worksheet") or {}).get("questions"))[: request_data["worksheetLength"]]
    answer_key_lines = _build_study_pack_answer_key_lines(worksheet_questions)
    total_questions = sum(len(items) for items in quiz_lanes.values())

    if (
        len(note_cards) < 4
        or not important_points
        or len(worksheet_questions) < request_data["worksheetLength"]
        or total_questions < 9
        or any(len(items) < 3 for items in quiz_lanes.values())
    ):
        raise DeepSeekError("AI returned an incomplete study pack. Please retry generation.")

    return {
        "id": f"study-pack-{uuid.uuid4().hex[:10]}",
        "generatedAt": _safe_text(ai_payload.get("generatedAt")) or datetime.now(timezone.utc).isoformat(),
        "provider": _safe_text(ai_payload.get("provider"), "deepseek"),
        "request": request_data,
        "title": _safe_text(ai_payload.get("title"), f"{request_data['topic']} Study Pack"),
        "subtitle": _safe_text(
            ai_payload.get("subtitle"),
            f"{request_data['syllabus']} - {request_data['level']} - {request_data['topic']}",
        ),
        "notes": {
            "focusItems": focus_items,
            "importantPoints": important_points,
            "noteCards": note_cards,
        },
        "quiz": {
            "lanes": quiz_lanes,
            "totalQuestions": total_questions,
        },
        "worksheet": {
            "intro": _safe_text((ai_payload.get("worksheet") or {}).get("intro"), f"Extra practice for {request_data['topic']}."),
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": _suggest_focus_terms(payload),
            "recommendedTopicIds": _safe_string_list(payload.get("topicIds")),
            "topicMatches": [],
            "libraryMatches": [],
        },
    }


def generate_ai_study_pack(payload: dict[str, Any]) -> dict[str, Any]:
    request_data = _study_pack_request(payload)
    errors: list[str] = []

    for retry_index in range(3):
        try:
            ai_payload = _generate_study_pack_with_deepseek(payload, retry_index=retry_index)
            return _build_study_pack_response(ai_payload, request_data, payload)
        except DeepSeekError as exc:
            errors.append(str(exc))

    reason = "; ".join(errors) if errors else "No AI provider is configured."
    raise DeepSeekError(f"Could not generate the study pack. {reason}")


@app.get("/")
def root() -> tuple[dict[str, Any], int]:
    return {"ok": True, "service": "iceducation-api"}, 200


@app.get("/api/health")
def health() -> tuple[dict[str, Any], int]:
    deepseek_configured = bool(os.environ.get("DEEPSEEK_API_KEY"))
    return {
        "ok": True,
        "service": "iceducation-api",
        "deepseekConfigured": deepseek_configured,
        "geminiConfigured": False,
        "geminiModel": "",
        "studyPackGenerationConfigured": deepseek_configured,
        "uploadMarkingConfigured": False,
        "generatorScript": "",
    }, 200


@app.get("/api/worksheets/options")
def worksheet_options() -> tuple[dict[str, Any], int]:
    return {
        "library": {"generatedAt": "", "count": 0, "facets": {}},
        "topical": {
            "subjects": [],
            "defaults": {
                "syllabus": DEFAULT_SYLLABUS,
                "level": DEFAULT_LEVEL,
                "yearFrom": 2020,
                "yearTo": 2026,
            },
        },
        "catalog": {"syllabi": []},
    }, 200


@app.get("/api/study-pack/recommend")
def study_pack_recommend() -> tuple[dict[str, Any], int]:
    payload = {
        "syllabus": request.args.get("syllabus", ""),
        "level": request.args.get("level", ""),
        "topic": request.args.get("topic", ""),
        "subject": request.args.get("subject", ""),
        "goal": request.args.get("goal", ""),
        "focus": request.args.get("focus", ""),
    }
    return {
        "recommendedFocus": _suggest_focus_terms(payload),
        "recommendedTopicIds": [],
        "topicMatches": [],
        "libraryMatches": [],
    }, 200


@app.post("/api/study-pack/generate")
def study_pack_generate() -> tuple[dict[str, Any], int]:
    payload = request.get_json(silent=True) or {}
    try:
        return jsonify(generate_ai_study_pack(payload)), 200
    except DeepSeekError as exc:
        return jsonify({"error": str(exc)}), 502 if os.environ.get("DEEPSEEK_API_KEY") else 503


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8001"))
    app.run(host="0.0.0.0", port=port)
