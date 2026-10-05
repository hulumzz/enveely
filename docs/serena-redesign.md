# Serena — Prince & Princess

## Audit dan arah desain

Serena sebelumnya memakai cover nama bertumpuk, foto biasa, garis tipis dan ornamen SVG generik. Pengerjaan ini mengubah satu keluarga itu menjadi undangan kerajaan dengan istana, ukiran emas, mahkota, tirai sutra dan merpati. Keluarga lain tetap memakai identitas desainnya masing-masing.

Tiga komposisi:
- Royal Ivory (serena-paper): ivory dan champagne, foto medali oval, bingkai barok, kartu lengkung dan galeri istana.
- Sapphire Palace (serena-modern-white): biru sapphire dan emas, foto jendela istana diletakkan sebelum nama, frame arsitektural, cerita bersudut lengkung dan galeri dengan foto utama persegi.
- Peach Pearl (serena-ink): peach dan pearl, foto kartus dengan outline berlapis, panel salon sutra, chapter berpita dan galeri lengkung asimetris.

ID varian, harga, paket gratis 7 hari, dan batas galeri tetap. Konten undangan yang disimpan tetap digunakan oleh renderer.

## Implementasi

Setiap section, termasuk placeholder kosong di editor, mempunyai layer dekorasi mandiri: empat sudut berukir, dua tirai, istana, dua merpati, damask dan cahaya kecil. Ornamen berada di frame section, tidak ikut lebar/tinggi kartu. Teks dan formulir memakai panel opak; kolom informasi adalah 30px minmax(0,1fr), radio 16px, input 16px dan navigasi minimal 44px.

Motion section masuk/keluar mengikuti viewport. Tirai berayun, merpati menempuh dua jalur terbang berlawanan, cahaya berpendar, dan istana memakai parallax terbatas 16px. Reveal konten sekali; idle berhenti offscreen dan ketika tab tersembunyi. RAF hanya dijadwalkan scroll/resize/visibility, observer dan listener dibersihkan pada env:navigate. Reduced motion mematikan gerak dan menampilkan seluruh konten; perubahan preferensi saat halaman terbuka didukung.

Gerbang publik membuka tirai dan menerbangkan merpati ke atas selama 1,4 detik. Kanvas tidak dibesarkan selama transisi; isi di belakang gerbang tetap tersembunyi dan inert sampai gerbang dilepas. Musik yang dipilih pengguna memakai fade in 3,2 detik dan fade out 1,8 detik. Tidak menambahkan lagu eksternal.

Deskripsi dan thumbnail katalog, pemilih desain, landing, editor, full preview, dan gerbang publik menggunakan identitas Serena baru. CSS Serena lama yang memutar/membatasi foto dan memberi label cover dihapus secara terbatas. Tinggi minimum cover editor dipadatkan menjadi 680px agar tidak mengikuti tinggi layar desktop. Animasi isi tersembunyi di belakang gerbang berhenti sampai undangan dibuka.

## Aset imagegen

Mode: built-in imagegen, transparent_background:true. Empat ilustrasi diperiksa visual, alpha asli diperiksa dan dipertahankan saat crop/resize serta konversi WebP. Mahkota dan pola sederhana dibuat native SVG/CSS.

Total empat WebP: 384.246 byte (sekitar 384 KB), digunakan ulang melalui cache.

- public/art/serena/palace.webp — 1100 × 440, 181.286 byte
- public/art/serena/corner.webp — 700 × 665, 109.470 byte
- public/art/serena/curtain.webp — 600 × 570, 48.010 byte
- public/art/serena/dove.webp — 500 × 417, 45.480 byte

### Prompt palace (verbatim)

A bespoke luxury wedding stationery illustration, a symmetrical European fairy tale royal palace with ornate ivory limestone towers, champagne gold roof details, grand stairway and a low misty cloud base. Architectural watercolor and fine engraved linework, elegant mature regal style, no characters, no text, no logos, not Disney. A wide low silhouette, entire palace visible, isolated on transparent background with true alpha. Warm ivory and gold with subtle powder blue shadows. Designed as a bottom frame ornament for an invitation; no rectangular background.

### Prompt corner (verbatim)

A bespoke elaborate gilded Baroque corner ornament for a luxury Prince and Princess wedding invitation. Intricate gold acanthus scrolls, pearl strings, a small sapphire jewel, rococo sculptural carving. L-shaped top left corner, vertical and horizontal thin trailing filigree, open center reserved for text, fully visible ornament with generous transparent padding. Refined realistic engraved gold, no text, no logos, no background, true transparent alpha.

### Prompt curtain (verbatim)

A luxury royal wedding invitation ornament: one champagne ivory silk curtain draped from the upper left corner and tied at the left edge with a gold tassel, graceful long folds, subtly lustrous satin, a few strings of pearls and thin gold braid. Ornate theatrical palace atmosphere, mature sophisticated illustration. Isolated single asymmetric corner drapery on true transparent alpha background, center and right completely empty, no rectangular backdrop, no text.

### Prompt dove (verbatim)

An exquisitely detailed white dove flying to the right, wings raised in a graceful arc, ivory feathers shaded with pale blue and warm gold, carrying a tiny golden olive branch. Fine hand painted luxury wedding stationery illustration, realistic elegant anatomy, entire bird and wings visible, isolated centered on true transparent background, no shadow ground or backdrop, no text, no logos.

## Validasi

Pemeriksaan render/CSS telah lolos: 33 full/lite renders dan 165 section previews; thumbnail geometry; carousel click/swipe/keyboard/resize/reduced motion; cleanup timer editor; fade musik, pause setelah fade dan cleanup navigasi.

Pemeriksaan final:

- node tests/atelier.test.mjs — PASS, 33 full/lite renders, fallback keluarga, fade musik parsial/penuh, pause setelah fade, cleanup sumber audio dan RAF.
- node tests/preview-layout.test.mjs — PASS, 165 section previews, geometri thumbnail, interaksi carousel dan cleanup editor, parsing CSS (diulang setelah perubahan akhir).
- node tests/serena-browser.mjs — PASS, 15 kombinasi 3 varian × 320/390/430/768/1440px; mode desktop; semua frame 13 section isi; gambar termuat; entry/exit dan jalur merpati; pause offscreen; sinyal tab hidden sintetis; perubahan reduced motion; nama panjang dan paragraf tanpa spasi; fallback tanpa foto; keyboard galeri, reopen cepat dan batas lightbox; slide katalog di 390/1440; pemilih desain; editor; draft preview; gerbang publik 3 varian × 320/390/1440; tidak ada uncaught browser error. results.json di folder bukti.
- node tests/serena-editor-browser.mjs — PASS setelah pemadatan cover akhir, 9 kombinasi editor varian × 320/390/1440px dan 3 kasus pause isi tersembunyi/resume setelah gerbang dibuka; tidak ada browser error.
- npm.cmd run build — PASS setelah perubahan akhir, 182 modules. Peringatan Vite tentang modul Firebase/Firestore yang diimpor statis dan dinamis tetap ada.
- git diff --check — tidak ada whitespace error.

Playwright memakai Chrome lokal dan instalasi test-only di C:/Users/ulum/.codex/tmp/amora-browser/node_modules/playwright/index.mjs. Bukti visual tersimpan di C:/Users/ulum/.codex/tmp/serena-review, termasuk editor-desktop-final.png. Auth, Firebase dan Maps pada alur editor/publik memakai fixture lokal; tidak membuktikan login atau publikasi produksi maupun pengujian perangkat fisik. Tidak commit, push, atau deploy.
