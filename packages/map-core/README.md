# @indoor/map-core

**Tanggung jawab:** Pembuat style MapLibre, layer per jenis fitur, kamera, lapisan rute, penutupan, kerumunan ilustrasi, dan penanda.

**Perangkat tanpa WebGL:** MapLibre 6 hanya memakai WebGL2. `supportsWebGL()` memeriksanya sekali per halaman; bila `false`, app tidak membuat peta dan menampilkan penggantinya sendiri (Visitor: "Perangkat ini tidak mendukung peta"). `createMap` tetap bisa melempar galat bila konteks GPU ditolak, jadi pemanggil menangkapnya.

**Tidak boleh berisi:** Akses data dan state aplikasi; data diterima lewat argumen.

Paket ini diekspor langsung dari sumber TypeScript (`exports` → `src/index.ts`), sehingga app memakainya tanpa build terpisah.
