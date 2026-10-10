// A thumbnail renders one real section on a 430px canvas, never the full page.
import { sampleInvitation } from '../data/sample-invitation.js';
import { renderInvitation } from '../engine/renderer.js';
import {loadDesignAssets} from '../services/design-assets.js';
import { esc } from '../core/format.js';
const DESIGN_W = 430;
const sessions = new WeakMap();

export function invitationFrame({ templateId, variantId = '', frame = 'arch', rotate = 0, section = 'cover',fit='contain',invitationId='' }) {
  return `<div class="inv-frame inv-frame--${esc(frame)}" data-inv-frame data-template="${esc(templateId)}" data-variant="${esc(variantId)}" data-preview-invitation="${esc(invitationId)}" data-preview-section="${esc(section)}" data-preview-fit="${fit==='cover'?'cover':'contain'}" style="--frame-rotate:${Number(rotate) || 0}deg" aria-hidden="true" inert><div class="inv-frame__skeleton"></div></div>`;
}

export function frameGeometry(width, height, contentHeight,fit='contain') {
  if (!(width > 0 && height > 0 && contentHeight > 0)) return null;
  const scale = (fit==='cover'?Math.max:Math.min)(width / DESIGN_W, height / contentHeight);
  return { scale, left: (width - DESIGN_W * scale) / 2, top: (height - contentHeight * scale) / 2 };
}

export function frameInvitation(templateId, variantId, section = 'cover') {
  const invitation = sampleInvitation(templateId, variantId);
  invitation._lite = true;
  invitation.sections = [{ id: section, enabled: true }];
  return invitation;
}

export function hydrateInvitationFrames(root, drafts = []) {
  let session = sessions.get(root);
  if (!session) {
    let scheduled = 0;
    const frames = new Set();
    const measure = () => {
      scheduled = 0;
      for (const el of frames) {
        if (!el.isConnected) { frames.delete(el); resize?.unobserve(el); const content = el.querySelector('.inv-frame__content'); if (content) resize?.unobserve(content); continue; }
        const inner = el.querySelector('.inv-frame__inner');
        if (!inner) continue;
        const geometry = frameGeometry(el.clientWidth, el.clientHeight, inner.firstElementChild.scrollHeight,el.dataset.previewFit);
        if (!geometry) continue;
        inner.style.setProperty('--inv-scale', String(geometry.scale));
        inner.style.left = geometry.left + 'px';
        inner.style.top = geometry.top + 'px';
        el.classList.add('is-painted');
      }
    };
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(measure); };
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    const paint = async el => {
      if (el.dataset.hydrated) return;
      el.dataset.hydrated = 'true';
      try {
        await loadDesignAssets(el.dataset.template);
        if(!el.isConnected)return;
        const inner = document.createElement('div');
        inner.className = 'inv-frame__inner';
        const draft=drafts.find(item=>item.id===el.dataset.previewInvitation);
        const invitation=draft ? {...draft,_lite:true,sections:[{id:el.dataset.previewSection || 'cover',enabled:true}]} : frameInvitation(el.dataset.template,el.dataset.variant,el.dataset.previewSection);
        inner.innerHTML = '<div class="inv-frame__content">' + renderInvitation(invitation) + '</div>';
        el.appendChild(inner);
        const inv = inner.querySelector('.inv');
        if (inv) el.style.backgroundColor = getComputedStyle(inv).backgroundColor;
        // Late image decoding and fonts can change section height.
        inner.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule, { once: true }));
        resize?.observe(inner.firstElementChild);
        schedule();
      } catch { el.classList.add('is-broken'); }
    };
    const intersection = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { paint(entry.target); intersection.unobserve(entry.target); }
    }), { rootMargin: '300px 0px' }) : null;
    const cleanup = () => {
      intersection?.disconnect(); resize?.disconnect(); cancelAnimationFrame(scheduled);
      frames.clear(); sessions.delete(root);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('env:navigate', cleanup);
    };
    session = { add(el) { frames.add(el); resize?.observe(el); if (intersection) intersection.observe(el); else paint(el); }, schedule };
    sessions.set(root, session);
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('env:navigate', cleanup, { once: true });
    document.fonts?.ready.then(schedule).catch(() => {});
  }
  root.querySelectorAll('[data-inv-frame]:not([data-hydrated])').forEach(el => session.add(el));
  session.schedule();
}
