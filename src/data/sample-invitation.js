// Enveely — Sample invitation content for template previews & demos.
// Represents the Content layer only; swap with real user data at runtime.
// Each template family gets a tailored sample (gallery images, accent copy)
// so the live preview truly reflects the Design DNA — not a one-size copy.

const DEMO_GALLERIES = {
  amora: [
    { url: '/demo/jawa.webp' },
    { url: '/demo/melati-pengantin.webp' },
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/sunda.webp' },
    { url: '/demo/ring-hand.webp' },
    { url: '/demo/batik-texture.webp' },
  ],
  elysian: [
    { url: '/demo/luxury.webp' },
    { url: '/demo/ring-hand.webp' },
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/melati-pengantin.webp' },
    { url: '/demo/modern.webp' },
  ],
  serena: [
    { url: '/demo/modern.webp' },
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/jawa.webp' },
    { url: '/demo/ring-hand.webp' },
  ],
  lumiere: [
    { url: '/demo/luxury.webp' },
    { url: '/demo/modern.webp' },
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/ring-hand.webp' },
    { url: '/demo/melati-pengantin.webp' },
    { url: '/demo/sunda.webp' },
    { url: '/demo/pendopo.webp' },
    { url: '/demo/jawa.webp' },
  ],
  nusantara: [
    { url: '/demo/batik-texture.webp' },
    { url: '/demo/nusantara.webp' },
    { url: '/demo/pendopo.webp' },
    { url: '/demo/jawa.webp' },
    { url: '/demo/sunda.webp' },
    { url: '/demo/melati-pengantin.webp' },
  ],
  meadow: [
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/ring-hand.webp' },
    { url: '/demo/melati-pengantin.webp' },
    { url: '/demo/batik-texture.webp' },
    { url: '/demo/pendopo.webp' },
    { url: '/demo/sunda.webp' },
  ],
};

const COVERS = {
  amora: '/demo/jawa.webp',
  elysian: '/demo/luxury.webp',
  serena: '/demo/modern.webp',
  lumiere: '/demo/pendopo.webp',
  nusantara: '/demo/nusantara.webp',
  meadow: '/demo/candid-laughing.webp',
};

const FAMILY_INTRO = {
  amora: 'Dengan penuh sukacita, kami mengundang kalian hadir di hari bahagia kami.',
  elysian: 'Kami berbesar hati menerima doa dan kehadiran kalian di hari yang paling bermakna ini.',
  serena: 'Dengan sederhana, kami mengundang kalian merayakan hari istimewa kami.',
  lumiere: 'Sebuah malam yang ingin kami rayakan bersama orang-orang terdekat &mdash; termasuk kalian.',
  nusantara: 'Dengan restu dan doa, kami mengundang keluarga serta sahabat hadir di hari bahagia kami.',
  meadow: 'Hari yang kami nantikan &mdash; datang, makan bersama, lepas tawa.',
};

export function sampleInvitation(templateId, variantId) {
  const tplId = (templateId || 'amora').toLowerCase();
  return {
    id: 'demo',
    locale: 'id',
    status: 'published',
    design: { templateId: tplId, variantId },
    content: {
      coverImage: COVERS[tplId] || COVERS.amora,
      groom: { name: 'Raka Aditya', nickname: 'Raka', description: 'Putra pertama dari Bapak Hartono & Ibu Dewi' },
      bride: { name: 'Alya Paramita', nickname: 'Alya', description: 'Putri kedua dari Bapak Bambang & Ibu Sri' },
      weddingDate: '2026-12-20',
      coverEyebrow: 'THE WEDDING OF',
      welcomeMessage: FAMILY_INTRO[tplId] || FAMILY_INTRO.amora,
      parents: {
        groom: 'Bapak Hartono & Ibu Dewi Lestari',
        bride: 'Bapak Bambang Wirawan & Ibu Sri Handayani',
      },
      events: [
        {
          id: 'akad', type: 'akad', title: 'Akad Nikah', date: '2026-12-20',
          startTime: '08.00', endTime: '10.00',
          venue: 'Masjid Agung Al-Falah', address: 'Jl. Diponegoro No. 12, Yogyakarta',
        },
        {
          id: 'resepsi', type: 'resepsi', title: 'Resepsi', date: '2026-12-20',
          startTime: '11.00', endTime: '14.00',
          venue: 'Grand Ballroom Ambarrukmo', address: 'Jl. Laksda Adisucipto No. 81, Yogyakarta',
        },
      ],
      story: [
        { date: '2019', title: 'Pertama Bertemu', text: 'Kami dipertemukan di sebuah acara kampus, berbincang tentang hal-hal kecil yang ternyata jadi awal segalanya.' },
        { date: '2022', title: 'Memulai Cerita', text: 'Setelah lama saling mengenal, kami memutuskan untuk melangkah lebih serius bersama.' },
        { date: '2026', title: 'Lamaran', text: 'Di bawah langit senja, sebuah pertanyaan diajukan — dan jawabannya adalah selamanya.' },
      ],
      gallery: DEMO_GALLERIES[tplId] || DEMO_GALLERIES.amora,
      rsvpSettings: { enabled: true, askAttendance: true, askGuestCount: true, allowMessage: true, maxGuestCount: 5 },
      giftSettings: {
        enabled: true,
        accounts: [{ bank: 'BCA', number: '1234567890', holder: 'Alya Paramita' }],
      },
      wishesEnabled: true,
    },
    sections: [
      { id: 'cover', enabled: true }, { id: 'welcome', enabled: true }, { id: 'couple', enabled: true },
      { id: 'event', enabled: true }, { id: 'countdown', enabled: true }, { id: 'story', enabled: true },
      { id: 'gallery', enabled: true }, { id: 'map', enabled: true }, { id: 'rsvp', enabled: true },
      { id: 'gift', enabled: true }, { id: 'wishes', enabled: true }, { id: 'closing', enabled: true },
    ],
  };
}
