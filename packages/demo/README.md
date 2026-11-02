# @indoor/demo

**Tanggung jawab:** Tujuh gedung demo fiktif (rumah sakit, mal, kampus, perkantoran, bandara, kawasan industri, stadion konser) beserta katalognya, snapshot yang dibangun langsung di browser, dan penutupan contoh.

**Tidak boleh berisi:** React, MapLibre, akses jaringan. Hanya bergantung pada `@indoor/domain`.

Paket ini diekspor langsung dari sumber TypeScript (`exports` → `src/index.ts`), sehingga app memakainya tanpa build terpisah.

## Isi

| Slug | Gedung | Ciri |
| --- | --- | --- |
| `demo` | RS Demo Harapan | blok bercourtyard, sayap IGD, kamar operasi di L1 |
| `demo-mal` | Mal Demo Sentosa | denah T, atrium bundar dengan void dan eskalator |
| `demo-kampus` | Kampus Demo Cendekia | dua gedung dihubungkan Area Luar |
| `demo-kantor` | Menara Demo Sinergi | tower enam lantai dengan inti lift di tengah |
| `demo-bandara` | Bandara Demo Nusantara | check-in, keamanan, gerbang domestik dan internasional |
| `demo-pabrik` | Kawasan Demo Industri Prima | lini produksi, gudang, APAR, pintu darurat |
| `demo-konser` | Konser Demo Gemilang | stadion oval, panggung, tribun dua lantai |

## Pemakaian

```ts
import { demoBySlug, demoClosures, demoSnapshot } from '@indoor/demo';

const entry = demoBySlug('demo');
const snapshot = entry && (await demoSnapshot(entry));
const closures = snapshot ? demoClosures(snapshot, new Date()) : [];
```

- `DEMO_VENUES` berisi slug, id venue, nama, alamat fiktif, warna merek, dan path logo (`apps/visitor/public/demo/logos/`, dibuat `node scripts/demo-logos.mjs`).
- Fixture tiap gedung dimuat lewat `import()`, jadi bundel hanya memuat gedung yang dibuka.
- Semua id berupa UUID deterministik dari kunci teks, sehingga tautan bagikan tetap berlaku.
- `demoClosures` membuat penutupan yang sedang berlaku relatif terhadap `now` (satu ruang direnovasi dan satu lift diservis), sehingga rute terlihat memutar.

Gedung baru ditambahkan di `src/venues/` dan `src/catalog.ts`; `test/demo.test.ts` memastikan snapshot lolos skema publik, id stabil, dan setiap lokasi bisa dirutekan dari titik asal pertama.

Semua nama orang, perusahaan, dan gerai fiktif.
