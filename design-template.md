# DESIGN TEMPLATE — Romantic Botanical Wedding Invitation

> **Design reference:** `https://by.ringvitation.com/ayu-odiq/?untuk=Siti%20Nuroh`
>
> Dokumen ini adalah spesifikasi **desain, layout, visual system, interaction, dan motion** untuk dijadikan inspirasi template undangan digital pada platform yang sudah ada. Dokumen ini **tidak membahas stack, framework, database, API, schema data, deployment, atau arsitektur aplikasi**.

---

## 1. Tujuan Desain

Buat sebuah template undangan digital pernikahan dengan karakter:

- romantis, elegan, lembut, dan personal;
- dominan nuansa **botanical watercolor** berwarna dusty rose / mauve;
- menempatkan foto pasangan sebagai elemen emosional utama, bukan sekadar dekorasi;
- memiliki alur vertikal yang terasa seperti membuka kartu undangan premium satu bagian demi satu bagian;
- tetap ringan secara visual meskipun memiliki banyak section;
- mobile-first, dengan komposisi sangat terkontrol pada layar ponsel;
- setiap section memiliki ruang napas yang cukup dan tidak terasa seperti kumpulan card dashboard;
- dekorasi floral bersifat organik dan sebagian keluar dari batas section agar tampilan tidak terlalu kaku;
- gerakan halus, lambat, dan elegan. Hindari motion yang terlalu agresif, spring berlebihan, bounce besar, atau efek yang terasa seperti template presentasi.

Template ini harus terasa seperti **undangan cetak premium yang dihidupkan menjadi halaman digital**.

---

# 2. Arah Visual Utama

## 2.1 Mood

Kata kunci visual:

`romantic` · `botanical` · `watercolor` · `dusty rose` · `soft luxury` · `intimate` · `editorial wedding` · `Javanese elegant` · `warm` · `personal`

Nuansa keseluruhan harus lebih dekat ke editorial wedding invitation daripada landing page SaaS.

Hindari:

- glassmorphism berlebihan;
- neon;
- gradient modern ala aplikasi AI;
- shadow tebal;
- card dengan border tajam di setiap section;
- icon berwarna-warni;
- dekorasi geometris modern yang tidak menyatu dengan botanical theme;
- terlalu banyak rounded card;
- elemen UI yang terlihat seperti dashboard/admin panel.

---

# 3. Color System

Gunakan palet lembut dan desaturated.

## 3.1 Warna utama

| Role | Warna referensi | Penggunaan |
|---|---|---|
| Canvas / Ivory | `#F7F2ED` | background utama |
| Warm Cream | `#EFE5DD` | section alternatif / card lembut |
| Dusty Rose | `#B97882` | aksen floral, tombol, divider |
| Muted Mauve | `#875C69` | heading sekunder / ornamen |
| Deep Burgundy | `#5F303D` | judul penting / button dark |
| Soft Blush | `#D5A2A9` | highlight dekoratif |
| Lavender Grey | `#AEB3C6` | detail berry / secondary accent |
| Charcoal Brown | `#382E2E` | body text |
| White | `#FFFFFF` | teks pada button / card tertentu |

Warna tidak perlu identik 1:1 dengan referensi, tetapi harus mempertahankan temperatur hangat dan muted.

## 3.2 Aturan warna

- Background utama jangan putih murni.
- Teks body gunakan charcoal hangat, bukan `#000000`.
- Burgundy digunakan hemat sebagai anchor visual.
- Dusty rose menjadi aksen paling dominan.
- Warna bunga dapat mempunyai beberapa variasi opacity agar tampak seperti watercolor asli.
- Jangan membuat semua section berbeda warna. Pertahankan kontinuitas canvas.

---

# 4. Botanical Decoration System

Elemen dekoratif utama adalah ranting watercolor dengan daun merah muda/mauve dan berry kecil warna biru-lavender.

## 4.1 Karakter ilustrasi

- bentuk organik;
- ujung ranting tipis;
- daun memanjang dan sedikit transparan;
- tekstur watercolor terlihat;
- warna tiap daun tidak seragam;
- berry kecil digunakan sebagai aksen;
- background ilustrasi transparan;
- tidak mempunyai outline keras.

## 4.2 Penempatan

Dekorasi tidak boleh hanya menjadi gambar kecil di tengah. Gunakan sebagai framing:

- pojok kiri atas;
- pojok kanan atas dengan versi mirror;
- sisi kiri atau kanan section;
- sebagian keluar dari viewport/container;
- dapat overlap tipis dengan frame foto;
- dapat muncul ulang dalam skala berbeda untuk menjaga kontinuitas desain.

Jangan membuat setiap section mempunyai dua bunga simetris identik. Variasikan komposisi agar organik.

## 4.3 Skala

Pada mobile:

- botanical corner besar: sekitar 120–190 px;
- botanical secondary: 70–130 px;
- decorative sprig kecil: 40–80 px.

Gunakan opacity sekitar 0.75–1 tergantung posisi.

---

# 5. Typography System

Template menggunakan hierarki tipografi editorial dan romantis.

Tidak perlu meniru font tertentu secara literal. Pertahankan role berikut.

## 5.1 Display / Couple Names

Karakter:

- serif elegan atau calligraphic serif;
- stroke kontras;
- terasa seperti wedding stationery;
- bukan script yang terlalu sulit dibaca.

Ukuran mobile:

- nama pasangan pada cover: 44–64 px;
- nama pasangan pada hero/closing: 36–52 px.

Line-height rapat: `0.95–1.08`.

## 5.2 Section Display

Contoh role:

- `Wedding Event`
- `Gallery`
- `Wedding Gift`
- `Friends Wishes`

Karakter:

- serif editorial;
- 28–42 px;
- bisa dikombinasikan antara kata kecil dan kata besar.

## 5.3 Kicker / Eyebrow

Contoh:

- `The Wedding Of`
- `SAVE THE DATE`
- `Kepada Yth.`

Ukuran sekitar 11–15 px.

Gunakan letter spacing `0.08em–0.18em` untuk teks uppercase kecil.

## 5.4 Body

- 13–16 px pada mobile;
- line-height 1.6–1.8;
- berat regular;
- maksimal lebar teks sekitar 300–360 px agar tetap nyaman dibaca.

## 5.5 Numeral Date

Tanggal besar harus menjadi elemen desain.

- angka hari: 42–64 px;
- bulan dan tahun: 13–20 px;
- gunakan serif display yang konsisten dengan heading.

---

# 6. Global Layout

## 6.1 Canvas

Halaman berupa satu vertical scroll panjang.

Target utama:

- viewport mobile 360–430 px;
- desain tetap baik hingga layar ponsel besar;
- pada desktop, konten utama tetap terasa seperti invitation canvas dan tidak melebar seperti website corporate.

Rekomendasi visual:

- content canvas sekitar 430–560 px;
- center-aligned pada desktop;
- dekorasi dapat melewati batas content canvas;
- foto tertentu boleh full-bleed di dalam invitation canvas.

## 6.2 Horizontal Padding

Mobile:

- standard: 24 px;
- section dengan card: 20–24 px;
- teks sempit/editorial: 30–42 px.

## 6.3 Vertical Rhythm

Jangan menggunakan spacing kecil seperti dashboard.

Gunakan:

- antar block: 20–36 px;
- antar subsection: 40–64 px;
- antar section besar: 80–120 px.

Section yang emosional seperti quote dan closing boleh memiliki whitespace lebih besar.

---

# 7. Overall Page Flow

Urutan visual yang harus dipertahankan:

1. Locked Invitation Cover
2. Main Wedding Hero / Save The Date
3. Countdown
4. Religious / Romantic Quote
5. Couple Photography Showcase
6. Groom & Bride Introduction
7. Wedding Event
8. Gallery
9. RSVP / Attendance Confirmation
10. Wedding Gift
11. Friends Wishes
12. Closing Message
13. Footer
14. Persistent Bottom Navigation
15. Floating Music Control
16. Optional QR Invitation / Guest Check-in Overlay

Bagian tertentu dapat dinonaktifkan berdasarkan isi template, tetapi urutan inti tidak diubah sembarangan.

---

# 8. SECTION 01 — Locked Invitation Cover

## 8.1 Purpose

Cover adalah layar pertama sebelum pengguna masuk ke undangan.

Harus terasa seperti sampul undangan, bukan hero biasa.

Selama cover belum dibuka:

- halaman utama berada di belakang cover;
- scrolling halaman utama tidak menjadi fokus;
- musik belum dimainkan secara aktif;
- CTA utama hanya `Buka Undangan`.

## 8.2 Composition

Struktur vertikal:

1. decorative botanical corner;
2. small kicker `The Wedding Of`;
3. nama mempelai pertama;
4. ampersand `&`;
5. nama mempelai kedua;
6. guest greeting;
7. nama tamu personalized;
8. `Buka Undangan` button;
9. tanggal pernikahan sebagai metadata kecil.

Semua konten dominan center-aligned.

## 8.3 Guest Personalization

Area nama tamu dibuat sebagai elemen penting.

Urutan visual:

`Kepada Yth.`

`Bapak/Ibu/Saudara/i`

**Nama Tamu**

Nama tamu memiliki weight lebih kuat daripada dua baris di atasnya.

Jangan membuat nama tamu tampak seperti input field.

## 8.4 Cover Button

Button:

- compact;
- rounded pill atau soft rounded;
- warna deep burgundy / muted rose;
- teks putih/ivory;
- icon envelope dapat digunakan secara subtle;
- tidak terlalu besar.

Suggested size:

- height 42–48 px;
- horizontal padding 22–28 px;
- radius 999 px atau 18–24 px.

## 8.5 Cover Background

Gunakan salah satu pendekatan:

- foto pasangan dengan overlay warm translucent;
- ivory background dengan botanical framing dan foto embedded;
- foto full-cover dengan botanical foreground.

Visual tetap harus memungkinkan nama pasangan sangat terbaca.

---

# 9. COVER OPENING MOTION

> **Catatan:** struktur dan behavior pembukaan undangan dapat diamati dari halaman. Nilai durasi/easing di bawah adalah reconstruction spec untuk menghasilkan feel yang sama, bukan klaim nilai CSS asli situs referensi.

## 9.1 Initial Reveal

Saat halaman pertama muncul:

- botanical: opacity `0 → 1`, scale `0.96 → 1`;
- kicker: fade-up;
- nama pasangan: fade-up dengan stagger;
- guest block: fade-up setelah nama;
- open button: fade-up paling akhir.

Suggested timing:

- duration 600–850 ms;
- stagger 80–140 ms;
- easing `cubic-bezier(0.22, 1, 0.36, 1)`.

## 9.2 Idle Motion

Open button boleh mempunyai pulse yang sangat subtle:

- scale `1 → 1.025 → 1`;
- durasi 2.6–3.4 detik;
- infinite;
- tanpa glow mencolok.

Botanical boleh memiliki floating motion sangat kecil:

- translateY maksimal 4–6 px;
- rotate maksimal 0.5–1 deg;
- durasi 7–12 detik.

## 9.3 On Open Invitation

Saat tombol ditekan:

1. button melakukan micro-press `scale 1 → 0.97 → 1`;
2. konten cover sedikit fade;
3. cover bergerak ke atas atau dissolve keluar;
4. main hero di bawahnya menjadi terlihat;
5. scrolling diaktifkan;
6. music masuk dengan volume fade-in;
7. bottom navigation muncul setelah hero mulai terlihat.

Motion target:

- cover exit: 650–900 ms;
- translateY sekitar `0 → -8%` bersamaan opacity `1 → 0`, lalu cover dilepas;
- hero opacity `0 → 1` dengan delay kecil;
- tidak menggunakan hard cut.

---

# 10. SECTION 02 — Main Wedding Hero / Save The Date

## 10.1 Function

Setelah cover terbuka, pengguna langsung mendapatkan ringkasan acara:

- nama pasangan;
- bulan;
- tanggal besar;
- tahun;
- save-the-date;
- countdown.

## 10.2 Hero Composition

Komposisi sebaiknya seperti editorial poster.

Recommended layout:

- background foto atau framed photo;
- botanical overlap pada beberapa corner;
- `The Wedding Of` kecil di bagian atas;
- nama pasangan sebagai focal point;
- date block di bawah nama;
- countdown berada dalam kelompok tersendiri.

## 10.3 Date Treatment

Gunakan tiga level:

`November`

**07**

`2025`

Angka tanggal paling dominan.

Bulan dan tahun dapat ditempatkan horizontal atau vertikal mengapit angka.

## 10.4 Save The Date

Tulisan `SAVE THE DATE` berupa uppercase kecil dengan tracking lebar.

Jangan menggunakan badge modern.

---

# 11. HERO MOTION

## 11.1 Photo Motion

Gunakan slow Ken Burns:

- scale `1.02 → 1.07`;
- optional translate 0–1.5%;
- 10–16 detik;
- ease-in-out;
- alternate atau reset sangat halus.

Jangan sampai wajah pasangan bergerak keluar focal area.

## 11.2 Text Reveal

Urutan:

1. kicker;
2. nama pasangan;
3. date;
4. `SAVE THE DATE`;
5. countdown.

Gunakan fade-up 16–28 px dengan stagger.

## 11.3 Botanical Motion

Botanical foreground boleh menggunakan parallax rendah saat scrolling:

- maksimal 8–16 px relatif terhadap scroll;
- jangan sampai terasa seperti parallax landing page modern.

---

# 12. SECTION 03 — Countdown

Countdown terdiri dari empat unit:

- Days
- Hours
- Minutes
- Seconds

## 12.1 Layout

Gunakan 4 kolom equal width.

Setiap unit:

- angka besar;
- label kecil di bawah;
- separator sangat minimal atau tanpa card sama sekali.

Hindari empat kotak besar seperti dashboard statistik.

## 12.2 Styling

Recommended:

- angka 26–36 px;
- label 9–12 px uppercase/small serif;
- divider berupa garis 1 px atau spacing.

## 12.3 Number Change Motion

Saat nilai berubah:

- angka lama slide 3–6 px ke atas + fade;
- angka baru muncul dari bawah;
- duration 180–260 ms.

Jangan membuat seluruh countdown berkedip setiap detik.

---

# 13. SECTION 04 — Quote / Sacred Verse

Referensi menampilkan kutipan religius setelah save-the-date.

## 13.1 Composition

- center aligned;
- maksimal width 310–350 px;
- banyak whitespace;
- decorative botanical ringan;
- citation/source lebih kecil di bawah quote.

## 13.2 Typography

Quote:

- 14–18 px;
- serif atau body serif;
- line-height 1.7–1.9.

Citation:

- 11–13 px;
- muted;
- diberi margin-top 14–20 px.

## 13.3 Motion

Saat masuk viewport:

- quote fade-up 20 px;
- citation muncul 100–160 ms sesudahnya;
- botanical hanya fade/scale ringan.

---

# 14. SECTION 05 — Couple Photography Showcase

Referensi menggunakan sejumlah foto prewedding pasangan sebagai bagian besar dari pengalaman visual.

Foto memiliki nuansa studio tradisional/elegan dengan background netral dan circular spotlight.

## 14.1 Photo Treatment

- jangan menambahkan filter berat;
- pertahankan skin tone natural;
- object-fit cover;
- focal point wajah harus aman;
- gunakan radius kecil–medium, bukan radius ekstrem;
- beberapa foto boleh edge-to-edge.

## 14.2 Layout Pattern

Gunakan kombinasi:

- satu foto portrait besar;
- dua foto kecil berdampingan;
- collage 2 kolom;
- sesekali satu foto full width.

Jangan membuat 6 foto menjadi grid seragam 3x2 seperti gallery e-commerce.

## 14.3 Spacing

Gap antar foto 8–14 px.

Jika menggunakan collage asymmetric, jaga baseline agar tetap rapi.

## 14.4 Scroll Reveal

Setiap image tile:

- opacity `0 → 1`;
- scale `0.96 → 1`;
- translateY 16–24 px;
- stagger 70–120 ms.

Tidak menggunakan flip atau 3D rotate.

---

# 15. SECTION 06 — Bride & Groom Introduction

Referensi menampilkan dua profil mempelai secara vertikal dengan foto masing-masing.

## 15.1 Overall Pattern

Groom block

`-&-` / ampersand decorative separator

Bride block

Pada mobile, gunakan vertical flow agar tiap profil memiliki ruang cukup.

## 15.2 Profile Structure

Setiap profil:

1. portrait/photo;
2. short name / nickname besar;
3. full name;
4. city/origin atau metadata pendek;
5. urutan anak;
6. nama orang tua.

## 15.3 Portrait Styling

- portrait ratio sekitar 3:4 atau 4:5;
- dapat menggunakan organic frame atau clean portrait crop;
- botanical boleh overlap di corner frame;
- jangan membuat foto berada di dalam card berat.

## 15.4 Name Hierarchy

Nickname menjadi display name.

Full name berada di bawah dengan ukuran lebih kecil.

Parent information lebih kecil dan muted tetapi tetap terbaca.

## 15.5 Motion

Profile pertama:

- foto fade-right atau fade-up;
- teks fade-up 100 ms setelah foto.

Profile kedua:

- foto fade-left atau fade-up;
- teks fade-up.

Jika menggunakan horizontal directional reveal, pergerakan maksimal 20–28 px.

---

# 16. SECTION 07 — Wedding Event

Referensi memiliki heading dua tingkat:

`Wedding`

**Event**

Lalu dua event:

- Akad
- Resepsi

## 16.1 Section Header

Gunakan decorative composition, bukan card title biasa.

- kata kecil serif/script;
- kata besar serif display;
- botanical di belakang/samping.

## 16.2 Event Block

Setiap event berisi:

- event title;
- day name;
- month;
- date numeral;
- year;
- time;
- venue/address;
- Google Maps CTA.

## 16.3 Date Card Composition

Tanggal adalah focal element.

Contoh pattern:

```
Jumat
November   07   2025
```

atau

```
Jumat
November
07
2025
```

Gunakan besar-kecil tipografi untuk menciptakan rhythm.

## 16.4 Event Separation

Jika dua event berada dalam satu section:

- beri gap 54–80 px;
- gunakan botanical/divider halus;
- jangan menggunakan dua card identik dengan shadow tebal.

## 16.5 Google Maps Button

Style:

- small rounded button;
- muted rose/deep burgundy;
- white text;
- location pin icon kecil;
- uppercase kecil opsional.

## 16.6 Event Motion

Saat section title masuk:

- heading fade-up;
- botanical scale/fade.

Setiap event:

- date block fade-up;
- time dan location menyusul;
- maps button terakhir.

Stagger 80–120 ms.

---

# 17. SECTION 08 — Gallery

Gallery harus terasa seperti album pernikahan, bukan asset manager.

## 17.1 Heading

Satu kata `Gallery` dapat dibuat sebagai display serif besar dengan botanical framing.

## 17.2 Grid

Gunakan masonry-like editorial layout.

Recommended mobile arrangement:

- row 1: 1 wide image;
- row 2: 2 equal images;
- row 3: 1 portrait + 1 stacked/square;
- row 4: 1 wide image.

Jumlah item menyesuaikan foto yang tersedia.

## 17.3 Image Radius

Radius 4–14 px.

Boleh beberapa gambar tanpa radius untuk memberi variasi editorial.

## 17.4 Gallery Tap Interaction

Saat foto disentuh:

- buka lightbox full viewport;
- background dark translucent;
- image scale dari `0.96 → 1`;
- opacity `0 → 1`;
- swipe next/previous jika lebih dari satu foto;
- close button kecil di upper corner;
- jangan menambahkan panel besar.

## 17.5 Gallery Scroll Animation

Setiap tile reveal dengan stagger.

Jika masonry panjang, trigger animation hanya sekali ketika pertama masuk viewport.

---

# 18. SECTION 09 — RSVP / Konfirmasi Kehadiran

Referensi menggunakan heading `Konfirmasi Kehadiran` dan penjelasan singkat.

## 18.1 Form Visual

Form harus menyatu dengan invitation theme.

Fields:

- Nama;
- Konfirmasi kehadiran;
- Jumlah hadir;
- submit.

## 18.2 Field Style

- background semi-white/cream;
- border 1 px mauve/blush dengan opacity rendah;
- radius 10–16 px;
- height 44–50 px;
- label kecil;
- focus state berupa border dusty rose, tanpa neon ring.

## 18.3 Section Container

RSVP boleh berada pada soft panel berwarna warm cream.

Jika memakai card:

- shadow sangat ringan;
- border optional;
- radius maksimal 20–24 px.

## 18.4 Submit Button

- full or near-full width;
- deep burgundy;
- ivory text;
- height 46–50 px;
- soft radius;
- typography elegan tetapi tetap jelas.

## 18.5 Form Motion

Saat section masuk:

- header fade-up;
- description fade-up;
- fields stagger 60–90 ms;
- button terakhir.

Interaction:

- press scale `0.985`;
- loading state tidak boleh menggeser layout;
- success feedback muncul sebagai small inline confirmation, bukan alert browser.

---

# 19. SECTION 10 — Wedding Gift

Referensi mendukung:

- rekening bank;
- e-wallet;
- alamat hadiah fisik;
- tombol copy;
- CTA kirim hadiah.

## 19.1 Intro

Heading `Wedding Gift` lalu satu paragraf singkat tentang pemberian hadiah.

Gunakan text width sempit dan center alignment.

## 19.2 Account Card

Setiap account item berisi:

1. nama bank/e-wallet;
2. pemilik;
3. nomor;
4. `Salin Rekening`.

Visual:

- clean;
- cream/white panel;
- border thin blush;
- subtle decorative botanical detail;
- angka rekening memakai tracking ringan agar mudah dibaca.

## 19.3 Copy Interaction

Saat tombol copy ditekan:

- icon berubah dari copy → check;
- label menjadi `Tersalin`;
- feedback 1–1.5 detik;
- lalu kembali normal.

Motion 150–220 ms.

Tidak menggunakan toast besar di tengah layar.

## 19.4 Gift Address

Jika alamat fisik tersedia:

- buat sebagai card terpisah;
- icon gift/location kecil;
- `Salin Alamat` CTA;
- teks address left-aligned agar lebih mudah dibaca.

---

# 20. SECTION 11 — Friends Wishes

Referensi memiliki area wishes/comments dan daftar ucapan tamu.

## 20.1 Heading

`Friends Wishes`

Gunakan serif display 28–36 px.

## 20.2 Input Area

Visual input tetap konsisten dengan RSVP.

Jika form memiliki:

- nama;
- email/identifier;
- message;

beri spacing 12–16 px.

## 20.3 Wishes List

Setiap wish item:

- nama pengirim;
- pesan;
- optional timestamp;
- separator tipis.

Jangan membuat bubble chat ala WhatsApp.

Lebih tepat berupa editorial comment list.

## 20.4 Load More

`Muat Lebih Banyak` sebagai secondary button:

- outline dusty rose;
- transparent/cream background;
- compact.

## 20.5 Wishes Animation

Saat list masuk viewport:

- first 3 items fade-up stagger;
- item hasil load-more masuk dengan fade + height expansion;
- hindari layout jump.

---

# 21. SECTION 12 — Closing

Closing harus mengembalikan fokus pada pasangan.

## 21.1 Content

Struktur:

1. ucapan terima kasih / kehormatan;
2. small label `The Wedding of`;
3. nama pasangan besar;
4. optional floral decoration;
5. optional final portrait/background.

## 21.2 Composition

Center aligned.

Gunakan whitespace besar di atas dan bawah.

Nama pasangan menjadi visual penutup, bukan footer teknis.

## 21.3 Motion

- paragraph fade-up;
- label fade-up;
- names fade + slight scale `0.98 → 1`;
- botanical masuk paling akhir.

---

# 22. Footer

Footer harus sangat kecil dan tidak mengambil fokus.

- teks copyright / platform credit;
- warna muted;
- ukuran 10–12 px;
- padding-bottom ditambah agar tidak tertutup bottom navigation.

Jangan membuat footer seperti website corporate dengan banyak link.

---

# 23. Persistent Bottom Navigation

Referensi memiliki bottom navigation untuk shortcut section utama:

- Cover
- Couple
- Event
- Gallery
- Wishes

## 23.1 Position

- fixed di bawah viewport;
- center;
- tidak full-width edge-to-edge jika tidak diperlukan;
- beri safe-area bottom padding.

## 23.2 Shape

Recommended:

- floating pill / rounded rectangle;
- translucent ivory atau warm white;
- very subtle shadow;
- 5 equal navigation items.

## 23.3 Item

Setiap item:

- icon kecil;
- label 9–11 px;
- muted default state;
- active state deep burgundy/dusty rose.

## 23.4 Active State Motion

Saat section berubah:

- icon opacity/scale transition 160–220 ms;
- active label sedikit lebih kuat;
- optional small dot/pill bergerak ke item aktif.

Hindari bounce besar.

## 23.5 Navigation Behavior

Saat item ditekan:

- smooth scroll menuju section;
- offset memperhitungkan navigation;
- active state mengikuti section yang paling dominan di viewport.

---

# 24. Floating Music Control

Template referensi mendukung wedding backsound.

## 24.1 Placement

- floating di salah satu corner;
- jangan menutupi bottom nav;
- diameter sekitar 36–44 px.

## 24.2 Visual

- circular button;
- muted rose/burgundy;
- icon music/disc putih;
- subtle shadow.

## 24.3 Motion

Saat musik aktif:

- icon/disc rotate sangat lambat;
- 5–8 detik per rotation;
- linear infinite.

Saat pause:

- rotation berhenti;
- opacity sedikit berkurang.

## 24.4 Audio Entry

Musik baru dimulai setelah user interaction pada `Buka Undangan`.

Volume sebaiknya fade-in selama 600–1000 ms agar tidak terasa mengejutkan.

---

# 25. Optional Guest QR / Check-in Overlay

Referensi memiliki tampilan QR undangan yang memuat:

- couple name;
- wedding date;
- QR code;
- instruksi penggunaan QR saat check-in.

## 25.1 Overlay Design

Jika fitur aktif:

- full-screen modal atau bottom sheet tinggi;
- background ivory;
- botanical corner;
- QR berada pada white card bersih;
- couple names di atas;
- instruksi ringkas di bawah.

## 25.2 Motion

Open:

- backdrop fade 200 ms;
- panel scale `0.97 → 1` + fade 280–360 ms.

Close:

- reverse tanpa bounce.

---

# 26. Global Scroll Animation System

Animasi harus konsisten. Jangan memberikan animation style berbeda ke setiap widget.

Gunakan empat primitive saja:

### A. Fade Up

Untuk:

- heading;
- text;
- button;
- form.

Suggested:

- opacity `0 → 1`;
- translateY `20–28 px → 0`;
- duration 600–760 ms.

### B. Soft Scale In

Untuk:

- foto;
- botanical;
- modal.

Suggested:

- opacity `0 → 1`;
- scale `0.95–0.98 → 1`;
- duration 650–850 ms.

### C. Directional Fade

Hanya untuk beberapa couple portrait / decorative pair.

- translateX maksimal 20–28 px;
- tidak lebih dari itu.

### D. Stagger Reveal

Untuk:

- gallery;
- form field;
- countdown;
- detail event.

Stagger 60–120 ms.

---

# 27. Animation Easing Language

Dominant easing:

`cubic-bezier(0.22, 1, 0.36, 1)`

Alternatif untuk simple opacity:

`ease-out`

Hindari:

- elastic;
- bounce;
- overshoot besar;
- fast spring;
- rotation masuk 180°;
- flip card;
- zoom ekstrem.

Motion harus terasa seperti halaman undangan yang perlahan terbuka.

---

# 28. Viewport Trigger Rules

- animation trigger ketika sekitar 15–25% elemen mulai masuk viewport;
- animation hanya dijalankan sekali untuk content utama;
- bottom navigation active state boleh terus berubah sesuai scroll;
- decorative parallax dapat aktif terus tetapi sangat subtle;
- jangan me-replay animasi panjang setiap kali user scroll sedikit naik/turun.

---

# 29. Reduced Motion Design

Jika motion dikurangi:

- hilangkan parallax;
- hilangkan Ken Burns;
- hilangkan floating botanical;
- ganti entrance menjadi simple opacity 150–250 ms;
- smooth scroll dapat menjadi instant/near instant.

Layout harus tetap terlihat lengkap tanpa bergantung pada animation.

---

# 30. Photo Direction

Referensi memakai foto pasangan dengan busana tradisional hitam dan aksen merah, background studio netral, serta circular warm spotlight.

Template harus mampu mengakomodasi foto dengan karakter seperti ini.

## 30.1 Recommended Photo Crop

Hero:

- portrait / vertical;
- safe headroom;
- wajah tidak tertutup text.

Couple profile:

- 3:4 / 4:5.

Gallery:

- campuran 1:1, 4:5, 3:4, dan wide.

## 30.2 Photo Overlay

Jika text berada di atas foto:

- gunakan warm dark overlay sekitar 15–35%;
- atau gradient transparan dari bottom;
- jangan blur wajah.

---

# 31. Iconography

Gunakan icon line sederhana untuk:

- envelope;
- calendar;
- clock;
- location pin;
- copy;
- gift;
- music;
- heart;
- gallery/photo;
- wishes/message.

Aturan:

- stroke konsisten;
- 16–20 px;
- tidak menggunakan icon 3D;
- warna mengikuti muted burgundy / charcoal;
- decorative botanical tetap menjadi elemen utama, icon hanya membantu usability.

---

# 32. Button System

## Primary

- deep burgundy / dusty rose background;
- ivory/white text;
- 42–50 px height;
- horizontal padding 20–28 px;
- soft rounded / pill;
- very subtle shadow.

## Secondary

- transparent/cream;
- thin border dusty rose;
- dark burgundy text.

## Micro Interaction

Hover desktop:

- translateY `-1 px`;
- slight shadow increase.

Tap:

- scale `0.98`.

Duration 140–200 ms.

---

# 33. Form Controls

## Inputs

- min-height 46 px;
- padding horizontal 14–16 px;
- background white dengan warm tint;
- border 1 px low-opacity mauve;
- radius 10–14 px;
- text 14 px.

## Textarea

- min-height 110–140 px;
- resize behavior tidak perlu terlihat sebagai desktop form kasar pada mobile.

## Select

Gunakan visual sama dengan input.

## Focus

- border dusty rose;
- subtle 2–3 px translucent focus halo;
- jangan biru default browser jika bertabrakan dengan tema.

---

# 34. Layering Rules

Gunakan layering untuk menghasilkan rasa premium:

1. background canvas;
2. large background botanical;
3. photo / main content;
4. foreground botanical overlap;
5. text / control;
6. floating navigation/music.

Botanical boleh berada di belakang atau depan foto secara terkontrol.

Jangan membuat semua dekorasi berada dalam normal document flow karena hasilnya akan terasa seperti icon biasa.

---

# 35. Section Transition

Section tidak perlu dipisahkan oleh divider keras.

Gunakan salah satu:

- whitespace;
- perubahan background ivory → warm cream;
- botanical bridge;
- overlap image;
- subtle curved/organic visual edge.

Hindari garis horizontal penuh antara setiap section.

---

# 36. Responsive Behavior

## Mobile

Mobile adalah desain utama.

- single column;
- text center kecuali address/account/message yang lebih mudah dibaca left-aligned;
- gallery 1–2 columns;
- event blocks stacked;
- bottom nav fixed.

## Tablet/Desktop

Jangan sekadar memperbesar semua elemen.

- invitation canvas tetap relatif sempit;
- beberapa profile/event dapat menggunakan dua kolom jika ruang cukup;
- whitespace kiri-kanan meningkat;
- decorative botanical bisa dibuat lebih besar;
- jangan membuat body text selebar layar desktop.

---

# 37. Visual Density Rules

Setiap viewport mobile sebaiknya hanya mempunyai 1 focal point utama.

Contoh:

- cover → couple name;
- hero → date/couple;
- quote → quote;
- couple → portrait;
- event → date;
- gallery → photography;
- RSVP → form;
- gift → payment details;
- wishes → guest messages.

Jangan menumpuk heading, foto besar, card, icon, dan dekorasi sama kuat dalam satu viewport.

---

# 38. Template Personality

Template harus terasa:

- feminine-neutral, bukan terlalu girly;
- romantis tetapi tidak klise;
- tradisional-modern;
- cocok untuk foto adat maupun formal;
- premium tetapi tidak terlalu luxurious/gold-heavy;
- warm dan intimate.

Dusty rose adalah identitas utama, bukan emas.

---

# 39. Important Interaction States

Desain wajib mempunyai state visual untuk:

- cover locked;
- cover opening;
- music playing;
- music paused;
- nav default;
- nav active;
- button pressed;
- form focus;
- form loading;
- form success;
- copy account default;
- copy success;
- gallery image selected;
- gallery lightbox open;
- load more wishes;
- QR modal open;
- countdown active;
- event date passed / countdown finished.

State-state ini harus tetap mengikuti palette yang sama.

---

# 40. Countdown Finished State

Ketika tanggal acara sudah lewat, jangan menampilkan countdown negatif atau semua angka aneh.

Ganti area countdown menjadi pesan singkat yang tetap sesuai visual invitation, misalnya:

- date tetap tampil;
- countdown numbers dapat berhenti di `00`;
- satu baris pesan kecil dapat menggantikan label countdown.

Tidak perlu alert atau warning visual.

---

# 41. Empty / Disabled Section Design

Karena template platform dapat memiliki data berbeda, section tertentu mungkin tidak digunakan.

Jika sebuah section tidak memiliki data:

- hilangkan section sepenuhnya;
- rapatkan vertical rhythm secara natural;
- jangan menampilkan empty card;
- jangan meninggalkan decorative divider sendirian.

Contoh:

- tidak ada wedding gift → section gift hilang;
- tidak ada gallery → section gallery hilang;
- hanya satu event → tampilkan satu event tanpa ruang kosong untuk event kedua.

---

# 42. Content Length Resilience

Template harus tetap terlihat bagus untuk nama panjang.

## Couple Names

Jika nama display panjang:

- ukuran font turun secara bertahap;
- maksimal 2 baris per nama;
- ampersand tetap mempunyai ruang sendiri.

## Address

Alamat panjang:

- maksimal width 320–360 px;
- line-height 1.55–1.7;
- center atau left sesuai panjang.

## Parent Names

Boleh 2–3 baris tanpa memaksa font terlalu kecil.

---

# 43. Motion Priority

Jika harus mengurangi jumlah animasi, pertahankan prioritas berikut:

1. cover opening;
2. hero reveal;
3. subtle scroll entrance;
4. gallery lightbox;
5. music rotation;
6. active bottom nav;
7. copy feedback;
8. minor botanical floating.

Jangan mengorbankan kelancaran scroll demi decorative animation.

---

# 44. Do / Don't Summary

## DO

- gunakan botanical watercolor sebagai framing;
- gunakan dusty rose + ivory;
- gunakan serif editorial;
- pertahankan whitespace besar;
- tampilkan foto secara editorial;
- buat date numeral sebagai focal point;
- gunakan entrance animation yang lembut;
- pertahankan bottom navigation compact;
- gunakan micro interaction sederhana;
- buat setiap section terasa menyambung.

## DON'T

- jangan membuat UI seperti dashboard;
- jangan pakai card untuk semuanya;
- jangan pakai gradient neon;
- jangan menggunakan shadow tebal;
- jangan pakai animasi bounce berlebihan;
- jangan membuat semua foto grid seragam;
- jangan membuat setiap section mempunyai background berbeda;
- jangan memenuhi layar dengan icon;
- jangan memakai typography sans-serif modern sebagai satu-satunya font;
- jangan membuat navbar besar seperti mobile app utama.

---

# 45. Suggested Mobile Composition Snapshot

Ini bukan wireframe teknis, melainkan urutan visual.

```text
┌───────────────────────────┐
│ botanical corner          │
│                           │
│      The Wedding Of       │
│          AYU              │
│            &              │
│          ODIQ             │
│                           │
│       Kepada Yth.         │
│ Bapak/Ibu/Saudara/i       │
│        Siti Nuroh         │
│                           │
│      [ Buka Undangan ]    │
│                           │
│        07-11-2025         │
│                botanical  │
└───────────────────────────┘

          ↓ opening

┌───────────────────────────┐
│        PHOTO / HERO       │
│                           │
│      The Wedding Of       │
│       AYU & ODIQ          │
│                           │
│        November           │
│           07              │
│          2025             │
│                           │
│      SAVE THE DATE        │
│ D     H      M      S     │
└───────────────────────────┘

┌───────────────────────────┐
│       Sacred Quote        │
│       source/citation     │
└───────────────────────────┘

┌───────────────────────────┐
│       PHOTO COLLAGE       │
│  ┌────────┐ ┌────────┐    │
│  │        │ │        │    │
│  └────────┘ └────────┘    │
│      ┌─────────────┐      │
│      │             │      │
│      └─────────────┘      │
└───────────────────────────┘

┌───────────────────────────┐
│      Groom Portrait       │
│          ODIQ             │
│      full identity        │
│      parent details       │
│                           │
│            &              │
│                           │
│      Bride Portrait       │
│           AYU             │
│      full identity        │
│      parent details       │
└───────────────────────────┘

┌───────────────────────────┐
│          Wedding          │
│           EVENT           │
│                           │
│           AKAD            │
│        November 07        │
│           2025            │
│       time + address      │
│       [Google Maps]       │
│                           │
│         RESEPSI           │
│        November 07        │
│           2025            │
│       time + address      │
│       [Google Maps]       │
└───────────────────────────┘

┌───────────────────────────┐
│          Gallery          │
│      editorial collage   │
└───────────────────────────┘

┌───────────────────────────┐
│   Konfirmasi Kehadiran    │
│         form RSVP         │
│     [Kirim Konfirmasi]    │
└───────────────────────────┘

┌───────────────────────────┐
│       Wedding Gift        │
│  bank / wallet / address  │
│  [copy]          [copy]   │
└───────────────────────────┘

┌───────────────────────────┐
│       Friends Wishes      │
│       message form        │
│       wishes list         │
│    [Muat Lebih Banyak]    │
└───────────────────────────┘

┌───────────────────────────┐
│      closing message      │
│      The Wedding of       │
│        AYU & ODIQ         │
│       botanical end       │
└───────────────────────────┘

       floating music ♪

┌───────────────────────────┐
│ Cover Couple Event Gallery Wishes │
└───────────────────────────┘
      fixed bottom nav
```

---

# 46. Final Design Directive for AI Agent

Bangun template ini sebagai sebuah **cohesive visual story**, bukan sekumpulan komponen yang ditempel berurutan.

Prioritas pengerjaan visual:

1. sempurnakan cover;
2. sempurnakan hero dan save-the-date;
3. konsistenkan botanical framing;
4. bangun typography hierarchy;
5. susun photography secara editorial;
6. buat couple profile dan event section;
7. integrasikan functional sections dengan visual theme yang sama;
8. tambahkan persistent bottom navigation;
9. tambahkan motion system;
10. lakukan final pass untuk spacing, overlap, dan visual balance.

Ketika membuat setiap section, selalu tanyakan:

> Apakah bagian ini masih terlihat seperti bagian dari satu kartu undangan premium yang sama?

Jika jawabannya tidak, kurangi card, border, icon, atau efek yang terlalu modern dan kembalikan fokus ke typography, photo, botanical decoration, dan whitespace.

---

# 47. Observation Notes

Hal-hal berikut terverifikasi pada referensi Ayu & Odiq:

- personalized invitation cover;
- tombol membuka undangan;
- nama pasangan Ayu & Odiq;
- wedding date 7 November 2025;
- save-the-date;
- live countdown dengan Days / Hours / Minutes / Seconds;
- kutipan religius;
- beberapa foto prewedding;
- profil Odiq dan Ayu;
- dua event, Akad dan Resepsi;
- link Google Maps;
- Gallery;
- RSVP / Konfirmasi Kehadiran;
- Wedding Gift dengan rekening/e-wallet/copy action dan alamat hadiah;
- Friends Wishes / comments;
- closing wedding message;
- bottom shortcut navigation untuk Cover, Couple, Event, Gallery, Wishes;
- guest QR/check-in view;
- botanical watercolor asset dengan daun dusty rose/mauve dan berry lavender;
- wedding backsound merupakan bagian dari feature set Ringvitation.

Nilai timing, easing, parallax amplitude, scale, dan stagger dalam dokumen ini adalah **design reconstruction values** agar motion yang dibuat AI agent konsisten dengan karakter referensi. Jangan memperlakukan angka tersebut sebagai hasil ekstraksi source CSS asli.

---

# 48. Scope Lock

Dokumen ini hanya mengatur:

- visual direction;
- layout;
- responsive composition;
- typography;
- color;
- decoration;
- photography treatment;
- interaction behavior;
- animation/motion;
- component visual states.

Dokumen ini **sengaja tidak menentukan**:

- programming language;
- framework;
- package;
- database;
- API;
- data model;
- backend;
- authentication;
- storage;
- CMS;
- deployment;
- hosting;
- routing architecture.

Seluruh keputusan teknis tersebut harus mengikuti project existing tempat template ini akan dipasang.
