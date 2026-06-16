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
DEFAULT_DATA_DIR = ROOT / "data" / "spm-kssm-syllabuses"
DEFAULT_OUTPUT_PATH = ROOT / "generated-spm-kssm-packs.js"

BPK_PAGE_URL = "https://bpk.moe.gov.my/kurikulum/kssm/kssm-tingkatan-4-dan-5"
BPK_BASE = "https://bpk.moe.gov.my"
SYLLABUS_NAME = "SPM / KSSM"
LEVELS = ["Tingkatan 4", "Tingkatan 5", "Form 4/5"]

DATA_BEGIN = "// BEGIN_IC_EDUCATE_SPM_KSSM_PACK_DATA"
DATA_END = "// END_IC_EDUCATE_SPM_KSSM_PACK_DATA"


@dataclass(frozen=True)
class KssmSubject:
    dskp_id: str
    raw_label: str
    href: str

    @property
    def file_url(self) -> str:
        return urllib.parse.urljoin(BPK_BASE, self.href)

    @property
    def title(self) -> str:
        return subject_title(self.raw_label)

    @property
    def label(self) -> str:
        return f"{self.title} - DSKP {self.dskp_id}"

    @property
    def slug(self) -> str:
        return slugify(f"{self.title}-{self.dskp_id}")


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


def fetch_bytes(url: str, timeout: int = 180) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "IC-Educate/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def clean_label(label: str) -> str:
    text = " ".join(re.sub(r"<.*?>", " ", html.unescape(label)).split())
    text = re.sub(r"^default\s+", "", text, flags=re.I)
    text = text.replace("<!-- -->", " ")
    text = " ".join(text.split())
    return text


def title_case_preserving_short_words(value: str) -> str:
    small = {"dan", "as", "of", "and", "the", "in"}
    out: list[str] = []
    for word in value.lower().split():
        if word in small:
            out.append(word)
        elif word in {"mpv", "kssmpk"}:
            out.append(word.upper())
        else:
            out.append(word[:1].upper() + word[1:])
    return " ".join(out)


def subject_title(raw_label: str) -> str:
    text = clean_label(raw_label)
    text = re.sub(r"^DSKP\s+KSSMPK\s+", "", text, flags=re.I)
    text = re.sub(r"^DSKP\s+KSSM\s+", "", text, flags=re.I)
    text = re.sub(r"\s+TINGKATAN\s+4\s+(?:DAN|AND|&)\s+5.*$", "", text, flags=re.I)
    text = re.sub(r"\s+FORM\s+4\s+AND\s+5.*$", "", text, flags=re.I)
    text = re.sub(r"\s+VERSI\s+ENGLISH.*$", " (English)", text, flags=re.I)
    text = text.replace("&amp;", "&")
    return title_case_preserving_short_words(text)


def parse_subjects_from_page(html_text: str) -> list[KssmSubject]:
    subjects: list[KssmSubject] = []
    pattern = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.I | re.S)
    for match in pattern.finditer(html_text):
        href, raw_label = match.groups()
        if "/kurikulum/kssm/kssm-tingkatan-4-dan-5/" not in href or not href.endswith("/file"):
            continue
        id_match = re.search(r"/(\d+)-", href)
        if not id_match:
            continue
        label = clean_label(raw_label)
        if not label.upper().startswith("DSKP"):
            continue
        subjects.append(KssmSubject(id_match.group(1), label, href))
    return subjects


def crawl_bpk_subjects(timeout: int, max_pages: int = 12) -> list[KssmSubject]:
    subjects_by_href: dict[str, KssmSubject] = {}
    stale_pages = 0
    for page_index in range(max_pages):
        start = page_index * 20
        url = BPK_PAGE_URL if start == 0 else f"{BPK_PAGE_URL}?limitstart={start}"
        before = len(subjects_by_href)
        for subject in parse_subjects_from_page(fetch_text(url, timeout=timeout)):
            subjects_by_href.setdefault(subject.href, subject)
        if len(subjects_by_href) == before:
            stale_pages += 1
        else:
            stale_pages = 0
        if page_index > 0 and stale_pages >= 2:
            break
    return sorted(subjects_by_href.values(), key=lambda item: (item.title, item.dskp_id))


def extract_pdf_text(path: Path, max_pages: int = 32) -> str:
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
    text = html.unescape(value).replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" -\t")


def clean_contents_heading(line: str) -> str:
    text = clean_line(line)
    text = re.sub(r"[.\u2026]{4,}.*$", "", text).strip()
    text = re.sub(r"\s+\d+\s*$", "", text).strip()
    return text


def extract_contents_focus(lines: list[str]) -> list[str]:
    skip = {
        "rukun negara",
        "falsafah pendidikan kebangsaan",
        "definisi kurikulum kebangsaan",
        "kata pengantar",
        "pendahuluan",
        "introduction",
        "aim",
        "objectives",
        "matlamat",
        "objektif",
        "focus",
        "fokus",
        "classroom assessment",
        "pentaksiran bilik darjah",
        "teaching and learning strategies",
        "strategi pengajaran dan pembelajaran",
        "cross-curricular elements",
        "elemen merentas kurikulum",
        "content organisation",
        "organisasi kandungan",
        "panel of writers",
        "panel penggubal",
        "contributors",
        "penghargaan",
        "acknowledgement",
        "glosari",
        "glossary",
    }
    out: list[str] = []
    seen: set[str] = set()
    collecting = False
    for line in lines[:180]:
        lower_line = line.lower()
        if any(marker in lower_line for marker in ["standard kandungan", "content standard"]):
            collecting = True
            continue
        if not collecting:
            continue
        if any(marker in lower_line for marker in ["appendix", "panel of", "panel peng", "penghargaan", "acknowledgement", "glosari", "glossary"]):
            break
        if "..." not in line and "\u2026" not in line:
            continue
        heading = clean_contents_heading(line)
        if len(heading) < 4 or len(heading) > 90:
            continue
        key = heading.lower()
        if key in skip:
            continue
        if any(fragment in key for fragment in ["standard kandungan", "standard pembelajaran", "performance standard", "learning standard"]):
            continue
        if key in seen:
            continue
        seen.add(key)
        out.append(heading)
        if len(out) >= 10:
            break
    return out


def extract_focus_items(text: str, subject_title_value: str) -> list[str]:
    lines = [clean_line(line) for line in text.splitlines()]
    contents_focus = extract_contents_focus(lines)
    if len(contents_focus) >= 4:
        return contents_focus
    candidates: list[str] = []
    for line in lines:
        if len(line) < 5 or len(line) > 100:
            continue
        lower = line.lower()
        if any(skip in lower for skip in ["kementerian pendidikan", "dokumen standard", "kurikulum standard", "hak cipta", "bahagian pembangunan"]):
            continue
        numbered = re.match(r"^(\d+(?:\.\d+)*|[A-Z]\d+(?:\.\d+)*)[.)]?\s+(.+)$", line)
        if numbered:
            item = clean_line(numbered.group(2))
            if 5 <= len(item) <= 90:
                candidates.append(item)
            continue
        if re.match(r"^[A-ZÀ-Ü][A-ZÀ-Üa-zà-ü0-9,&()'/: -]{7,90}$", line) and len(line.split()) <= 10:
            candidates.append(line)

    out: list[str] = []
    seen: set[str] = set()
    skip_exact = {subject_title_value.lower(), "standard kandungan", "standard pembelajaran", "standard prestasi"}
    for item in candidates:
        item = re.sub(r"^\d+(?:\.\d+)*\s*", "", item)
        key = item.lower()
        if key in seen or key in skip_exact:
            continue
        if item.isdigit():
            continue
        seen.add(key)
        out.append(item)
        if len(out) >= 10:
            break
    if len(out) >= 4:
        return out
    return [
        "Standard kandungan dan standard pembelajaran",
        "Kemahiran asas dan aplikasi",
        "Pentaksiran bilik darjah",
        "Latihan berasaskan format SPM",
        "Pembetulan kesilapan dan ulang kaji",
        "Penguasaan topik utama Tingkatan 4 dan 5",
    ]


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


def build_pack(subject: KssmSubject, focus_items: list[str]) -> dict[str, Any]:
    pack_id = f"spm-kssm-{subject.dskp_id}"
    selected = focus_items[:6]
    note_cards = [
        {
            "title": "Peta DSKP",
            "points": [
                f"Pek ini dibina daripada DSKP rasmi KSSM Tingkatan 4 dan 5 untuk {subject.title}.",
                "Gunakan pek ini sebagai peta semakan sebelum bina nota topik yang lebih terperinci.",
                "Padankan setiap bidang pembelajaran dengan latihan, semakan jawapan, dan pembetulan.",
            ],
        },
        {
            "title": "Fokus kandungan",
            "points": [f"{item}." if not item.endswith(".") else item for item in selected[:4]],
        },
        {
            "title": "Cara belajar",
            "points": [
                "Tukar setiap standard atau tajuk kepada soalan pendek untuk uji ingatan aktif.",
                "Bina contoh, bukan hanya salin semula definisi daripada DSKP.",
                "Selepas latihan, tanda semula kelemahan mengikut tajuk DSKP.",
            ],
        },
        {
            "title": "Latihan SPM",
            "points": [
                "Baca kata tugas soalan sebelum tentukan panjang jawapan.",
                "Gunakan istilah subjek yang tepat dan sertakan contoh apabila sesuai.",
                "Simpan senarai kesilapan untuk ulang kaji sasaran selepas dua hari.",
            ],
        },
    ]
    lanes = {
        "Foundation": [
            quiz_question(pack_id, "Foundation", 1, f"Apakah fungsi utama pek {subject.title} ini?", "Memetakan DSKP kepada fokus ulang kaji", ["Menghafal nombor halaman sahaja", "Mengabaikan standard pembelajaran"], "DSKP membantu pelajar tahu kandungan dan kemahiran yang perlu dikuasai."),
            quiz_question(pack_id, "Foundation", 2, "Apakah langkah ulang kaji pertama yang baik?", "Terangkan satu fokus kandungan dengan ayat sendiri", ["Baca tajuk sahaja", "Tunggu sehingga minggu peperiksaan"], "Penjelasan aktif lebih kuat daripada pembacaan pasif."),
            quiz_question(pack_id, "Foundation", 3, "Mengapa kata tugas penting?", "Kata tugas menentukan bentuk dan kedalaman jawapan", ["Kata tugas menggantikan ilmu subjek", "Kata tugas hanya penting selepas markah diberi"], "Kata tugas membantu pelajar tahu sama ada perlu nyatakan, huraikan, jelaskan, atau nilai."),
        ],
        "Core": [
            quiz_question(pack_id, "Core", 1, f"Bagaimana menggunakan fokus '{selected[0]}'?", "Bina nota ringkas, contoh, dan latihan untuk fokus itu", ["Abaikan sehingga keluar dalam peperiksaan", "Jadikan ia sempadan gred"], "Setiap fokus perlu ditukar kepada nota dan latihan ingatan."),
            quiz_question(pack_id, "Core", 2, "Apakah ciri senarai pembetulan yang berguna?", "Ia mengaitkan kesilapan dengan tajuk DSKP yang tepat", ["Ia menyimpan markah akhir sahaja", "Ia menyembunyikan kelemahan berulang"], "Senarai pembetulan menunjukkan topik yang perlu dipelajari semula."),
            quiz_question(pack_id, "Core", 3, "Bilakah latihan patut disemak?", "Selepas cuba menjawab sendiri menggunakan skema atau poin jawapan", ["Sebelum membaca soalan", "Hanya selepas semua topik tamat"], "Semakan selepas percubaan menunjukkan jurang sebenar."),
        ],
        "Stretch": [
            quiz_question(pack_id, "Stretch", 1, "Bagaimana bergerak melepasi hafalan?", "Hubungkan istilah DSKP dengan contoh, bukti, atau langkah alasan", ["Warnakan semua tajuk sahaja", "Buang contoh daripada jawapan"], "Prestasi lebih tinggi memerlukan aplikasi, bukan pengecaman sahaja."),
            quiz_question(pack_id, "Stretch", 2, "Apakah semakan akhir yang kuat?", "Terangkan setiap fokus tanpa nota dan buat latihan bermasa", ["Baca muka depan DSKP sahaja", "Tukar topik setiap kali terasa susah"], "Latihan bermasa menguji sama ada ingatan kekal di bawah tekanan."),
            quiz_question(pack_id, "Stretch", 3, "Bagaimana menangani kesilapan berulang?", "Kumpulkan mengikut tajuk DSKP dan jadualkan ulang kaji sasaran", ["Anggap kesilapan itu rawak", "Padam daripada nota"], "Corak kesilapan menunjukkan sasaran belajar seterusnya."),
        ],
    }
    worksheet_prompts = [
        f"Senaraikan empat fokus DSKP yang perlu dikuasai untuk {subject.title}.",
        f"Pilih satu fokus {subject.title} dan tulis ringkasan yang jelas.",
        "Terangkan mengapa kata tugas mengubah bentuk jawapan peperiksaan.",
        "Bina pelan ulang kaji dua hari untuk fokus yang paling lemah.",
        "Tulis satu soalan latihan untuk fokus yang dipilih.",
        "Semak satu jawapan contoh dengan mengenal pasti perkara yang hilang.",
        "Terangkan cara menggunakan DSKP rasmi semasa ulang kaji.",
        "Bina senarai semak mini untuk latihan seterusnya.",
        "Huraikan satu kesilapan lazim dan cara mengelakkannya.",
        "Tulis refleksi pendek tentang fokus yang masih lemah.",
        "Tukar satu fokus DSKP kepada tiga kad imbas.",
        "Rancang satu sesi latihan bermasa dan cara menyemaknya.",
    ]
    worksheet_questions = [
        {
            "number": index,
            "lane": "Foundation" if index <= 4 else "Core" if index <= 8 else "Stretch",
            "prompt": prompt,
            "marks": 3,
            "answerPoints": [
                "Nyatakan fokus DSKP atau kemahiran dengan jelas.",
                "Beri contoh atau tindakan ulang kaji yang sesuai.",
                "Terangkan cara jawapan akan disemak atau diperbaiki.",
            ],
        }
        for index, prompt in enumerate(worksheet_prompts, start=1)
    ]
    answer_key_lines = [
        f"Q{item['number']} ({item['lane']}, {item['marks']} marks) - {item['prompt']}\n"
        + "\n".join(f"- {point}" for point in item["answerPoints"])
        for item in worksheet_questions
    ]
    return {
        "id": pack_id,
        "generatedAt": utc_now(),
        "provider": "spm-kssm-dskp-bundle",
        "title": f"{subject.title} Study Pack",
        "subtitle": "SPM / KSSM Tingkatan 4 dan 5 - DSKP overview",
        "spmKssm": {
            "dskpId": subject.dskp_id,
            "label": subject.label,
            "sourceUrl": subject.file_url,
            "source": "Bahagian Pembangunan Kurikulum, KPM",
        },
        "notes": {
            "focusItems": selected,
            "importantPoints": [
                f"Gunakan DSKP KSSM {subject.title} sebagai senarai semak liputan.",
                "Utamakan fokus lemah sebelum membaca semua kandungan semula.",
                "Gabungkan ingatan aktif, latihan format SPM, dan pembetulan kesilapan.",
            ],
            "noteCards": note_cards,
        },
        "quiz": {"lanes": lanes, "totalQuestions": sum(len(items) for items in lanes.values())},
        "worksheet": {
            "intro": f"Latihan ringkas berpandukan DSKP KSSM Tingkatan 4 dan 5 untuk {subject.title}.",
            "questions": worksheet_questions,
            "answerKeyLines": answer_key_lines,
            "rubricText": "\n\n".join(answer_key_lines),
        },
        "recommendations": {
            "recommendedFocus": selected,
            "recommendedTopicIds": [f"dskp-{subject.dskp_id}"],
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
    [subject.label, subject.title, subject.dskpId].filter(Boolean).forEach((value) => {{
      out[slugify(value)] = subject.dskpId;
    }});
    return out;
  }}, {{}});

  function requestSubjectId(request) {{
    if (safeText(request?.syllabus) !== "SPM / KSSM") {{
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
      name: "SPM / KSSM",
      levels: ["Tingkatan 4", "Tingkatan 5", "Form 4/5"],
      subjects: SUBJECTS.map((subject) => ({{
        label: safeText(subject.label),
        value: safeText(subject.label),
        topicPacks: [
          {{
            id: `dskp-${{safeText(subject.dskpId)}}`,
            title: "DSKP Tingkatan 4 dan 5 overview",
            source: "official-bpk-dskp",
            subtopics: (subject.focusItems || []).map((title, index) => ({{
              id: String(index + 1),
              title: safeText(title)
            }}))
          }}
        ]
      }}))
    }};
  }}

  window.IC_EDUCATE_SPM_KSSM_PACKS = {{
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


def sync_subject(subject: KssmSubject, data_dir: Path, timeout: int, force_download: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    subject_dir = data_dir / f"{subject.dskp_id}-{subject.slug}"
    subject_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = subject_dir / "dskp.pdf"
    text_path = subject_dir / "dskp.txt"
    meta_path = subject_dir / "metadata.json"

    if force_download or not pdf_path.exists():
        pdf_path.write_bytes(fetch_bytes(subject.file_url, timeout=timeout))
    if force_download or not text_path.exists():
        text = extract_pdf_text(pdf_path)
        text_path.write_text(text, encoding="utf-8")
    else:
        text = text_path.read_text(encoding="utf-8", errors="replace")

    focus_items = extract_focus_items(text, subject.title)
    pack = build_pack(subject, focus_items)
    subject_data = {
        "label": subject.label,
        "title": subject.title,
        "dskpId": subject.dskp_id,
        "sourceUrl": subject.file_url,
        "localPdf": str(pdf_path.relative_to(ROOT)),
        "localText": str(text_path.relative_to(ROOT)),
        "focusItems": focus_items,
    }
    metadata = {
        "label": subject.label,
        "title": subject.title,
        "dskpId": subject.dskp_id,
        "sourceUrl": subject.file_url,
        "downloadedAt": utc_now(),
        "focusItems": focus_items,
    }
    meta_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding="utf-8")
    return subject_data, pack


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download BPK KSSM Form 4/5 DSKP PDFs and generate SPM packs.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH)
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only-id", action="append", default=[])
    parser.add_argument("--timeout", type=int, default=180)
    parser.add_argument("--sleep", type=float, default=0.2)
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--list", action="store_true")
    parser.add_argument("--continue-on-error", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    subjects = crawl_bpk_subjects(args.timeout)
    if args.only_id:
        wanted = set(args.only_id)
        subjects = [subject for subject in subjects if subject.dskp_id in wanted]
    data = read_bundle_data(args.output)
    packs = data.setdefault("packs", {})
    existing_ids = set(packs.keys())
    queue = [subject for subject in subjects if args.force or subject.dskp_id not in existing_ids]
    if args.limit > 0:
        queue = queue[: args.limit]

    print(f"Official BPK KSSM Tingkatan 4/5 DSKP entries found: {len(subjects)}")
    print(f"Existing generated SPM/KSSM packs: {len(existing_ids)}")
    print(f"Generation/download queue: {len(queue)}")
    if args.dry_run or args.list:
        for subject in queue:
            print(f"- {subject.label}: {subject.file_url}")
        return 0

    subjects_by_id = {item.get("dskpId"): item for item in data.get("subjects") or [] if item.get("dskpId")}
    failures: list[tuple[KssmSubject, str]] = []
    for index, subject in enumerate(queue, start=1):
        print(f"[{index}/{len(queue)}] {subject.label}")
        try:
            subject_data, pack = sync_subject(subject, args.data_dir, args.timeout, args.force_download)
            subjects_by_id[subject.dskp_id] = subject_data
            packs[subject.dskp_id] = pack
            data["subjects"] = sorted(subjects_by_id.values(), key=lambda item: item["label"])
            data["metadata"] = {
                "generatedAt": utc_now(),
                "source": "Bahagian Pembangunan Kurikulum KSSM Tingkatan 4 dan 5",
                "sourceUrl": BPK_PAGE_URL,
                "syllabus": SYLLABUS_NAME,
                "levels": LEVELS,
                "dskpEntryCount": len(subjects),
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

    print(f"Wrote {len(packs)} SPM/KSSM pack(s) to {args.output}")
    if failures:
        print("Failures:")
        for subject, error in failures:
            print(f"- {subject.label}: {error[:500]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
