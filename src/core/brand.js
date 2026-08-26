// Enveely — Brand constants (single source of truth for naming).
// Product name: Enveely. Tagline: "Invite Your Beloved People".

export const BRAND = {
  name: 'Enveely',
  tagline: 'Invite Your Beloved People',
  taglineID: 'Undangan untuk Orang-orang Tercinta',
};

/** Wordmark HTML with premium serif styling. */
export function wordmark(cls = '') {
  return `<span class="wordmark ${cls}">EN<span class="wordmark__accent">VEELY</span></span>`;
}
