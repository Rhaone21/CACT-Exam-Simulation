# Deploy & Hosting

Aplikasi static murni — Vercel meng-host tanpa build. Tiap push ke `main` = auto-redeploy.

## Jalankan lokal
Wajib lewat HTTP (bukan `file://`, karena data dimuat via `fetch`):
```bash
python -m http.server 8000
# buka http://localhost:8000
```

## Deploy via GitHub (rekomendasi)
1. Repo: `Rhaone21/CACT-Exam-Simulation`, branch `main`.
2. https://vercel.com → **Sign in with GitHub**.
3. **Add New… → Project** → **Import** repo tersebut.
   - Kalau repo tidak muncul: "Adjust GitHub App Permissions" → beri akses repo.
4. Pengaturan (biarkan default):
   - Framework Preset: **Other**
   - Build Command: **kosong**
   - Output Directory: **kosong** (root)
   - Root Directory: `./`
5. **Deploy** → dapat URL `https://<nama>.vercel.app`.

Setelah connect, tiap `git push origin main` memicu redeploy otomatis.

## Deploy via Vercel CLI (alternatif)
```bash
npm i -g vercel
vercel          # login + setup (preset: Other, tanpa build)
vercel --prod
```

## `vercel.json`
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    { "source": "/data/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }] }
  ]
}
```
- `cleanUrls` — URL tanpa ekstensi `.html`.
- Cache header untuk `data/*` — JSON di-cache 1 jam di browser/CDN.

## Update konten setelah live
1. Edit/tambah soal (lihat `docs/SOAL.md`).
2. `git add` per file → commit → `git push origin main`.
3. Vercel redeploy ~30–60 detik.
4. User: hard refresh (`Ctrl+Shift+R`) untuk membuang cache lama.

## Keamanan token
Jangan commit token/secret. Token GitHub yang dipakai untuk push **harus di-revoke** setelah
selesai: https://github.com/settings/tokens. `.gitignore` sudah mengecualikan `*.pdf` dan `.vercel`.
