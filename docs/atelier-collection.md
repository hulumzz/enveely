# Koleksi undangan Atelier

Delapan keluarga, masing-masing tiga variasi. Renderer yang sama digunakan oleh galeri, preview, builder, dan undangan publik. Ornamen SVG lokal bersifat dekoratif, tidak menerima klik, dan disembunyikan dari pembaca layar.

| Keluarga | Komposisi utama | Perbedaan variasi |
| --- | --- | --- |
| Amora | Potret lengkung, mawar berlapis, kartu acara berkubah | Garden: taman terang; Moonlit: potret bulat dan bulan; Vintage Rose: foto kertas miring dan garis ganda |
| Elysian | Editorial asimetris, huruf besar, garis tipis | Ivory: potret di sisi kanan; Noir: foto memenuhi latar; Champagne: potret lengkung simetris |
| Serena | Seni kertas, garis oval, ruang tenang | Paper: bingkai kertas; Modern White: foto lanskap lengkung; Ink: potret monokrom dan teks rata kiri |
| Lumiere | Sampul sinematik, bab panorama, galeri foto | Gallery: contact sheet; Film: perforasi dan galeri horizontal; Clean: panel judul terang |
| Nusantara | Geometri paviliun, bingkai ukir, bidang warna pekat | Sagara: arsitektur persegi; Puspa: medali bulat; Terra: lengkung tanah dan lapisan kartu |
| Meadow | Herbarium, bunga kecil, scrapbook | Picnic: polaroid miring; Garden: potret lengkung dan cerita lurus; Film: cetak analog sepia |
| Botanica | Kebun dengan burung, potret tinggi, panel surat | Dusty Rose: collage; Mauve Intimate: oval dan galeri tunggal; Blush Cream: lengkung ganda |
| Tempwed | Paviliun floral, bingkai potret berlapis | Classic: medali lengkung; Golden Hour: medali bulat miring; Midnight Garden: potret tinggi dan cahaya lembut |

Motion memakai IntersectionObserver, reveal sekali per elemen, stagger terbatas, dan ayunan SVG lambat. Konten tetap terlihat tanpa inisialisasi motion. Pengaturan reduced motion mematikan animasi.

Musik menggunakan lagu yang diatur pemilik undangan. Tidak menambahkan lagu demo atau mengganti lagu pengguna. Fade in 1,8 detik, fade out sebelum jeda 0,65 detik. Mulai setelah tombol buka/putar ditekan. Navigasi dan tab tersembunyi menghentikan audio langsung untuk menghindari suara tertinggal. Volume nol dipertahankan. Tidak ada crossfade antarlagu atau sambungan loop.

Validasi: `node tests/atelier.test.mjs`, `npm.cmd run build`, `git diff --check`. Tes audio menggunakan mock, bukan perangkat audio fisik. Pemeriksaan visual dan responsivitas browser masih perlu dilakukan karena provider browser tidak tersedia pada sesi implementasi.
