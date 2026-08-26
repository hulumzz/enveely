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
    <div class="env-modal" role="dialog" aria-modal="true" aria-label="${cfg.title || ''}">
      ${cfg.title ? `<h3 class="env-modal__title">${cfg.title}</h3>` : ''}
      <div class="env-modal__body">${cfg.body}</div>
      <div class="env-modal__actions"></div>
    </div>`;

  const actionsEl = overlay.querySelector('.env-modal__actions');
  const close = () => {
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove(), 200);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();

  for (const action of cfg.actions || [{ label: 'Tutup', closeOnClick: true }]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn--${action.kind === 'primary' ? 'primary' : 'ghost'} btn--sm`;
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      action.onClick?.(close);
      if (action.closeOnClick !== false) close();
    });
    actionsEl.appendChild(btn);
  }

  overlay.addEventListener('click', (e) => e.target === overlay && close());
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('is-open'));
  return close;
}
