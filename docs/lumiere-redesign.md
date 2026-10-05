# Lumière — undangan dalam cahaya dan bab fotografi

## Rencana desain

Keluarga selanjutnya adalah Lumière, dengan arah fotografi sinematik.
Sampul mempertemukan foto besar, judul pasangan, tanggal, dan penerima.
Ornamen berupa lensa optik, sorot cahaya, jejak film melengkung, perforasi,
dan tanda viewfinder. Artwork SVG dibuat dari kode asli tanpa aset ilustrasi
eksternal atau ID SVG yang bisa bentrok antarmockup.

| Varian | Warna dan suasana | Komposisi |
| --- | --- | --- |
| Gallery | Biru malam, peach, cahaya kebiruan | Sampul foto penuh; potret bergaya credit; galeri contact sheet dengan foto utama besar |
| Film | Plum gelap, amber, cahaya hangat | Potret letterbox/perforasi; judul miring; tanggal horizontal pada tiket; galeri reel horizontal |
| Clean | Ivory hangat, tinta biru, aksen bronze | Foto bergeser ke sisi kanan; nama bertingkat; potret mendatar; album dengan mount terang |

ID dan nama varian yang sudah ada dipertahankan. Konten dan urutan bagian
tetap berasal dari data undangan di editor.

## Komposisi setiap bagian

- Pembuka menjadi prolog tipografi dengan garis cahaya.
- Mempelai memakai portrait credit dengan foto lebar dan caption terpisah.
- Kutipan mendapat interlude kontras yang tenang.
- Acara memakai tiket dengan stub tanggal, garis perforasi, dan punch pada
  sambungan. Film memiliki tanggal horizontal, Clean tepi album asimetris.
- Hitung mundur menggunakan bidang angka berlipat, tanpa animasi angka yang
  berkelip atau mengganggu pembacaan.
- Cerita tersusun menjadi bab foto dan teks bernomor, dengan layout dua kolom
  berselang-seling pada kanvas lebar. Foto cerita tidak wajib diisi.
- Gallery memakai contact sheet; Film reel yang bisa digulir mendatar; Clean
  foto dengan mount album. Galeri tetap mendukung keyboard dan lightbox.
- Peta menggunakan frame viewfinder berlapis.
- Informasi memakai bidang teks lebar dengan sudut asimetris. RSVP dan ucapan
  memakai panel buram agar cahaya tidak mengganggu pembacaan atau pengetikan.
- Hadiah menjadi kartu rekening bergaya logam, dengan tombol salin tetap ada.
- Penutup menjadi credit dengan nama besar, pesan terima kasih, dan lensa.

## Gerak dan integrasi

`styles/lumiere.css` menjadi sumber komposisi. Aturan Lumière sebelumnya
dihapus dari `atelier.css` dan `templates.css` untuk menghindari benturan.
Layout sampul baru bernama `cinematicTitle`; foto kosong mendapat inisial.
Demo Clean menggunakan foto terang; demo cerita Lumière memiliki foto.
Isi undangan pengguna tidak ditimpa oleh data demo.

`lumiere-motion.js` menggunakan IntersectionObserver untuk reveal satu kali,
wiping foto, dan aktivasi idle hanya pada bagian yang terlihat. Bilah lensa
berputar perlahan, cahaya bergeser, dan jejak film bergerak lembut. Dekorasi
masuk/fade ketika bagian masuk viewport dan fade saat keluar.

Satu listener scroll pasif menjadwalkan RAF saat diperlukan: drift lensa
dibatasi 24px, drift foto sampul 10px, dan garis progres tampil pada navigasi.
Teks, kartu input, dan urutan baca tidak digerakkan oleh parallax. Scroll
tetap native, tanpa scroll hijacking. Animasi berhenti di luar layar dan saat
tab tersembunyi. Preferensi reduced motion, termasuk perubahan saat halaman
terbuka, menghentikan gerak dan menjaga konten terlihat.

Gerbang publik memakai sampul sebenarnya dan nama tamu `?to=`. Shutter
horizontal menutup sebelum isi diungkap dengan fade 950ms; skala kanvas
dipertahankan. Isi memakai `inert` hingga dibuka. Amora dan Nusantara tetap
memakai gerbang serta durasi masing-masing.

Musik pilihan editor masuk setelah gesture dengan fade in 3 detik dan fade
out 1,2 detik saat dijeda. Tidak menambahkan lagu eksternal. Copy katalog,
landing, pemilih desain, dan deskripsi varian mengikuti karakter baru.

## Preview lokal

- `/templates/lumiere/preview/lumiere-gallery`
- `/templates/lumiere/preview/lumiere-film`
- `/templates/lumiere/preview/lumiere-clean`

## Validasi

- `node tests/atelier.test.mjs`: lulus untuk 24 varian full/lite, fallback
  keluarga, dan perilaku musik. Fade Lumière 3000/1200ms diuji dengan Audio
  dan RAF tiruan untuk memastikan volume bertahap serta jeda setelah fade.
- `node tests/preview-layout.test.mjs`: lulus untuk 120 preview bagian,
  ukuran thumbnail, carousel klik/swipe/keyboard/resize, reduced motion,
  cleanup timer editor, serta parsing CSS.
- `npm.cmd run build`: lulus. Peringatan import Firebase statis/dinamis yang
  sudah ada tetap muncul.
- `tests/lumiere-browser.mjs`: lulus di Chrome headless untuk 15 kombinasi
  tiga varian pada lebar 320/390/430/768/1440px; mode desktop; copy panjang
  dan kata tanpa spasi; nama panjang; foto kosong; radio; idle di viewport
  dan pause di luar layar; perubahan reduced motion; progres gulir; lightbox
  keyboard/reopen; slide katalog; editor; draft preview; gerbang publik.
- Reel Film diperiksa dengan gulir horizontal hingga foto terakhir,
  membuka foto via keyboard, menutupnya, dan mempertahankan posisi reel.
- Gerbang tiga varian diuji pada 320/390/1440px (9 kombinasi), termasuk nama
  tamu, skala kanvas, pertumbuhan shutter sebelum reveal, serta pelepasan
  `inert`. Fase animasi diambil langsung di halaman sebelum timer menghapus
  gerbang sehingga latensi protokol tidak mengukur sampul body yang kedua.
- `tests/nusantara-browser.mjs`: regresi lulus untuk 15 kombinasi varian dan
  lebar, desktop, copy panjang, motion/reduced motion, galeri, katalog,
  editor/draft, serta 9 kombinasi gerbang publik.
- Tidak ada error JavaScript yang tidak tertangani pada kedua suite browser.
- `git diff --check`: lulus.

Screenshot ada di `C:\Users\ulum\.codex\tmp\lumiere-review`; hasil regresi
Nusantara ada di `C:\Users\ulum\.codex\tmp\nusantara-regression-lumiere`.
Screenshot meliputi sampul mobile/desktop setiap varian, bagian utama,
preview editor, kartu informasi, dan transisi gerbang.

Pengujian browser memerlukan Vite lokal. Playwright dapat disediakan di luar
repository melalui `PLAYWRIGHT_MODULE_PATH`. `LUMIERE_BASE_URL` dan
`LUMIERE_SCREENSHOT_DIR` mengubah alamat server dan folder screenshot.

Pengujian editor dan publik memakai draft lokal dengan auth/Firebase yang
dimock hanya di browser pengujian. Kode autentikasi tidak diubah. Ini adalah
validasi layout dan interaksi, bukan login nyata, penulisan Firestore,
pengiriman RSVP produksi, atau pengujian audio/perangkat fisik. Perubahan
masih lokal; tidak melakukan deploy, commit, atau push.
