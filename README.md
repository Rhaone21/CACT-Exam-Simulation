# Latihan CAT Kompetensi ASN 2025 (CACT)

Web latihan soal interaktif untuk **Pemetaan Kompetensi ASN** sistem CACT. Statis, tanpa build,
siap deploy ke Vercel.

## Fitur
- **3 mode**: Simulasi Ujian (timer), Latihan per Kompetensi (pembahasan instan), Acak Cepat.
- **6 kompetensi**: Teknis, Manajerial, Sosial Kultural, Literasi Digital, Berpikir Kritis & Analitis, Mengelola Diri.
- **Pembahasan** tiap soal, **tandai/ragu + tinjau** ala CAT, **skor per kompetensi**.
- **Simpan lokal** (localStorage): riwayat, skor terbaik, bank "soal yang pernah salah" → bisa diulang.
- **Bagikan hasil**: link berisi skor + salin ringkasan teks.
- Aksesibel: kontras WCAG, navigasi keyboard (A–D / 1–4 pilih, ←/→ navigasi, F tandai), `prefers-reduced-motion`.

## Dokumentasi
Detail lengkap di folder [`docs/`](docs/README.md): arsitektur, panduan soal, deploy, UI/UX.

## Struktur
```
index.html              # shell
css/styles.css          # design system
js/{storage,quiz,share,app}.js
data/index.json         # manifest kompetensi
data/<kompetensi>.json  # bank soal
scripts/parse_pdf.py    # regenerasi bank dari PDF sumber
vercel.json
```

## Jalankan Lokal
Harus lewat HTTP (bukan `file://`, karena memuat JSON via `fetch`):
```bash
python -m http.server 8000
# buka http://localhost:8000
```

## Deploy ke Vercel
**Cara 1 — CLI:**
```bash
npm i -g vercel
vercel        # ikuti prompt; Framework Preset: Other, tanpa build command
vercel --prod
```
**Cara 2 — Import Git:** push folder ini ke GitHub → di Vercel "Add New Project" → import repo →
Framework Preset **Other**, Build Command kosong, Output Directory kosong (root). Deploy.

## Regenerasi & Perluasan Bank Soal
```bash
python scripts/parse_pdf.py        # ekstrak 445 soal dari PDF -> data/*.json (butuh pypdf)
python scripts/add_pembahasan.py   # isi pembahasan yang masih kosong
python scripts/merge_extra.py      # gabungkan soal tambahan data_extra/*.json (idempoten, dedupe)
```
Tambah soal baru: tulis ke `data_extra/<kompetensi>.json` (format objek tanpa `id`), lalu jalankan
`merge_extra.py`. ID dinomori ulang otomatis. Bank saat ini **603 soal** berpembahasan.
> Catatan Windows: jika Controlled Folder Access memblokir tulis Python, set `OUT_DIR` ke folder
> tak terproteksi lalu salin: `OUT_DIR=C:\temp\out python scripts/parse_pdf.py`.

## Format Soal (`data/<kompetensi>.json`)
```json
{ "id": "TK-001", "kompetensi": "teknis",
  "q": "Pertanyaan…", "opsi": ["A","B","C","D"],
  "jawaban": 2, "pembahasan": "Penjelasan singkat." }
```
`jawaban` = indeks 0–3. `pembahasan` boleh kosong (UI menampilkan placeholder).

> Latihan mandiri, bukan produk resmi pemerintah.
