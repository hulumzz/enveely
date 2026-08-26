// Enveely — Sample invitation content for template previews & demos.
// Represents the Content layer only; swap with real user data at runtime.

export function sampleInvitation(templateId, variantId) {
  return {
    id: 'demo',
    locale: 'id',
    status: 'published',
    design: { templateId, variantId },
    content: {
      coverImage: '/demo/jawa.webp',
      groom: { name: 'Raka Aditya', nickname: 'Raka', description: 'Putra pertama dari Bapak Hartono & Ibu Dewi' },
      bride: { name: 'Alya Paramita', nickname: 'Alya', description: 'Putri kedua dari Bapak Bambang & Ibu Sri' },
      weddingDate: '2026-12-20',
      coverEyebrow: 'THE WEDDING OF',
      welcomeMessage: 'Dengan penuh sukacita, kami mengundang Anda untuk menjadi bagian dari hari bahagia kami.',
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
      gallery: [
        { url: '/demo/jawa.webp' },
        { url: '/demo/sunda.webp' },
        { url: '/demo/modern.webp' },
        { url: '/demo/luxury.webp' },
        { url: '/demo/candid-laughing.webp' },
        { url: '/demo/melati-pengantin.webp' },
      ],
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
