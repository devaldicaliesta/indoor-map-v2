# Test E2E (Playwright)

Test end-to-end untuk landing page dan demo. Tidak butuh database atau kunci apa pun: Playwright membangun Visitor versi produksi ke `apps/visitor/dist-e2e` lalu menyajikannya dengan `vite preview`, jadi yang diuji sama dengan yang di-deploy.

## Persiapan

Pasang Chromium sekali: `pnpm --filter @indoor/e2e exec playwright install chromium`. Versi `@playwright/test` dikunci di katalog `pnpm-workspace.yaml`; naikkan bersama browsernya.

## Menjalankan

```bash
pnpm test:e2e                                        # dari root; build + preview (5174) dijalankan otomatis
pnpm --filter @indoor/e2e exec playwright show-report
```

Artefak test yang gagal (screenshot dan trace) ada di `e2e/test-results/`, laporan HTML di `e2e/playwright-report/`.

Tur halaman tidak mulai sendiri di build yang dibuat Playwright (`VITE_TOUR_AUTOSTART=off`). Bila port 5174 sudah dipakai `pnpm dev`, Playwright memakai server itu (`reuseExistingServer`); isi `VITE_TOUR_AUTOSTART=off` di `.env.local` agar tur tidak menghalangi test.

Di komputer sendiri test berjalan dengan 4 worker, di CI dengan 1. Peta dirender WebGL lewat swiftshader (CPU), jadi worker yang lebih banyak justru membuat test lambat dan tidak stabil.

## Isi

| Test | Proyek | Yang dibuktikan |
| --- | --- | --- |
| `tests/landing.spec.ts` | `mobile`, `desktop` | Pesan utama, cara kerja, dan tujuh kartu demo dengan logo tampil; tombol utama membuka demo rumah sakit; bahasa Inggris langsung berlaku; tidak ada tautan Admin atau login |
| `tests/demo.spec.ts` | `mobile` | "radilogi" menemukan Radiologi lalu rute dari QR lobi lengkap dengan langkah, mode aksesibel tanpa eskalator/tangga; tautan bagikan dari alamat slug berisi id venue dan membuka gedung yang sama; alamat yang bukan gedung demo diarahkan ke beranda |
| `tests/a11y.spec.ts` | `mobile`, `desktop` | Tanpa pelanggaran WCAG A/AA (axe) di landing page, demo rumah sakit, dan demo mal |
| `tests/no-webgl.spec.ts` | `no-webgl` | Chromium tanpa WebGL: pesan pengganti peta, pencarian dan rute tetap jalan, tanpa layar galat |
