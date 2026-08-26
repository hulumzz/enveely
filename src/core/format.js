// Enveely — Formatting + invitation-level micro-copy (ID/EN).
// Invitation locale is independent from app locale (Blueprint-1.md §21).

const DICT = {
  id: {
    open: 'Buka Undangan',
    eventsTitle: 'Save The Date',
    eventsSub: 'Akad & Resepsi',
    coupleTitle: 'Mempelai',
    coupleSub: 'Dengan memohon ridho Tuhan Yang Maha Esa',
    countdownTitle: 'Menghitung Hari',
    storyTitle: 'Cerita Kami',
    galleryTitle: 'Galeri',
    mapTitle: 'Lokasi Acara',
    rsvpTitle: 'Konfirmasi Kehadiran',
    giftTitle: 'Kirim Hadiah',
    wishesTitle: 'Ucapan & Doa',
    days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik',
    viewMap: 'Lihat Lokasi', navigate: 'Navigasi', openMap: 'Buka Peta',
    yourName: 'Nama Anda',
    attendYes: 'Hadir dengan hormat',
    attendNo: 'Maaf, berhalangan hadir',
    guests: 'Jumlah Tamu',
    messageOptional: 'Ucapan (opsional)',
    send: 'Kirim',
    rsvpThanks: 'Terima kasih! Konfirmasi Anda sudah kami terima.',
    copy: 'Salin', copied: 'Tersalin!',
    giftNote: 'Doa restu Anda adalah hadiah terindah bagi kami. Namun jika ingin memberi tanda kasih, silakan gunakan informasi berikut.',
    giftAddress: 'Alamat Kirim Hadiah',
    wishName: 'Nama',
    wishMessage: 'Tulis ucapan & doa terbaik...',
    wishSend: 'Kirim Ucapan',
    passed: 'Hari bahagia telah tiba',
  },
  en: {
    open: 'Open Invitation',
    eventsTitle: 'Save The Date',
    eventsSub: 'Ceremony & Reception',
    coupleTitle: 'The Couple',
    coupleSub: 'With the blessings of our beloved families',
    countdownTitle: 'Counting Down',
    storyTitle: 'Our Story',
    galleryTitle: 'Gallery',
    mapTitle: 'Location',
    rsvpTitle: 'RSVP',
    giftTitle: 'Wedding Gift',
    wishesTitle: 'Wishes',
    days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
    viewMap: 'View Location', navigate: 'Navigate', openMap: 'Open Map',
    yourName: 'Your Name',
    attendYes: 'Joyfully attending',
    attendNo: "Sorry, can't attend",
    guests: 'Guest Count',
    messageOptional: 'Message (optional)',
    send: 'Send',
    rsvpThanks: 'Thank you! Your confirmation has been received.',
    copy: 'Copy', copied: 'Copied!',
    giftNote: 'Your prayers are the greatest gift. Should you wish to honor us with a token of love, you may use the details below.',
    giftAddress: 'Gift Delivery Address',
    wishName: 'Name',
    wishMessage: 'Write your best wishes...',
    wishSend: 'Send Wishes',
    passed: 'The big day has arrived',
  },
};

/** Invitation-level translation lookup. */
export function invT(locale, key) {
  return DICT[locale]?.[key] ?? DICT.id[key] ?? key;
}

/** Escape user/content strings for safe HTML interpolation. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** "2026-12-20" -> "Sabtu, 20 Desember 2026" (locale aware). */
export function formatDateLong(dateStr, locale = 'id') {
  const d = new Date(String(dateStr).length <= 10 ? `${dateStr}T00:00:00` : dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr || '');
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Split a long date into parts for event badges. */
export function formatDateParts(dateStr, locale = 'id') {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return { weekday: '', day: '', monthYear: '' };
  const loc = locale === 'en' ? 'en-US' : 'id-ID';
  return {
    weekday: d.toLocaleDateString(loc, { weekday: 'long' }),
    day: d.toLocaleDateString(loc, { day: 'numeric' }),
    monthYear: `${d.toLocaleDateString(loc, { month: 'short' })} ${d.getFullYear()}`,
  };
}

export function formatTimeRange(event, locale = 'id') {
  if (!event.startTime && !event.endTime) return '';
  const suffix = locale === 'en' ? 'WIB' : 'WIB';
  return `${event.startTime || ''}${event.endTime ? `–${event.endTime}` : ''} ${suffix}`.trim();
}

export function mapsUrlFor(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
