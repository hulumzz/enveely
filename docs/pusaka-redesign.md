# Pusaka — panggung budaya

Keluarga baru dengan inspirasi visual Jawa: panggung wayang, gunungan/kayon, kain batik, ukiran, dan pendopo. Ilustrasi merupakan interpretasi dekoratif orisinal; tidak mengklaim motif sakral atau tokoh pewayangan tertentu. Referensi konteks budaya: [Wayang puppet theatre](https://ich.unesco.org/en/RL/wayang-puppet-theatre-00063) dan [Indonesian Batik](https://ich.unesco.org/en/RL/indonesian-batik-00170), UNESCO. Tidak menggunakan gambar atau source template referensi sebagai aset.

## Rencana dan hasil desain

- Setiap section, termasuk placeholder kosong di editor, memiliki lapisan bingkai terpisah: empat sudut ukiran, tepi batik, gunungan, wayang, cahaya, dan partikel. Ornamen menempati pinggir kanvas dengan pointer-events none. Teks dan formulir berada di lapisan di atasnya.
- Sogan: panggung sepia, potret lengkung, panel pendopo, kartu kisah menyerupai gulungan, album foto dengan lengkung.
- Kencana: pendopo merah-emas, potret sampul mendatar, bingkai melengkung ganda, potret oval, galeri medali, panel tulisan melengkung diagonal.
- Nila: panggung biru malam, potret asimetris dan nama rata kiri, ukiran abu biru, wayang bayangan, panel cerita gelap, album bertepi lurus.
- Ornamen masuk dan keluar berulang dari tepi ketika section terlihat. Idle wayang, gunungan, cahaya lampu, dan partikel berjalan hanya pada section yang terlihat. Parallax dibatasi 24px; RAF berjalan hanya saat scroll/resize, bukan loop tanpa henti.
- Konten reveal sekali untuk menjaga keterbacaan ketika kembali. Reduced motion dan pergantian preferensi ditangani; listener/observer/RAF dibersihkan saat navigasi, animasi dihentikan saat tab tersembunyi.
- Gerbang publik memakai sampul keluarga yang sebenarnya. Wayang bergerak ke samping, tirai batik membuka, teks memudar sebelum isi dibuka. Isi tetap inert sampai gerbang selesai.
- Isi belakang gerbang juga visibility:hidden selama transisi agar tidak ada dua sampul yang terlihat bertumpuk. Nama penutup dipisah menjadi dua baris dalam ruang khusus di antara wayang.
- Musik memakai envelope volume yang sudah ada: fade in 2.8 detik dan fade out 1.4 detik. Tetap mengikuti lagu pilihan pengguna dan gesture pemutaran.
- Galeri memakai lightbox bersama dengan keyboard, fokus, Escape, dan dukungan buka ulang cepat. Navigasi/aksi minimal 44px; formulir memakai teks 16px dan radio 16px. Kartu informasi memakai kolom teks minmax(0,1fr).
- Terintegrasi dengan koleksi, halaman keluarga, preview penuh, pemilih desain, editor, draft preview, dan undangan publik. Paket memakai tingkat Heritage yang sudah ada: Sogan Rp135.000/16 foto, Kencana Rp155.000/20 foto, Nila Rp175.000/18 foto; paket lama tidak berubah.

## Aset imagegen

Menggunakan skill imagegen, mode built-in dengan transparent_background:true. Alpha asli dipertahankan; hasil diperiksa dan dikonversi menjadi WebP untuk proyek. Dua aset gambar total sekitar 582 KB, dibaca dari URL yang sama di setiap section agar cache dapat digunakan. Section di bawah sampul memakai lazy loading.

- public/art/pusaka/wayang.webp — wayang dekoratif berprofil kanan.
- public/art/pusaka/gunungan.webp — pohon, burung, dan gerbang dalam siluet gunungan.
- public/art/pusaka/batik.svg — pola geometris orisinal terinspirasi tekstil, dibuat native SVG; bukan hasil imagegen.

Prompt wayang (verbatim):

Use case: stylized-concept. Asset type: transparent decorative illustration for an elegant Javanese wedding invitation website. Create one exquisite original full-length Javanese wayang kulit puppet, graceful elongated profile facing RIGHT, finely pierced leather filigree, curved nose, slender articulated arms, towering ornate headdress, rich antique gold, deep oxblood and warm brown accents, intricate traditional costume with batik-inspired textile. Hand-painted archival illustration with fine ink outlines and gilded details, sophisticated and beautiful rather than cartoon. Single isolated puppet with both hands and long holding rod visible, ample margin around complete silhouette. Actual transparent background, no shadow backdrop, no lettering, no watermark, no frame. Do not depict a specifically named religious or epic character. The puppet will live along the edge of a wedding invitation so silhouette must be clear.

Prompt gunungan (verbatim):

Use case: stylized-concept. Asset type: transparent ornament for luxurious Javanese wedding invitation. One original exquisitely painted gunungan or kayon-shaped decorative tree-of-life silhouette, tall symmetrical pointed leaf or mountain outline, a branching banyan tree above an intricately carved wooden pendopo gate, pairs of tiny birds nestled in branches, winding leaves and fine pierced gilded filigree within the pointed silhouette. Antique burnished gold and warm sepia with subtle oxblood accents, hand-painted ornamental leather and meticulous fine ink lines, archival Indonesian craft illustration, beautiful sophisticated detailed heirloom artwork. Single entire complete isolated centered silhouette, ample padding, actual transparent background, no rectangular frame, no lettering, no watermark. Stylized cultural inspiration, not a copy of any existing sacred object or specific museum artifact.

## Verifikasi

Perintah pemeriksaan:

Seluruh pemeriksaan berikut lulus pada implementasi akhir. Browser mencakup 15 kombinasi variasi/viewport dan 9 kombinasi gerbang publik, serta pemilihan keluarga/variasi melalui wizard pembuatan. Build menghasilkan 170 modul; peringatan import Firebase statis/dinamis yang sudah ada tetap muncul.

- node tests/atelier.test.mjs — 27 full/lite renders, fallback keluarga, bingkai setiap section/placeholder, fade/pause/zero-volume/cleanup musik menggunakan fake Audio dan RAF.
- node tests/preview-layout.test.mjs — 135 preview section, geometri thumbnail, carousel click/swipe/keyboard/resize/reduced motion, cleanup timer, parse CSS.
- node tests/pusaka-browser.mjs — Chrome lokal: tiga variasi pada 320/390/430/768/1440px, kanvas desktop, bingkai dan aset semua section, entry/exit/idle, reduced motion dinamis, nama/copy panjang, fallback tanpa foto, galeri keyboard dan buka ulang, slide koleksi, editor, preview draft, dan gerbang publik.
- npm.cmd run build.

Screenshot browser disimpan di C:/Users/ulum/.codex/tmp/pusaka-review. Editor/public menggunakan auth dan Firebase mock hanya di konteks browser test; kode autentikasi produksi tidak diubah. Pengujian ini tidak membuktikan login nyata, penulisan RSVP ke cloud, perangkat fisik, atau kualitas audio yang didengar. Tidak melakukan commit/push/deploy.

Preview lokal: http://127.0.0.1:5173/templates/pusaka/preview/pusaka-sogan
