// Enveely — Section registry (Blueprint-1.md §15).
// Core invitation sections. Templates declare which they support/recommend;
// renderer resolves order from invitation.sections[].order + enabled flags.

/**
 * @typedef {Object} SectionDef
 * @property {string} id
 * @property {string} labelID
 * @property {string} labelEN
 * @property {boolean} core - present in every new invitation by default
 * @property {'required'|'recommended'|'optional'} flexibility
 */

/** @type {SectionDef[]} */
export const sectionDefs = [
  { id: 'cover', labelID: 'Sampul', labelEN: 'Cover', core: true, flexibility: 'required' },
  { id: 'welcome', labelID: 'Pembuka', labelEN: 'Welcome', core: true, flexibility: 'optional' },
  { id: 'couple', labelID: 'Mempelai', labelEN: 'Couple', core: true, flexibility: 'required' },
  { id: 'parents', labelID: 'Orang Tua', labelEN: 'Parents', core: false, flexibility: 'optional' },
  { id: 'quote', labelID: 'Kutipan', labelEN: 'Quote', core: false, flexibility: 'optional' },
  { id: 'event', labelID: 'Acara', labelEN: 'Events', core: true, flexibility: 'required' },
  { id: 'countdown', labelID: 'Hitung Mundur', labelEN: 'Countdown', core: true, flexibility: 'recommended' },
  { id: 'story', labelID: 'Cerita', labelEN: 'Story', core: false, flexibility: 'optional' },
  { id: 'gallery', labelID: 'Galeri', labelEN: 'Gallery', core: true, flexibility: 'recommended' },
  { id: 'video', labelID: 'Video', labelEN: 'Video', core: false, flexibility: 'optional' },
  { id: 'map', labelID: 'Lokasi', labelEN: 'Location', core: true, flexibility: 'recommended' },
  { id: 'info', labelID: 'Info Penting', labelEN: 'Info', core: false, flexibility: 'optional' },
  { id: 'rsvp', labelID: 'RSVP', labelEN: 'RSVP', core: true, flexibility: 'recommended' },
  { id: 'gift', labelID: 'Hadiah', labelEN: 'Gift', core: false, flexibility: 'optional' },
  { id: 'wishes', labelID: 'Ucapan', labelEN: 'Wishes', core: false, flexibility: 'optional' },
  { id: 'music', labelID: 'Musik', labelEN: 'Music', core: false, flexibility: 'optional' },
  { id: 'closing', labelID: 'Penutup', labelEN: 'Closing', core: true, flexibility: 'required' },
];

export function getSectionDef(id) {
  return sectionDefs.find((s) => s.id === id) || null;
}
