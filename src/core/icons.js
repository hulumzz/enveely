// Enveely — Inline SVG icon library (premium line style, stroke-based).
// Replaces emoji icons; consistent 1.5px stroke, currentColor, 24px grid.

const I = {
  heart: `<path d="M12 20s-7-4.35-9.33-8.11C.9 8.98 2.24 5.5 5.5 5.5c1.94 0 3.28 1.06 4 2.13h5c.72-1.07 2.06-2.13 4-2.13 3.26 0 4.6 3.48 2.83 6.39C19 15.65 12 20 12 20z"/>`,
  rings: `<circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M12 8.5 10.5 5h3L12 8.5z"/>`,
  calendar: `<rect x="4" y="6" width="16" height="15" rx="2.5"/><path d="M4 10.5h16M8.5 3.5v4M15.5 3.5v4"/>`,
  clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,
  image: `<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4.5 17.5 4.8-4.8a1.5 1.5 0 0 1 2.12 0l6.08 6.08M15 15l1.88-1.88a1.5 1.5 0 0 1 2.12 0l1.5 1.5"/>`,
  pin: `<path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 19 11c0 4.6-7 10-7 10z"/><circle cx="12" cy="11" r="2.4"/>`,
  mail: `<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7.5 6.42 5.14a1.75 1.75 0 0 0 2.16 0L19.5 7.5"/>`,
  link: `<path d="M10 14a4.53 4.53 0 0 0 6.44 0l3-3a4.55 4.55 0 0 0-6.44-6.43l-1.5 1.5"/><path d="M14 10a4.53 4.53 0 0 0-6.44 0l-3 3a4.55 4.55 0 0 0 6.44 6.43l1.5-1.5"/>`,
  sparkle: `<path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5zM18.5 15.5c.3 1.95 1.3 2.95 3.25 3.25-1.95.3-2.95 1.3-3.25 3.25-.3-1.95-1.3-2.95-3.25-3.25 1.95-.3 2.95-1.3 3.25-3.25z"/>`,
  palette: `<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.38 0 2-.86 2-1.75 0-.84-.62-1.32-.62-2.13 0-1 .81-1.87 2.12-1.87H17a4.5 4.5 0 0 0 4.5-4.5C21.5 6.36 17.25 3.5 12 3.5z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="12" cy="7.75" r="1.2"/><circle cx="16.5" cy="10.5" r="1.2"/>`,
  layers: `<path d="m12 3.5 8.5 4.75L12 13 3.5 8.25 12 3.5z"/><path d="m4.5 12.5 7.5 4.2 7.5-4.2M4.5 16.5l7.5 4.2 7.5-4.2"/>`,
  music: `<path d="M9 18.5V6.8a1 1 0 0 1 .76-.97l8-2A1 1 0 0 1 19 4.8v11.7"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>`,
  gift: `<rect x="4" y="10" width="16" height="10.5" rx="1.5"/><path d="M12 10v10.5M4 10h16M12 10s-.5-4.5-3.5-4.5a2 2 0 0 0 0 4M12 10s.5-4.5 3.5-4.5a2 2 0 0 1 0 4"/>`,
  chat: `<path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.54L3.5 20.5l1.02-4.5A8.5 8.5 0 1 1 20.5 12z"/>`,
  users: `<circle cx="9" cy="8.5" r="3.5"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.6a3.5 3.5 0 0 1 0 5.8M17.5 14.7a5.5 5.5 0 0 1 3 4.3"/>`,
  arrowRight: `<path d="M4.5 12h15M13.5 6l6 6-6 6"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  close: `<path d="m6 6 12 12M18 6 6 18"/>`,
  google: `<path fill="currentColor" stroke="none" d="M21.35 11.1h-9.17v2.96h5.34c-.5 2.36-2.44 3.75-5.34 3.75a5.85 5.85 0 1 1 0-11.7c1.49 0 2.82.54 3.87 1.43l2.2-2.2A9 9 0 1 0 12.18 21c5.02 0 8.63-3.52 8.63-8.48 0-.57-.06-1-.11-1.42z"/>`,
  eye: `<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>`,
  lock: `<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>`,
  send: `<path d="M21 3.5 10.5 14M21 3.5l-6.8 17.5-3.7-7-7-3.7L21 3.5z"/>`,
  quote: `<path d="M9.5 7c-3 .8-4.5 2.9-4.5 6.2V17h4.8v-4.8H7.2c.1-1.7 1-2.8 2.8-3.4L9.5 7zm9 0c-3 .8-4.5 2.9-4.5 6.2V17H19v-4.8h-2.6c.1-1.7 1-2.8 2.8-3.4L18.5 7z"/>`,
};

/**
 * Render an icon as inline SVG.
 * @param {keyof typeof I} name
 * @param {{size?: number|string, cls?: string}} [opts]
 */
export function icon(name, opts = {}) {
  const body = I[name] || I.sparkle;
  const size = opts.size || 24;
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
