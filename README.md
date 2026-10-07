# Enveely — Invite Your Beloved People

Platform undangan pernikahan digital yang design-first: enam keluarga template memiliki komposisi, tipografi, ornamen, treatment foto, dan ritme section yang berbeda. Setiap keluarga memiliki tiga variasi dengan karakter turunannya sendiri.

## Stack

- Vanilla JavaScript (ES modules) + Vite
- Firebase Authentication, Firestore, dan Analytics
- Cloudflare R2 untuk foto undangan; ImgBB/Freeimage hanya uploader lama opsional
- Cloudflare Pages Functions, D1, R2, dan Workers AI untuk pembayaran dan asisten teks
- QRIS EMV dinamis dengan nominal dan kode unik per order

## Menjalankan proyek

```powershell
node --version # Node.js 24 atau lebih baru
npm.cmd install
copy .env.example .env.local
npm.cmd run dev
```

Dev server: `http://localhost:5173`.

Di Windows PowerShell gunakan `npm.cmd` karena kebijakan eksekusi dapat memblokir `npm.ps1`.

## Environment frontend

Isi `.env.local` dan jangan commit file tersebut.

| Variable | Kegunaan |
|---|---|
| `VITE_FIREBASE_*` | Firebase Web App + Auth + Firestore |
| `VITE_IMGBB_API_KEY` | Uploader lama opsional; editor memakai R2 |
| `VITE_FREEIMAGE_API_KEY` | Uploader lama opsional |
| `VITE_QRIS_STATIC_PAYLOAD` | Payload QRIS statis merchant yang diubah menjadi QRIS dinamis saat checkout |

Asisten teks memakai Workers AI GPT-OSS 120B. `GROQ_API_KEY` hanya override opsional server; simpan di `.dev.vars`/Pages secret, tanpa awalan `VITE_`.

Payload QRIS asli dan hasil decoder merchant tidak boleh masuk repository. `.gitignore` sudah mencakup `.env.local` dan `QRIS Decoder.md`.

## Route produk

| Route | Akses | Isi |
|---|---|---|
| `/` | Publik | Landing, koleksi, harga, dan CTA |
| `/templates` | Publik | Galeri keluarga template |
| `/templates/:id` | Publik | Detail, varian, harga, dan Design DNA |
| `/templates/:id/preview/:variant` | Publik | Live preview mobile/desktop |
| `/login` | Publik | Login, pendaftaran, Google, reset password |
| `/create` | Login | Pemilihan desain dan data awal |
| `/builder/:id` | Login | Editor dengan autosave lokal + cloud |
| `/checkout/:id` | Login | QRIS, kode unik, upload bukti, status review |
| `/dashboard/*` | Login | Ringkasan, undangan, template, pembayaran, profil |
| `/dashboard/guests` | Pemilik | RSVP dan persetujuan ucapan |
| `/admin/payments` | Reviewer dengan email terverifikasi | Review bukti privat dan aktivasi |
| `/invite/:id` | Publik jika aktif | Undangan yang sudah dipublikasikan |
| `/help`, `/privacy`, `/terms` | Publik | Bantuan dan halaman legal dasar |

## Paket dan masa tayang

- `Serena Paper`: gratis, aktif 7 hari sejak publikasi pertama; tidak dapat direset lewat draf.
- Template berbayar: Rp55.000–Rp220.000, aktif 3 bulan.
- Opsi 6 bulan: biaya tambahan Rp15.000.
- Kode unik dipilih secara kriptografis dari `111`, `222`, `333`, `123`, atau `321`.

Sumber harga tunggal berada di `src/data/plans.js` dan juga dipakai endpoint verifikasi server agar nominal tidak dipercaya dari input browser.

## Alur pembayaran

1. Checkout membuat order draft dan menyimpannya di localStorage.
2. Bukti yang dipilih disimpan sementara di IndexedDB, sehingga tetap tersedia setelah tab tertutup.
3. QRIS dinamis menyisipkan total, order reference, dan CRC EMV baru.
4. Pages Function memverifikasi Firebase ID token, menghitung ulang harga, menyimpan bukti privat di R2, lalu meminta Workers AI membaca bukti.
5. Hasil AI hanya rekomendasi `ai_match` atau `pending_review`; AI tidak mengaktifkan undangan secara mandiri.
6. Setelah review admin, status D1 dan dokumen entitlement Firestore harus diaktifkan. Rules Firestore menolak publikasi template berbayar tanpa entitlement aktif.

## Cloudflare Pages production setup

Build command: `npm run build`. Output directory: `dist`.

Binding tercatat di `wrangler.jsonc`. Akun tujuan `fa9e4b5cc90250f132b17fb7c067490b`, proyek `enveely`, URL `https://enveely.pages.dev`. Skrip deploy memilih akun tersebut secara eksplisit. Git production mengikuti `hulumzz/enveely`, branch `main`; preview Git dinonaktifkan dan konfigurasi preview tidak membawa D1/R2 production.

| Binding / secret | Tipe | Kegunaan |
|---|---|---|
| `PAYMENTS_DB` | D1 | Order dan status review |
| `PAYMENT_PROOFS` | R2 | Bukti pembayaran privat |
| `INVITATION_MEDIA` | R2 | Foto, dilayani melalui `/media/:key` dengan URL publik acak |
| `AI` | Workers AI | Pemeriksaan screenshot Llama Vision dan saran teks GPT-OSS 120B |
| `GROQ_API_KEY` | Secret opsional | Override provider saran teks |
| `FIREBASE_WEB_API_KEY` | Secret | Verifikasi Firebase ID token di server |
| `ADMIN_EMAILS` | Secret | Email reviewer, pisahkan dengan koma |
| `FIREBASE_PROJECT_ID` | Variable | Project ID Firebase untuk entitlement |
| `FIREBASE_SERVICE_ACCOUNT_EMAIL` | Secret | Email service account Firebase Admin |
| `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` | Secret | Private key PEM service account Firebase Admin |

Terapkan semua migration pada D1 `enveely-payments` (`a15c57f9-3cce-4fee-a7d7-79afb07a9ee1`). Model `@cf/meta/llama-3.2-11b-vision-instruct` membutuhkan persetujuan lisensi. Konfigurasi akun ini telah disiapkan dalam migrasi Oktober 2026.

```powershell
$env:CLOUDFLARE_ACCOUNT_ID='fa9e4b5cc90250f132b17fb7c067490b'
npx.cmd wrangler d1 migrations apply enveely-payments --remote
npm.cmd run deploy:pages
```

Jangan simpan key server atau payload merchant di `wrangler.jsonc`. Gunakan encrypted variables/secrets di Cloudflare. Untuk lokal Pages Functions, gunakan `.dev.vars` dan jangan commit.

## Review pembayaran internal

Reviewer `uniquefactuhl@gmail.com` membuka `/admin/payments` setelah login dengan email terverifikasi. Cocokkan transaksi asli di merchant sebelum menyetujui; screenshot dan AI tidak membuktikan bahwa dana diterima. Halaman menampilkan bukti R2 privat, ringkasan AI, dan tombol setujui/tolak.

- Setuju: D1 diset `active`, tanggal expired dihitung dari paket, dan server menulis `entitlements/{invitationId}` ke Firestore menggunakan service account.
- Tolak: order diset `rejected`; pengguna kembali melihat statusnya pada dashboard dan dapat mengunggah bukti baru.
- Tidak ada endpoint publik untuk mengaktifkan entitlement atau melihat bukti pembayaran.

Untuk service account Firebase, buat key khusus server dengan hak minimum yang dapat menulis dokumen entitlement, lalu simpan email dan private key sebagai Cloudflare secrets. Jangan memakai key tersebut pada Vite atau di browser.

## Firebase production setup

1. Aktifkan Email/Password dan Google provider di Firebase Authentication.
2. Deploy `firestore.rules` dan `firestore.indexes.json`.
3. Tambahkan domain production ke Authorized domains.
4. Uji rules dengan Firebase Emulator sebelum deploy.
5. Endpoint reviewer menulis `entitlements/{invitationId}` berisi `ownerUid`, `variantId`, `active: true`, dan `expiresAt` berupa timestamp. Client tidak memiliki izin menulis entitlement.

Draft Firestore dimiliki oleh `ownerUid == request.auth.uid`. Undangan publik hanya dapat dibaca jika published dan masa tayangnya aktif. RSVP dan wishes memiliki validasi field, waktu server, serta batas panjang di rules. Hapus undangan menghapus data tamu dan foto R2 yang masih direferensikan; catatan pembayaran dipertahankan untuk audit transaksi.

## Verifikasi sebelum deploy

```powershell
npm.cmd test
npm.cmd run test:rules # memerlukan Java 21 dan emulator Firestore
npm.cmd run build
git diff --check
```

Pengujian produk nyata (membuat akun QA dan undangan sementara pada Firebase target):

```powershell
$env:PLAYWRIGHT_MODULE_PATH='C:\path\to\playwright\index.mjs'
$env:TEST_BASE_URL='http://127.0.0.1:8788'
node tests/product-browser.mjs
```

Jalankan Pages dev dengan `.dev.vars` berisi secret server; D1 lokal juga perlu migration. State QA dan screenshot disimpan di direktori ignored `.pages-config-scratch/browser`, untuk pembersihan akun setelah pengujian. Hasil migrasi dan batas verifikasi dijelaskan di [audit Cloudflare](docs/cloudflare-migration-audit.md).

Lanjutkan dengan smoke test route pada hasil `vite preview`, emulator test untuk Firestore rules, serta QA visual desktop/mobile. Pages Functions perlu diuji melalui `wrangler pages dev dist` atau environment preview Cloudflare karena server Vite biasa tidak menjalankan folder `functions/`.

## Arsitektur inti

```text
CONTENT + TEMPLATE DNA + VARIANT DNA + SECTION CONFIG
                         ↓
                   RENDER ENGINE → INVITATION
```

Content dan design tetap terpisah, sehingga pengguna dapat mengganti template tanpa kehilangan data. Blueprint dan Design `.md` adalah konteks awal; implementasi saat ini mengikuti kebutuhan produk komersial yang lebih baru.
