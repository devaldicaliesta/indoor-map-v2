# Berkontribusi ke PanduArah

Terima kasih sudah mau membantu! Semua kontribusi diterima: laporan bug, perbaikan dokumentasi, terjemahan, test, maupun fitur baru. Panduan ini ditulis dalam Bahasa Indonesia, tetapi issue dan PR dalam Bahasa Inggris juga dipersilakan.

Dengan berkontribusi, Anda setuju mengikuti [Kode Etik](CODE_OF_CONDUCT.md) dan bahwa kontribusi Anda dirilis di bawah [lisensi MIT](LICENSE) proyek ini.

## Daftar isi

- [Cara berkontribusi](#cara-berkontribusi)
- [Menyiapkan lingkungan](#menyiapkan-lingkungan)
- [Branch](#branch)
- [Alur kerja](#alur-kerja)
- [Aturan kode](#aturan-kode)
- [Test](#test)
- [Pemeriksaan otomatis](#pemeriksaan-otomatis)
- [Checklist pull request](#checklist-pull-request)
- [Memakai AI](#memakai-ai)
- [Keamanan dan rahasia](#keamanan-dan-rahasia)

## Cara berkontribusi

- **Melaporkan bug:** buka issue dan pilih template **🐛 Laporan bug**. Isi langkah reproduksi, hasil yang diharapkan, perangkat/browser, dan tangkapan layar bila ada. Hapus data pribadi dari tangkapan layar.
- **Mengusulkan fitur:** buka issue dengan template **✨ Usulan fitur** dan jelaskan masalah yang ingin diselesaikan sebelum menulis kode besar. Ini menghindari kerja yang akhirnya tidak bisa digabung.
- **Mengerjakan issue:** tulis komentar di issue bahwa Anda sedang mengerjakannya agar tidak dobel.
- **Kontribusi pertama?** Cari issue berlabel `good first issue` atau `help wanted`. Perbaikan dokumentasi, terjemahan teks (ID/EN), dan penambahan test adalah titik awal yang baik.
- **Celah keamanan:** jangan lewat issue publik. Ikuti [SECURITY.md](SECURITY.md).

## Menyiapkan lingkungan

Prasyarat: **Node 22** (`.nvmrc`) dan **pnpm 10** (`corepack enable`). Tidak perlu database, Docker, atau kunci apa pun: data demo dibangun langsung di browser dari `packages/demo`.

```bash
# 1. Fork repo ini di GitHub, lalu:
git clone https://github.com/<akun-anda>/indoor-map-v2.git
cd indoor-map-v2
corepack enable
pnpm install

# 2. Jalankan
pnpm dev                       # http://localhost:5174
```

## Branch

| Branch | Fungsi | Siapa yang mengubah |
| --- | --- | --- |
| `main` | Versi stabil yang siap dipakai. Hanya berisi rilis | Pengelola saja, lewat merge dari `develop` |
| `develop` | Tempat semua kontribusi digabung dan diuji bersama | Lewat pull request dari kontributor |

**Semua pull request diarahkan ke `develop`, bukan ke `main`.** PR yang menuju `main` akan diminta dipindahkan. Setelah `develop` dianggap stabil, pengelola menggabungkannya ke `main` sebagai rilis.

Kedua branch dilindungi: tidak bisa di-push langsung, tidak bisa di-force push, dan tidak bisa dihapus. Semua perubahan masuk lewat pull request.

## Alur kerja

1. Ambil `develop` terbaru (`git checkout develop && git pull`), lalu buat branch baru dari situ dengan nama yang jelas:
   - `fix/rute-lift-terbalik`
   - `feat/ekspor-geojson`
   - `docs/panduan-instalasi`
2. Buat perubahan kecil dan terfokus. Satu PR untuk satu hal. Usahakan PR di bawah ±400 baris; perubahan besar dipecah.
3. Tulis commit yang jelas. Format yang disarankan:
   ```
   fix: rute tidak memakai lift saat mode aksesibel
   feat(visitor): tombol bagikan lokasi
   docs: perbaiki langkah instalasi
   ```
4. Jalankan `pnpm check` sampai hijau.
5. Buka PR ke **`develop`**, isi deskripsi sesuai [checklist](#checklist-pull-request), dan tautkan issue terkait (`Closes #123`).
6. Tanggapi masukan peninjau. Setelah disetujui dan semua pemeriksaan lulus, PR akan digabung.

## Aturan kode

Aturan berikut menjaga kode tetap rapi, aman, dan mudah dipindah. PR yang melanggarnya akan diminta diperbaiki.

**Arsitektur**

- Repo ini berisi **landing page dan demo pengunjung** saja (`apps/visitor`). Editor peta, panel pengelola, backend, dan lisensi bukan bagian repo ini.
- **Komponen React tidak membangun data sendiri.** Snapshot demo, penutupan contoh, dan URL aset diambil lewat `apps/visitor/src/data`, yang memakai `packages/demo`.
- **Logika bisnis ada di `packages/domain` dan `packages/routing`**, bukan di komponen. Kedua paket ini tidak boleh mengimpor React atau MapLibre.
- Gedung demo baru ditambahkan di `packages/demo` (fixture + entri katalog) dan wajib lolos test paket itu: snapshot valid, id stabil, dan setiap lokasi bisa dirutekan.
- Jarak dalam meter, koordinat WGS84 (EPSG:4326), geometri GeoJSON.

**Gaya**

- TypeScript strict, tanpa `any`.
- Fungsi kecil dengan nama jelas; file di atas ±300 baris dipecah.
- Gunakan istilah netral di kode: `location`, `unit`, `venue`, `building`, `floor`. Istilah industri ("toko", "poli", "tenant") hanya di data template.
- Komentar menjelaskan *mengapa*, bukan mengulang *apa*.
- Teks antarmuka lewat i18next (ID/EN), tidak di-hardcode.
- Format dan lint dengan Biome (`pnpm format`, `pnpm lint`).
- Jangan menambah dependency tanpa menuliskan alasannya di PR. Hindari dependency berat (> ±100 kB gzip) atau berlisensi non-permisif.
- Data contoh hanya di `packages/demo` atau fixture test.

## Test

| Perintah | Kapan |
| --- | --- |
| `pnpm check` | Selalu, sebelum setiap PR |
| `pnpm test:e2e` | Saat mengubah tampilan landing page atau alur demo |

Setiap perbaikan bug sebaiknya disertai test yang gagal sebelum perbaikan. Perubahan di `packages/domain` dan `packages/routing` **wajib** disertai test.

## Pemeriksaan otomatis

Setiap pull request otomatis diperiksa oleh GitHub Actions:

| Pemeriksaan | Isinya |
| --- | --- |
| **CI** | `pnpm check` (typecheck, lint, test unit), `pnpm build`, dan test E2E Playwright untuk landing page dan demo |
| **Security** | dependency rentan (`pnpm audit`), rahasia yang ikut ter-commit (gitleaks), dan tinjauan dependency baru (kerentanan dan lisensi) |
| **CodeQL** | analisis keamanan kode TypeScript dan workflow |

### Syarat PR bisa digabung

1. ✅ Semua pemeriksaan di atas hijau.
2. 👀 Disetujui (approve) minimal **1 pengelola**. Bila Anda menambah commit setelah disetujui, persetujuannya batal dan PR perlu ditinjau ulang.
3. 💬 Semua komentar review sudah diselesaikan (*resolved*).

Bila ada yang merah, buka tab **Checks** di PR untuk melihat log-nya. Bila CodeQL melaporkan temuan di kode Anda, perbaiki, atau jelaskan di PR mengapa temuan itu alarm palsu. Untuk kontributor baru, workflow bisa menunggu persetujuan pengelola sebelum berjalan; ini pengaman standar GitHub untuk repo publik.

Pembaruan dependency dibuat otomatis oleh **Dependabot** dalam bentuk PR ke `develop` setiap minggu, dan diperiksa dengan cara yang sama.

## Checklist pull request

Template PR ini otomatis muncul saat Anda membuka pull request. Isinya:

```markdown
## Apa yang berubah
<!-- ringkas, dan alasannya -->

Closes #

## Cara menguji
<!-- langkah singkat untuk peninjau -->

## Checklist
- [ ] `pnpm check` hijau
- [ ] Test ditambah/diperbarui untuk logika yang berubah
- [ ] Tidak ada rahasia, `.env*`, token, atau data pribadi yang ikut ter-commit
- [ ] `pnpm test:e2e` hijau bila tampilan berubah
- [ ] Dependency baru (bila ada) disebut beserta alasannya
- [ ] Tangkapan layar untuk perubahan UI (bila ada)
- [ ] Sebagian besar kode dibuat dengan bantuan AI: ya / tidak
```

## Memakai AI

Asisten AI (Claude Code, Copilot, Cursor, dan sejenisnya) boleh dipakai. Proyek ini sendiri dibangun dengan bantuan Claude Code; caranya dijelaskan di [README](README.md#-cara-saya-memakai-ai). Syaratnya:

- **Anda bertanggung jawab penuh atas PR Anda.** Pahami dan baca setiap baris sebelum mengirim.
- Minta AI membaca berkas ini dulu, lalu minta rencana sebelum kode.
- Batasi lingkup ke satu issue. PR besar hasil AI yang menyentuh banyak hal sekaligus akan diminta dipecah.
- Jangan menempelkan rahasia, isi `.env.local`, atau data pribadi ke prompt.
- Sebutkan di PR bila sebagian besar kode dibuat dengan bantuan AI.

## Keamanan dan rahasia

- **Jangan pernah meng-commit** `.env.local`, kunci API, token, password, sertifikat, atau kunci privat. `.gitignore` sudah memblokir pola umum, tetapi periksa `git diff --staged` sebelum commit.
- Untuk ekstra aman, pasang pemindai rahasia lokal seperti [gitleaks](https://github.com/gitleaks/gitleaks) dan jalankan `gitleaks git .` sebelum push.
- **Tulis kode yang aman sejak awal:**
  - Jangan pernah menyalin nilai dari permintaan (header, query, body) langsung ke header respons atau ke HTML.
  - Hindari regex dengan kuantifier yang tumpang tindih (misalnya `\s*[,\s]\s*` atau `[^@]+\.[^@]+`) untuk masukan dari pengguna, karena bisa sangat lambat (ReDoS). Untuk membuang `/` di akhir URL, pakai `trimTrailingSlashes` dari `@indoor/domain`.
  - Tautan dari data pengguna hanya boleh `http(s)`, dan validasi selalu diulang di server.
- Bila Anda tidak sengaja meng-commit rahasia, beri tahu pengelola lewat jalur di [SECURITY.md](SECURITY.md) dan anggap rahasia itu sudah bocor (ganti segera).

Terima kasih sudah berkontribusi! 🙌
