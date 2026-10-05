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
      const data = Object.fromEntries(new FormData(form).entries());
      if (!demo && form.getAttribute('invitation-id')) {
        const { submitRsvp } = await import('../services/firestore-data.js');
        await submitRsvp(form.getAttribute('invitation-id'), data);
      }
      const done = form.querySelector('.rsvp__done');
      if (done) {
        done.classList.remove('sr-only');
        setTimeout(() => done.classList.add('sr-only'), 4000);
      }
      form.reset();
    });
  });
}

/** Wire wishes forms; renders submitted wish into the local list. */
export function wireWishesForms(root, { demo = false } = {}) {
  root.querySelectorAll('[data-wishes-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const list = root.querySelector('[data-wishes-list]');
      if (list) {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = data.name || '—';
        const p = document.createElement('p');
        p.textContent = data.message || '';
        li.append(b, p);
        list.prepend(li);
      }
      if (!demo && form.getAttribute('invitation-id')) {
        const { submitWish } = await import('../services/firestore-data.js');
        await submitWish(form.getAttribute('invitation-id'), data);
      }
      form.reset();
    });
  });
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
    const viewportMiddle = isWindow
      ? window.innerHeight / 2
      : (scrollContainer?.clientHeight || 400) / 2;

    let closest = null;
    let minDistance = Infinity;

    targets.forEach(({ id, el }) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - (scrollContainer?.getBoundingClientRect().top || 0) - viewportMiddle);
      if (distance < minDistance) {
        minDistance = distance;
        closest = id;
      }
    });

    if (closest) {
      items.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.navTarget === closest);
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

  const open = (src) => {
    if (!img || !src) return;
    img.src = src;
    lightbox.removeAttribute('aria-hidden');
    lightbox.classList.add('is-open');
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    setTimeout(() => {
      lightbox.setAttribute('aria-hidden', 'true');
      if (img) img.src = '';
    }, 240);
  };

  root.addEventListener('click', (e) => {
    const item = e.target.closest('[data-lightbox-src]');
    if (item) {
      open(item.dataset.lightboxSrc);
      return;
    }
    if (e.target.closest('[data-lightbox-close]')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      close();
    }
  });
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
