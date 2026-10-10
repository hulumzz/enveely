# Operasional Enveely

Aplikasi: https://enveely.pages.dev. Firebase: ulwed-d729f. Cloudflare account: fa9e4b5cc90250f132b17fb7c067490b.

## Rilis

1. `npm ci --ignore-scripts`, lalu `npm run verify:release` dengan Node 24. Script menguji aplikasi dan rules, membangun frontend/Functions, lalu mengaudit dependency runtime. Java 21 dan emulator resmi diunduh bila diperlukan dengan versi dan SHA-256 tetap.
2. Pages memakai `npm run verify:release` sebagai build command, sehingga pemeriksaan tetap berjalan saat GitHub Actions terhalang billing akun. Build menghasilkan salinan tetap aturan dan indeks, tanpa kredensial.
3. Simpan bookmark D1 Time Travel sebelum migrasi; terapkan migrasi bernomor yang belum pernah dijalankan. Migrasi 0003 mempertahankan seluruh pesanan. Periksa duplikasi pesanan terbuka pada database lama sebelum menerapkan indeks unik.
4. Pastikan Pages memiliki TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, MAINTENANCE_SECRET dan binding yang tercantum di wrangler.jsonc. Secret tidak boleh masuk Git.
5. Push main memicu Pages. Setelah deployment sukses, lakukan POST terautentikasi ke `/api/internal/maintenance?action=install-policy`. Sumber yang dipasang selalu berasal dari build, bukan request. Periksa `verify-policy`: hash cocok dan seluruh indeks READY. Jika 403, operator Firebase perlu memasang aturan dan indeks dengan kredensial berizin, bukan melonggarkan aturan.
6. Pasang Worker `ops/wrangler.jsonc` dengan secret pemeliharaan yang sama. Cron setiap 15 menit; workers.dev dan preview URL dimatikan.
7. Smoke test halaman publik, konfigurasi challenge, 401 endpoint privat, CSP, robots, sitemap, dan undangan yang tidak tersedia. QA visual dan perjalanan login/editor/upload/publish/RSVP pada ponsel diperlukan sebelum menyatakan produksi siap penuh.

## Konsistensi pembayaran

Pesanan dibuat di D1 sebelum QR. Maksimal satu pesanan terbuka per pemilik dan undangan. Reviewer memeriksa catatan merchant serta mengisi referensi unik. AI tidak memberikan hak tayang.

Aktivasi menyimpan tanggal berakhir tetap pada status `activation_pending`, mengunci undangan, lalu menulis entitlement bersama pemeriksaan versi undangan dalam satu commit Firestore. Pesanan ditandai aktif hanya setelah write berhasil. Retry memakai order dan tanggal yang sama. Cron memproses dua aktivasi per batch. Status aktif dengan tanggal yang lewat ditampilkan sebagai kedaluwarsa; checkout menghasilkan pesanan perpanjangan baru.

Jika pemilik atau desain berubah saat aktivasi tertunda, proses berhenti dan menyimpan activation_error. Reviewer perlu menyelesaikan perubahan desain atau transaksi bersama pengguna; jangan mengubah expiry atau memaksa aktif melalui SQL.

## Pemeliharaan dan retensi

Pemeliharaan memakai lease D1 5 menit agar batch tidak bertabrakan. Batch kecil menginventarisasi upload lama, menghapus media tanpa referensi setelah 7 hari, menghapus bukti pembayaran final setelah 180 hari, dan membersihkan penghitung rate limit. Penghapusan undangan ditutup dengan status deleting terlebih dahulu; job berlanjut secara bertahap sampai tamu, seluruh media, control, dan entitlement terhapus. Trial ledger dan catatan transaksi tetap disimpan.

Periksa log `maintenance_complete`, `maintenance_schedule`, `activation_failed`, `maintenance_error`, dan kolom activation_error. Cron yang gagal menghasilkan exception pada Worker. Pantau kegagalan deployment Pages, error Worker, antrean activation_pending yang berumur >30 menit, serta job penghapusan yang tidak bergerak. Tujuan notifikasi perlu ditentukan operator; jangan menganggap log sebagai alarm yang sudah terkirim.

## Cadangan dan pemulihan

D1 Time Travel dapat mengembalikan database dari bookmark yang diverifikasi sebelum migrasi. Jangan melakukan restore produksi untuk menguji: pemulihan dapat menimpa pesanan baru. Untuk latihan, ekspor snapshot dan pulihkan ke database terpisah; bandingkan jumlah/baris transaksi serta referensi order sebelum cutover.

Endpoint `install-backup` memasang jadwal backup Firestore harian dengan retensi 7 hari menggunakan IAM yang sudah ada. `verify-backup` memeriksa konfigurasi; backup pertama dan keberhasilan restore belum dibuktikan hanya dengan adanya jadwal. Firestore backup dipulihkan ke database baru. Konfigurasi TTL perlu diperiksa terpisah karena tidak tercakup backup. Cadangkan inventaris R2 serta objek ke bucket terpisah sesuai kebutuhan pemilik dan kebijakan retensi; kode aplikasi tidak mengklaim salinan R2 sebagai backup mandiri.

Pada 10 Oktober 2026, pemasangan jadwal ditolak karena billing Firebase belum aktif. Daftar backup schedule masih kosong. Setelah pemilik mengaktifkan billing pada proyek yang benar, jalankan installer dan verifikasi kembali, tunggu backup pertama, kemudian lakukan latihan pemulihan pada database terpisah.

Sebelum cutover pemulihan, hentikan approval dan publikasi, rekonsiliasi semua order, simpan snapshot kedua, lalu cocokkan D1 dan entitlements. Pages rollback mengembalikan kode saja; tidak mengembalikan data/migrasi. Rilis sebelum 0003 tidak memahami status baru dan tidak aman dipakai untuk rollback tanpa pemeriksaan kompatibilitas.

## Keamanan

Aturan membatasi pasangan keluarga/varian, revisi, jumlah foto, hak tayang, dan moderasi. Tamu menggunakan endpoint server dengan Turnstile, rate limit IP yang dihash, serta idempotency ID. Commit juga memeriksa versi parent sehingga pengiriman tidak membuat child setelah penghapusan. Semua Functions mendapatkan CSP dan header keamanan. Foto draf memerlukan cookie sesi HttpOnly dan tidak di-cache publik.

Pengujian emulator memakai proyek demo, bukan produksi. CI tidak memerlukan private key. Untuk deploy aturan, service account membutuhkan izin Firebase Rules dan indeks; izin menulis entitlement saja tidak mencukupi.
