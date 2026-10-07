import { renderPage } from '../ui/app-shell.js';

const pages = {
  help: {
    eyebrow: 'Pusat Bantuan',
    title: 'Kami bantu sampai undangan tayang.',
    intro: 'Jawaban singkat untuk hal yang paling sering ditanyakan saat membuat undangan di Enveely.',
    sections: [
      ['Apakah bisa melihat desain tanpa akun?', 'Bisa. Landing, galeri, detail, dan pratinjau template dapat dilihat bebas. Akun baru dibutuhkan ketika mulai membuat undangan.'],
      ['Apakah draft aman jika browser tertutup?', 'Ya. Editor dan proses pembayaran menyimpan draft di perangkat secara otomatis. Saat Firebase aktif, draft undangan juga disinkronkan ke akun.'],
      ['Berapa lama undangan aktif?', 'Template polos gratis aktif 7 hari. Template berbayar aktif 3 bulan, atau 6 bulan dengan tambahan Rp15.000.'],
      ['Bagaimana pembayaran diverifikasi?', 'Bayar lewat QRIS sesuai nominal unik, lalu unggah screenshot. AI membantu membaca detail, sementara aktivasi akhir tetap direview agar tidak salah cocok.'],
    ],
  },
  privacy: {
    eyebrow: 'Privasi',
    title: 'Cerita kalian tetap milik kalian.',
    intro: 'Ringkasan ini menjelaskan data yang diperlukan Enveely untuk menjalankan undangan digital dengan aman.',
    sections: [
      ['Data akun', 'Email, nama tampilan, dan identitas Firebase digunakan untuk menjaga kepemilikan draft, undangan, dan transaksi.'],
      ['Konten undangan', 'Nama, foto, detail acara, RSVP, dan ucapan diproses untuk merender undangan. Undangan yang dipublikasikan dapat dibuka oleh siapa pun yang memiliki tautannya.'],
      ['Bukti pembayaran', 'Bukti disimpan secara privat dan hanya digunakan untuk pencocokan transaksi. Jangan pernah menyertakan PIN, OTP, password, atau data saldo yang tidak diperlukan.'],
      ['Penyimpanan lokal', 'Browser menyimpan draft editor dan checkout agar pekerjaan tidak hilang saat tab tertutup. Data lokal dapat dihapus melalui pengaturan situs di browser.'],
    ],
  },
  terms: {
    eyebrow: 'Ketentuan Layanan',
    title: 'Ketentuan yang dibuat agar semuanya jelas.',
    intro: 'Dengan membuat dan mempublikasikan undangan, pengguna menyetujui ketentuan dasar penggunaan Enveely berikut.',
    sections: [
      ['Masa tayang', 'Paket gratis berlaku 7 hari. Paket berbayar berlaku 3 bulan; opsi 6 bulan dikenai tambahan Rp15.000. Masa tayang dimulai setelah paket diaktifkan.'],
      ['Konten pengguna', 'Pengguna bertanggung jawab memastikan hak penggunaan foto, musik, nama, dan informasi acara yang dimasukkan ke undangan.'],
      ['Pembayaran', 'Pembayaran harus dilakukan sesuai nominal pada QRIS dinamis, termasuk kode unik. Aktivasi diproses setelah bukti berhasil dicocokkan.'],
      ['Penggunaan wajar', 'Layanan tidak boleh digunakan untuk penipuan, spam, konten ilegal, atau aktivitas yang melanggar hak pihak lain.'],
    ],
  },
};

export function renderInfoPage(kind) {
  const page = pages[kind] || pages.help;
  renderPage(`
    <section class="info-page">
      <div class="container info-page__inner">
        <header><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><p>${page.intro}</p></header>
        <div class="info-page__content">
          ${page.sections.map(([title, body], index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${title}</h2><p>${body}</p></div></article>`).join('')}
        </div>
        <aside class="info-page__contact"><div><p class="eyebrow">Masih Ada Pertanyaan?</p><h2>Ceritakan yang kalian butuhkan.</h2></div><a href="mailto:enveely@nalaro.digital" class="btn btn--primary btn--lg">Email Enveely</a></aside>
      </div>
    </section>`);
}
