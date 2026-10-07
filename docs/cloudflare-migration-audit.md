# Audit migrasi Cloudflare Enveely — 8 Oktober 2026 WIB

## Infrastruktur

| Komponen | Akun baru / status |
|---|---|
| Cloudflare | `uniquefactuhl@gmail.com`, account `fa9e4b5cc90250f132b17fb7c067490b` |
| Pages | `enveely`, `https://enveely.pages.dev`, Git `hulumzz/enveely/main` |
| D1 | `enveely-payments`, ID `a15c57f9-3cce-4fee-a7d7-79afb07a9ee1`, APAC/SIN |
| R2 bukti | `enveely-payment-proofs`, akses melalui endpoint reviewer terautentikasi |
| R2 foto | `enveely-invitation-media`, bucket privat; foto dibuka lewat URL acak `/media/:key` |
| Workers AI | GPT-OSS 120B untuk teks; Llama 3.2 Vision untuk rekomendasi bukti |
| Firebase | Project yang sudah ada `ulwed-d729f`; Auth/Firestore tetap dipakai |
| Reviewer | `uniquefactuhl@gmail.com`, wajib email Firebase terverifikasi |
| Kontak publik | `enveely@nalaro.digital` |

User mengonfirmasi tidak ada data pembayaran atau domain khusus yang perlu dipindahkan. Resource akun lama tidak dihapus. D1 baru memakai migration 0001/0002; binding lama telah diganti. Secret server dan konfigurasi Firebase/QRIS telah dipasang sebagai encrypted Pages variables. Preview Git dinonaktifkan dan binding storage production dikeluarkan dari konfigurasi preview. Compatibility date 2026-10-07 mengikuti tanggal UTC yang diterima API ketika migrasi dilakukan.

Firebase rules lama, konfigurasi Auth, dan konfigurasi Pages dibackup pada direktori lokal ignored `.pages-config-scratch`. Firebase rules dan indexes baru sudah diterapkan tanpa menghapus index lama yang tidak tercantum di repository.

## Kekurangan yang diperbaiki

- Konfigurasi frontend Firebase tidak lengkap dan secret Firebase Admin belum tersedia di Pages.
- Pembuatan undangan cloud gagal karena pembacaan dokumen baru ditolak rules, lalu editor memberi kesan tersimpan lokal saja. Create sekarang melewati pemeriksaan create rules dan menyimpan cloud dengan benar.
- Foto editor bergantung pada provider eksternal yang belum dikonfigurasi. Foto sekarang diunggah ke R2 setelah verifikasi akun, kepemilikan, MIME, ukuran, dan kuota.
- Publikasi sebelumnya dapat menampilkan keberhasilan meskipun penyimpanan cloud gagal. Status sukses dan link bagikan sekarang mengikuti hasil cloud.
- Tautan publik memiliki fallback draf lokal; sekarang hanya membuka undangan published dengan masa aktif yang diizinkan rules.
- Masa gratis bisa direset dan entitlement berbayar bisa dipakai untuk varian berbeda. Timestamp pertama dibuat server dan immutable; entitlement mengikat pemilik, varian, dan expiry.
- RSVP/ucapan sebelumnya dapat terlihat berhasil tanpa persistensi; kegagalan sekarang disampaikan, daftar tamu dan moderasi tersedia di dashboard.
- Draf dan pembayaran lokal kini dipisahkan berdasarkan UID akun. Editor dan riwayat bukti yang sudah dikirim dapat dilanjutkan di browser lain.
- Profil, filter undangan, dan histori pembayaran kini terhubung ke data nyata. Nama dapat diubah, verifikasi/reset menggunakan Firebase; email login ditampilkan baca-saja.
- Pemeriksaan bukti menghitung nominal di server, mengikat undangan ke pemilik, menolak perubahan order menunggu review, dan mendukung unggah ulang order yang ditolak. Approval hanya reviewer terverifikasi dan memakai lock untuk mencegah review bersamaan.
- Format gambar Workers AI diperbaiki; kegagalan model tetap masuk antrean review manual dengan bukti tersimpan privat.
- Saran teks memakai Workers AI saat tidak ada Groq key, dengan kuota akun.
- Hapus undangan membersihkan RSVP, ucapan, dan foto yang masih direferensikan sebelum menghapus parent/control. Riwayat pembayaran dipertahankan untuk audit.
- Metadata share/title undangan kini dibuat server, dan undangan hilang/expired memberi HTTP 404.
- Redirect SPA yang ditolak Wrangler dihapus; fallback bawaan Pages dipakai. Dependensi runtime diperbarui dan audit production tidak menemukan vulnerability.

## Bukti validasi

- Regression renderer: 33 full/lite renders dan 165 section previews lulus.
- Pengujian pembayaran dengan SQLite nyata dan mock layanan eksternal: ownership, nominal, riwayat per akun, email admin terverifikasi, reject/resubmit, fallback AI, approval, dan recovery lock lulus.
- Emulator Firebase: 27 access checks lulus, mencakup pemilik, free expiry/reset, paid variant, RSVP validation/deletion, dan moderasi ucapan.
- Browser Chrome desktop/mobile: 18 kombinasi route/viewport awal; registrasi, login, profil, create, upload R2, autosave cloud, publish, pemulihan pada browser kedua, RSVP, ucapan, moderasi, filter, hapus, metadata server, dan HTTP 404 telah lulus.
- Vite build dan bundling Pages Functions lulus. Peringatan dynamic/static import tidak menggagalkan build.
- `npm audit --omit=dev`: 0 vulnerability. Audit penuh mencatat 14 temuan (4 moderate, 10 high) pada dependency tooling Firebase CLI/Wrangler dan turunannya, termasuk Sharp, FTP/proxy, telemetry, dan glob. Tidak dilakukan force downgrade yang merusak toolchain; pembaruan tooling berikutnya perlu ditinjau.

Tes browser lokal lengkap juga lulus untuk Workers AI langsung, penolakan akses admin nonreviewer, gambar QRIS, selisih tambahan durasi Rp15.000, checkout 320/1440 px tanpa overflow, cascade delete, dan HTTP 404 foto yang telah dihapus. Deployment production, cleanup QA, dan hasil smoke production dicatat pada bagian rilis di bawah.

## Batas yang masih perlu diperhatikan

1. Pembayaran memakai QRIS merchant dan review manual, belum ada webhook provider yang memverifikasi dana masuk. Approval wajib dicocokkan dengan transaksi merchant asli. Pembayaran bank nyata belum dilakukan dalam audit ini.
2. Google provider dan authorized domain telah diperiksa; login popup Google dengan akun pengguna, email verifikasi/reset yang benar-benar diterima, serta penerimaan email `enveely@nalaro.digital` belum diuji.
   Akun reviewer belum terdaftar di Firebase pada saat audit. Login Google atau daftar dan verifikasi `uniquefactuhl@gmail.com` untuk membuka `/admin/payments`.
3. RSVP/ucapan anonim memakai validasi rules tetapi belum memiliki CAPTCHA atau pembatasan per IP. Moderasi menahan ucapan sebelum tampil publik.
4. Foto undangan memiliki URL publik yang dapat dibagikan; berbeda dari bukti bayar privat. Foto lama yang sudah dilepas/diganti sebelum penghapusan undangan belum memiliki garbage collection otomatis.
5. Order sebelum bukti dikirim dan file bukti sementara masih tersimpan pada perangkat. Riwayat server tersedia setelah bukti berhasil dikirim.
6. Uji browser dilakukan lewat Chrome desktop dengan viewport mobile; belum uji perangkat fisik, kapasitas, atau kestabilan musik/audio pada seluruh browser.

Data contoh pada galeri template adalah demo desain yang disengaja. Draf pengguna dimulai dari data yang dimasukkan sendiri; foto kosong memakai ornamen/gradient netral. Data demo tidak dipakai sebagai fallback undangan published.

## Rilis

- Perubahan aplikasi: commit `66583140c635e28b177ae06433233603f9a146e6`, sudah dipush ke `hulumzz/enveely/main`.
- Deploy Wrangler production sukses: `315761d8-e722-40c5-9863-575f60f7073f`, URL `https://315761d8.enveely.pages.dev`.
- Build Git otomatis untuk commit yang sama juga sukses dan menjadi canonical deployment: `2703f0f9-e0db-49c3-8a80-6b7b18a37aca`, selesai 8 Oktober 2026 sekitar 01.09 WIB. Domain utama `https://enveely.pages.dev` tersedia.
- Tes produk lengkap terhadap domain production **lulus**: 18 route/viewport checks, registrasi/login/profil nyata, create/upload/cloud/publish, pemulihan lewat browser kedua, RSVP/ucapan/moderasi, Workers AI, otorisasi admin, QRIS/nominal durasi, filter/cascade delete, metadata server dan 404 publik. D1/R2 production dan Firebase asli digunakan; tidak ada pembayaran bank atau approval dana palsu.
- Kredensial Firebase Admin benar-benar diuji menulis/membaca entitlement sementara, kemudian dokumen tersebut dihapus. Approval transaksi tetap diuji dengan SQLite/mocks; akun reviewer asli belum tersedia untuk uji browser admin.
- Cleanup: 7 akun QA Firebase dari seluruh percobaan dihapus; 13 dokumen sisa dari percobaan awal dibersihkan. Uji production terakhir menghapus undangan, guest responses, dan foto lewat aplikasi sendiri; cleanup admin tidak menemukan sisa dokumen undangannya. Quota D1 hanya UID QA production dibersihkan.
- Pemeriksaan terakhir: D1 `payment_orders` = 0; migration 0001/0002 terpasang; kedua bucket R2 berisi 0 objek dan managed public domain disabled. Foto QA yang dihapus memberi HTTP 404.
- Smoke HTTP: `/`, `/templates`, `/login`, `/help`, `/privacy`, `/terms` memberi 200; `/api/payments` tanpa login memberi 401, `/api/admin/payments` tanpa reviewer memberi 403, undangan/foto yang tidak ada memberi 404.
- Secret dan payload merchant tidak masuk file staged/commit. Node build Pages dipilih versi 24, sesuai toolchain yang diuji.

## Referensi operasional

- [Wrangler configuration untuk Pages](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [Firebase rules dan data validation](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firebase account lookup/delete API](https://docs.cloud.google.com/identity-platform/docs/reference/rest/v1/projects.accounts/lookup)
