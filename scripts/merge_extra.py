#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gabung soal tambahan (data_extra/<komp>.json) ke bank utama (data/<komp>.json).
Idempoten: dedupe berdasarkan teks pertanyaan, ID dinomori ulang berurutan.
Output ke OUT_DIR (default 'data').
"""
import json, os, glob

BASE_DIR = "data"
EXTRA_DIR = "data_extra"
OUT_DIR = os.environ.get("OUT_DIR", "data")

PREFIX = {
    "teknis": "TK", "manajerial": "MJ", "sosial-kultural": "SK",
    "literasi-digital": "LD", "berpikir-kritis": "BK", "mengelola-diri": "MD",
}


def norm(q):
    return " ".join(q.lower().split())[:80]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for komp, pref in PREFIX.items():
        base_path = os.path.join(BASE_DIR, komp + ".json")
        base = json.load(open(base_path, encoding="utf-8")) if os.path.exists(base_path) else []
        seen = {norm(s["q"]) for s in base}

        extra_path = os.path.join(EXTRA_DIR, komp + ".json")
        added = 0
        if os.path.exists(extra_path):
            for s in json.load(open(extra_path, encoding="utf-8")):
                if norm(s["q"]) in seen:
                    continue
                seen.add(norm(s["q"]))
                s["kompetensi"] = komp
                base.append(s)
                added += 1

        # nomor ulang ID
        for i, s in enumerate(base, 1):
            s["id"] = f"{pref}-{i:03d}"

        out = os.path.join(OUT_DIR, komp + ".json")
        json.dump(base, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        total += len(base)
        print(f"{komp:18s}: +{added:3d} baru -> {len(base):3d} total")
    print(f"\nTotal bank: {total} soal")


if __name__ == "__main__":
    main()
