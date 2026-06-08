#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ekstrak 450 soal dari PDF Pemetaan Kompetensi ASN -> 6 file JSON per kompetensi.
Jalankan sekali: python scripts/parse_pdf.py
"""
import json
import os
import re
import sys

PDF = "885411480-SOAL-PEMETAAN-CACT.pdf"
OUT_DIR = os.environ.get("OUT_DIR", "data")

# Pemetaan rentang nomor soal -> kompetensi (sesuai struktur PDF)
def kompetensi_for(n):
    if 1 <= n <= 75:
        return "teknis"
    if 76 <= n <= 150:
        return "manajerial"
    if 151 <= n <= 200:
        return "sosial-kultural"
    if 201 <= n <= 250:
        return "literasi-digital"
    if 251 <= n <= 300:
        return "berpikir-kritis"
    if 301 <= n <= 350:
        return "mengelola-diri"
    if 351 <= n <= 450:
        return "literasi-digital"
    return None

PREFIX = {
    "teknis": "TK",
    "manajerial": "MJ",
    "sosial-kultural": "SK",
    "literasi-digital": "LD",
    "berpikir-kritis": "BK",
    "mengelola-diri": "MD",
}

NOISE = re.compile(
    r"(===PAGE \d+===|Berikut .*?|\(Lanjut.*?\)|Selanjutnya .*?|Siap untuk.*?|"
    r"Saya akan .*?|Kompetensi .*?\(\d+.*?\)|I+\. KOMPETENSI.*?|\(Soal.*?\)|"
    r"\d+\.\s+Kompetensi .*?soal|Pembagian Soal.*?|\d+\.\s+Kompetensi (Teknis|Manajerial|Sosial|Literasi|Kemampuan|Mengelola).*?)",
    re.IGNORECASE,
)


def clean(text):
    # gabung kata terpisah hasil OCR seperti "T ahun" -> "Tahun"
    text = re.sub(r"\bT ahun\b", "Tahun", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_text():
    from pypdf import PdfReader
    reader = PdfReader(PDF)
    parts = []
    for page in reader.pages:
        parts.append(page.extract_text() or "")
    return "\n".join(parts)


def main():
    if not os.path.exists(PDF):
        print(f"PDF tidak ditemukan: {PDF}", file=sys.stderr)
        sys.exit(1)

    raw = extract_text()
    # buang baris penanda halaman & narasi
    lines = [l for l in raw.splitlines() if not NOISE.match(l.strip())]
    text = "\n".join(lines)

    # blok soal: N. <q> A. <a> B. <b> C. <c> D. <d> Jawaban: X
    pattern = re.compile(
        r"(?P<num>\d+)\.\s+(?P<q>.*?)"
        r"A\.\s*(?P<a>.*?)"
        r"B\.\s*(?P<b>.*?)"
        r"C\.\s*(?P<c>.*?)"
        r"D\.\s*(?P<d>.*?)"
        r"Jawaban\s*:\s*(?P<ans>[ABCD])",
        re.DOTALL,
    )

    buckets = {k: [] for k in PREFIX}
    seen = set()
    counters = {k: 0 for k in PREFIX}
    skipped = 0

    for m in pattern.finditer(text):
        n = int(m.group("num"))
        komp = kompetensi_for(n)
        if komp is None:
            skipped += 1
            continue
        q = clean(m.group("q"))
        opsi = [clean(m.group(x)) for x in ("a", "b", "c", "d")]
        ans = "ABCD".index(m.group("ans"))

        if not q or any(not o for o in opsi):
            skipped += 1
            continue
        # dedupe by pertanyaan
        key = q.lower()[:80]
        if key in seen:
            continue
        seen.add(key)

        counters[komp] += 1
        soal = {
            "id": f"{PREFIX[komp]}-{counters[komp]:03d}",
            "kompetensi": komp,
            "q": q,
            "opsi": opsi,
            "jawaban": ans,
            "pembahasan": "",
        }
        buckets[komp].append(soal)

    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for komp, items in buckets.items():
        path = os.path.join(OUT_DIR, f"{komp}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=1)
        total += len(items)
        print(f"{komp:18s}: {len(items):3d} soal -> {path}")

    print(f"\nTotal terparse: {total}  (dilewati: {skipped})")


if __name__ == "__main__":
    main()
