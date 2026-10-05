# Nusantara — perayaan warna dan geometri

## Rencana dan arah desain

Keluarga berikutnya setelah Amora adalah Nusantara. Komposisinya memakai
anyaman pita, medali radial, kipas lipat, bingkai bertingkat, dan warna permata.
Ilustrasi geometris dibuat langsung sebagai SVG asli; tidak menyalin ilustrasi
referensi dan tidak menyatakan pola ini sebagai motif adat tertentu.

| Varian | Warna | Komposisi dan nuansa |
| --- | --- | --- |
| Sagara | Teal pekat, emas, turquoise | Gerbang berpasangan, potret potong sudut, panel anyaman yang terstruktur |
| Puspa | Merah delima, coral, emas hangat | Potret oktagonal, medali besar, tanggal pada bidang burgundy, galeri berbingkai permata |
| Terra | Terracotta, plum, bronze | Potret mendatar, bingkai bertingkat, panel berpijak dan aksen plum |

ID varian lama tetap berlaku. Data pasangan, bagian aktif, urutan bagian,
foto, lokasi, dan musik tetap mengikuti isi undangan dari editor.

## Implementasi

- Layout `ceremonialGate` menyatukan foto, nama, tanggal, penerima, dan tombol
  pembuka. Foto kosong mendapat inisial dalam bingkai yang sama.
- Setiap bagian mendapat geometri tepi. Surat pembuka memakai panel inset;
  mempelai dua perisai potret; kutipan bidang terang; acara kartu lipatan
  dengan tanggal terpisah; hitung mundur medali; cerita garis anyaman dan
  nomor bab; galeri mosaik; peta bingkai berlapis; informasi kartu sudut
  potong; RSVP bingkai ganda; hadiah kartu cap; ucapan panel bersusun.
- `styles/nusantara.css` menjadi sumber komposisi. Aturan Nusantara sebelumnya
  dibuang dari stylesheet bersama agar tidak bertabrakan.
- `nusantara-art.js` menghasilkan artwork SVG tanpa ID sehingga banyak
  preview dapat tampil bersamaan tanpa konflik referensi SVG.
- Dekorasi berada di layer absolut terpisah dan tidak menangkap klik. Teks
  berada di atasnya. Ukuran kolom dan breakpoint mengikuti kanvas undangan.
- Runtime `nusantara-motion.js` memakai IntersectionObserver untuk reveal
  sekali dan gerak ornamen saat masuk/keluar viewport. Medali luar/dalam
  berputar berlawanan arah; kipas dan pita bergerak perlahan. Animasi idle
  berhenti saat bagian tidak terlihat atau tab tersembunyi.
- Satu listener scroll pasif dan RAF yang dijadwalkan saat diperlukan mengatur
  drift dekorasi terbatas 18px serta progres perjalanan di navigasi bawah.
  Tidak ada scroll hijacking atau RAF loop tanpa henti.
- Pengaturan pengurangan gerak, termasuk perubahan saat halaman terbuka,
  menjaga semua konten terbaca tanpa reveal tersembunyi.
- Undangan publik menggunakan sampul asli sebagai gerbang, dengan panel
  bergeser keluar dan fade 900ms. Isi memakai `inert` sampai dibuka. Nama tamu
  dari `?to=` tetap ditampilkan. Amora mempertahankan transisi 650ms miliknya.
- Musik pilihan editor memakai fade in 2,6 detik dan fade out 1,1 detik.
  Pemutaran dimulai setelah gesture; envelope volume dapat dibatalkan saat
  tombol putar/jeda ditekan cepat. Tidak menambahkan lagu demo eksternal.
- Copy katalog, pemilih desain, landing, dan deskripsi varian disesuaikan
  dengan karakter baru.

## Meninjau

Dengan Vite berjalan pada port 5173:

- `/templates/nusantara/preview/nusantara-sagara`
- `/templates/nusantara/preview/nusantara-puspa`
- `/templates/nusantara/preview/nusantara-terra`

## Validasi

- `node tests/atelier.test.mjs`: lulus untuk 24 varian full/lite, fallback
  keluarga, serta fade/pause/volume nol/cleanup audio. Tambahan pengujian
  Nusantara memeriksa konfigurasi 2600/1100ms dan perubahan volume bertahap
  menggunakan Audio/RAF tiruan; ini bukan pengujian suara pada perangkat fisik.
- `node tests/preview-layout.test.mjs`: lulus untuk 120 preview bagian,
  ukuran thumbnail, slide klik/swipe/keyboard/resize, reduced motion,
  cleanup timer editor, dan parsing CSS.
- `npm.cmd run build`: lulus. Peringatan Vite tentang import Firebase
  statis/dinamis yang sudah ada tetap muncul.
- `tests/nusantara-browser.mjs`: lulus di Chrome headless untuk 15 kombinasi
  tiga varian pada lebar 320/390/430/768/1440px, mode desktop, informasi
  panjang termasuk kata tanpa spasi, nama panjang, foto sampul kosong,
  radio yang tidak menghabiskan kolom teks, reveal/idle/reduced motion,
  progres gulir, galeri via keyboard dan reopen cepat, slide katalog,
  editor, draft preview, serta gerbang publik.
- Gerbang ketiga varian juga diperiksa pada 320/390/1440px (9 kombinasi),
  termasuk nama tamu, panel yang bergeser, skala kanvas tetap, dan pelepasan
  `inert` setelah animasi. Tidak ada error JavaScript yang tidak tertangani.
- `tests/amora-browser.mjs`: regresi lulus untuk 15 kombinasi ukuran/varian
  Amora, motion, galeri, katalog, editor/draft/public gate.
- `git diff --check`: lulus.

Screenshot peninjauan Nusantara disimpan di
`C:\Users\ulum\.codex\tmp\nusantara-review`, termasuk mode desktop setiap
varian, bagian utama ketiga varian, kartu informasi, serta transisi gerbang.
Regresi Amora ada di `C:\Users\ulum\.codex\tmp\amora-regression-nusantara`.

Untuk pengujian browser, jalankan Vite lokal. Playwright adalah dependensi
pengujian dan dapat disediakan di luar repository melalui
`PLAYWRIGHT_MODULE_PATH`. `NUSANTARA_BASE_URL` dan `NUSANTARA_SCREENSHOT_DIR`
dapat mengubah alamat server dan folder screenshot.

Pengujian editor dan gerbang publik menggunakan draft lokal dengan modul
auth/Firebase yang dimock hanya di browser pengujian. Kode autentikasi proyek
tidak diubah. Hasil ini memverifikasi layout dan interaksi, bukan login nyata,
penulisan Firestore, pengiriman RSVP produksi, atau perangkat fisik. Tidak
melakukan deploy, commit, maupun push.
