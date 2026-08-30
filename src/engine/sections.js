// Enveely — Invitation section components.
// Each renderer returns an HTML string. Layout differentiation between
// templates comes from: layout class (data-layout), template CSS scope
// (.inv--<templateId>), ornament selection, and design tokens — NOT from
// separate HTML per family (data-driven design system, Blueprint-1.md §40).

import { esc, invT, formatDateLong, formatDateParts, formatTimeRange, mapsUrlFor } from '../core/format.js';
import { ornamentSvg, cornerOrnament, dividerOrnament } from '../data/ornaments.js';

const AMP = '&amp;'; // renders as "&" between couple names

export function renderCover(ctx) {
  const { c, design } = ctx;
  const corner = cornerOrnament(design.ornamentSet);
  return `
  <section class="sec sec--cover" data-section="cover" data-layout="${esc(design.layouts.cover)}">
    ${corner ? `<span class="corner corner--tl">${ornamentSvg(corner)}</span>` : ''}
    ${corner ? `<span class="corner corner--br">${ornamentSvg(corner)}</span>` : ''}
    <div class="cover__media">
      <img src="${esc(c.coverImage || placeholder(c))}" alt="" loading="eager" />
    </div>
    <div class="cover__body">
      <p class="cover__eyebrow">${esc(c.coverEyebrow ?? defaultEyebrow(ctx.locale))}</p>
      <h1 class="cover__names">${namesLine(ctx)}</h1>
      <p class="cover__date">${esc(formatDateLong(c.weddingDate, ctx.locale))}</p>
      <a class="btn-inv" href="#welcome" data-scroll>${esc(invT(ctx.locale, 'open'))}</a>
    </div>
  </section>`;
}

export function renderWelcome(ctx) {
  const { c } = ctx;
  if (!c.welcomeMessage && !c.hostName) return '';
  return `
  <section class="sec sec--welcome" data-section="welcome" id="welcome">
    <p class="welcome__text">${esc(c.welcomeMessage || defaultWelcome(ctx.locale))}</p>
    ${c.hostName ? `<p class="welcome__host">— ${esc(c.hostName)}</p>` : ''}
  </section>`;
}

export function renderCouple(ctx) {
  const { c, design } = ctx;
  const div = dividerOrnament(design.ornamentSet);
  return `
  <section class="sec sec--couple" data-section="couple" data-layout="${esc(design.layouts.couple)}">
    <header class="sec-head">
      <h2>${esc(invT(ctx.locale, 'coupleTitle'))}</h2>
      <p class="sec-sub">${esc(invT(ctx.locale, 'coupleSub'))}</p>
    </header>
    <div class="couple__grid">
      ${person(c.groom)}
      <div class="couple__amp" aria-hidden="true">${AMP}</div>
      ${person(c.bride)}
    </div>
    ${div ? `<div class="sec-divider">${ornamentSvg(div)}</div>` : ''}
  </section>`;
}

export function renderParents(ctx) {
  const { c } = ctx;
  if (!c.parents?.groom && !c.parents?.bride) return '';
  return `
  <section class="sec sec--parents" data-section="parents">
    ${c.parents?.groom ? `<p>${esc(c.parents.groom)}</p>` : ''}
    ${c.parents?.bride ? `<p>${esc(c.parents.bride)}</p>` : ''}
  </section>`;
}

export function renderEvents(ctx) {
  const { c, design } = ctx;
  const events = (c.events || []).filter((e) => e.title || e.venue);
  if (!events.length) return '';
  const div = dividerOrnament(design.ornamentSet);
  return `
  <section class="sec sec--events" data-section="event" data-layout="${esc(design.layouts.events)}">
    <header class="sec-head">
      <h2>${esc(invT(ctx.locale, 'eventsTitle'))}</h2>
      <p class="sec-sub">${esc(events.map((e) => e.title).join(' · '))}</p>
    </header>
    <div class="events__list">
      ${events.map((ev) => eventCard(ev, ctx)).join('')}
    </div>
    ${div ? `<div class="sec-divider">${ornamentSvg(div)}</div>` : ''}
  </section>`;
}

export function renderCountdown(ctx) {
  const { c, design } = ctx;
  if (!c.weddingDate) return '';
  return `
  <section class="sec sec--countdown" data-section="countdown" data-layout="${design.layoutStrategy}">
    <h2 class="countdown__title">${esc(invT(ctx.locale, 'countdownTitle'))}</h2>
    <div class="countdown__grid" data-countdown-date="${esc(c.weddingDate)}">
      ${['days', 'hours', 'minutes', 'seconds'].map(
        (u) => `<div class="countdown__cell"><span class="countdown__num" data-unit="${u}">00</span><span class="countdown__label">${esc(invT(ctx.locale, u))}</span></div>`,
      ).join('')}
    </div>
  </section>`;
}

export function renderQuote(ctx) {
  const { c, design } = ctx;
  const q = c.quoteSettings || {};
  if (!q.text && !ctx.draftMode) return '';
  const div = dividerOrnament(design.ornamentSet);
  const text = q.text || defaultQuote(ctx.locale);
  return `
  <section class="sec sec--quote" data-section="quote" data-layout="${esc(design.layouts.quote || 'centerQuote')}">
    <div class="quote__mark">“</div>
    <blockquote class="quote__text">${esc(text)}</blockquote>
    ${q.source ? `<p class="quote__source">— ${esc(q.source)}</p>` : ''}
    ${div ? `<div class="sec-divider">${ornamentSvg(div)}</div>` : ''}
  </section>`;
}

export function renderInfo(ctx) {
  const { c } = ctx;
  const i = c.infoSettings || {};
  const hasContent = i.dressCode || i.access || i.notes;
  if (!hasContent && !ctx.draftMode) return '';
  return `
  <section class="sec sec--info" data-section="info">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'infoTitle'))}</h2></header>
    <div class="info__cards">
      ${i.dressCode ? `
        <article class="info__card">
          <span class="info__icon">${infoIconSvg('dress')}</span>
          <h3>Dress Code</h3>
          <p>${esc(i.dressCode)}</p>
        </article>` : ''}
      ${i.access ? `
        <article class="info__card">
          <span class="info__icon">${infoIconSvg('car')}</span>
          <h3>${esc(invT(ctx.locale, 'infoAccess'))}</h3>
          <p>${esc(i.access).replace(/\n/g, '<br/>')}</p>
        </article>` : ''}
      ${i.notes ? `
        <article class="info__card info__card--wide">
          <span class="info__icon">${infoIconSvg('note')}</span>
          <h3>${esc(invT(ctx.locale, 'infoNotes'))}</h3>
          <p>${esc(i.notes).replace(/\n/g, '<br/>')}</p>
        </article>` : ''}
    </div>
  </section>`;
}

export function renderStory(ctx) {
  const { c, design } = ctx;
  const items = c.story || [];
  if (!items.length) return '';
  const div = dividerOrnament(design.ornamentSet);
  return `
  <section class="sec sec--story" data-section="story" data-layout="${esc(design.layouts.story)}">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'storyTitle'))}</h2></header>
    <ol class="story__list">
      ${items.map((s) => `
        <li class="story__item">
          ${s.image ? `<figure class="story__fig"><img src="${esc(s.image)}" alt="" loading="lazy"/></figure>` : ''}
          <div class="story__text">
            ${s.date ? `<time>${esc(s.date)}</time>` : ''}
            <h3>${esc(s.title || '')}</h3>
            <p>${esc(s.text || '')}</p>
          </div>
        </li>`).join('')}
    </ol>
    ${div ? `<div class="sec-divider">${ornamentSvg(div)}</div>` : ''}
  </section>`;
}

export function renderGallery(ctx) {
  const { c, design } = ctx;
  const photos = (c.gallery || []).map((g) => g.url || g).filter(Boolean);
  if (!photos.length) return '';
  return `
  <section class="sec sec--gallery" data-section="gallery" data-layout="${esc(design.layouts.gallery)}">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'galleryTitle'))}</h2></header>
    <div class="gallery__grid gallery__grid--${Math.min(photos.length, 9)}">
      ${photos.map((url, i) => `<figure class="gallery__item" style="--i:${i}"><img src="${esc(url)}" alt="" loading="lazy"/></figure>`).join('')}
    </div>
  </section>`;
}

export function renderMap(ctx) {
  const { c } = ctx;
  const ev = (c.events || []).find((e) => e.venue || e.address);
  if (!ev) return '';
  const query = [ev.venue, ev.address].filter(Boolean).join(', ');
  const embedQuery = encodeURIComponent(query);
  // Lite mode (mini previews): skip the Google Maps iframe — a landing page
  // with many frames would otherwise load one Maps embed per frame.
  const mapEmbed = ctx.liteMode
    ? ''
    : `
    <div class="map__frame">
      <iframe title="Peta lokasi acara" src="https://www.google.com/maps?q=${embedQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>`;
  return `
  <section class="sec sec--map" data-section="map">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'mapTitle'))}</h2></header>
    <p class="map__venue">${esc(ev.venue || '')}</p>
    <p class="map__addr muted-inv">${esc(ev.address || '')}</p>${mapEmbed}
    <div class="map__actions">
      <a class="btn-inv btn-inv--ghost" target="_blank" rel="noopener" href="${esc(mapsUrlFor(query))}">${esc(invT(ctx.locale, 'viewMap'))}</a>
      <a class="btn-inv btn-inv--ghost" target="_blank" rel="noopener" href="${esc(`https://www.google.com/maps/dir/?api=1&destination=${embedQuery}`)}">${esc(invT(ctx.locale, 'navigate'))}</a>
    </div>
  </section>`;
}

export function renderRsvp(ctx) {
  const { c } = ctx;
  const s = c.rsvpSettings || {};
  if (s.enabled === false) return '';
  return `
  <section class="sec sec--rsvp" data-section="rsvp" data-layout="${ctx.design.layouts.rsvp}">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'rsvpTitle'))}</h2></header>
    <form class="rsvp__form" data-rsvp-form invitation-id="${esc(ctx.invitationId || '')}">
      <label class="fld">
        <span>${esc(invT(ctx.locale, 'yourName'))}</span>
        <input name="name" required maxlength="80" autocomplete="name"/>
      </label>
      ${s.askAttendance !== false ? `
      <fieldset class="fld fld--choice">
        <legend class="sr-only">Attendance</legend>
        <label><input type="radio" name="attendance" value="attending" checked/> ${esc(invT(ctx.locale, 'attendYes'))}</label>
        <label><input type="radio" name="attendance" value="not-attending"/> ${esc(invT(ctx.locale, 'attendNo'))}</label>
      </fieldset>` : ''}
      ${s.askGuestCount !== false ? `
      <label class="fld">
        <span>${esc(invT(ctx.locale, 'guests'))}</span>
        <input type="number" name="guestCount" min="1" max="${Number(s.maxGuestCount) || 5}" value="1"/>
      </label>` : ''}
      ${s.allowMessage !== false ? `
      <label class="fld">
        <span>${esc(invT(ctx.locale, 'messageOptional'))}</span>
        <textarea name="message" rows="3" maxlength="500"></textarea>
      </label>` : ''}
      <button class="btn-inv" type="submit">${esc(invT(ctx.locale, 'send'))}</button>
      <p class="rsvp__done sr-only" role="status">${esc(invT(ctx.locale, 'rsvpThanks'))}</p>
    </form>
  </section>`;
}

export function renderGift(ctx) {
  const { c } = ctx;
  const g = c.giftSettings || {};
  if (!g.enabled) return '';
  return `
  <section class="sec sec--gift" data-section="gift">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'giftTitle'))}</h2></header>
    <p class="gift__note">${esc(invT(ctx.locale, 'giftNote'))}</p>
    ${(g.accounts || []).map((a) => `
      <div class="gift__card">
        <span class="gift__bank">${esc(a.bank || '')}</span>
        <span class="gift__number">${esc(a.number || '')}</span>
        <span class="gift__holder">${esc(a.holder || '')}</span>
        <button type="button" class="btn-inv btn-inv--ghost" data-copy="${esc(a.number || '')}">${esc(invT(ctx.locale, 'copy'))}</button>
      </div>`).join('')}
    ${g.address ? `
      <div class="gift__card gift__card--wide">
        <span class="gift__bank">${esc(invT(ctx.locale, 'giftAddress'))}</span>
        <span class="gift__holder">${esc(g.address)}</span>
      </div>` : ''}
  </section>`;
}

export function renderWishes(ctx) {
  const { c } = ctx;
  if (c.wishesEnabled === false) return '';
  return `
  <section class="sec sec--wishes" data-section="wishes">
    <header class="sec-head"><h2>${esc(invT(ctx.locale, 'wishesTitle'))}</h2></header>
    <form class="wishes__form" data-wishes-form invitation-id="${esc(ctx.invitationId || '')}">
      <label class="fld"><span>${esc(invT(ctx.locale, 'wishName'))}</span>
        <input name="name" required maxlength="80"/>
      </label>
      <label class="fld"><span class="sr-only">${esc(invT(ctx.locale, 'wishMessage'))}</span>
        <textarea name="message" rows="3" maxlength="500" placeholder="${esc(invT(ctx.locale, 'wishMessage'))}" required></textarea>
      </label>
      <button class="btn-inv" type="submit">${esc(invT(ctx.locale, 'wishSend'))}</button>
    </form>
    <ul class="wishes__list" data-wishes-list role="list"></ul>
  </section>`;
}

export function renderMusic(ctx) {
  const m = ctx.c.musicSettings || {};
  if (!m.enabled || !m.url) return '';
  return `
  <div class="music-float" data-music
       data-music-src="${esc(m.url)}"
       data-music-autoplay="${m.autoplay === false ? 'false' : 'true'}"
       data-music-loop="${m.loop === false ? 'false' : 'true'}"
       data-music-volume="${Number.isFinite(+m.volume) ? +m.volume : 0.55}">
    <button type="button" class="music-float__btn" data-music-toggle aria-pressed="false" aria-label="Putar / jeda musik">
      <span data-music-icon>♪̸</span>
    </button>
  </div>`;
}

export function renderClosing(ctx) {
  const { c, design } = ctx;
  const div = dividerOrnament(design.ornamentSet);
  return `
  <section class="sec sec--closing" data-section="closing" data-layout="${esc(design.layouts.closing)}">
    ${c.closingImage ? `<figure class="closing__fig"><img src="${esc(c.closingImage)}" alt="" loading="lazy"/></figure>` : ''}
    <p class="closing__thanks">${esc(c.closingMessage || defaultClosing(ctx.locale))}</p>
    <h2 class="closing__names">${namesLine(ctx)}</h2>
    ${div ? `<div class="sec-divider">${ornamentSvg(div)}</div>` : ''}
  </section>`;
}

// ---- helpers ----

function person(p = {}) {
  if (!p.name) return '';
  return `
  <figure class="person">
    <span class="person__photo"><img src="${esc(p.photoUrl || genericAvatar())}" alt="" loading="lazy"/></span>
    <figcaption>
      <h3 class="person__name">${esc(p.name)}</h3>
      ${p.nickname && p.nickname !== p.name ? `<p class="person__nick">${esc(p.nickname)}</p>` : ''}
      ${p.description ? `<p class="person__desc muted-inv">${esc(p.description)}</p>` : ''}
    </figcaption>
  </figure>`;
}

function eventCard(ev, ctx) {
  const parts = ev.date ? formatDateParts(ev.date, ctx.locale) : null;
  return `
  <article class="event-card">
    ${parts ? `
    <div class="event-card__date" aria-hidden="true">
      <span class="d-weekday">${esc(parts.weekday)}</span>
      <span class="d-day">${esc(parts.day)}</span>
      <span class="d-monthyear">${esc(parts.monthYear)}</span>
    </div>` : ''}
    <div class="event-card__info">
      <h3>${esc(ev.title || '')}</h3>
      ${formatTimeRange(ev, ctx.locale) ? `<p class="event-card__time">${esc(formatTimeRange(ev, ctx.locale))}</p>` : ''}
      ${ev.venue ? `<p class="event-card__venue">${esc(ev.venue)}</p>` : ''}
      ${ev.address ? `<p class="event-card__addr muted-inv">${esc(ev.address)}</p>` : ''}
      ${ev.venue || ev.address ? `
      <a class="event-card__link" target="_blank" rel="noopener"
         href="${esc(mapsUrlFor([ev.venue, ev.address].filter(Boolean).join(', ')))}">${esc(invT(ctx.locale, 'openMap'))} ↗</a>` : ''}
    </div>
  </article>`;
}

function namesLine({ c }) {
  const g = c.groom?.name || '';
  const b = c.bride?.name || '';
  if (g && b) return `${esc(g)} &amp; ${esc(b)}`;
  return esc(g || b || '');
}

function placeholder(c) {
  // Neutral gradient placeholder until the user uploads a cover photo.
  // No text label: keeps covers clean at any size.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe7dc"/><stop offset="1" stop-color="#d9c9b6"/></linearGradient></defs><rect width="900" height="1200" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function genericAvatar() {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#ece4da"/><circle cx="200" cy="160" r="70" fill="#c9b8a5"/><path d="M60 400 q140 -150 280 0 z" fill="#c9b8a5"/></svg>`,
  )}`;
}

function defaultEyebrow(locale) {
  return locale === 'en' ? 'THE WEDDING OF' : 'THE WEDDING OF';
}

function defaultWelcome(locale) {
  return locale === 'en'
    ? 'Together with joyful hearts, we invite you to celebrate our wedding day.'
    : 'Dengan penuh sukacita, kami mengundang kalian hadir di hari bahagia kami.';
}

function defaultClosing(locale) {
  return locale === 'en'
    ? 'Your presence and prayers mean everything to us. Thank you.'
    : 'Kehadiran dan doa restu Anda adalah kebahagiaan terbesar bagi kami. Terima kasih.';
}

function defaultQuote(locale) {
  return locale === 'en'
    ? 'And over all these virtues put on love, which binds them all together in perfect unity.'
    : 'Dan di atas semuanya itu, kenakanlah kasih, yang adalah pengikat yang sempurna.';
}

function infoIconSvg(kind) {
  const stroke = 'currentColor';
  const inner = {
    dress: `<path d="M8 4l-3 6 4 1v9h6v-9l4-1-3-6-2 2-2-2-2 2-2-2z" stroke="${stroke}" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`,
    car: `<path d="M3 13l2-5h10l2 5v4h-2v-2H5v2H3v-4zm2.5-1a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" stroke="${stroke}" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`,
    note: `<path d="M5 4h10v12l-3 3H5V4zm0 0v12m0 0v3h7" stroke="${stroke}" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`,
  }[kind] || '';
  return `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">${inner}</svg>`;
}
