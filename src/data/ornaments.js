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
  'rose-corner': {
    vb: '0 0 130 130',
    body: `<path d="M8 124C17 78 47 41 92 18" stroke="currentColor" stroke-width="1.4"/><path d="M31 83c-15-3-22-13-21-27 15 1 23 10 21 27ZM57 52c-12-7-15-18-10-31 13 5 18 15 10 31Z" fill="currentColor" opacity=".55"/><g transform="translate(88 18)"><path d="M0 18C-7 9-2 1 7 5c2-10 13-10 15 0 9-4 14 4 7 13 7 8 1 16-8 12-3 10-14 9-15-1-10 3-15-5-6-11Z" fill="currentColor" opacity=".72"/><circle cx="14" cy="16" r="4" fill="none" stroke="currentColor"/></g>`
  },
  'batik-corner': {
    vb: '0 0 120 120',
    body: `<path d="M5 115V40C5 17 17 5 40 5h75" stroke="currentColor" stroke-width="1.5"/><path d="M18 102V47c0-18 11-29 29-29h55" stroke="currentColor" opacity=".45"/><path d="m33 33 10-10 10 10-10 10-10-10Zm24 24 12-12 12 12-12 12-12-12Z" fill="none" stroke="currentColor"/><circle cx="91" cy="29" r="5" fill="currentColor" opacity=".65"/>`
  },
  'olive-corner': {
    vb: '0 0 130 100',
    body: `<path d="M5 94C35 81 61 55 91 12" stroke="currentColor" stroke-width="1.5"/><path d="M25 82c-4-13 2-23 14-28 3 13-2 23-14 28Zm18-13c1-14 9-22 22-22-1 13-8 21-22 22Zm18-17c-2-13 5-23 17-26 2 13-4 22-17 26Zm17-21c2-12 10-18 22-17-2 11-9 17-22 17Z" fill="currentColor" opacity=".64"/>`
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
  'batik-divider': {
    vb: '0 0 240 32',
    body: `<path d="M0 16h82m76 0h82" stroke="currentColor"/><path d="m99 16 10-10 10 10-10 10-10-10Zm22 0 10-10 10 10-10 10-10-10Z" fill="none" stroke="currentColor"/><circle cx="120" cy="16" r="3" fill="currentColor"/>`
  },
  'rose-divider': {
    vb: '0 0 240 32',
    body: `<path d="M0 16h88m64 0h88" stroke="currentColor"/><path d="M120 5c6-7 15 0 9 8 9-2 12 9 3 12-4 8-13 3-12-5-1 8-10 13-14 5-9-3-6-14 3-12-6-8 3-15 9-8l2 6 2-6Z" fill="currentColor" opacity=".7"/>`
  },
  'botanical-watercolor-corner': {
    vb: '0 0 160 160',
    body: `
      <!-- Main stem -->
      <path d="M12 152 C 24 110 50 62 105 32 C 124 21 142 16 154 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M48 98 C 72 82 96 68 128 54" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".6"/>
      <!-- Soft watercolor leaves (varied opacity and delicate organic curvature) -->
      <path d="M38 122 C 16 114 12 96 28 88 C 42 84 48 104 38 122 Z" fill="currentColor" opacity=".72"/>
      <path d="M56 92 C 34 84 32 66 50 58 C 64 54 68 76 56 92 Z" fill="currentColor" opacity=".82"/>
      <path d="M78 68 C 64 50 72 32 90 32 C 104 34 100 56 78 68 Z" fill="currentColor" opacity=".68"/>
      <path d="M106 46 C 96 28 108 14 124 18 C 136 24 126 44 106 46 Z" fill="currentColor" opacity=".76"/>
      <path d="M132 28 C 126 12 138 2 150 8 C 160 16 148 30 132 28 Z" fill="currentColor" opacity=".8"/>
      <!-- Smaller secondary sprigs and leaves -->
      <path d="M68 96 C 82 104 94 94 92 82 C 88 74 74 80 68 96 Z" fill="currentColor" opacity=".55"/>
      <path d="M96 74 C 112 80 120 70 116 58 C 110 52 98 60 96 74 Z" fill="currentColor" opacity=".58"/>
      <!-- Lavender berry accents -->
      <g fill="#AEB3C6" opacity=".88">
        <circle cx="62" cy="74" r="3.2"/>
        <circle cx="68" cy="70" r="2.6"/>
        <circle cx="58" cy="68" r="2.2"/>
        <circle cx="102" cy="52" r="3"/>
        <circle cx="108" cy="48" r="2.4"/>
        <circle cx="138" cy="34" r="2.8"/>
        <circle cx="144" cy="30" r="2.2"/>
      </g>`,
  },
  // Tempwed — Luxury Floral Animated Ornaments
  'floral-corner-animated': {
    vb: '0 0 180 180',
    body: `
      <!-- Main floral vine -->
      <path d="M10 170 C 25 130 55 85 100 50 C 130 25 155 15 170 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.9"/>
      <path d="M30 150 C 50 115 80 75 115 45" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.6"/>
      <!-- Flowers -->
      <g fill="currentColor" opacity="0.85">
        <circle cx="25" cy="145" r="8"/>
        <circle cx="15" cy="135" r="6"/>
        <circle cx="35" cy="135" r="6"/>
        <circle cx="25" cy="125" r="5"/>
        <circle cx="65" cy="105" r="7"/>
        <circle cx="55" cy="95" r="5"/>
        <circle cx="75" cy="95" r="5"/>
        <circle cx="65" cy="85" r="4"/>
        <circle cx="105" cy="65" r="8"/>
        <circle cx="95" cy="55" r="6"/>
        <circle cx="115" cy="55" r="6"/>
        <circle cx="105" cy="45" r="5"/>
        <circle cx="145" cy="30" r="7"/>
        <circle cx="135" cy="20" r="5"/>
        <circle cx="155" cy="20" r="5"/>
        <circle cx="145" cy="10" r="4"/>
      </g>
      <!-- Leaves -->
      <g fill="currentColor" opacity="0.6">
        <ellipse cx="40" cy="125" rx="12" ry="6" transform="rotate(-30 40 125)"/>
        <ellipse cx="80" cy="85" rx="14" ry="7" transform="rotate(25 80 85)"/>
        <ellipse cx="120" cy="45" rx="16" ry="8" transform="rotate(-20 120 45)"/>
        <ellipse cx="155" cy="25" rx="10" ry="5" transform="rotate(15 155 25)"/>
      </g>
      <!-- Gold accent dots -->
      <g fill="#D4AF37" opacity="0.9">
        <circle cx="25" cy="145" r="2.5"/>
        <circle cx="65" cy="105" r="2.5"/>
        <circle cx="105" cy="65" r="3"/>
        <circle cx="145" cy="30" r="2.5"/>
      </g>
    `,
  },
  'floral-corner-dark': {
    vb: '0 0 180 180',
    body: `
      <!-- Main floral vine (dark version) -->
      <path d="M10 170 C 25 130 55 85 100 50 C 130 25 155 15 170 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M30 150 C 50 115 80 75 115 45" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.4"/>
      <!-- Flowers (white/gold) -->
      <g fill="#FBF9F7" opacity="0.9">
        <circle cx="25" cy="145" r="8"/>
        <circle cx="15" cy="135" r="6"/>
        <circle cx="35" cy="135" r="6"/>
        <circle cx="25" cy="125" r="5"/>
        <circle cx="65" cy="105" r="7"/>
        <circle cx="55" cy="95" r="5"/>
        <circle cx="75" cy="95" r="5"/>
        <circle cx="65" cy="85" r="4"/>
        <circle cx="105" cy="65" r="8"/>
        <circle cx="95" cy="55" r="6"/>
        <circle cx="115" cy="55" r="6"/>
        <circle cx="105" cy="45" r="5"/>
        <circle cx="145" cy="30" r="7"/>
        <circle cx="135" cy="20" r="5"/>
        <circle cx="155" cy="20" r="5"/>
        <circle cx="145" cy="10" r="4"/>
      </g>
      <!-- Gold center dots -->
      <g fill="#D4AF37" opacity="1">
        <circle cx="25" cy="145" r="3"/>
        <circle cx="65" cy="105" r="3"/>
        <circle cx="105" cy="65" r="3.5"/>
        <circle cx="145" cy="30" r="3"/>
      </g>
      <!-- Leaves (subtle) -->
      <g fill="#D4AF37" opacity="0.3">
        <ellipse cx="40" cy="125" rx="12" ry="6" transform="rotate(-30 40 125)"/>
        <ellipse cx="80" cy="85" rx="14" ry="7" transform="rotate(25 80 85)"/>
        <ellipse cx="120" cy="45" rx="16" ry="8" transform="rotate(-20 120 45)"/>
        <ellipse cx="155" cy="25" rx="10" ry="5" transform="rotate(15 155 25)"/>
      </g>
    `,
  },
  'floral-divider-animated': {
    vb: '0 0 280 40',
    body: `
      <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      <!-- Center floral motif -->
      <g transform="translate(140, 20)">
        <circle cx="0" cy="0" r="10" fill="currentColor" opacity="0.2"/>
        <circle cx="0" cy="0" r="6" fill="currentColor" opacity="0.4"/>
        <circle cx="0" cy="0" r="3" fill="#D4AF37" opacity="1"/>
        <!-- Petals around center -->
        <g fill="currentColor" opacity="0.7">
          <ellipse cx="0" cy="-18" rx="5" ry="10" transform="rotate(0)"/>
          <ellipse cx="0" cy="18" rx="5" ry="10" transform="rotate(180)"/>
          <ellipse cx="-18" cy="0" rx="10" ry="5" transform="rotate(90)"/>
          <ellipse cx="18" cy="0" rx="10" ry="5" transform="rotate(-90)"/>
          <ellipse cx="-13" cy="-13" rx="4" ry="8" transform="rotate(45)"/>
          <ellipse cx="13" cy="-13" rx="4" ry="8" transform="rotate(-45)"/>
          <ellipse cx="-13" cy="13" rx="4" ry="8" transform="rotate(135)"/>
          <ellipse cx="13" cy="13" rx="4" ry="8" transform="rotate(-135)"/>
        </g>
      </g>
      <line x1="180" y1="20" x2="280" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    `,
  },
  'floral-divider-dark': {
    vb: '0 0 280 40',
    body: `
      <line x1="0" y1="20" x2="100" y2="20" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
      <!-- Center floral motif (gold) -->
      <g transform="translate(140, 20)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.5"/>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.7"/>
        <circle cx="0" cy="0" r="4" fill="#D4AF37" opacity="1"/>
        <!-- Petals around center -->
        <g fill="#D4AF37" opacity="0.8">
          <ellipse cx="0" cy="-20" rx="6" ry="12" transform="rotate(0)"/>
          <ellipse cx="0" cy="20" rx="6" ry="12" transform="rotate(180)"/>
          <ellipse cx="-20" cy="0" rx="12" ry="6" transform="rotate(90)"/>
          <ellipse cx="20" cy="0" rx="12" ry="6" transform="rotate(-90)"/>
        </g>
      </g>
      <line x1="180" y1="20" x2="280" y2="20" stroke="#D4AF37" stroke-width="1.5" opacity="0.4"/>
    `,
  },
  'botanical-branch-divider': {
    vb: '0 0 280 36',
    body: `
      <!-- Center stem -->
      <path d="M10 18 H 105 C 116 18 125 14 135 14 C 145 14 154 18 165 18 H 270" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity=".7"/>
      <!-- Left sprig leaves -->
      <path d="M92 18 C 84 10 90 2 100 6 C 108 10 102 18 92 18 Z" fill="currentColor" opacity=".7"/>
      <path d="M112 15 C 116 7 126 6 130 13 C 132 18 122 20 112 15 Z" fill="currentColor" opacity=".8"/>
      <!-- Center leaves & blossom motif -->
      <path d="M140 14 C 136 5 144 1 150 7 C 154 13 148 18 140 14 Z" fill="currentColor" opacity=".75"/>
      <path d="M168 18 C 176 10 170 2 160 6 C 152 10 158 18 168 18 Z" fill="currentColor" opacity=".7"/>
      <path d="M148 19 C 144 27 134 28 130 21 C 128 16 138 14 148 19 Z" fill="currentColor" opacity=".8"/>
      <!-- Delicate berries -->
      <g fill="#AEB3C6" opacity=".9">
        <circle cx="120" cy="22" r="2.4"/>
        <circle cx="125" cy="25" r="1.8"/>
        <circle cx="155" cy="22" r="2.4"/>
        <circle cx="160" cy="25" r="1.8"/>
        <circle cx="140" cy="8" r="2"/>
      </g>`,
  },
  'botanical-sprig-accent': {
    vb: '0 0 80 80',
    body: `
      <path d="M8 72 C 20 48 42 24 72 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
      <path d="M26 50 C 14 44 16 30 28 32 C 38 36 34 50 26 50 Z" fill="currentColor" opacity=".72"/>
      <path d="M46 32 C 36 22 42 12 52 16 C 60 22 54 34 46 32 Z" fill="currentColor" opacity=".8"/>
      <circle cx="40" cy="40" r="2.6" fill="#AEB3C6" opacity=".85"/>
      <circle cx="58" cy="24" r="2.4" fill="#AEB3C6" opacity=".85"/>`,
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
  if (/botanica|watercolor-rose|dusty-rose/.test(set)) return 'botanical-watercolor-corner';
  if (/nusantara|terra|sagara/.test(set)) return 'batik-corner';
  if (/rose/.test(set)) return 'rose-corner';
  if (/leafy|botanical/.test(set)) return 'olive-corner';
  if (/geometric/.test(set)) return 'geo-corner';
  if (/doodle|grain|picnic|analog/.test(set)) return 'doodle-leaf';
  if (/floral-corner-animated|floral-corner-dark/.test(set)) return set;
  if (/minimal|line|single|film|cue/.test(set)) return null; // editorial families: no corners
  return 'floral-corner';
}

/** Pick the section divider matching a template's ornament set. */
export function dividerOrnament(ornamentSet) {
  const set = String(ornamentSet || '');
  if (/botanica|watercolor-rose|dusty-rose/.test(set)) return 'botanical-branch-divider';
  if (/nusantara|terra|puspa|sagara/.test(set)) return 'batik-divider';
  if (/minimal|none|ink|white|paper|modern/.test(set)) return 'line-divider';
  if (/doodle|leafy|grain|picnic|analog|botanical/.test(set)) return 'leaf-divider';
  if (/rose|flower/.test(set)) return 'rose-divider';
  if (/floral-corner-animated/.test(set)) return 'floral-divider-animated';
  if (/floral-corner-dark/.test(set)) return 'floral-divider-dark';
  return 'line-divider';
}
