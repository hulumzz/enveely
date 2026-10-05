// Enveely — Three compositional variations for each template family.
// Rule (Blueprint-1.md §14 / Design-1.md §37): a variation must change at least
// hero composition, image density/treatment, ornament set, typography weight,
// background treatment, or section composition — color-only variation is NOT allowed.

import { getTemplate } from './templates.js';

/**
 * @typedef {Object} TemplateVariant
 * @property {string} id - e.g. "amora-garden"
 * @property {string} parentTemplate - family id
 * @property {string} name
 * @property {'low'|'medium'|'high'} density
 * @property {string} layoutStrategy
 * @property {string} ornamentSet
 * @property {string} frameSet
 * @property {{bg?: string, accent?: string}} colorOverrides
 */

/** @type {TemplateVariant[]} */
export const templateVariants = [
  { id: 'blocka-sky-party', parentTemplate: 'blocka', name: 'Sky Party', density: 'medium', layoutStrategy: 'skyPortal', ornamentSet: 'block-world', frameSet: 'stepped-portal', colorOverrides: {} },
  { id: 'blocka-sunshine', parentTemplate: 'blocka', name: 'Sunshine', density: 'high', layoutStrategy: 'sunshineStack', ornamentSet: 'block-world', frameSet: 'stacked-ticket', colorOverrides: { bg: '#ffe9a7', text: '#443219', primary: '#a64d18', accent: '#efab33' } },
  { id: 'blocka-cloud-dancer', parentTemplate: 'blocka', name: 'Cloud Dancer', density: 'medium', layoutStrategy: 'cloudAtrium', ornamentSet: 'block-world', frameSet: 'glass-atrium', colorOverrides: { bg: '#f4f6fb', text: '#243248', primary: '#385b8e', accent: '#9db6d4' } },
  { id: 'mayura-jade', parentTemplate: 'mayura', name: 'Jade', density: 'medium', layoutStrategy: 'jadeAviary', ornamentSet: 'peacock-canopy', frameSet: 'noveau-window', colorOverrides: {} },
  { id: 'mayura-garnet', parentTemplate: 'mayura', name: 'Garnet', density: 'high', layoutStrategy: 'garnetSalon', ornamentSet: 'peacock-canopy', frameSet: 'scalloped-medallion', colorOverrides: { bg: '#4d2038', text: '#fff0e2', primary: '#efbd9d', accent: '#c9aa8a' } },
  { id: 'mayura-pearl', parentTemplate: 'mayura', name: 'Pearl', density: 'medium', layoutStrategy: 'pearlConservatory', ornamentSet: 'peacock-canopy', frameSet: 'asymmetric-inlay', colorOverrides: { bg: '#f2eadb', text: '#214642', primary: '#275e53', accent: '#987439' } },
  { id: 'pusaka-sogan', parentTemplate: 'pusaka', name: 'Sogan', density: 'medium', layoutStrategy: 'soganTheatre', ornamentSet: 'wayang-kayon', frameSet: 'carved-stage', colorOverrides: {} },
  { id: 'pusaka-kencana', parentTemplate: 'pusaka', name: 'Kencana', density: 'high', layoutStrategy: 'lacquerPendopo', ornamentSet: 'wayang-kayon', frameSet: 'pendopo-vault', colorOverrides: { bg: '#631f27', text: '#fff2d5', primary: '#f6cf86', accent: '#d9a254' } },
  { id: 'pusaka-nila', parentTemplate: 'pusaka', name: 'Nila', density: 'medium', layoutStrategy: 'indigoShadow', ornamentSet: 'wayang-kayon', frameSet: 'shadow-screen', colorOverrides: { bg: '#142c40', text: '#f4eedc', primary: '#e6c58b', accent: '#9cadb9' } },
  // Amora — Romantic Floral
  { id: 'amora-garden', parentTemplate: 'amora', name: 'Garden', density: 'medium', layoutStrategy: 'garden', ornamentSet: 'floral-fine', frameSet: 'organic-arch', colorOverrides: {} },
  { id: 'amora-moonlit', parentTemplate: 'amora', name: 'Moonlit', density: 'low', layoutStrategy: 'moonlit', ornamentSet: 'floral-line-dark', frameSet: 'thin-glow', colorOverrides: { bg: '#20232e', text: '#f0e9de', primary: '#ddd0b4', accent: '#c2b3ce' } },
  { id: 'amora-vintage-rose', parentTemplate: 'amora', name: 'Vintage Rose', density: 'high', layoutStrategy: 'vintageRose', ornamentSet: 'rose-frame', frameSet: 'layered-paper', colorOverrides: { bg: '#f4e9df', text: '#513b3a', primary: '#86585d', accent: '#a77b68' } },

  // Elysian — Luxury Editorial
  { id: 'elysian-ivory', parentTemplate: 'elysian', name: 'Ivory', density: 'low', layoutStrategy: 'engravedLetter', ornamentSet: 'couture-engraving', frameSet: 'folded-letter', colorOverrides: {} },
  { id: 'elysian-noir', parentTemplate: 'elysian', name: 'Noir', density: 'low', layoutStrategy: 'lacquerFolio', ornamentSet: 'couture-silver', frameSet: 'inset-lacquer', colorOverrides: { bg: '#191c25', text: '#f4eadd', primary: '#dbc7a2', accent: '#8292aa' } },
  { id: 'elysian-champagne', parentTemplate: 'elysian', name: 'Champagne', density: 'medium', layoutStrategy: 'ribbonProgramme', ornamentSet: 'couture-ribbon', frameSet: 'layered-folio', colorOverrides: { bg: '#e9d6b3', text: '#392c30', primary: '#783f53', accent: '#8c6841' } },

  // Serena — Prince & Princess. IDs retain existing drafts and package prices.
  { id: 'serena-paper', parentTemplate: 'serena', name: 'Royal Ivory', density: 'medium', layoutStrategy: 'ivoryMedallion', ornamentSet: 'royal-palace', frameSet: 'gilded-oval', colorOverrides: {} },
  { id: 'serena-modern-white', parentTemplate: 'serena', name: 'Sapphire Palace', density: 'medium', layoutStrategy: 'sapphireWindow', ornamentSet: 'royal-palace', frameSet: 'palace-window', colorOverrides: { bg: '#142f50', text: '#fff2d7', primary: '#f0ce8d', accent: '#b3cbe2' } },
  { id: 'serena-ink', parentTemplate: 'serena', name: 'Peach Pearl', density: 'medium', layoutStrategy: 'pearlSalon', ornamentSet: 'royal-palace', frameSet: 'silk-cartouche', colorOverrides: { bg: '#f4ded0', text: '#573c34', primary: '#83513e', accent: '#b78b52' } },

  // Lumière — Modern Gallery
  { id: 'lumiere-gallery', parentTemplate: 'lumiere', name: 'Gallery', density: 'high', layoutStrategy: 'midnightPremiere', ornamentSet: 'optical-light', frameSet: 'immersive-screen', colorOverrides: {} },
  { id: 'lumiere-film', parentTemplate: 'lumiere', name: 'Film', density: 'high', layoutStrategy: 'analogPremiere', ornamentSet: 'optical-film', frameSet: 'perforated-reel', colorOverrides: { bg: '#211421', text: '#fff0da', primary: '#edba77', accent: '#dca2c1' } },
  { id: 'lumiere-clean', parentTemplate: 'lumiere', name: 'Clean', density: 'medium', layoutStrategy: 'daylightAlbum', ornamentSet: 'optical-daylight', frameSet: 'offset-album', colorOverrides: { bg: '#f4eddf', text: '#293645', primary: '#324b70', accent: '#93623c' } },

  // Nusantara — Modern Traditional
  { id: 'nusantara-sagara', parentTemplate: 'nusantara', name: 'Sagara', density: 'medium', layoutStrategy: 'wovenGate', ornamentSet: 'geometric-nusantara', frameSet: 'stepped-shield', colorOverrides: { bg: '#073b3b', text: '#fff2d9', primary: '#f4c66b', accent: '#67c6bc' } },
  { id: 'nusantara-puspa', parentTemplate: 'nusantara', name: 'Puspa', density: 'high', layoutStrategy: 'radialCelebration', ornamentSet: 'geometric-nusantara', frameSet: 'jewel-octagon', colorOverrides: { bg: '#58182b', text: '#fff1da', primary: '#ffb874', accent: '#f28c8c' } },
  { id: 'nusantara-terra', parentTemplate: 'nusantara', name: 'Terra', density: 'medium', layoutStrategy: 'terracedCeremony', ornamentSet: 'geometric-nusantara', frameSet: 'terraced-frame', colorOverrides: { bg: '#833b28', text: '#fff2dc', primary: '#ffd087', accent: '#dba8df' } },

  // Meadow — Rustic Botanical
  { id: 'meadow-picnic', parentTemplate: 'meadow', name: 'Picnic', density: 'high', layoutStrategy: 'picnicJournal', ornamentSet: 'woodland-storybook', frameSet: 'layered-postcard', colorOverrides: {} },
  { id: 'meadow-garden', parentTemplate: 'meadow', name: 'Garden', density: 'high', layoutStrategy: 'gardenPavilion', ornamentSet: 'woodland-storybook', frameSet: 'pavilion-window', colorOverrides: { bg: '#dce7ec', text: '#2b4452', primary: '#486c82', accent: '#a47c3c' } },
  { id: 'meadow-film', parentTemplate: 'meadow', name: 'Film', density: 'high', layoutStrategy: 'lanternArchive', ornamentSet: 'woodland-storybook', frameSet: 'perforated-archive', colorOverrides: { bg: '#282321', text: '#faf0dc', primary: '#e7bd7c', accent: '#9babbb' } },

  // Botanica — Romantic Botanical (Editorial Dusty Rose)
  { id: 'botanica-dusty-rose', parentTemplate: 'botanica', name: 'Dusty Rose', density: 'high', layoutStrategy: 'botanicalEditorial', ornamentSet: 'watercolor-rose', frameSet: 'botanical-arch', colorOverrides: { bg: '#F7F2ED', text: '#382E2E', primary: '#5F303D', accent: '#B97882' } },
  { id: 'botanica-mauve-intimate', parentTemplate: 'botanica', name: 'Mauve Intimate', density: 'medium', layoutStrategy: 'intimateEditorial', ornamentSet: 'watercolor-rose', frameSet: 'soft-editorial', colorOverrides: { bg: '#F3ECE7', text: '#2E2525', primary: '#4A222D', accent: '#875C69' } },
  { id: 'botanica-blush-cream', parentTemplate: 'botanica', name: 'Blush Cream', density: 'high', layoutStrategy: 'blushEditorial', ornamentSet: 'watercolor-rose', frameSet: 'double-arch', colorOverrides: { bg: '#EFE5DD', text: '#3D332C', primary: '#5F303D', accent: '#D5A2A9' } },

  // Tempwed — Luxury Floral Animated
  { id: 'tempwed-classic', parentTemplate: 'tempwed', name: 'Classic', density: 'high', layoutStrategy: 'classicFloral', ornamentSet: 'floral-corner-animated', frameSet: 'arch-frame', colorOverrides: {} },
  { id: 'tempwed-golden-hour', parentTemplate: 'tempwed', name: 'Golden Hour', density: 'high', layoutStrategy: 'goldenHour', ornamentSet: 'floral-corner-animated', frameSet: 'arch-frame-gold', colorOverrides: { bg: '#FFF8F0', primary: '#B8860B', accent: '#DAA520' } },
  { id: 'tempwed-midnight-garden', parentTemplate: 'tempwed', name: 'Midnight Garden', density: 'medium', layoutStrategy: 'midnightGarden', ornamentSet: 'floral-corner-dark', frameSet: 'arch-frame-dark', colorOverrides: { bg: '#1A0F12', text: '#FBF9F7', primary: '#D4AF37', accent: '#C98870' } },
];

export function getVariantsFor(templateId) {
  return templateVariants.filter((v) => v.parentTemplate === templateId);
}

export function getVariant(variantId) {
  return templateVariants.find((v) => v.id === variantId) || null;
}

/**
 * Merge family DNA + variant overrides into the final design tokens
 * consumed by the renderer (Content + Template DNA + Variant DNA -> Design).
 */
export function resolveDesign(templateId, variantId) {
  const tpl = getTemplate(templateId);
  if (!tpl) return null;
  const requested = getVariant(variantId);
  const variant = (requested?.parentTemplate === templateId ? requested : null) || getVariantsFor(templateId)[0] || null;

  return {
    templateId: tpl.id,
    variantId: variant?.id ?? null,
    fonts: { ...tpl.fonts },
    colors: {
      ...tpl.colors,
      ...(variant?.colorOverrides?.bg ? { bg: variant.colorOverrides.bg } : {}),
      ...(variant?.colorOverrides?.text ? { text: variant.colorOverrides.text } : {}),
      ...(variant?.colorOverrides?.primary ? { primary: variant.colorOverrides.primary } : {}),
      ...(variant?.colorOverrides?.accent ? { accent: variant.colorOverrides.accent } : {}),
    },
    layouts: { ...tpl.layouts },
    motion: { ...tpl.motion },
    imageDensity: variant?.density ?? tpl.imageDensity,
    ornamentSet: variant?.ornamentSet ?? null,
    frameSet: variant?.frameSet ?? null,
    layoutStrategy: variant?.layoutStrategy ?? null,
  };
}
