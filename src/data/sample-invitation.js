// Enveely — Sample invitation content for template previews & demos.
// Represents the Content layer only; swap with real user data at runtime.
// Each template family gets a tailored sample (gallery images, accent copy)
// so the live preview truly reflects the Design DNA — not a one-size copy.

const DEMO_GALLERIES = {
  blocka: [{ url:'/demo/modern.webp' },{ url:'/demo/candid-laughing.webp' },{ url:'/demo/ring-hand.webp' },{ url:'/demo/luxury.webp' },{ url:'/demo/jawa.webp' },{ url:'/demo/sunda.webp' }],
  mayura: [ { url: '/demo/melati-pengantin.webp' }, { url: '/demo/jawa.webp' }, { url: '/demo/candid-laughing.webp' }, { url: '/demo/pendopo.webp' }, { url: '/demo/ring-hand.webp' }, { url: '/demo/luxury.webp' } ],
  pusaka: [ { url: '/demo/jawa.webp' }, { url: '/demo/melati-pengantin.webp' }, { url: '/demo/pendopo.webp' }, { url: '/demo/batik-texture.webp' }, { url: '/demo/ring-hand.webp' }, { url: '/demo/candid-laughing.webp' } ],
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
    { url: '/demo/nusantara.webp' },
    { url: '/demo/batik-texture.webp' },
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
  blocka: '',
  mayura: '/demo/melati-pengantin.webp',
  pusaka: '/demo/jawa.webp',
  amora: '/demo/jawa.webp',
  elysian: '/demo/luxury.webp',
  serena: '/demo/luxury.webp',
  lumiere: '/demo/luxury.webp',
  nusantara: '/demo/nusantara.webp',
  meadow: '/demo/candid-laughing.webp',
  botanica: '/demo/jawa.webp',
};

const FAMILY_INTRO = {
  blocka: 'Dari banyak petualangan, kita menemukan satu tujuan: membangun rumah bersama. Yuk, rayakan awal cerita baru kami!',
  mayura: 'Di antara cerita yang tumbuh dan doa yang menyertai, kami ingin merayakan hari bahagia ini bersama kalian.',
  pusaka: 'Dengan restu keluarga dan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan berbagi kebahagiaan di hari pernikahan kami.',
  amora: 'Dengan penuh sukacita, kami mengundang kalian hadir di hari bahagia kami.',
  elysian: 'Kami berbesar hati menerima doa dan kehadiran kalian di hari yang paling bermakna ini.',
  serena: 'Dengan penuh cinta dan doa, kami mengundang kalian menjadi bagian dari hari ketika kisah kami memasuki bab yang baru.',
  lumiere: 'Sebuah hari yang ingin kami rayakan bersama orang-orang terdekat — termasuk kalian.',
  nusantara: 'Dengan restu dan doa, kami mengundang keluarga serta sahabat hadir di hari bahagia kami.',
  meadow: 'Di antara tawa, doa, dan cerita yang tumbuh, kami ingin merayakan hari bahagia ini bersama kalian.',
  botanica: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.',
};

const QUOTES = {
  blocka: { text:'Satu langkah, satu cerita, satu dunia yang kita bangun bersama.', source:'Raka & Alya' },
  mayura: { text: 'Bersama, kita memberi ruang untuk tumbuh. Bersama, kita menemukan tempat untuk pulang.', source: 'Raka & Alya' },
  pusaka: { text: 'Dari dua cerita, kami merangkai satu rumah. Dengan doa keluarga, kami melangkah bersama.', source: 'Raka & Alya' },
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
    text: 'Rumah bukan hanya tempat. Ia adalah cerita yang kita tumbuhkan bersama.',
    source: 'Raka & Alya',
  },
  botanica: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },
};

const DRESS_CODE = {
  blocka: 'Busana semi-formal yang nyaman. Sentuhan biru, putih, atau kuning akan menyemarakkan pesta. Hindari putih penuh untuk memberi ruang bagi pengantin.',
  mayura: 'Busana formal atau semi-formal yang nyaman. Nuansa hijau, krem, dan sentuhan kain bertekstur akan menyatu dengan suasana taman.',
  pusaka: 'Batik, kebaya, atau busana formal yang nyaman. Sentuhan kain tradisional akan menyemarakkan hari bahagia kami.',
  amora: 'Nuansa pastel & earth tone sangat diapresiasi. Hindari putih kecuali pengantin.',
  elysian: 'Busana formal atau semi-formal dengan warna pilihan kalian. Aksesori sederhana bernuansa emas atau perak dapat melengkapi penampilan.',
  serena: 'Busana formal bernuansa ivory, champagne, atau biru lembut. Mohon hindari busana putih penuh agar menjadi warna khusus pengantin.',
  lumiere: 'Busana formal dengan warna pilihan kalian. Sentuhan satin atau aksesori sederhana dapat melengkapi suasana perayaan.',
  nusantara: 'Batik, kebaya, atau busana formal dengan warna pilihan kalian. Mari merayakan hari bahagia ini dengan nyaman.',
  meadow: 'Busana semi-formal yang nyaman. Motif bunga atau warna hangat akan menyatu dengan suasana taman. Gunakan sepatu datar agar mudah berjalan di area rumput.',
  botanica: 'Batik modern atau formal attire bernuansa earth tone & dusty rose. Mohon tidak mengenakan busana serba putih.',
};

const ACCESS = {
  blocka: 'Parkir tersedia di halaman gedung. Tamu lansia dan pengguna kursi roda dapat turun di pintu utama; petugas siap membantu.',
  mayura: 'Parkir tersedia di halaman gedung. Pintu utama memiliki akses tanpa tangga; petugas siap membantu tamu lansia dan pengguna kursi roda.',
  pusaka: 'Parkir tersedia di halaman pendopo. Tamu lansia dan pengguna kursi roda dapat turun di pintu utama; petugas siap membantu.',
  amora: 'Parkir tersedia di basement masjid. Akses dari pintu samping untuk tamu keluarga.',
  elysian: 'Valet parking di lobi utama. Taksi online bisa drop-off di pintu ballroom.',
  serena: 'Parkir gratis di halaman gedung. Shuttle dari parkiran ke pintu utama setiap 10 menit.',
  lumiere: 'Parkir tersedia di bawah tanah hotel. Lift menuju ballroom berada di dekat lobi utama; petugas akan membantu menunjukkan arah.',
  nusantara: 'Area parkir pendopo kapasitas 80 mobil. Disarankan naik kendaraan bersama.',
  meadow: 'Parkir kendaraan roda dua dan empat tersedia di samping gedung. Pintu masuk berjarak sekitar 50 meter; tamu yang memerlukan bantuan dapat turun di dekat pintu utama.',
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
      coverImage: tplId === 'blocka' ? '' : tplId === 'lumiere' && variantId === 'lumiere-clean' ? '/demo/modern.webp' : COVERS[tplId] || COVERS.amora,
      groom: isBotanica
        ? { name: 'Odiq Pratama, S.T.', nickname: 'Odiq', description: 'Putra pertama dari Bapak Triyono & Ibu Sri Rahayu' }
        : { name: 'Raka Aditya', nickname: 'Raka', description: 'Putra pertama dari Bapak Hartono & Ibu Dewi', ...(['amora', 'nusantara', 'lumiere', 'elysian', 'pusaka', 'mayura', 'blocka', 'meadow', 'serena'].includes(tplId) ? { photoUrl: '/demo/jawa.webp' } : {}) },
      bride: isBotanica
        ? { name: 'Ayu Lestari, S.Farm.', nickname: 'Ayu', description: 'Putri kedua dari Bapak Handoko & Ibu Endang Susilowati' }
        : { name: 'Alya Paramita', nickname: 'Alya', description: 'Putri kedua dari Bapak Bambang & Ibu Sri', ...(['amora', 'nusantara', 'lumiere', 'elysian', 'pusaka', 'mayura', 'blocka', 'meadow', 'serena'].includes(tplId) ? { photoUrl: '/demo/melati-pengantin.webp' } : {}) },
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
        { date: '2019', title: 'Pertama Bertemu', text: 'Kami dipertemukan di sebuah acara kampus, berbincang tentang hal-hal kecil yang ternyata jadi awal segalanya.', ...(tplId === 'lumiere' ? { image: '/demo/candid-laughing.webp' } : {}) },
        { date: '2022', title: 'Memulai Cerita', text: 'Setelah lama saling mengenal, kami memutuskan untuk melangkah lebih serius bersama.', ...(tplId === 'lumiere' ? { image: '/demo/modern.webp' } : {}) },
        { date: '2026', title: 'Lamaran', text: 'Di bawah langit senja, sebuah pertanyaan diajukan — dan jawabannya adalah selamanya.', ...(tplId === 'lumiere' ? { image: '/demo/ring-hand.webp' } : {}) },
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
