# Elysian — couture stationery dan folio pernikahan

## Rencana dan karakter

Elysian menjadi keluarga undangan bertema detail cetak: lipatan surat,
emboss, segel monogram, ukiran garis halus, pita, dan komposisi editorial.
Nama pasangan menjadi pusat sampul, dengan foto sebagai cetakan inset.
Artwork ukiran dan segel dibuat langsung sebagai SVG asli tanpa ID yang
berkonflik ketika beberapa mockup tampil dalam satu halaman.

| Varian | Suasana | Komposisi |
| --- | --- | --- |
| Ivory | Kertas hangat, burgundy, ukiran emas | Nama rata kiri; foto strip; segel di sisi kiri; kartu program berlipat |
| Noir | Tinta gelap, metalik, emboss | Tipografi lebih padat; potret tinggi; segel kanan; tanggal di sisi kartu seperti jilid buku |
| Champagne | Kertas keemasan, plum, pita | Nama terpusat; segel tengah; foto mendatar; program berbingkai ganda dan vellum |

ID varian dan konten undangan tetap dipertahankan. Urutan bagian, nama,
foto, lokasi, serta musik berasal dari editor. Data demo tidak mengganti
data pengguna.

## Layout dan bagian

- Sampul `coutureFolio`: nama, tanggal, cetakan foto, segel, penerima, dan
  tombol pembuka dalam satu komposisi. Foto kosong mendapat inisial.
- Pembuka menjadi lembar korespondensi di atas kertas berlapis.
- Mempelai memakai kartu potret editorial dengan foto dan caption terpisah;
  Noir memakai potret tinggi, Champagne bingkai ganda.
- Kutipan memakai bidang kontras dan tipografi serif miring.
- Acara memakai booklet dengan spine dan garis lipatan. Tanggal horizontal
  pada Ivory/Champagne, vertikal pada Noir. Teks venue tetap lebar.
- Hitung mundur menjadi baris kalender beraturan.
- Cerita memakai nomor folio pada margin dan kartu bab berselang-seling di
  kanvas lebar. Foto cerita tetap opsional.
- Galeri menjadi koleksi cetakan dengan mount kertas; varian memiliki bentuk
  foto utama dan bingkai berbeda. Lightbox dan keyboard tetap didukung.
- Peta, informasi, RSVP, hadiah, dan ucapan memakai panel kertas yang buram,
  detail jilid/pita, dan ruang teks yang cukup.
- Penutup menjadi tanda tangan besar dengan pesan terima kasih.

## Gerak dan integrasi

`styles/elysian.css` menjadi sumber komposisi; aturan lama Elysian di stylesheet
bersama dibuang untuk menghindari benturan. Kontainer preview menentukan
breakpoint dan ukuran; foto inset tidak dapat memaksa tinggi sampul mengikuti
ukuran intrinsik berkas gambar.

Runtime `elysian-motion.js` memakai IntersectionObserver untuk reveal sekali,
aktivasi idle, dan fade dekorasi saat keluar viewport. Kilau foil bergerak
perlahan, ukiran bergeser terbatas, dan kartu program masuk dengan gerak
lipatan tipis. Setelah reveal, teks dan input tetap stabil.

Satu listener scroll pasif menjadwalkan RAF hanya ketika diperlukan untuk
drift dekorasi maksimal 18px serta progres navigasi. Tidak ada scroll
hijacking atau RAF loop tanpa henti. Idle berhenti di luar layar dan ketika
tab tersembunyi. Pengaturan reduced motion, termasuk perubahan saat halaman
terbuka, mempertahankan konten terlihat tanpa gerak.

Undangan publik memakai folio sebenarnya dengan nama tamu `?to=`. Flap
amplop terbuka dalam gerak perspektif dan fade 1000ms sebelum isi diungkap.
Skala kanvas tetap; isi memakai `inert` sampai pembuka selesai. Keluarga lain
mempertahankan gerbang dan durasi masing-masing.

Musik pilihan editor dimulai setelah gesture dengan fade in 2,4 detik dan
fade out 1 detik. Tidak menambahkan lagu eksternal. Deskripsi katalog,
landing, pemilih desain, dan varian disesuaikan dengan karakter couture.

## Preview lokal

- `/templates/elysian/preview/elysian-ivory`
- `/templates/elysian/preview/elysian-noir`
- `/templates/elysian/preview/elysian-champagne`

## Validasi

- `node tests/atelier.test.mjs`: lulus untuk 24 varian full/lite, fallback
  keluarga, dan perilaku musik. Fade Elysian 2400/1000ms diuji menggunakan
  Audio dan RAF tiruan untuk memastikan volume bertahap dan jeda setelah fade.
- `node tests/preview-layout.test.mjs`: lulus untuk 120 preview bagian,
  geometri thumbnail, carousel klik/swipe/keyboard/resize, reduced motion,
  cleanup timer editor, serta parsing CSS.
- `npm.cmd run build`: lulus. Peringatan import Firebase statis/dinamis yang
  sebelumnya sudah ada tetap muncul.
- `tests/elysian-browser.mjs`: lulus di Chrome headless untuk 15 kombinasi
  tiga varian pada lebar 320/390/430/768/1440px, mode desktop, nama panjang,
  copy panjang dan kata tanpa spasi, foto sampul kosong, radio, idle yang
  berhenti di luar layar, reduced motion dan perubahan preferensinya,
  progres scroll, galeri keyboard/reopen, slide katalog, editor, draft
  preview, serta gerbang publik.
- Gerbang ketiga varian diuji pada 320/390/1440px (9 kombinasi), termasuk
  nama tamu, kanvas tanpa overflow, skala tetap, flap yang bergerak sebelum
  reveal, dan pelepasan `inert` setelah pembuka. Fase animasi diambil langsung
  dalam halaman sebelum timer menghapus gerbang.
- `tests/lumiere-browser.mjs`: regresi lulus untuk 15 kombinasi varian dan
  lebar, mode desktop, copy panjang, motion/reduced motion, galeri/reel Film,
  katalog, editor/draft, serta gerbang publik termasuk 9 kombinasi.
- Tidak ada error JavaScript yang tidak tertangani pada kedua suite browser.
- `git diff --check`: lulus.

Screenshot Elysian ada di `C:\Users\ulum\.codex\tmp\elysian-review`;
regresi Lumière di `C:\Users\ulum\.codex\tmp\lumiere-regression-elysian`.
Screenshot meliputi sampul mobile/desktop setiap varian, kartu acara,
informasi, galeri, formulir, editor, dan gerbang publik.

Untuk menjalankan pengujian browser, gunakan Vite lokal dan instalasi
Playwright melalui `PLAYWRIGHT_MODULE_PATH`. `ELYSIAN_BASE_URL` dan
`ELYSIAN_SCREENSHOT_DIR` dapat mengubah server serta folder screenshot.

Pengujian editor/publik memakai draft lokal dengan modul auth/Firebase yang
dimock hanya di browser pengujian. Kode autentikasi tidak diubah. Hasil ini
memverifikasi layout dan interaksi; login nyata, penulisan Firestore,
pengiriman RSVP produksi, audio nyata, dan perangkat fisik belum diuji.
Tidak melakukan deploy, commit, atau push.
