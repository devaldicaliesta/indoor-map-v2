# Kebijakan keamanan

## Melaporkan celah keamanan

**Jangan** membuka issue publik, pull request, atau diskusi untuk celah yang belum diperbaiki.

Laporkan secara privat lewat salah satu jalur berikut:

1. **GitHub:** tab **Security** → **Report a vulnerability** di repo ini (laporan privat ke pengelola).
2. **Email:** **panduarahid@gmail.com** dengan judul `[KEAMANAN] ringkasan singkat`.

Sertakan bila memungkinkan:

- bagian yang terdampak (landing page, demo, build, atau workflow) dan versi/commit;
- langkah reproduksi, bukti konsep, dan perkiraan dampak;
- apakah celah ini sudah diketahui pihak lain.

Kami tidak ingin menerima data pribadi milik pengguna mana pun. Bila data semacam itu ikut terlihat saat pengujian, berhentilah di sana, laporkan, dan jangan simpan salinannya.

## Yang kami lakukan

| Langkah | Target waktu |
| --- | --- |
| Konfirmasi laporan diterima | 3 hari kerja |
| Penilaian awal dan tingkat keparahan | 7 hari kerja |
| Perbaikan kritis/tinggi | Secepatnya |
| Perbaikan sedang/rendah | Rilis berikutnya |

Pelapor dikabari sampai perbaikan dirilis dan, bila bersedia, namanya dicantumkan di catatan rilis.

Setelah perbaikan dirilis, kami menerbitkan **GitHub Security Advisory** untuk celah yang berdampak pada pengguna, beserta versi yang terdampak dan cara memperbaruinya.

## Pemindaian otomatis

Repo ini diperiksa terus-menerus, sehingga sebagian besar masalah umum tertangkap sebelum masuk ke `main`:

| Alat | Yang diperiksa | Kapan |
| --- | --- | --- |
| **CodeQL** | Celah di kode TypeScript dan workflow (injeksi, XSS, ReDoS, kebocoran data) | Setiap PR, push, dan mingguan |
| **Dependabot** | Dependency yang punya kerentanan diketahui, plus PR pembaruan otomatis | Terus-menerus dan mingguan |
| **pnpm audit** | Dependency dengan kerentanan tinggi atau kritis | Setiap PR, push, dan mingguan |
| **gitleaks** | Rahasia (kunci, token, password) di seluruh riwayat git | Setiap PR dan push |
| **Dependency review** | Dependency baru di PR: kerentanan dan lisensi copyleft | Setiap PR |

Branch `main` dan `develop` dilindungi: perubahan hanya masuk lewat pull request yang lulus semua pemeriksaan di atas dan disetujui pengelola.

Pemindaian otomatis tidak menggantikan laporan dari manusia. Bila Anda menemukan sesuatu yang lolos, kami sangat berterima kasih atas laporannya.

## Pengujian yang diizinkan

Uji dengan itikad baik **hanya** terhadap salinan yang Anda jalankan sendiri, misalnya hasil `pnpm dev` atau `pnpm build` dari repo ini.

Tidak diizinkan: menguji server demo atau server milik orang lain, uji beban atau penolakan layanan, rekayasa sosial, dan akses fisik.

## Versi yang didukung

Perbaikan keamanan diberikan untuk branch `main` terbaru.

## Untuk kontributor

- Jangan meng-commit `.env*` (kecuali `.env.example`), kunci, token, atau sertifikat.
- Demo berjalan sepenuhnya di browser tanpa server dan tanpa rahasia; jangan menambahkan kunci API atau kredensial ke kode demo.
- Jalankan pemindai rahasia seperti [gitleaks](https://github.com/gitleaks/gitleaks) sebelum push bila memungkinkan.
