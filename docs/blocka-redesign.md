# Blocka — dunia blok untuk pernikahan

Keluarga baru terinspirasi geometri avatar dan lingkungan game Roblox. Ilustrasi dibuat khusus, tanpa logo Roblox atau aset game yang diambil dari pihak lain. Identitas visualnya memakai pulau melayang, platform bertingkat, pasangan avatar, balon kotak, cincin, kubus, dan awan. Semua section memperoleh scene independen dengan bingkai empat sudut serta arsitektur pada tepi kanvas, termasuk placeholder editor.

## Komposisi

- Sky Party: biru langit, portal blok, avatar di atas nama, panel lobby dengan bayangan ekstrusi.
- Sunshine: kuning matahari dan aksen aprikot, plakat nama bertumpuk, tanggal acara berupa strip tiket, album kartu.
- Cloud Dancer: putih mutiara dan biru kabut, nama di atas avatar yang bergeser ke kanan, frame atrium asimetris, panel kaca dengan bayangan halus.

Sampul mendukung foto pengguna, dengan avatar menjadi dekorasi di tepi foto. Tanpa foto, ilustrasi pasangan menjadi pusat sampul. Nama, tanggal, penerima, dan tombol tetap berada pada layer teks terpisah.

## Gerak

Ornamen masuk/keluar mengikuti section yang terlihat. Kubus dan pulau melayang, balon berayun, cincin berputar lembut, avatar bernapas, dan bintang berkedip. Konten reveal sekali; ornamen masuk lagi ketika tamu kembali ke section. Parallax dibatasi 24px. Idle berhenti saat offscreen atau tab tersembunyi; reduced motion menampilkan konten tanpa animasi. Runtime membersihkan observer, listener, dan RAF ketika pindah halaman. Gerbang membuka dua panel portal selama 1.1 detik dan menyembunyikan isi di belakangnya sampai selesai. Musik pilihan pengguna menggunakan fade in 2.2 detik dan fade out 1.4 detik, tanpa menambahkan lagu eksternal.

## Aset imagegen

Mode: built-in imagegen, transparent_background:true. Hasil diperiksa visual, alpha asli dipertahankan saat resize/konversi WebP. Dua file unik berjumlah 268.824 byte (sekitar 269 KB), dipakai ulang melalui cache.

- public/art/blocka/couple.webp — 900 × 822, 149.360 byte.
- public/art/blocka/island.webp — 1000 × 667, 119.464 byte.
- src/data/blocka-art.js — kubus, cincin, balon native SVG dan komposisi frame per section.

Prompt pasangan (verbatim):

Use case: stylized-concept. Asset type: transparent 3D character illustration for a wedding invitation inspired by Roblox blocky avatar games. Primary request: a charming bride and groom with unmistakably block-shaped Roblox-style bodies, rectangular limbs and simple happy faces, standing together holding hands on one small floating square white and sky-blue platform. Groom wears a cream suit with navy lapels and bow tie; bride wears a white wedding dress with squared skirt tiers and a short veil, holding a tiny block flower bouquet. Style: polished premium playful 3D game render, softly bevelled blocks, glossy subtle plastic and satin, tasteful wedding details, not realistic humans. Isometric three-quarter front camera, full bodies visible, wide compact composition. Soft warm studio light, blue and golden accents, crisp silhouettes. Actual transparent background including space around characters, no lettering, no watermark, no logos, no interface, no scenery, no rectangular backdrop. Keep the characters large, a single cohesive couple.

Prompt pulau (verbatim):

Use case: stylized-concept. Asset type: transparent ornamental floating wedding island for a Roblox-inspired block-world wedding invitation website. A lavish small isometric floating island built entirely from softly bevelled cubes and rectangular blocks: ivory ceremonial wedding portal with square columns and stepped golden arch, pale blue tiled platform with stairs, two small geometric topiary trees, cubic ivory blossoms and yellow buds, tiny angular lanterns, a few floating blue crystal cubes and squared clouds at the edges. Platform has a layered block underside, suspended in empty space. Clearly resembles polished Roblox game environment geometry, playful but sophisticated wedding celebration, smooth plastic and porcelain with golden satin details. Three-quarter isometric camera, entire island visible, low wide composition, rich readable forms, soft studio lighting, sky blue, ivory, apricot and sunflower gold palette. Actual transparent background and empty transparent gaps, no people, no text, no logo, no watermark, no UI, no full scene backdrop. A single coherent compact architectural ornament.

## Integrasi dan pemeriksaan

Katalog, halaman detail, preview section, preview penuh, wizard pemilihan, editor, draft preview, dan undangan publik memakai sumber keluarga/varian yang sama. Paket memakai tingkat Premium yang sudah ada: Sky Party Rp150.000/10 foto, Sunshine Rp170.000/12 foto, Cloud Dancer Rp185.000/14 foto.

Perintah validasi:

Hasil akhir: build lulus (176 module), 33 full/lite render dan envelope musik lulus, 165 preview section/carousel lulus. Browser utama lulus 15 kombinasi varian/viewport pada 320/390/430/768/1440px, termasuk seluruh frame section, idle/exit/reduced motion, nama panjang, galeri keyboard/buka ulang, slide katalog, wizard, editor, draft preview dan gerbang publik. Sembilan kasus tambahan memakai foto pengguna pada mobile dan desktop juga lulus. Tidak ada uncaught browser error. Hasil browser utama tersimpan di C:/Users/ulum/.codex/tmp/blocka-review/results.json.

- node tests/atelier.test.mjs
- node tests/preview-layout.test.mjs
- node tests/blocka-browser.mjs (Chrome lokal; Playwright test-only dapat berada di luar proyek)
- node tests/blocka-photo-browser.mjs
- npm.cmd run build

Skill web-perf dibaca untuk audit performa, tetapi Chrome DevTools MCP tidak tersedia. Mengikuti instruksi skill "If unavailable, STOP", audit tersebut tidak dijalankan. Tidak ada klaim hasil Core Web Vitals, Lighthouse, atau perangkat fisik. Build masih menampilkan peringatan pembagian chunk Firebase yang sudah ada.

Bukti browser: C:/Users/ulum/.codex/tmp/blocka-review. Auth/Firebase di editor dan public fixture memakai mock serta draft lokal. Maps memakai iframe placeholder agar pemeriksaan layout tidak bergantung pada jaringan layanan eksternal. Pengujian tidak membuktikan login nyata, penulisan cloud, perangkat fisik, atau musik yang didengar. Tidak melakukan commit/push/deploy.

Preview: http://127.0.0.1:5173/templates/blocka/preview/blocka-sky-party
