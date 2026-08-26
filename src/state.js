// Enveely — Tiny reactive state store with pub/sub.
// Single source of truth for app/editor/invitation state (Blueprint-1.md §22).
// Renderer reads from here; components mutate via actions; UI subscribes.

const listeners = new Map(); // key -> Set<fn>
let silent = false;

export const state = {
  app: {
    locale: 'id',
    route: { name: 'landing', params: {} },
    isOnline: true,
  },
  project: {
    invitationId: null,
    status: 'draft',
    lastSavedAt: null,
  },
  invitation: null, // full invitation object when loaded
  editor: {
    selectedSectionId: null,
    previewMode: 'mobile',
    dirty: false,
  },
  ui: {
    modal: null,
    toast: null,
  },
};

/**
 * Subscribe to changes of a top-level slice ("app", "project", "invitation", "editor", "ui").
 * @returns {() => void} unsubscribe function
 */
export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key).delete(fn);
}

/** Update a top-level slice and notify subscribers. */
export function setState(key, patch) {
  if (typeof patch === 'function') {
    state[key] = patch(state[key]);
  } else if (patch && typeof patch === 'object') {
    state[key] = { ...state[key], ...patch };
  } else {
    state[key] = patch;
  }
  notify(key);
}

/** Notify without changing state (e.g. after deep mutation). */
export function notify(key) {
  if (silent) return;
  const set = listeners.get(key);
  if (set) for (const fn of [...set]) fn(state[key]);
}

/** Batch deep mutations then notify once. */
export function update(key, mutator) {
  mutator(state[key]);
  notify(key);
}

// ---- Convenience selectors/actions ----

export function setRoute(name, params = {}) {
  setState('app', { route: { name, params } });
}

export function setLocale(locale) {
  setState('app', { locale });
}

export function markDirty() {
  if (!state.editor.dirty) setState('editor', { dirty: true });
}
