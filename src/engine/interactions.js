// Enveely — Invitation runtime interactions.
// Wires behavior to rendered invitation DOM: countdown timers, copy-to-
// clipboard, RSVP/wishes form handling. Firestore submission lands in Phase 3.

/** Start all [data-countdown-date] tickers within a root. */
export function startCountdowns(root) {
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

    tick();
    const timer = setInterval(tick, 1000);
  });
}

/** Wire [data-copy] buttons (gift account numbers). */
export function wireCopyButtons(root) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy || '');
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = original), 1400);
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
