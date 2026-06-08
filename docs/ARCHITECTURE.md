# Arsitektur

Aplikasi **static single-page** tanpa build step. HTML + CSS + vanilla JS, data soal berupa
file JSON yang dimuat via `fetch`. Tidak ada backend/DB — semua jalan di browser.

## Struktur folder
```
index.html              # shell + mount point (#app) + urutan <script>
css/styles.css          # design system (token + komponen + responsive)
js/
  storage.js            # localStorage: riwayat, bank soal salah, skor
  quiz.js               # Bank (loader+cache) + Session (engine sesi)
  share.js              # encode hasil -> URL hash + salin ringkasan
  app.js                # router + render semua layar + ikon SVG
data/
  index.json            # manifest 6 kompetensi
  <kompetensi>.json     # bank soal per kompetensi
data_extra/             # sumber soal tambahan (di-merge ke data/)
scripts/                # tool Python regenerasi/perluasan bank
vercel.json             # konfigurasi static deploy
```

## Urutan muat script (penting)
`storage.js` → `quiz.js` → `share.js` → `app.js`. Tiap modul meng-expose global ke `window`
(`Store`, `Bank`, `Session`, `Share`). `app.js` jalan terakhir, init dari manifest.

## Alur data
1. `app.js` init → `Bank.loadManifest()` (`data/index.json`, ~1KB).
2. Cek `location.hash` → kalau ada `#hasil=...` render layar hasil-dibagikan; kalau tidak, `renderHome()`.
3. User pilih mode → `renderSetup()` → pilih kompetensi & jumlah.
4. `startSession()` → `Bank.loadMany(ids)` fetch file kompetensi terpilih (di-cache), buat `Session`.
5. `Session` acak soal (Fisher-Yates) + acak urutan opsi (jawaban dipetakan ulang).
6. User jawab → skor dihitung → `Store.recordSession()` + update bank soal salah.

## Lazy / performa
- File kompetensi hanya di-fetch saat dipilih, lalu di-cache di `Bank._cache`.
- Beranda hanya muat manifest. Total data ~356KB raw (~90KB setelah gzip Vercel).
- Tidak ada gambar; ikon = SVG inline; font dari Google Fonts CDN.

## Komponen kunci (file:fungsi)
- `quiz.js:Bank` — `loadManifest`, `loadKompetensi`, `loadMany`, `loadAll`, `namaKompetensi`.
- `quiz.js:Session` — `score()`, `wrongList()`, `toggleFlag()`, navigasi `next/prev/go`.
- `quiz.js:prepare()` — acak opsi + remap index jawaban (anti-hafal posisi).
- `app.js` layar — `renderHome`, `renderSetup`, `renderQuiz`, `renderReview`, `renderResult`, `renderShared`.
- `storage.js:Store` — `recordSession`, `markWrong/clearWrong`, `wrongIds`, `bestScore`, `reset`.

## State
Tidak ada framework state. Objek `state` di `app.js` memegang `session`, `timer`, `mode`.
Render = ganti `app.innerHTML`. Interaksi dalam satu soal (pilih jawaban, flag) di-update
**in-place** (tanpa re-render) supaya tidak ada kedip.
