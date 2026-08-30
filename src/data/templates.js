// Enveely — Template catalog: 6 families × Design DNA (Blueprint/Design docs §30–36).
// MVP templates live in code (no admin CMS). Each family declares its DNA;
// variants live in variants.js. This is the single source of truth consumed by
// gallery, preview, creation flow, and the renderer.

/**
 * @typedef {Object} TemplateFamily
 * @property {string} id
 * @property {string} name
 * @property {string} family - design family slug
 * @property {string[]} mood
 * @property {string} moodLabel - display label (ID)
 * @property {'low'|'medium'|'high'} imageDensity
 * @property {string} densityLabel
 * @property {{display: string, body: string, accent?: string}} fonts
 * @property {{bg: string, text: string, primary: string, accent: string}} colors
 * @property {Record<string, string>} layouts - section -> layout strategy
 * @property {{reveal?: string, gallery?: string}} motion
 */

/** @type {TemplateFamily[]} */
export const templateFamilies = [
  {
    id: 'amora',
    name: 'Amora',
    family: 'romantic-floral',
    mood: ['romantic', 'floral', 'elegant'],
    moodLabel: 'Romantis · Floral',
    imageDensity: 'medium',
    densityLabel: 'Foto Sedang',
    fonts: { display: "'Cormorant Garamond', serif", body: "'Manrope', sans-serif", accent: "'DM Serif Display', serif" },
    colors: { bg: '#faf6f1', text: '#3d332c', primary: '#8b6f5a', accent: '#a89484' },
    layouts: {
      cover: 'archPortrait',
      couple: 'splitEditorial',
      events: 'floralCards',
      story: 'narrowColumn',
      gallery: 'featurePlusGrid',
      rsvp: 'framedCard',
      closing: 'floralFade',
      quote: 'warmCenter',
      info: 'floralCards',
    },
    motion: { reveal: 'fade-up', gallery: 'soft-zoom' },
  },
  {
    id: 'elysian',
    name: 'Elysian',
    family: 'luxury-editorial',
    mood: ['luxury', 'editorial'],
    moodLabel: 'Luxury · Editorial',
    imageDensity: 'low',
    densityLabel: 'Foto Sedikit',
    fonts: { display: "'DM Serif Display', serif", body: "'Inter', sans-serif" },
    colors: { bg: '#f7f4ee', text: '#26221e', primary: '#2f2a25', accent: '#b5a380' },
    layouts: {
      cover: 'typographyOnly',
      couple: 'largeNames',
      events: 'editorialTimeline',
      story: 'magazinePage',
      gallery: 'largeFeature',
      rsvp: 'minimalCard',
      closing: 'quoteEnd',
      quote: 'editorialRule',
      info: 'editorialTimeline',
    },
    motion: { reveal: 'slow-reveal', gallery: 'fade' },
  },
  {
    id: 'serena',
    name: 'Serena',
    family: 'minimal-romance',
    mood: ['minimal', 'modern'],
    moodLabel: 'Minimal · Modern',
    imageDensity: 'low',
    densityLabel: 'Foto Sedikit',
    fonts: { display: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    colors: { bg: '#fbfaf8', text: '#2b2926', primary: '#55504a', accent: '#9a938b' },
    layouts: {
      cover: 'stackedNames',
      couple: 'sideBySide',
      events: 'timeline',
      story: 'verticalTimeline',
      gallery: 'singleFeature',
      rsvp: 'centerCard',
      closing: 'namesOnly',
      quote: 'serifQuiet',
      info: 'cleanGrid',
    },
    motion: { reveal: 'fade', gallery: 'none' },
  },
  {
    id: 'lumiere',
    name: 'Lumière',
    family: 'modern-gallery',
    mood: ['modern', 'luxury'],
    moodLabel: 'Modern · Gallery',
    imageDensity: 'high',
    densityLabel: 'Foto Banyak',
    fonts: { display: "'DM Serif Display', serif", body: "'Manrope', sans-serif" },
    colors: { bg: '#111013', text: '#f4f2ef', primary: '#f4f2ef', accent: '#c8b48c' },
    layouts: {
      cover: 'fullBleed',
      couple: 'fullWidthPortrait',
      events: 'modernCards',
      story: 'imageInterleave',
      gallery: 'masonry',
      rsvp: 'floatingPanel',
      closing: 'fullImage',
      quote: 'cinematicGlow',
      info: 'glassPanel',
    },
    motion: { reveal: 'image-reveal', gallery: 'horizontal-slide' },
  },
  {
    id: 'nusantara',
    name: 'Nusantara',
    family: 'modern-traditional',
    mood: ['traditional', 'cultural'],
    moodLabel: 'Tradisional Modern',
    imageDensity: 'medium',
    densityLabel: 'Foto Sedang',
    fonts: { display: "'DM Serif Display', serif", body: "'Inter', sans-serif" },
    colors: { bg: '#f6efe4', text: '#3a2e24', primary: '#7c3f2c', accent: '#b98a4e' },
    layouts: {
      cover: 'framedPortrait',
      couple: 'framedPair',
      events: 'patternBorderCards',
      story: 'separatorStory',
      gallery: 'framedGrid',
      rsvp: 'ornateCard',
      closing: 'ornamentalEnd',
      quote: 'framedScript',
      info: 'patternBorderCards',
    },
    motion: { reveal: 'rise', gallery: 'fade' },
  },
  {
    id: 'meadow',
    name: 'Meadow',
    family: 'rustic-botanical',
    mood: ['rustic', 'warm'],
    moodLabel: 'Rustic · Botanical',
    imageDensity: 'high',
    densityLabel: 'Foto Banyak',
    fonts: { display: "'Cormorant Garamond', serif", body: "'Manrope', sans-serif", accent: "'Caveat', cursive" },
    colors: { bg: '#f7f3ea', text: '#40382e', primary: '#6b7a54', accent: '#c2a37a' },
    layouts: {
      cover: 'polaroidStack',
      couple: 'scrapbookPair',
      events: 'handwrittenCards',
      story: 'scrapbookTimeline',
      gallery: 'collageMasonry',
      rsvp: 'paperCard',
      closing: 'floralEnding',
      quote: 'handwritten',
      info: 'scrapbookTimeline',
    },
    motion: { reveal: 'gentle-scale', gallery: 'soft-zoom' },
  },
];

export function getTemplate(id) {
  return templateFamilies.find((tpl) => tpl.id === id) || null;
}
