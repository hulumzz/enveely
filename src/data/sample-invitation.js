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
  botanica: [
    { url: '/demo/jawa.webp' },
    { url: '/demo/melati-pengantin.webp' },
    { url: '/demo/candid-laughing.webp' },
    { url: '/demo/sunda.webp' },
    { url: '/demo/ring-hand.webp' },
    { url: '/demo/batik-texture.webp' },
    { url: '/demo/luxury.webp' },
  ],
};

const COVERS = {
  amora: '/demo/jawa.webp',
  elysian: '/demo/luxury.webp',
  serena: '/demo/modern.webp',
  lumiere: '/demo/pendopo.webp',
  nusantara: '/demo/nusantara.webp',
  meadow: '/demo/candid-laughing.webp',
  botanica: '/demo/jawa.webp',
};

const FAMILY_INTRO = {
  amora: 'Dengan penuh sukacita, kami mengundang kalian hadir di hari bahagia kami.',
  elysian: 'Kami berbesar hati menerima doa dan kehadiran kalian di hari yang paling bermakna ini.',
  serena: 'Dengan sederhana, kami mengundang kalian merayakan hari istimewa kami.',
  lumiere: 'Sebuah malam yang ingin kami rayakan bersama orang-orang terdekat &mdash; termasuk kalian.',
  nusantara: 'Dengan restu dan doa, kami mengundang keluarga serta sahabat hadir di hari bahagia kami.',
  meadow: 'Hari yang kami nantikan &mdash; datang, makan bersama, lepas tawa.',
  botanica: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.',
};

const QUOTES = {
  amora: {
    text: 'Cinta bukan menemukan orang yang sempurna, tapi belajar melihat kesempurnaan di mata orang yang tidak sempurna.',
    source: 'Alya & Raka',
  },
  elysian: {
    text: 'The best thing to hold onto in life is each other.',
    source: 'Audrey Hepburn',
  },
  serena: {
    text: 'Pernikahan adalah dua orang yang memutuskan untuk berjalan bersama melewati suka dan duka.',
    source: 'Anonim',
  },
  lumiere: {
    text: 'Here’s to love, laughter, and happily ever after.',
    source: '— R & A',
  },
  nusantara: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.',
    source: 'QS. Ar-Rum: 21',
  },
  meadow: {
    text: 'Kalau bukan kita yang memilih untuk bersama, siapa lagi? Cinta sederhana adalah yang paling awet.',
    source: '— Kami',
  },
  botanica: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },
};

const DRESS_CODE = {
  amora: 'Nuansa pastel & earth tone sangat diapresiasi. Hindari putih kecuali pengantin.',
  elysian: 'Black-tie optional. Warna monokromatik dan metalik sangatelcome.',
  serena: 'Kasual rapi, warna netral atau earth tone. Hindari busana terlalu mencolok.',
  lumiere: 'Tuxedo / formal dress. Aksen emas dan gelap sangatelcome.',
  nusantara: 'Batik & kebaya casual untuk keluarga dekat, formal attire untuk undangan VIP.',
  meadow: 'Garden casual — floral pattern, warna earthy, sepatu flat atau wedges.',
  botanica: 'Batik modern atau formal attire bernuansa earth tone & dusty rose. Mohon tidak mengenakan busana serba putih.',
};

const ACCESS = {
  amora: 'Parkir tersedia di basement masjid. Akses dari pintu samping untuk tamu keluarga.',
  elysian: 'Valet parking di lobi utama. Taksi online bisa drop-off di pintu ballroom.',
  serena: 'Parkir gratis di halaman gedung. Shuttle dari parkiran ke pintu utama setiap 10 menit.',
  lumiere: 'Parkir bawah tanah hotel, tunjukkan QR undangan di gerbang. Lift langsung ke ballroom.',
  nusantara: 'Area parkir pendopo kapasitas 80 mobil. Disarankan naik kendaraan bersama.',
  meadow: 'Parkir rumput di samping venue, roda dua dan empat. Akses jalan kaki 50m dari gate.',
  botanica: 'Area parkir luas tersedia di pelataran dan basement gedung. Drop-off tamu VIP dan keluarga berada di lobi barat.',
};

export function sampleInvitation(templateId, variantId) {
  const tplId = (templateId || 'amora').toLowerCase();
  const isBotanica = tplId === 'botanica';
  return {
    id: 'demo',
    locale: 'id',
    status: 'published',
    design: { templateId: tplId, variantId },
    content: {
      coverImage: COVERS[tplId] || COVERS.amora,
      groom: isBotanica
        ? { name: 'Odiq Pratama, S.T.', nickname: 'Odiq', description: 'Putra pertama dari Bapak Triyono & Ibu Sri Rahayu' }
        : { name: 'Raka Aditya', nickname: 'Raka', description: 'Putra pertama dari Bapak Hartono & Ibu Dewi' },
      bride: isBotanica
        ? { name: 'Ayu Lestari, S.Farm.', nickname: 'Ayu', description: 'Putri kedua dari Bapak Handoko & Ibu Endang Susilowati' }
        : { name: 'Alya Paramita', nickname: 'Alya', description: 'Putri kedua dari Bapak Bambang & Ibu Sri' },
      weddingDate: '2026-11-07',
      coverEyebrow: 'THE WEDDING OF',
      guestName: isBotanica ? 'Siti Nuroh' : '',
      guestGreeting: isBotanica ? 'Kepada Yth. Bapak/Ibu/Saudara/i' : '',
      welcomeMessage: FAMILY_INTRO[tplId] || FAMILY_INTRO.amora,
      parents: isBotanica
        ? { groom: 'Bapak Triyono & Ibu Sri Rahayu', bride: 'Bapak Handoko & Ibu Endang Susilowati' }
        : { groom: 'Bapak Hartono & Ibu Dewi Lestari', bride: 'Bapak Bambang Wirawan & Ibu Sri Handayani' },
      events: [
        {
          id: 'akad', type: 'akad', title: 'Akad Nikah', date: '2026-11-07',
          startTime: '08.00', endTime: '10.00',
          venue: 'Masjid Agung Al-Falah', address: 'Jl. Diponegoro No. 12, Yogyakarta',
        },
        {
          id: 'resepsi', type: 'resepsi', title: 'Resepsi Pernikahan', date: '2026-11-07',
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
      closingMessage: 'Terima kasih sudah menjadi bagian dari cerita kami. Sampai jumpa di hari H!',
      closingImage: '',
      quoteSettings: QUOTES[tplId] || QUOTES.amora,
      infoSettings: {
        dressCode: DRESS_CODE[tplId] || DRESS_CODE.amora,
        access: ACCESS[tplId] || ACCESS.amora,
        notes: '',
      },
    },
    sections: [
      { id: 'cover', enabled: true }, { id: 'welcome', enabled: true }, { id: 'couple', enabled: true },
      { id: 'quote', enabled: true }, { id: 'event', enabled: true }, { id: 'countdown', enabled: true },
      { id: 'story', enabled: true }, { id: 'gallery', enabled: true }, { id: 'map', enabled: true },
      { id: 'info', enabled: true }, { id: 'rsvp', enabled: true }, { id: 'gift', enabled: true },
      { id: 'wishes', enabled: true }, { id: 'closing', enabled: true },
    ],
  };
}
