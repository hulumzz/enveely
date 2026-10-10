# Tindak lanjut audit produksi, 10 Oktober 2026

| Temuan | Implementasi | Bukti/ketentuan |
|---|---|---|
| Bypass premium lewat template/varian berbeda | Pemetaan pasangan eksplisit di rules dan validasi renderer publik/server | Emulator menolak Lumière + Serena Paper |
| Tempwed tanpa paket | Tiga harga dan batas galeri eksplisit | Katalog mencakup 33 varian |
| Draf lokal menimpa cloud | Revisi transaksional, antrean save per ID, penanda dirty dan conflict | Stale revision ditolak rules; salinan lokal dapat diunduh |
| Aktivasi D1/Firestore terputus | Durable outbox, tanggal tetap, lock per undangan, retry idempotent | Fault injection D1 dan Firestore lolos |
| Pesanan ganda/durasi memendek | Pesanan server sebelum QR, indeks pesanan terbuka, expiry kumulatif | Regression checkout reuse dan renewal lolos |
| Renewal kedaluwarsa | Status efektif expired, checkout baru, editing tetap tersedia | Regression dan emulator lolos |
| Spam RSVP/ucapan | Turnstile server, quota, idempotency, direct create ditutup | Unit endpoint dan rules lolos |
| Order hanya lokal | Resolusi checkout/publish langsung dari server | Riwayat akun dipaginasi |
| Autosave terputus/berkas hilang | Flush saat navigasi, retry online, upload pending di IndexedDB | Verifikasi browser masih diperlukan |
| Batas daftar dan jumlah tamu | Pagination seluruh daftar, RSVP sesuai setting, ekspor CSV | Tidak lagi menghitung hanya 200 respons |
| Media yatim/penghapusan race | Registry/quota 256 MB, inventory lama, cleanup, deleting jobs, atomic parent verify | Verifikasi lifecycle R2 produksi masih diperlukan |
| Upload bukti bergantung AI | Bukti/pending dicatat sebelum AI; timeout dan background enrichment | Kegagalan AI tidak menghilangkan antrean manual |
| XSS judul modal | Judul dan aria label memakai textContent/setAttribute | Raw interpolation dihapus |
| CI/regression | Node 24, Java 21, emulator resmi dengan checksum, build Functions, audit runtime | Pemeriksaan lokal lolos; Pages menjalankan `verify:release` sebelum deploy. GitHub Actions tidak mulai karena akun terkunci terkait billing |
| Operasional | Worker cron, lease, reconciliation, runbook backup/restore | Cron 15 menit aktif, policy dan indeks produksi terverifikasi, batch manual berhasil. Backup Firestore ditolak karena billing belum aktif; alarm tujuan dan latihan restore belum diverifikasi |
| Muatan awal/SEO | Route dan CSS desain dimuat terpisah; font selektif; robots/sitemap nyata | JS entry sekitar 22 KB; CWV lapangan belum diukur |
| Header Functions | Middleware CSP dan cache/security defaults | Endpoint unit dan smoke produksi |
| Kebijakan tidak lengkap | Retensi, AI, analitik opt-in, hapus akun via bantuan, refund manual, durasi/SLA dijelaskan | Kemampuan produk disebut sesuai implementasi |
| Masa gratis reset | Ledger immutable bertahan setelah undangan dihapus | Rules menolak delete ledger dan reset clock |

Hero memakai Mayura Pearl di depan, Amora Garden/Elysian Ivory/Pusaka Kencana di belakang, foto cincin dengan mat dan keterangan, serta komposisi foto kedua yang berbeda. Landing menghapus eyebrow badge, rotasi otomatis, klaim berlebihan, dan pemisah kalimat dash. Komposisi mengikuti scroll tanpa mengunci atau memanipulasi scrolling, dengan reduced motion dan cleanup listener.

Build dan emulator tidak menggantikan QA visual, pengujian transaksi merchant sungguhan, pengukuran Core Web Vitals lapangan, dan latihan pemulihan cadangan. Item tersebut harus dilaporkan terpisah dari pemeriksaan yang sudah lolos.

Status produksi terverifikasi: migrasi D1 0003 selesai; bookmark sebelum migrasi `00000006-00000000-00005100-832fadd14881a1ce60c75cf3419fc07b`. Hash rules Firestore `a3811494d3f30b4ccb8ecc77df70e254a2f8e25b5aac65bc23e1347f49c18e7c`, tiga indeks READY. Audit npm seluruh dependency, termasuk pengembangan, melaporkan nol kerentanan. Turnstile memakai widget produksi khusus domain aplikasi, bukan key pengujian.

Backup harian belum terpasang: API Firestore mengembalikan `403: This API method requires billing to be enabled`. `verify-backup` mengembalikan daftar kosong. GitHub run 38027054907 tidak menjalankan langkah apa pun karena billing akun; ini berbeda dari kegagalan test. Jadwal alarm, salinan R2 terpisah, dan latihan restore masih memerlukan penyelesaian operasional.
