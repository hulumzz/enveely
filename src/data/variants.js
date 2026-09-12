// Enveely — Template variants (18 total: 6 families × 3).
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
  // Amora — Romantic Floral
  { id: 'amora-garden', parentTemplate: 'amora', name: 'Garden', density: 'medium', layoutStrategy: 'garden', ornamentSet: 'floral-fine', frameSet: 'organic-arch', colorOverrides: {} },
  { id: 'amora-moonlit', parentTemplate: 'amora', name: 'Moonlit', density: 'low', layoutStrategy: 'moonlit', ornamentSet: 'floral-line-dark', frameSet: 'thin-glow', colorOverrides: { bg: '#191720', accent: '#cbb8d4' } },
  { id: 'amora-vintage-rose', parentTemplate: 'amora', name: 'Vintage Rose', density: 'high', layoutStrategy: 'vintageRose', ornamentSet: 'rose-frame', frameSet: 'layered-paper', colorOverrides: { bg: '#f7ecea', accent: '#b76e79' } },

  // Elysian — Luxury Editorial
  { id: 'elysian-ivory', parentTemplate: 'elysian', name: 'Ivory', density: 'low', layoutStrategy: 'ivoryEditorial', ornamentSet: 'minimal-line', frameSet: 'thin-rect', colorOverrides: {} },
  { id: 'elysian-noir', parentTemplate: 'elysian', name: 'Noir', density: 'low', layoutStrategy: 'noirEditorial', ornamentSet: 'single-accent', frameSet: 'hairline', colorOverrides: { bg: '#161513', text: '#efece6', primary: '#efece6' } },
  { id: 'elysian-champagne', parentTemplate: 'elysian', name: 'Champagne', density: 'medium', layoutStrategy: 'champagneEditorial', ornamentSet: 'champagne-line', frameSet: 'double-line', colorOverrides: { bg: '#f5eddd', accent: '#a98f5f' } },

  // Serena — Minimal Romance
  { id: 'serena-paper', parentTemplate: 'serena', name: 'Paper', density: 'low', layoutStrategy: 'paperGrid', ornamentSet: 'none', frameSet: 'none', colorOverrides: { bg: '#f6f1e7' } },
  { id: 'serena-modern-white', parentTemplate: 'serena', name: 'Modern White', density: 'low', layoutStrategy: 'whiteGrid', ornamentSet: 'none', frameSet: 'hairline', colorOverrides: {} },
  { id: 'serena-ink', parentTemplate: 'serena', name: 'Ink', density: 'low', layoutStrategy: 'inkGrid', ornamentSet: 'dot-line', frameSet: 'hairline', colorOverrides: { bg: '#1c1c1c', text: '#ececec', primary: '#ececec' } },

  // Lumière — Modern Gallery
  { id: 'lumiere-gallery', parentTemplate: 'lumiere', name: 'Gallery', density: 'high', layoutStrategy: 'maxGallery', ornamentSet: 'geometric-min', frameSet: 'edge-to-edge', colorOverrides: {} },
  { id: 'lumiere-film', parentTemplate: 'lumiere', name: 'Film', density: 'high', layoutStrategy: 'filmStrip', ornamentSet: 'film-cue', frameSet: 'film-border', colorOverrides: { bg: '#0c0c0e', accent: '#d9c9a3' } },
  { id: 'lumiere-clean', parentTemplate: 'lumiere', name: 'Clean', density: 'medium', layoutStrategy: 'cleanWhitespace', ornamentSet: 'geometric-min', frameSet: 'soft-edge', colorOverrides: { bg: '#f4f2ef', text: '#22201e', primary: '#22201e' } },

  // Nusantara — Modern Traditional
  { id: 'nusantara-sagara', parentTemplate: 'nusantara', name: 'Sagara', density: 'medium', layoutStrategy: 'architectural', ornamentSet: 'geometric-nusantara', frameSet: 'structured', colorOverrides: { bg: '#eef0ee', accent: '#4f6f8f' } },
  { id: 'nusantara-puspa', parentTemplate: 'nusantara', name: 'Puspa', density: 'high', layoutStrategy: 'floralTraditional', ornamentSet: 'botanical-nusantara', frameSet: 'ornate', colorOverrides: { bg: '#faf1e3', accent: '#c2703f' } },
  { id: 'nusantara-terra', parentTemplate: 'nusantara', name: 'Terra', density: 'medium', layoutStrategy: 'earthyFramed', ornamentSet: 'earth-geometric', frameSet: 'clay-frame', colorOverrides: { bg: '#f2e5d3', accent: '#96502e' } },

  // Meadow — Rustic Botanical
  { id: 'meadow-picnic', parentTemplate: 'meadow', name: 'Picnic', density: 'high', layoutStrategy: 'playfulCollage', ornamentSet: 'doodle-leaves', frameSet: 'polaroid-tape', colorOverrides: { bg: '#fbf7ec', accent: '#d99a4e' } },
  { id: 'meadow-garden', parentTemplate: 'meadow', name: 'Garden', density: 'high', layoutStrategy: 'elegantBotanical', ornamentSet: 'leafy-botanical', frameSet: 'organic-irregular', colorOverrides: { bg: '#f3f4ea', accent: '#7d8f63' } },
  { id: 'meadow-film', parentTemplate: 'meadow', name: 'Film', density: 'high', layoutStrategy: 'analogScrapbook', ornamentSet: 'grain-doodle', frameSet: 'polaroid-grain', colorOverrides: { bg: '#efe9dc', accent: '#8a7355' } },

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
  const variant = getVariant(variantId) || getVariantsFor(templateId)[0] || null;

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
