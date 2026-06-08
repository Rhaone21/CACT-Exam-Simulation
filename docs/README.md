# Dokumentasi — Latihan CAT Kompetensi ASN

Index dokumentasi proyek. README utama ada di [root](../README.md).

| Dokumen | Isi |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Struktur folder, alur data, modul, state, lazy-load |
| [SOAL.md](SOAL.md) | Format soal, cara menambah/regenerasi bank, validasi |
| [DEPLOY.md](DEPLOY.md) | Jalankan lokal, deploy Vercel via GitHub/CLI, update konten |
| [UI.md](UI.md) | Design system, ikon, aksesibilitas, responsif, layar |

## Ringkas
- App: static SPA (HTML + vanilla JS), tanpa build, tanpa backend.
- Data: 678 soal berpembahasan, 6 kompetensi, JSON di `data/`.
- Deploy: Vercel auto dari branch `main`.
