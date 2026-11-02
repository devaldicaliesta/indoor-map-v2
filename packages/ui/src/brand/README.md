# Logo PanduArah

Sumber resmi dari pemilik ada di `docs/brand/` (`panduarah-logo.webp`, gambar raster berlatar putih).
Folder ini berisi versi vektornya yang dipakai landing page dan demo.

| Berkas | Isi |
| --- | --- |
| `panduarah-logo.svg` | **Sumber vektor**: simbol + tulisan, latar transparan. Hasil jiplak `panduarah-logo.webp` (potrace per warna, 4× supersampling); selisih rata-rata dengan berkas asli < 1/255 per piksel. `<view id="symbol">` menandai lebar simbol |
| `panduarah-symbol.svg` | Simbol saja (favicon, ikon bawaan saat venue tanpa logo) |
| `panduarah-logo-white.svg`, `panduarah-symbol-white.svg` | Satu warna putih untuk latar gelap, tanpa kotak latar |
| `logo-paths.ts` | Path untuk komponen `BrandLogo` dan `BrandSymbol` |
| `brand-logo.tsx` | Komponen React; warna dari token `--brand-blue`, `--brand-yellow`, `--brand-ink` (`tokens.css`) |

Warna: biru `#0F4A91`, kuning `#FEC409`, hitam `#04080B`. Bentuk dan warna tidak boleh diubah.
Bila pemilik memberi berkas vektor asli, ganti `panduarah-logo.svg` dengan berkas itu (pertahankan
`id` path dan `<view id="symbol">`), lalu buat ulang semua turunan:

```
node scripts/brand-assets.mjs
```

Skrip itu juga menulis favicon (`apps/visitor/public/icons/favicon.svg`) dan ikon PWA (192, 512,
maskable dengan ruang aman 80%, apple-touch 180 berlatar putih).
`test/brand.test.ts` gagal bila turunan tidak sama dengan sumber.

Di Visitor logo venue (branding) tetap yang utama: PanduArah hanya menjadi ikon bawaan
saat venue belum punya logo dan teks kecil "Didukung oleh PanduArah" di dialog informasi peta.
