# Amora — taman romantis dan undangan editorial

Amora sekarang memakai komposisi khusus: ilustrasi taman berlapis, foto dalam
bingkai, tipografi serif miring, bunga cat air, jeda kutipan berwarna gelap,
tanggal acara pada kartu berbingkai, galeri foto tersusun, dan formulir yang
mempertahankan ruang baca. Data undangan, urutan bagian, serta pilihan musik
tetap berasal dari editor.

## Tiga suasana dalam satu keluarga

| Varian | Sampul dan potret | Acara dan galeri | Suasana |
| --- | --- | --- | --- |
| Garden | Potret lengkung dengan bingkai ganda dan bunga taman | Tanggal di sisi kartu; foto utama lengkung | Ivory, sage, taman pagi |
| Moonlit | Potret lingkaran, bulan sabit, bunga keperakan | Kartu acara lengkung dengan tanggal horizontal; bingkai foto gelap | Malam dengan cahaya lembut |
| Vintage Rose | Foto bergaya cetak, pita dan lapisan kertas | Kartu bergaris ganda; galeri cetak sedikit miring; kisah pada kertas | Kertas hangat dan mawar klasik |

## Komposisi dan runtime

- `styles/amora.css` menjadi sumber komposisi Amora. Aturan lama Amora di
  `templates.css` dan `atelier.css` dihapus agar tidak bertabrakan.
- Layout sampul `floralPortal` menyatukan foto, nama, tanggal, nama tamu, dan
  tombol pembuka. Foto kosong mendapat monogram dalam bingkai.
- Ornamen berada di layer dekoratif terpisah, tidak menangkap klik. Konten
  memiliki layer tersendiri agar bunga tidak menghalangi teks.
- Reveal saat scroll, bunga bergoyang, kelopak/sinar kecil, gerak burung, dan
  perpindahan latar terbatas aktif hanya ketika bagiannya berada di viewport.
  Animasi berhenti di luar layar dan ketika tab tersembunyi.
- `prefers-reduced-motion` menjaga konten tetap terlihat dan menonaktifkan
  gerak. Perubahan pengaturan saat halaman terbuka juga didukung.
- Lagu yang dipilih pengguna mulai setelah klik pembuka. Amora memakai fade
  in 2,2 detik dan fade out 0,8 detik saat dijeda. Tombol cepat jeda/putar
  membatalkan transisi sebelumnya. Tidak ada lagu eksternal tambahan.
- Halaman publik memakai sampul Amora sebagai pembuka, termasuk nama tamu
  dari `?to=`. Isi di belakang pembuka memakai `inert` sampai dibuka.
- Kartu informasi memakai pembungkus teks tersendiri sehingga paragraf tidak
  jatuh ke kolom ikon. Jumlah kolom mengikuti kanvas undangan, bukan lebar
  browser desktop yang membungkusnya. Perbaikan ini berlaku pada keluarga lain.
- Navigasi bawah tetap di dalam perangkat preview. Penanda bagian mengikuti
  bagian yang sudah dimasuki. Foto galeri mendukung keyboard, mengembalikan
  fokus, dan membatalkan timer penutup saat foto segera dibuka kembali.

## Aset asli

Dibuat dengan built-in **imagegen**, kemudian dikonversi ke WebP untuk pemakaian
web. Alpha bunga dipertahankan; ilustrasi tidak dipotong atau dimodifikasi.

| Aset proyek | Ukuran | Fungsi |
| --- | --- | --- |
| `public/art/amora/botanical-corner.webp` | 1024 × 1536, 424.028 byte | Bunga dan dedaunan transparan di bingkai dan tepi bagian |
| `public/art/amora/garden-pavilion.webp` | 1024 × 1536, 221.590 byte | Latar arsitektur taman cat air |

Referensi prinsip komposisi:
[Beranda Wedding](https://berandawedding.co.id/pdf-argi-dan-wigi?to=Ulum) dan
[Wevitation](https://www.wevitation.com/Rini&Lana/280EFEMQX).
Aset, kode, dan susunan persis kedua undangan tidak digunakan dalam proyek.

Prompt final untuk bunga:

```text
Create an ORIGINAL premium botanical watercolor illustration asset for an elegant Indonesian wedding invitation website named Amora. A single lush asymmetrical cascading corner bouquet: softly detailed ivory garden roses, pale dusty blush peonies and small cream blossoms, layered muted sage eucalyptus leaves, fine olive branches, a few slender trailing stems. Refined realistic hand-painted botanical watercolor, delicate translucent petal edges, natural paperless pigment detail, subdued warm romantic colors. Composition forms an L-shaped flourish rising from the lower left and trailing right, with large transparent negative space toward the upper right. All flower and leaf tips must fit within the canvas, no clipping. Genuinely transparent background, no white fill, no shadow rectangle, no text, no logos, no frame, no people. Portrait-ish arrangement suitable for rotating and layering as foreground corners on a 430px-wide mobile invitation. High visual detail, soft depth, not flat geometric flowers, not clipart, not oversaturated. Output one botanical ornament asset only.
```

Prompt final untuk latar:

```text
Create an ORIGINAL atmospheric botanical watercolor background for a premium romantic wedding invitation website, family Amora Garden. Portrait 1024x1536 composition. A quiet elegant Italian-inspired garden pavilion with very pale warm ivory stone archways and slender classical columns subtly visible at the far left and right, distant soft sage garden and misty sunlit trees, delicate climbing ivory and dusty blush roses near the outer edges. Refined painterly watercolor and soft gouache, muted naturally aged ivory parchment palette, hazy luminous morning light, subtle texture. Center 60 percent intentionally very pale, quiet, spacious, low contrast with almost no details, suitable for dark wedding text overlaid later. Most architectural detail and botanical depth along outer edges and lowest quarter, not a literal photograph, no people, no text, no typography, no watermarks, no ornamental border line, no copied design. Restrained romantic atmosphere with layered depth. High quality soft illustration, designed to blend into an ivory page background, no dark heavy areas.
```

## Meninjau dan menguji

Jalankan `npm.cmd run dev`, lalu buka:

- `/templates/amora/preview/amora-garden`
- `/templates/amora/preview/amora-moonlit`
- `/templates/amora/preview/amora-vintage-rose`

Pemeriksaan renderer, musik, dan carousel:

```powershell
node tests/atelier.test.mjs
node tests/preview-layout.test.mjs
npm.cmd run build
```

Pemeriksaan browser memakai Playwright dengan profil Chrome sementara. Bila
Playwright dipasang di luar proyek, arahkan `PLAYWRIGHT_MODULE_PATH` ke
`node_modules/playwright/index.mjs`. Browser Chrome harus tersedia; pilih
`PLAYWRIGHT_BROWSER_CHANNEL=bundled` untuk Chromium bawaan Playwright.

```powershell
$env:PLAYWRIGHT_MODULE_PATH='C:\path\to\node_modules\playwright\index.mjs'
node tests/amora-browser.mjs
```

Script menguji tiga varian pada lebar 320, 390, 430, 768, dan 1440 px, mode
desktop, nama dan teks panjang, foto kosong, motion/reduced motion, galeri,
slide katalog, editor, preview draft, serta pembuka halaman publik. Screenshot
dan `results.json` disimpan di direktori sementara `enveely-amora-review`
atau di `AMORA_SCREENSHOT_DIR`.

Pemeriksaan editor dan halaman publik menggunakan autentikasi serta backend
tiruan dan data draft lokal. Ini memeriksa UI dan perilaku renderer; bukan
bukti login Firebase, penyimpanan cloud, pembayaran, atau perangkat fisik.

Hasil verifikasi lokal (5 Oktober 2026): build Vite dan kedua tes renderer/
carousel/musik lolos. Tes browser Chrome lolos 15 kombinasi varian/viewport,
peralihan mode desktop, teks panjang/foto kosong, motion/reduced motion,
galeri keyboard/buka ulang cepat, slide katalog, serta editor/draft/pembuka
publik. Screenshot sampul, mempelai, acara, galeri, informasi, formulir, dan
penutup juga ditinjau secara visual. Belum dideploy.
