// Enveely — Invitation runtime interactions.
// Wires behavior to rendered invitation DOM: countdown timers, copy-to-
// clipboard, RSVP/wishes form handling. Firestore submission lands in Phase 3.

/** Start all [data-countdown-date] tickers within a root. */
import { initInvitationMotion } from './motion.js';

export function startCountdowns(root) {
  const timers = [];
  root.querySelectorAll('[data-countdown-date]').forEach((el) => {
    const target = new Date(`${el.dataset.countdownDate}T00:00:00`);
    if (Number.isNaN(target.getTime())) return;

    const cells = {
      days: el.querySelector('[data-unit="days"]'),
      hours: el.querySelector('[data-unit="hours"]'),
      minutes: el.querySelector('[data-unit="minutes"]'),
      seconds: el.querySelector('[data-unit="seconds"]'),
    };
    const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

    const tick = () => {
      let diff = Math.floor((target.getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        Object.values(cells).forEach((c) => c && (c.textContent = '00'));
        clearInterval(timer);
        return;
      }
      cells.days.textContent = pad(Math.floor(diff / 86400));
      cells.hours.textContent = pad(Math.floor((diff % 86400) / 3600));
      cells.minutes.textContent = pad(Math.floor((diff % 3600) / 60));
      cells.seconds.textContent = pad(diff % 60);
    };

    const timer = setInterval(tick, 1000);
    tick();
    timers.push(timer);
  });
  const cleanup = () => { timers.forEach(clearInterval); document.removeEventListener('env:navigate', cleanup); };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}

/** Wire [data-copy] buttons (gift account numbers). */
export function wireCopyButtons(root) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy || '');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Tersalin';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('is-copied');
      }, 1500);
    } catch {
      /* clipboard unavailable */
    }
  });
}

/**
 * Wire RSVP forms. In demo mode submissions resolve locally;
 * with a real invitationId they will persist via firestore service (Phase 3).
 */
export function wireRsvpForms(root, { demo = false } = {}) {
  root.querySelectorAll('[data-rsvp-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.sending) return;
      const data = Object.fromEntries(new FormData(form).entries());
      form.dataset.sending = 'true';
      const button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;
      try {
      if (!demo) {
        if (!form.getAttribute('invitation-id')) throw new Error('Undangan belum tersedia.');
        const {guestChallenge}=await import('../services/guest-challenge.js');
        data._token=await guestChallenge(form,'rsvp');data._requestId=form.dataset.requestId ||= crypto.randomUUID();
        const { submitRsvp } = await import('../services/firestore-data.js');
        await submitRsvp(form.getAttribute('invitation-id'), data);
      }
      const done = form.querySelector('.rsvp__done');
      if (done) {
        done.classList.remove('sr-only');
        setTimeout(() => done.classList.add('sr-only'), 4000);
      }
      form.reset();delete form.dataset.requestId;
      submissionFeedback(form,demo ? 'Pratinjau: konfirmasi tidak dikirim.' : 'Konfirmasi kehadiran berhasil dikirim.');
      } catch(error) { submissionFeedback(form,error.message || 'Konfirmasi belum terkirim.'); }
      finally {delete form.dataset.sending;if(button)button.disabled=false;}
    });
  });
}

/** Wire wishes forms; renders submitted wish into the local list. */
export function wireWishesForms(root, { demo = false } = {}) {
  root.querySelectorAll('[data-wishes-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.sending) return;
      const data = Object.fromEntries(new FormData(form).entries());
      form.dataset.sending = 'true';
      const button = form.querySelector('[type="submit"]');
      if(button)button.disabled=true;
      try {
      if (!demo) {
        if (!form.getAttribute('invitation-id')) throw new Error('Undangan belum tersedia.');
        const {guestChallenge}=await import('../services/guest-challenge.js');
        data._token=await guestChallenge(form,'wish');data._requestId=form.dataset.requestId ||= crypto.randomUUID();
        const { submitWish } = await import('../services/firestore-data.js');
        await submitWish(form.getAttribute('invitation-id'), data);
      }
      const list = root.querySelector('[data-wishes-list]');
      if (demo && list) {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = data.name || '—';
        const p = document.createElement('p');
        p.textContent = data.message || '';
        li.append(b, p);
        list.prepend(li);
      }
      form.reset();delete form.dataset.requestId;
      submissionFeedback(form,demo ? 'Pratinjau: ucapan tidak dikirim.' : 'Ucapan berhasil dikirim dan menunggu persetujuan pemilik undangan.');
      } catch(error) { submissionFeedback(form,error.message || 'Ucapan belum terkirim.'); }
      finally {delete form.dataset.sending;if(button)button.disabled=false;}
    });
  });
}

function submissionFeedback(form,message) {
  let feedback = form.querySelector('[data-submit-feedback]');
  if(!feedback){feedback=document.createElement('p');feedback.dataset.submitFeedback='';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');form.append(feedback);}
  feedback.textContent=message;
}

/**
 * Wire persistent bottom navigation with smooth scrolling and active scroll spy.
 */
export function wireBottomNav(root) {
  const nav = root.querySelector('[data-inv-nav]');
  if (!nav) return;

  const items = nav.querySelectorAll('[data-nav-target]');
  if (!items.length) return;

  // Determine scroll container: either closest scrollable ancestor or window
  let scrollContainer = root.closest('.device-frame__inner');
  const isWindow = !scrollContainer;

  const targetIds = ['cover', 'couple', 'event', 'gallery', 'wishes'];
  const targets = targetIds
    .map((id) => ({ id, el: root.querySelector(`#${id}`) }))
    .filter((t) => Boolean(t.el));

  // Smooth scroll handler
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('[data-nav-target]');
    if (!link) return;
    e.preventDefault();
    const id = link.dataset.navTarget;
    const targetEl = root.querySelector(`#${id}`);
    if (!targetEl) return;

    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (isWindow) targetEl.scrollIntoView({ behavior, block: 'start' });
    else scrollContainer.scrollTo({ top: scrollContainer.scrollTop + targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top, behavior });
  });

  // Scroll spy to update active pill item
  const updateActive = () => {
    const viewportTop = scrollContainer?.getBoundingClientRect().top || 0;
    const height = isWindow ? window.innerHeight : scrollContainer.clientHeight;
    // Keep the current chapter selected until the following chapter enters.
    let closest = targets[0]?.id;
    targets.forEach(({ id, el }) => {
      if (el.getBoundingClientRect().top <= viewportTop + height * .25) closest = id;
    });

    if (closest) {
      items.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.navTarget === closest);
        if (item.dataset.navTarget === closest) item.setAttribute('aria-current', 'location');
        else item.removeAttribute('aria-current');
      });
    }
  };

  const scroller = isWindow ? window : scrollContainer;
  scroller?.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
  document.addEventListener('env:navigate', () => scroller?.removeEventListener('scroll', updateActive), { once: true });
}

/**
 * Wire gallery image lightbox preview.
 */
export function wireLightbox(root) {
  const lightbox = root.querySelector('[data-lightbox]');
  if (!lightbox) return;

  const img = lightbox.querySelector('[data-lightbox-img]');
  const closeButton = lightbox.querySelector('button[data-lightbox-close]');
  let closeTimer = 0, returnFocus = null;
  lightbox.inert = true;

  const open = (src, trigger) => {
    if (!img || !src) return;
    clearTimeout(closeTimer);
    returnFocus = trigger || document.activeElement;
    img.src = src;
    lightbox.inert = false;
    lightbox.removeAttribute('aria-hidden');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.classList.add('is-open');
    closeButton?.focus({ preventScroll: true });
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.inert = true;
    lightbox.removeAttribute('aria-modal');
    returnFocus?.focus({ preventScroll: true });
    closeTimer = setTimeout(() => {
      lightbox.setAttribute('aria-hidden', 'true');
      img?.removeAttribute('src');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
  };

  const click = (e) => {
    const item = e.target.closest('[data-lightbox-src]');
    if (item) {
      open(item.dataset.lightboxSrc, item);
      return;
    }
    if (e.target.closest('[data-lightbox-close]')) {
      close();
    }
  };

  const keydown = (e) => {
    if (lightbox.classList.contains('is-open')) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { e.preventDefault(); closeButton?.focus(); }
    } else if ((e.key === 'Enter' || e.key === ' ') && root.contains(e.target)) {
      const item = e.target.closest('[data-lightbox-src]');
      if (item) { e.preventDefault(); open(item.dataset.lightboxSrc, item); }
    }
  };
  root.addEventListener('click', click);
  document.addEventListener('keydown', keydown);
  const cleanup = () => { clearTimeout(closeTimer); root.removeEventListener('click', click); document.removeEventListener('keydown', keydown); document.removeEventListener('env:navigate', cleanup); };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}

/**
 * Convenience helper to wire all invitation engine interactions at once.
 */
export function attachInvitationInteractions(root, options = {}) {
  initInvitationMotion(root);
  startCountdowns(root);
  wireCopyButtons(root);
  wireRsvpForms(root, options);
  wireWishesForms(root, options);
  wireBottomNav(root);
  wireLightbox(root);
}
