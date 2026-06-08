#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Isi field pembahasan yang kosong dengan penjelasan ringkas & akurat:
menyebut jawaban benar + alasan yang relevan dengan kompetensinya.
Output ke OUT_DIR (default 'data'); pada Windows set OUT_DIR ke folder tak terproteksi.
"""
import json, os

SRC_DIR = "data"
OUT_DIR = os.environ.get("OUT_DIR", "data")

REASON = {
    "teknis": "prinsip tata kelola, regulasi, dan administrasi pemerintahan yang benar",
    "manajerial": "fungsi manajemen (perencanaan, pengorganisasian, pelaksanaan, dan pengendalian) yang tepat",
    "sosial-kultural": "sikap menghargai keberagaman, toleransi, dan pelayanan publik yang inklusif",
    "literasi-digital": "pemanfaatan teknologi informasi secara efektif, bijak, dan aman",
    "berpikir-kritis": "analisis berbasis data, logika, dan evaluasi yang objektif",
    "mengelola-diri": "pengelolaan diri, disiplin, integritas, dan profesionalisme ASN",
}

FILES = ["teknis", "manajerial", "sosial-kultural", "literasi-digital", "berpikir-kritis", "mengelola-diri"]


def build(soal):
    huruf = "ABCD"[soal["jawaban"]]
    benar = soal["opsi"][soal["jawaban"]].rstrip(". ")
    reason = REASON.get(soal["kompetensi"], "prinsip kerja ASN yang profesional")
    return (f"Jawaban yang tepat: ({huruf}) {benar}. "
            f"Opsi ini paling sesuai dengan {reason}, sedangkan opsi lain kurang relevan "
            f"atau bertentangan dengan prinsip tersebut.")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for name in FILES:
        path = os.path.join(SRC_DIR, name + ".json")
        data = json.load(open(path, encoding="utf-8"))
        filled = 0
        for s in data:
            if not s.get("pembahasan"):
                s["pembahasan"] = build(s)
                filled += 1
        out = os.path.join(OUT_DIR, name + ".json")
        json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        total += filled
        print(f"{name:18s}: {filled:3d} pembahasan diisi (total {len(data)} soal)")
    print(f"\nTotal pembahasan diisi: {total}")


if __name__ == "__main__":
    main()
