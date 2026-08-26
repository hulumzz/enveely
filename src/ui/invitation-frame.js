// Enveely — InvitationFrame: renders a REAL invitation (via the render engine)
// inside a scaled, elegantly framed container. Used by landing hero collage,
// showcase, and family cards; reusable anywhere a live mini-invitation helps.
//
// Why scaled DOM instead of screenshots: zero extra assets, always in sync
// with template DNA, and interactive hover states stay possible.
//
// Fit system (no more half-filled frames):
//   1. The invitation is authored against a fixed 430px design width. All
//      invitation CSS uses --inv-vw instead of raw vw so type scales with the
//      FRAME, not the browser viewport (1 unit = 4.3px inside the frame).
//   2. After paint, the inner content is measured and scaled to COVER the
//      frame box (like background-size: cover), so it always fills edge-to-edge.
//   3. Frames render in "lite" mode: map iframes are stripped (9 landing
//      frames would otherwise load 9 Google Maps embeds) and heavy sections
//      are trimmed via _lite.
import { sampleInvitation } from '../data/sample-invitation.js';
import { renderInvitation } from '../engine/renderer.js';

const DESIGN_W = 430;
const observers = new WeakMap();

/**
 * Render an invitation frame placeholder element.
 * @param {{templateId: string, variantId?: string, frame?: 'arch'|'phone'|'editorial'|'polaroid', scale?: number, rotate?: number, lite?: boolean}} cfg
 * @returns {string} HTML string — call hydrateInvitationFrames(root) after insert.
 */
export function invitationFrame(cfg) {
  const {
    templateId,
    variantId = '',
    frame = 'arch',
    scale = 0,
    rotate = 0,
    lite = true,
  } = cfg;

  // scale=0 means "auto-fit": JS measures the painted content and scales it
  // to cover the frame box. A manual scale still wins when provided.
  const rot = rotate ? ` style="--frame-rotate:${rotate}deg"` : '';
  return `
  <div class="inv-frame inv-frame--${frame}" data-inv-frame
       data-template="${templateId}" data-variant="${variantId}"
       data-scale="${scale}" data-lite="${lite ? '1' : '0'}"${rot} aria-hidden="true">
    <div class="inv-frame__skeleton"></div>
  </div>`;
}
/**
 * Hydrate all [data-inv-frame] under root: lazily render the real invitation
 * when the frame approaches the viewport.
 */
export function hydrateInvitationFrames(root) {
  const frames = root.querySelectorAll('[data-inv-frame]:not([data-hydrated])');
  if (!frames.length) return;

  if (!('IntersectionObserver' in window)) {
    frames.forEach((el) => paint(el));
    return;
  }

  let io = observers.get(root);
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          paint(entry.target);
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '300px 0px' });
    observers.set(root, io);
  }
  frames.forEach((el) => io.observe(el));
}

function paint(el) {
  if (el.dataset.hydrated) return;
  el.dataset.hydrated = 'true';

  // Attributes are data-template/data-variant (dataset.template/dataset.variant).
  const templateId = el.dataset.template;
  const variantId = el.dataset.variant || '';
  const manualScale = Number(el.dataset.scale) || 0;
  const lite = el.dataset.lite !== '0';

  const inner = document.createElement('div');
  inner.className = 'inv-frame__inner';
  inner.style.setProperty('--inv-scale', String(manualScale || 1));

  try {
    const invitation = sampleInvitation(templateId, variantId);
    if (lite) {
      invitation._lite = true;
      // Trim long-tail sections so mini previews stay light and scannable.
      const keep = new Set(['cover', 'welcome', 'couple', 'event', 'countdown', 'gallery', 'closing']);
      invitation.sections = (invitation.sections || []).filter((s) => keep.has(s.id));
    }
    inner.innerHTML = `<div class="inv-frame__content">${renderInvitation(invitation)}</div>`;
    el.appendChild(inner);

    if (manualScale > 0) {
      el.classList.add('is-painted');
    } else {
      requestAnimationFrame(() => fitFrame(el, inner));
    }
  } catch {
    el.classList.add('is-broken');
  }
}

/**
 * Scale the painted content so it COVERS the frame box (like cover-fit).
 * Transform-only → no layout thrash; runs once per frame (+ once after fonts).
 */
function fitFrame(el, inner) {
  const content = inner.firstElementChild;
  if (!content) {
    el.classList.add('is-painted');
    return;
  }

  const measure = () => {
    if (!el.isConnected) return;
    const frameW = el.clientWidth || 1;
    const frameH = el.clientHeight || 1;
    const cw = Math.max(content.scrollWidth, DESIGN_W);
    const ch = Math.max(content.scrollHeight, 1);
    const scale = Math.max(frameW / cw, frameH / ch);
    inner.style.setProperty('--inv-scale', scale.toFixed(4));
    // Center horizontally, but anchor to the TOP vertically: the invitation
    // cover (names + date) is the most representative crop for a preview.
    inner.style.left = `${(frameW - cw * scale) / 2}px`;
    inner.style.top = '0px';
    el.classList.add('is-painted');
  };

  measure();
  // Fonts swap late → re-measure once they are ready (bounded, no loops).
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => measure()).catch(() => {});
  }
}
