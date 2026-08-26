// Enveely — Ornament library (inline SVG, colorizable via currentColor).
// Families map ornament sets -> corner/divider ornaments (Design-1.md §39–41).
// Production may replace these with refined assets; metadata-driven selection
// keeps templates decoupled from actual artwork.

const LIB = {
  'floral-corner': {
    vb: '0 0 120 120',
    body: `
      <path d="M6 114 C 10 70 26 34 66 16 C 82 9 100 6 114 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M28 74 q -14 -2 -20 -14 q 14 -2 20 14 z" fill="currentColor" opacity=".85"/>
      <path d="M44 52 q -12 -6 -13 -19 q 13 3 13 19 z" fill="currentColor" opacity=".7"/>
      <path d="M64 32 q -8 -9 -4 -21 q 11 6 4 21 z" fill="currentColor" opacity=".75"/>
      <circle cx="103" cy="19" r="5.5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="103" cy="19" r="1.8" fill="currentColor"/>
      <path d="M93 28 q 10 7 20 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>`,
  },
  'geo-corner': {
    vb: '0 0 100 100',
    body: `
      <path d="M4 96 V 30 Q 4 4 30 4 H 96" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M14 96 V 36 Q 14 14 36 14 H 96" stroke="currentColor" stroke-width="1.1" opacity=".55"/>
      <rect x="23" y="23" width="9" height="9" transform="rotate(45 27.5 27.5)" fill="currentColor"/>
      <circle cx="45" cy="45" r="2" fill="currentColor" opacity=".7"/>`,
  },
  'doodle-leaf': {
    vb: '0 0 120 60',
    body: `
      <path d="M6 52 C 40 48 76 34 112 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M38 44 q 2 -14 15 -18 q 0 14 -15 18 z" fill="currentColor" opacity=".85"/>
      <path d="M62 36 q 4 -13 17 -15 q -2 13 -17 15 z" fill="currentColor" opacity=".7"/>
      <path d="M86 25 q 6 -11 18 -12 q -3 12 -18 12 z" fill="currentColor" opacity=".75"/>`,
  },
  'leaf-divider': {
    vb: '0 0 220 24',
    body: `
      <line x1="0" y1="12" x2="88" y2="12" stroke="currentColor" stroke-width="1"/>
      <path d="M110 3 C 119 7.5 119 16.5 110 21 C 101 16.5 101 7.5 110 3 z" fill="currentColor"/>
      <line x1="132" y1="12" x2="220" y2="12" stroke="currentColor" stroke-width="1"/>`,
  },
  'star-divider': {
    vb: '0 0 220 24',
    body: `
      <line x1="0" y1="12" x2="92" y2="12" stroke="currentColor" stroke-width="1"/>
      <path d="M110 2 l 2.6 7.4 L 120 12 l -7.4 2.6 L 110 22 l -2.6 -7.4 L 100 12 l 7.4 -2.6 z" fill="currentColor"/>
      <line x1="128" y1="12" x2="220" y2="12" stroke="currentColor" stroke-width="1"/>`,
  },
  'line-divider': {
    vb: '0 0 220 12',
    body: `
      <line x1="0" y1="6" x2="99" y2="6" stroke="currentColor" stroke-width="1"/>
      <circle cx="110" cy="6" r="2" fill="currentColor"/>
      <line x1="121" y1="6" x2="220" y2="6" stroke="currentColor" stroke-width="1"/>`,
  },
};

/** Render an ornament as inline SVG string. */
export function ornamentSvg(id, cls = '') {
  const o = LIB[id] || LIB['line-divider'];
  const classAttr = cls ? ` class="orn ${cls}"` : ' class="orn"';
  return `<svg${classAttr} viewBox="${o.vb}" fill="none" aria-hidden="true" focusable="false">${o.body}</svg>`;
}

/** Pick the corner ornament matching a template's ornament set. */
export function cornerOrnament(ornamentSet) {
  const set = String(ornamentSet || '');
  if (!set || set === 'none') return null;
  if (/geometric|nusantara|terra|sagara/.test(set)) return 'geo-corner';
  if (/doodle|leafy|grain|picnic|analog/.test(set)) return 'doodle-leaf';
  if (/minimal|line|single|film|cue/.test(set)) return null; // editorial families: no corners
  return 'floral-corner';
}

/** Pick the section divider matching a template's ornament set. */
export function dividerOrnament(ornamentSet) {
  const set = String(ornamentSet || '');
  if (/geometric|nusantara|terra|puspa|sagara/.test(set)) return 'star-divider';
  if (/minimal|none|ink|white|paper|modern/.test(set)) return 'line-divider';
  if (/doodle|leafy|grain|picnic|analog|botanical/.test(set)) return 'leaf-divider';
  if (/rose|flower/.test(set)) return 'leaf-divider';
  return 'line-divider';
}
