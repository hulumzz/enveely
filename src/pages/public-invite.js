// Enveely — Public invitation page (Phase 5).
// Route /invite/:id — renders a PUBLISHED invitation with an opening gate
// (classic digital-invitation UX), guest name personalization via ?to=,
// music, countdown, RSVP/wishes wired to Firestore.

import { renderPage } from '../ui/app-shell.js';
import { getPublishedInvitation, listApprovedWishes } from '../services/firestore-data.js';
import { renderInvitation } from '../engine/renderer.js';
import { attachInvitationInteractions } from '../engine/interactions.js';
import { initInvitationMusic, stopInvitationMusic } from '../engine/music.js';
import { initInvitationMotion } from '../engine/motion.js';
import { esc, invT } from '../core/format.js';
import { stopAllVideos } from '../engine/media.js';

export async function renderPublicInvitation({ id }, query = new URLSearchParams()) {
  // Resolve: cloud published first; local draft fallback (owner preview /
  // local-only mode when Firebase is not configured yet).
  let invitation;
  try { invitation = await getPublishedInvitation(id); }
  catch { return renderInviteNotFound(); }
  if (!invitation || invitation.status !== 'published') return renderInviteNotFound();

  // Dynamic OG tags so WhatsApp/IG previews show the couple's names.
  applyInviteMeta(invitation);

  const guestName = query.get('to') || '';
  const isAmora = invitation.design?.templateId === 'amora';
  const isNusantara = invitation.design?.templateId === 'nusantara';
  const isLumiere = invitation.design?.templateId === 'lumiere';
  const isElysian = invitation.design?.templateId === 'elysian';
  const isPusaka = invitation.design?.templateId === 'pusaka';
  const isMayura = invitation.design?.templateId === 'mayura';
  const isBlocka = invitation.design?.templateId === 'blocka';
  const isMeadow = invitation.design?.templateId === 'meadow';
  const isSerena = invitation.design?.templateId === 'serena';
  const hasDesignGate = isSerena || isMeadow || isBlocka || isAmora || isNusantara || isLumiere || isElysian || isPusaka || isMayura;
  const gateCover = hasDesignGate ? renderInvitation({
    ...invitation, _draft: false, _lite: true,
    sections: [{ id: 'cover', enabled: true }],
    content: { ...invitation.content, guestName: guestName || invitation.content?.guestName },
  }).replace('data-open-cover', 'data-open-invite') : '';

  renderPage(
    `
    <div class="public-invite">
      <div class="invite-gate ${isSerena ? 'invite-gate--serena' : isAmora ? 'invite-gate--amora' : isNusantara ? 'invite-gate--nusantara' : isLumiere ? 'invite-gate--lumiere' : isElysian ? 'invite-gate--elysian' : isPusaka ? 'invite-gate--pusaka' : isMayura ? 'invite-gate--mayura' : isBlocka ? 'invite-gate--blocka' : isMeadow ? 'invite-gate--meadow' : ''}" data-gate>
        ${hasDesignGate ? gateCover : `
        <p class="invite-gate__to">${guestName ? `Kepada ${esc(guestName)}` : ''}</p>
        <p class="invite-gate__eyebrow">THE WEDDING OF</p>
        <h1 class="invite-gate__names">${esc(guestNames(invitation))}</h1>
        <p class="invite-gate__date">${esc(shortDate(invitation.content?.weddingDate))}</p>
        <button type="button" class="btn-inv invite-gate__btn" data-open-invite>${esc(invT(invitation.locale || 'id', 'open'))}</button>`}
      </div>
      <div class="invite-body ${isSerena ? 'invite-body--serena' : isPusaka ? 'invite-body--pusaka' : isMayura ? 'invite-body--mayura' : isBlocka ? 'invite-body--blocka' : isMeadow ? 'invite-body--meadow' : ''}" data-invite-body aria-hidden="true" inert></div>
    </div>
    `,
    (rootEl) => {
      const body = rootEl.querySelector('[data-invite-body]');
      body.innerHTML = renderInvitation({
        ...invitation,
        _draft: false,
        content: {
          ...invitation.content,
          guestName: guestName || invitation.content?.guestName,
        },
      });

      attachInvitationInteractions(body, {});
      hydrateWishes(body, id);

      const gate = rootEl.querySelector('[data-gate]');
      const clearGateMotion = hasDesignGate ? initInvitationMotion(gate) : null;
      const openBtn = rootEl.querySelector('[data-open-invite]');
      openBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        if (gate.classList.contains('is-leaving')) return;
        gate.classList.add('is-leaving');
        setTimeout(() => {
          clearGateMotion?.();
          gate.remove();
          body.removeAttribute('aria-hidden');
          body.inert = false;
          if (hasDesignGate) {
            body.querySelector('.inv')?.classList.add('is-opened');
            body.querySelector('.sec--cover')?.nextElementSibling?.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : isSerena ? 1400 : isMeadow ? 1250 : isBlocka ? 1100 : isMayura ? 1200 : isPusaka ? 1150 : isNusantara ? 900 : isLumiere ? 950 : isElysian ? 1000 : 650);
        document.dispatchEvent(new CustomEvent('env:gate-opened'));
      });

      initInvitationMusic(body);
    },
  );
}

async function hydrateWishes(bodyEl, invitationId) {
  const list = bodyEl.querySelector('[data-wishes-list]');
  if (!list || !invitationId) return;
  try {
    const wishes = await listApprovedWishes(invitationId);
    for (const w of wishes) {
      const li = document.createElement('li');
      const b = document.createElement('b');
      b.textContent = w.name || '—';
      const p = document.createElement('p');
      p.textContent = w.message || '';
      li.append(b, p);
      list.appendChild(li);
    }
  } catch {
    /* wishes stay empty on failure */
  }
}

function guestNames(invitation) {
  const g = invitation.content?.groom?.name || '';
  const b = invitation.content?.bride?.name || '';
  return [g, b].filter(Boolean).join(' & ') || 'Undangan Pernikahan';
}

/** Update OG/meta tags for link-preview crawlers (best effort client-side). */
function applyInviteMeta(invitation) {
  const names = guestNames(invitation);
  const setMeta = (selector, attr, value) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  document.title = `${names} — Undangan Pernikahan`;
  setMeta('meta[property="og:title"]', 'content', `Undangan Pernikahan ${names}`);
  setMeta('meta[property="og:description"]', 'content',
    invitation.content?.weddingDate ? `Kami menikah pada ${shortDate(invitation.content.weddingDate)}. Buka undangan berikut.` : 'Buka undangan pernikahan kami.');
}

function shortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderInviteNotFound() {
  stopInvitationMusic();
  stopAllVideos();
  renderPage(
    `
    <section class="section notfound">
      <div class="container notfound__inner">
        <p class="eyebrow">404</p>
        <h1>Undangan tidak ditemukan</h1>
        <p class="muted">Tautan ini tidak valid atau undangan belum dipublikasikan.</p>
        <a href="/" data-link class="btn btn--primary">Ke Halaman Utama</a>
      </div>
    </section>`,
  );
}
