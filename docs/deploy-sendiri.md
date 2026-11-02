# 🚀 Deploy landing page dan demo

Repo ini menghasilkan situs statis: landing page di `/` dan tujuh gedung demo di `/v/<slug>`. Tidak ada database, server, atau kunci yang perlu disiapkan, jadi situsnya bisa dipasang gratis di layanan hosting statis mana pun.

> Butuh PanduArah untuk gedungmu sendiri, lengkap dengan editor peta dan panel pengelola? Itu bagian dari versi lengkap. Hubungi [panduarahid@gmail.com](mailto:panduarahid@gmail.com) atau kunjungi [panduarah.my.id](https://panduarah.my.id).

## Build

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

Hasilnya ada di `apps/visitor/dist`: HTML, JavaScript, logo demo, service worker (PWA), dan `third-party-notices.txt`.

Coba hasil build di komputer sendiri:

```bash
pnpm --filter @indoor/visitor preview    # http://localhost:5174
```

## Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git**, pilih fork repo ini.
2. Isi pengaturan build:

   | Pengaturan | Nilai |
   | --- | --- |
   | Framework preset | None |
   | Build command | `corepack enable && pnpm install --frozen-lockfile && pnpm build` |
   | Build output directory | `apps/visitor/dist` |
   | Environment variable | `NODE_VERSION` = `22` |

3. **Save and Deploy.** Cloudflare Pages otomatis melayani `index.html` untuk alamat yang bukan berkas (mis. `/v/demo`), jadi tidak perlu aturan tambahan.

## Hosting statis lain

Pakai perintah build dan folder output yang sama. Yang penting, semua alamat yang bukan berkas harus dilayani `index.html` (mode SPA):

| Layanan | Cara |
| --- | --- |
| Netlify | Tambahkan berkas `apps/visitor/public/_redirects` berisi `/*  /index.html  200` |
| Vercel | Rewrite `/(.*)` → `/index.html` di `vercel.json` |
| Nginx | `try_files $uri /index.html;` |

## Uji asap

1. Buka `/`: landing page dan tujuh kartu demo tampil.
2. Buka `/v/demo`, cari **Radiologi**, lalu **Rute ke sini**: langkah rute muncul.
3. Setelah halaman terbuka sekali, matikan internet lalu muat ulang: peta dan rute tetap jalan.
