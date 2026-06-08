# UI/UX & Desain

Gaya **Accessible & Ethical** — kontras tinggi, biru pemerintahan, fokus keterbacaan & WCAG.
Tanpa emoji sebagai ikon (pakai SVG inline), tanpa gradient "AI", animasi minim.

## Token warna (`css/styles.css` :root)
| Peran | Hex |
|---|---|
| Background | `#f1f5f9` |
| Surface | `#ffffff` |
| Primary / teks | `#0f172a` / `#020617` |
| Sekunder | `#334155` |
| Aksen (CTA) | `#0369a1` |
| Muted | `#475569` |
| Benar | `#15803d` · Salah `#b91c1c` · Tandai `#b45309` |

## Tipografi
- Judul: **Plus Jakarta Sans** (600–800).
- Body: **Inter** (400–700), ukuran ≥16px, line-height 1.5–1.75.
- Dimuat via Google Fonts (`<link>` di `index.html`).

## Ikon
- SVG inline (stroke 2, viewBox 24) di objek `I` dalam `app.js`.
- Default ukuran: `svg:not([width]) { width:1.1em; height:1.1em }` → skala mengikuti teks.
- Elemen dengan atribut `width` (mis. score-ring) dikecualikan dari default.

## Aksesibilitas
- `viewport` meta + semantik (`<header> <main> <footer>`, `tabindex` mount).
- Skip link "Lewati ke konten".
- Target sentuh ≥44px (tombol 48px, opsi 56px, chip 44px).
- Focus ring jelas: `:focus-visible { outline: 3px solid #38bdf8 }`.
- Navigasi keyboard di kuis: `A–D` / `1–4` pilih, `←/→` navigasi, `F` tandai.
- `aria-pressed` pada chip, `aria-live` pada toast.
- `prefers-reduced-motion` → animasi dimatikan.

## Responsif
- Layout fluid: container `max-width:880px`, grid `auto-fit/fill minmax()`.
- Breakpoint `@media (max-width:600px)`: padding/font disesuaikan; `quiz-nav` jadi tombol
  full-width per baris; brand sub-teks dikecilkan.
- Diuji untuk 360 / 375 / 768 / 1024 / 1440px, tanpa horizontal scroll.

## Layar (state machine di `app.js`)
1. **Beranda** — pilih mode + statistik lokal (sesi, skor terbaik, soal perlu diulang).
2. **Setup** — pilih kompetensi, jumlah soal (10/25/50/100/Semua), timer (mode simulasi).
3. **Kuis** — kartu soal, opsi, progress, timer, tombol Ragu, navigasi.
4. **Tinjau** — grid nomor (terjawab/kosong/ditandai) sebelum submit (ala CAT).
5. **Hasil** — score ring, band penilaian, rincian per kompetensi, pembahasan soal salah, bagikan.
6. **Hasil dibagikan** — render read-only dari `#hasil=` di URL.

## Interaksi anti-kedip
Memilih jawaban & menandai soal meng-update DOM **in-place** (toggle class), bukan re-render
penuh, agar tidak muncul animasi "loading". Re-render penuh hanya saat pindah soal/layar
(fade opacity 0.14s).

## Checklist sebelum rilis UI
- [ ] Ikon proporsional di semua layar (beranda, kuis, hasil)
- [ ] Tidak ada horizontal scroll di 360–375px
- [ ] Pilih jawaban mulus tanpa kedip
- [ ] Kontras teks ≥4.5:1, focus ring terlihat
- [ ] Keyboard nav berfungsi di kuis
