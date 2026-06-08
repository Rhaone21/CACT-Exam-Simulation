# Panduan Bank Soal

Bank saat ini: **678 soal** berpembahasan, 6 kompetensi.

| Kompetensi | id | prefix | Jumlah |
|---|---|---|---|
| Kompetensi Teknis | `teknis` | TK | 102 |
| Kompetensi Manajerial | `manajerial` | MJ | 103 |
| Sosial Kultural | `sosial-kultural` | SK | 100 |
| Literasi Digital | `literasi-digital` | LD | 173 |
| Berpikir Kritis & Analitis | `berpikir-kritis` | BK | 100 |
| Mengelola Diri | `mengelola-diri` | MD | 100 |

## Format objek soal (`data/<kompetensi>.json`)
```json
{
  "id": "TK-001",
  "kompetensi": "teknis",
  "q": "Teks pertanyaan…",
  "opsi": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
  "jawaban": 2,
  "pembahasan": "Penjelasan singkat kenapa jawaban benar."
}
```
- `jawaban` = **indeks 0–3** (bukan huruf). 0=A, 1=B, 2=C, 3=D.
- `opsi` wajib **tepat 4**.
- `pembahasan` wajib terisi (UI menampilkannya di mode latihan & di hasil).
- `id` digenerate otomatis oleh script — tak perlu diisi manual di file extra.

## Menambah soal baru (cara dipakai)
1. Buat/buka file di `data_extra/` untuk kompetensi terkait. Boleh banyak file:
   `data_extra/teknis.json`, `data_extra/teknis.2.json`, `data_extra/teknis.3.json`, …
   (semua file `teknis*.json` ikut terbaca).
2. Isi array objek soal **tanpa** field `id` (cukup `q`, `opsi`, `jawaban`, `pembahasan`).
3. Jalankan merge:
   ```bash
   python scripts/merge_extra.py
   ```
   - **Idempoten**: dedupe berdasarkan teks pertanyaan (80 char pertama) → aman dijalankan berulang.
   - ID dinomori ulang berurutan per kompetensi.
4. Commit `data/<kompetensi>.json` + file extra, push → Vercel redeploy.

## Catatan Windows (Controlled Folder Access)
Python tidak bisa menulis ke folder proyek/`AppData\Temp` (diblok Defender). Tulis ke folder
tak terproteksi lalu salin:
```bash
OUT_DIR="C:\\temp\\out" python scripts/merge_extra.py
cp -f /c/temp/out/*.json data/
```

## Script terkait
- `scripts/parse_pdf.py` — ekstrak soal dari PDF sumber → `data/*.json` (butuh `pypdf`).
- `scripts/add_pembahasan.py` — isi `pembahasan` yang kosong dengan penjelasan terstruktur.
- `scripts/merge_extra.py` — gabung `data_extra/*` ke bank (idempoten, dedupe, re-ID).

## Validasi cepat
```bash
python -c "import json;[ (lambda d:[__import__('sys').exit('bad '+s['id']) for s in d if len(s['opsi'])!=4 or not(0<=s['jawaban']<4) or not s['q'] or not s['pembahasan']])(json.load(open('data/%s.json'%k,encoding='utf-8'))) for k in ['teknis','manajerial','sosial-kultural','literasi-digital','berpikir-kritis','mengelola-diri']];print('OK')"
```
