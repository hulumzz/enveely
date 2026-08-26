// Enveely — i18n for Product UI strings (ID/EN).
// Rule: appLocale (UI language) is independent from invitationLocale
// (the language of the generated invitation) — Blueprint-1.md §21.

import { state, subscribe, setLocale } from './state.js';
import { translations } from './data/translations.js';

let current = 'id';

export function initI18n() {
  current = state.app.locale || 'id';
  subscribe('app', (slice) => {
    if (slice.locale && slice.locale !== current) {
      current = slice.locale;
      document.documentElement.lang = current;
      rerenderTexts();
    }
  });
  document.documentElement.lang = current;
}

/** Translate a key in the current app locale. Falls back to EN, then the key itself. */
export function t(key, vars = {}) {
  const dict = translations[current] || translations.en || {};
  let str = dict[key] ?? translations.en?.[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}

/** Apply translations to all elements carrying data-i18n / data-i18n-placeholder. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
}

function rerenderTexts() {
  applyTranslations(document);
  document.dispatchEvent(new CustomEvent('env:locale-changed', { detail: { locale: current } }));
}

export { setLocale };
