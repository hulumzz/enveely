// Enveely — Invitation renderer.
// Pipeline (Blueprint-1.md §25):
//   Invitation JSON + Template DNA + Variant DNA -> resolveDesign -> sections -> DOM
// The renderer never touches Firestore directly.

import { resolveDesign } from '../data/variants.js';
import * as S from './sections.js';

const SECTION_RENDERERS = {
  cover: S.renderCover,
  welcome: S.renderWelcome,
  couple: S.renderCouple,
  parents: S.renderParents,
  quote: S.renderQuote,
  event: S.renderEvents,
  countdown: S.renderCountdown,
  story: S.renderStory,
  gallery: S.renderGallery,
  map: S.renderMap,
  info: S.renderInfo,
  rsvp: S.renderRsvp,
  gift: S.renderGift,
  wishes: S.renderWishes,
  closing: S.renderClosing,
};
/** Default section order for a fresh invitation. */
export const DEFAULT_SECTIONS = [
  'cover', 'welcome', 'couple', 'quote', 'event', 'countdown', 'story',
  'gallery', 'map', 'info', 'rsvp', 'gift', 'wishes', 'closing',
];

/**
 * Render a full invitation into an HTML string.
 * @param {object} invitation invitation document (content + design refs)
 * @returns {string} HTML
 */
export function renderInvitation(invitation) {
  const content = invitation.content || {};
  const designRef = invitation.design || {};
  const design = resolveDesign(designRef.templateId, designRef.variantId);
  if (!design) return `<p class="muted-inv">Template not found.</p>`;

  const ctx = {
    c: content,
    design,
    locale: invitation.locale || 'id',
    invitationId: invitation.id || '',
    // Builder passes _draft=true so empty sections render as editable
    // placeholders instead of disappearing (public invitations hide them).
    draftMode: Boolean(invitation._draft),
    // Mini previews (landing frames) set _lite=true to skip heavy embeds.
    liteMode: Boolean(invitation._lite),
  };

  const order = (invitation.sections?.length
    ? invitation.sections.filter((s) => s.enabled !== false).map((s) => s.id)
    : DEFAULT_SECTIONS
  ).filter((id) => SECTION_RENDERERS[id] && !(ctx.liteMode && id === 'map'));

  const body = order.map((id) => {
    const html = SECTION_RENDERERS[id](ctx);
    return html || (ctx.draftMode ? emptySection(id) : '');
  }).join('\n');

  // Floating controls & modals
  const music = ctx.liteMode ? '' : S.renderMusic(ctx);
  const bottomNav = ctx.liteMode ? '' : S.renderBottomNav(ctx);
  const lightbox = ctx.liteMode ? '' : S.renderLightbox();

  return `
  <article class="inv inv--${design.templateId} ${design.variantId ? `inv--v-${design.variantId}` : ''}"
           style="${designVarsCss(design)}">
    ${body}
    ${music}
    ${bottomNav}
    ${lightbox}
  </article>`;
}

/** Map resolved design DNA to CSS custom properties on the .inv root. */
function designVarsCss(design) {
  const styleVars = {
    '--inv-bg': design.colors.bg,
    '--inv-text': design.colors.text,
    '--inv-primary': design.colors.primary,
    '--inv-accent': design.colors.accent,
    '--inv-font-display': design.fonts.display,
    '--inv-font-body': design.fonts.body,
  };
  if (design.fonts.accent) styleVars['--inv-font-accent'] = design.fonts.accent;
  if (design.templateId === 'botanica') {
    styleVars['--inv-canvas'] = '#F7F2ED';
    styleVars['--inv-warm-cream'] = '#EFE5DD';
    styleVars['--inv-dusty-rose'] = '#B97882';
    styleVars['--inv-muted-mauve'] = '#875C69';
    styleVars['--inv-deep-burgundy'] = '#5F303D';
    styleVars['--inv-soft-blush'] = '#D5A2A9';
    styleVars['--inv-lavender-grey'] = '#AEB3C6';
    styleVars['--inv-charcoal'] = '#382E2E';
  }
  return Object.entries(styleVars)
    .map(([k, v]) => `${k}:${String(v).replace(/"/g, "'")}`)
    .join(';');
}

/** Builder-only placeholder for sections with no content yet. */
function emptySection(id) {
  const labels = {
    welcome: 'Pembuka', parents: 'Orang Tua', story: 'Cerita Kami',
    gallery: 'Galeri Foto', map: 'Lokasi Acara', gift: 'Hadiah', wishes: 'Ucapan',
    video: 'Video',
  };
  const hints = {
    gallery: 'Tambahkan foto dari panel Galeri di kanan.',
    map: 'Isi venue & alamat pada salah satu acara.',
    gift: 'Aktifkan dan isi rekening hadiah dari panel Hadiah.',
    story: 'Tambahkan momen berharga kalian.',
  };
  return `
  <section class="sec sec--empty" data-section="${id}">
    <p class="empty__title">${labels[id] || id}</p>
    <p class="empty__hint">${hints[id] || 'Konten bagian ini belum diisi.'}</p>
  </section>`;
}
