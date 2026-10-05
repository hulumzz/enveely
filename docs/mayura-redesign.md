# Mayura — taman merak

Keluarga undangan baru dengan merak, kanopi teratai, sulur emas, kipas bulu, dan garis lengkung Art Nouveau. Aset ilustrasi dibuat khusus untuk proyek ini; tidak mengambil ilustrasi dari template referensi. Template yang telah dikerjakan sebelumnya tetap dipertahankan.

## Rencana dan implementasi

1. Pisahkan identitas desain dari Amora dan Pusaka: taman aviari dengan nama serif di atas jendela potret pada kanvas mobile, serta komposisi nama/foto dua kolom pada desktop.
2. Bangun bingkai seluruh section, termasuk placeholder kosong di editor. Dua kanopi diagonal, dua kipas bulu, merak, pola bulu, garis inlay, dan partikel ditempatkan pada lapisan section terpisah. Card tidak menampung seluruh dekorasi; artwork mengisi sudut dan tepi kanvas.
3. Bentuk plakat acara dengan medali tanggal oval, potret cameo, cerita mengikuti sulur, galeri salon, dan panel formulir berlapis. Panel informasi memakai kolom teks minmax(0,1fr), seluruh input memakai teks 16px, radio 16px, dan aksi/navigasi minimal 44px.
4. Buat tiga variasi komposisi:
   - Jade: taman hijau, jendela potret lengkung, potret cameo, dan plakat medali.
   - Garnet: salon merah ungu, foto oval, mahkota kipas bulu, kartu lengkung diagonal, dan galeri medali.
   - Pearl: konservatori terang, potret offset asimetris, panel porselen, dan garis bingkai emerald.
5. Terapkan entry/exit ornamen berulang, konten reveal sekali, parallax maksimal 20px, napas/gerak merak, sulur perlahan, kipas bulu, dan partikel kunang-kunang. Hanya tiga bulu per kipas yang dianimasikan saat section terlihat; ornamen offscreen berhenti. RAF hanya dijadwalkan untuk scroll/resize. Tab tersembunyi, navigasi, dan perubahan reduced motion memiliki penanganan cleanup.
6. Gerbang memakai sampul keluarga yang sebenarnya. Merak bergerak keluar, daun bingkai membuka, teks memudar, dan latar menghilang pada akhir transisi 1.2 detik. Isi di belakang gerbang tetap inert dan visibility:hidden sampai gerbang selesai, sehingga tidak menampilkan dua sampul bertumpuk.
7. Musik pilihan pengguna memakai fade in 3.2 detik dan fade out 1.6 detik; mengikuti gesture pemutaran dan runtime audio bersama. Tidak menambah lagu eksternal.
8. Integrasikan koleksi, detail keluarga, preview penuh, pemilih desain, editor, draft preview, dan undangan publik. Mayura memakai tingkat paket Premium yang sudah ada: Jade Rp150.000/10 foto, Garnet Rp170.000/12 foto, Pearl Rp185.000/14 foto. Paket keluarga lama tidak berubah.

## Aset imagegen

Mode built-in imagegen dengan transparent_background:true. Hasil diperiksa secara visual, alpha dipertahankan, lalu dikonversi menjadi WebP dalam workspace. Dua raster berjumlah sekitar 468 KB dan memakai URL yang sama agar browser memakai cache. Ornamen dimuat eager agar dekorasi yang terpotong di tepi/bertransformasi tidak terlewat oleh heuristik lazy loading; hanya dua file unik yang diperlukan. Foto galeri tetap lazy, dan thumbnail koleksi tetap mengikuti hydration ketika mendekati viewport.

- public/art/mayura/peacock.webp — merak dengan ekor menjuntai.
- public/art/mayura/canopy.webp — kanopi teratai/sulur berbentuk sudut.
- public/art/mayura/inlay.svg — pola bulu native SVG orisinal, bukan hasil imagegen.
- src/data/mayura-art.js — kipas bulu SVG dan komposisi layer per section.

Prompt merak (verbatim):

Use case: stylized-concept. Asset type: isolated transparent illustration for an ornate luxury wedding invitation website, Art Nouveau garden aviary theme. One exquisite peacock in graceful side profile facing RIGHT, perched on a slender curling gilded branch, long flowing folded tail draping DOWN and curling slightly left, richly patterned eye feathers, emerald jade and petrol blue plumage with delicate antique gold outlines, subtle cream and coral jewel details. Editorial hand-painted gouache and fine gold engraving, luxurious decorative botanical plate rather than photograph or cartoon. Complete full bird and tail visible, tall portrait composition with generous margin. A coherent elegant decorative silhouette suitable for a web frame edge. Actual transparent background including spaces between tail feathers and branch, no scenery, no background color, no lettering, no watermark, no flowers or border, single bird only.

Prompt kanopi (verbatim):

Use case: stylized-concept. Asset type: isolated transparent corner canopy illustration for an ornate Art Nouveau wedding garden invitation. One elaborate asymmetrical decorative garland shaped like a broad INVERTED L: a horizontal arching branch extending from upper LEFT toward upper RIGHT, and a longer descending curling vine along the LEFT edge. Elegant gilded curling stems, lush jade and blue-green leaves, small ivory lotus-like blossoms, a few dusky coral blooms, jewel-toned buds and seedpods, subtle fine gold filigree integrated among foliage. Fine hand-painted gouache with Art Nouveau ornamental ink contours, archival luxury illustrated garden plate, richly layered and polished. Open transparent negative space in lower RIGHT three quarters for readable wedding text. Entire botanical artwork visible, leave outer padding. Actual transparent background including between branches, no text, no lettering, no rectangular border, no bird, no photorealism or cartoon. Palette coordinates with jade/petrol/antique gold peacock illustration.

## Pemeriksaan

Hasil akhir: seluruh pemeriksaan di bawah lulus. Build selesai dengan 173 module; peringatan pembagian chunk Firebase yang sudah ada tetap muncul. Browser mencatat 15 kombinasi varian/viewport, seluruh alur lanjutan selesai, dan tidak ada uncaught error. Bukti hasil: C:/Users/ulum/.codex/tmp/mayura-review-final/results.json.

- node tests/atelier.test.mjs: 30 full/lite render, fallback keluarga, bingkai semua section dan placeholder, envelope musik dengan fake Audio/RAF, pause/resume/volume nol/cleanup.
- node tests/preview-layout.test.mjs: 150 preview section, thumbnail, carousel click/swipe/keyboard/resize/reduced motion, cleanup timer, dan parse CSS.
- node tests/mayura-browser.mjs: Chrome lokal untuk tiga variasi pada 320/390/430/768/1440px; desktop canvas; frame/aset semua section; entry/exit/idle/reduced motion; nama/copy panjang dan fallback tanpa foto; keyboard/lightbox/buka ulang; slide koleksi; wizard pemilihan; editor/draft/public gate.
- npm.cmd run build.

Screenshot: C:/Users/ulum/.codex/tmp/mayura-review-final. Pengujian editor/public menggunakan mock auth/Firebase dan draft lokal; pengujian visual Maps memakai iframe placeholder untuk menghindari ketergantungan jaringan eksternal. Pengujian tidak membuktikan login nyata, penulisan data cloud, layanan Maps langsung, perangkat fisik, atau audio yang didengar. Tidak melakukan commit/push/deploy.

Preview lokal: http://127.0.0.1:5173/templates/mayura/preview/mayura-jade
