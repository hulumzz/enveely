// Enveely — Toast + modal primitives (Product UI layer).
// Minimal promise-free helpers; builder/publish/share flows compose them.

let toastRoot = null;

function ensureRoot() {
  if (!toastRoot) toastRoot = document.getElementById('toast-root');
  if (!toastRoot) {
    toastRoot = document.createElement('div');
    toastRoot.id = 'toast-root';
    toastRoot.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastRoot);
  }
  return toastRoot;
}

/**
 * Show a transient toast.
 * @param {string} message
 * @param {{type?: 'success'|'error'|'info', duration?: number}} [opts]
 */
export function toast(message, opts = {}) {
  const root = ensureRoot();
  const el = document.createElement('div');
  el.className = `env-toast env-toast--${opts.type || 'info'}`;
  el.textContent = message;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => {
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 300);
  }, opts.duration || 3200);
}

/**
 * Open a modal. Returns a close function.
 * @param {{title?: string, body: string, actions?: Array<{label: string, kind?: string, onClick?: Function, closeOnClick?: boolean}>}} cfg
 */
export function openModal(cfg) {
  const overlay = document.createElement('div');
  overlay.className = 'env-modal-overlay';
  overlay.innerHTML = `
    <div class="env-modal" role="dialog" aria-modal="true" aria-label="Dialog">
      ${cfg.title ? `<h3 class="env-modal__title"></h3>` : ''}
      <div class="env-modal__body">${cfg.body}</div>
      <div class="env-modal__actions"></div>
    </div>`;

  overlay.querySelector('[role=dialog]').setAttribute('aria-label', cfg.title || 'Dialog');
  const title = overlay.querySelector('.env-modal__title');
  if (title) title.textContent = cfg.title;
  const previousFocus = document.activeElement;
  const actionsEl = overlay.querySelector('.env-modal__actions');
  const close = () => {
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove(), 200);
    document.removeEventListener('keydown', onKey);
    previousFocus?.focus();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const items = [...overlay.querySelectorAll('button,a[href],input,textarea,select')].filter(el=>!el.disabled);
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };

  for (const action of cfg.actions || [{ label: 'Tutup', closeOnClick: true }]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn--${action.kind === 'primary' ? 'primary' : 'ghost'} btn--sm`;
    btn.textContent = action.label;
    btn.addEventListener('click', async () => {
      btn.disabled=true;
      try {await action.onClick?.(close);if (action.closeOnClick !== false) close();}
      catch(error){toast(error.message || 'Tindakan belum berhasil.',{type:'error'});}
      finally{btn.disabled=false;}
    });
    actionsEl.appendChild(btn);
  }

  overlay.addEventListener('click', (e) => e.target === overlay && close());
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => { overlay.classList.add('is-open'); overlay.querySelector('button,input')?.focus(); });
  return close;
}
