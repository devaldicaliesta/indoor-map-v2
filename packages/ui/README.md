# @indoor/ui

**Tanggung jawab:** Komponen shadcn yang sudah dikustom, token, ikon, pola layout.

**Tidak boleh berisi:** Logika bisnis.

## Tur halaman (`src/tour`)

- Langkah menunjuk elemen lewat atribut `data-tour="…"`, bukan kelas CSS.
- `resolveTourSteps` membuang langkah untuk aksi yang tidak tersedia (`requires`) dan langkah
  yang elemennya tidak terlihat.
- `useTour` memuat driver.js (MIT) lewat `import()` saat tur dimulai, sehingga tidak masuk bundel
  awal. Tema diambil dari token (`run-tour.ts`), bukan CSS bawaan driver.js. Tombol tur
  Lanjut/Kembali/Selesai/Lewati dan indikator langkah memakai label dari app (i18n di Visitor).
  Keyboard: panah, Esc, dan Tab berputar di tombol tur; tanpa animasi saat
  `prefers-reduced-motion`.
- Status "sudah dilihat" (`id@versi`) disediakan app lewat `TourSeenStore`; demo menyimpannya di
  `localStorage` per perangkat.
- Tur otomatis mengikuti bawaan build (`VITE_TOUR_AUTOSTART=off` mematikannya) dan pilihan
  perangkat `localStorage['indoor.tour.auto']` (`'on'`/`'off'`).

Paket ini diekspor langsung dari sumber TypeScript (`exports` → `src/index.ts`), sehingga app memakainya tanpa build terpisah.
