# Meadow — buku cerita pedesaan

## Audit dan rencana

Meadow sebelumnya hanya memakai dua ornamen SVG bersama, foto polaroid, dan animasi reveal generik. Serena, Botanica, dan Tempwed juga masih memakai dekorator lama; sesuai permintaan satu per satu, pengerjaan kali ini hanya merombak Meadow.

Identitas baru: buku cerita pedesaan dengan bingkai ranting/pakis/bunga liar, burung robin, lentera, pondok, kupu-kupu native SVG, dan tekstur linen. Empat aset imagegen dibuat khusus; ornamen berada pada layer section terpisah yang tidak ikut alur layout kartu. Semua section, termasuk placeholder kosong editor, memperoleh bingkai.

- Picnic: kanvas warna madu, foto postcard berlapis dengan tape, kartu catatan lipat, cerita seperti halaman buku dan galeri album kenangan.
- Garden: kanvas biru kabut, potret jendela paviliun, panel linen terang, potret dan galeri lengkung.
- Film: kanvas kopi gelap, lentera hangat, frame foto perforasi analog, panel arsip kertas gading, foto dengan sentuhan sepia.

## Motion dan keterbacaan

Ornamen masuk dan keluar mengikuti viewport; konten reveal sekali. Dedaunan bergerak lembut, lentera berayun dari tali, burung bernapas, sayap kupu-kupu mengepak dan kunang-kunang berpendar. Animasi idle berhenti saat offscreen dan tab tersembunyi. Parallax dibatasi 16px dan RAF dijadwalkan hanya saat scroll/resize. Reduced motion menampilkan semua konten tanpa animasi. Observer, event listener, dan RAF dibersihkan saat navigasi.

Gerbang seperti membuka halaman buku selama 1.25 detik; isi di belakangnya tetap tersembunyi dan inert hingga transisi selesai. Musik pilihan pengguna memakai fade in 3 detik dan fade out 1.7 detik, tanpa menambahkan lagu eksternal.

Panel teks cukup opak, kolom informasi memakai 30px minmax(0,1fr), input berukuran 16px, radio 16px dan tap target minimal 44px. Isi undangan lama dipertahankan, termasuk foto, nama, acara, dan data RSVP. Harga, ID varian, dan batas galeri tidak berubah.

## Aset imagegen

Mode: built-in imagegen dengan transparent_background:true. Keempat hasil diperiksa visual; alpha asli dipertahankan saat resize dan konversi WebP. Raster dekoratif dipakai ulang melalui cache, foto galeri tetap lazy. Hasil final berada di:

Total empat WebP: 632.896 byte (sekitar 633 KB). Sudut: 900 × 822; pondok: 1100 × 550; burung: 600 × 400; lentera: 450 × 675. Tidak ada background kotak pada ilustrasi.

- public/art/meadow/corner.webp
- public/art/meadow/cottage.webp
- public/art/meadow/bird.webp
- public/art/meadow/lantern.webp

Prompt corner (verbatim):

Use case: stylized-concept. Asset type: transparent corner ornament for a lavish rustic storybook wedding invitation. One richly detailed asymmetrical L-shaped woodland garland occupying the TOP and LEFT edges: intertwined slender old oak twigs, lush sage and slate-blue fern fronds, golden wheat, tiny ivory chamomile daisies with honey centers, small blue forget-me-not blossoms, seedpods and delicate winding stems. A warm elegant botanical engraving meets hand-painted watercolor storybook illustration, finely rendered natural texture, linen-and-paper wedding aesthetic, soft golden afternoon light. Broad horizontal upper branch, longer descending foliage at left; LOWER RIGHT three quarters remain empty transparent space for readable text. Entire artwork with outer padding, no cut-off leaves, single cohesive ornament. Actual transparent background including all open spaces between leaves. No text, no watermark, no rectangular frame, no birds, no buildings.

Prompt cottage (verbatim):

Use case: stylized-concept. Asset type: transparent lower-edge scenic ornament for a rustic storybook wedding website. A small charming countryside cottage with warm glowing amber windows, a slate blue pitched roof, aged cream stucco and timber details, an open weathered wooden fence, a curving stone path, clumps of fern and golden wheat, tiny ivory meadow wildflowers; rolling low meadow grass fades into transparent edges. A whimsical but sophisticated hand-painted watercolor and fine engraving, detailed luxury illustrated wedding stationery, warm dusk lantern glow, muted parchment, honey, dusty blue and natural olive accents. LOW WIDE landscape composition, all of cottage, roof and fence visible, a single cohesive delicate vignette suitable along bottom of a web invitation frame. Actual transparent background including sky and all space above the cottage, no solid rectangle, no lettering, no people, no watermark, no logo, no border.

Prompt bird (verbatim):

Use case: stylized-concept. Asset type: isolated transparent songbird ornament for an elegant rustic wedding invitation. One graceful small European robin in side profile facing RIGHT, copper orange breast, delicate slate-blue and warm grey wings, dark tiny eye, perched on a slender curved oak twig with a few cream chamomile flowers and wheat tips. Entire bird and twig visible with generous margin, compact wide composition. Fine hand-painted watercolor with detailed vintage botanical engraving contours, sophisticated storybook wedding stationery rather than cartoon or photo, warm soft daylight, natural feather detail. Actual transparent background including gaps among twigs. No text, no watermark, no frame, no landscape, no extra birds.

Prompt lantern (verbatim):

Use case: stylized-concept. Asset type: isolated transparent hanging-lantern illustration for ornate rustic wedding invitation borders. One exquisite small antique brass and weathered dark oak lantern, warm amber candle glowing behind glass panes, suspended from a thin long twine cord tied to a small cream linen ribbon bow at the top, two tiny fern sprigs and a few ivory wildflower buds around the bow. Elegant old-world countryside wedding detail, fine hand-painted watercolor and engraved ink texture, softly luminous glass, parchment honey brass slate-blue palette, realistic illustrative proportions, premium storybook stationery. TALL narrow composition, whole cord bow and lantern visible, outer margin. Actual transparent background around every detail, no scenery, no people, no border, no text, no watermark.

## Pemeriksaan

Perintah:

Browser utama lulus 15 kombinasi varian/viewport dan seluruh alur lanjutan tanpa uncaught error. 33 render full/lite, 165 preview section/carousel, serta envelope musik juga lulus. Aturan lama Meadow pada styles/templates.css dihapus agar sampul tidak lagi memiliki margin/rotasi seluruh kanvas dan label pojok "ENVEELY FILM". Caption tanggal pada foto merupakan konten yang dapat dibaca teknologi bantu, bukan ornamen aria-hidden.

Build final lulus dengan 179 module; peringatan pembagian chunk Firebase yang sudah ada tetap muncul. Pemeriksaan browser terakhir memastikan caption tanggal dan teks informasi tamu yang diperbarui tetap terbaca serta tidak overflow pada ketiga varian.

- node tests/atelier.test.mjs
- node tests/preview-layout.test.mjs
- node tests/meadow-browser.mjs
- npm.cmd run build

Browser Chrome lokal memeriksa tiga varian pada 320/390/430/768/1440px, desktop canvas, seluruh frame section dan aset, idle/entry/exit/reduced motion, nama dan copy panjang, fallback tanpa foto, galeri keyboard/buka ulang, slide katalog, wizard, editor/draft preview, dan gerbang publik.

Screenshot: C:/Users/ulum/.codex/tmp/meadow-review. Fixture editor/public memakai mock auth/Firebase dan draft lokal. Maps memakai iframe placeholder; hasil tidak membuktikan login nyata, penulisan cloud, layanan Maps langsung, perangkat fisik, atau musik yang didengar. Tidak melakukan commit/push/deploy.

Preview: http://127.0.0.1:5173/templates/meadow/preview/meadow-picnic
