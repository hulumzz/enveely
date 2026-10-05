// Original optical artwork, without SVG ids or external illustration assets.
export function lensArtwork() {
  const blades = Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45} 100 100)" d="M100 16C150 16 184 50 184 100L130 70 100 50Z"/>`).join('');
  return `<svg viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor" stroke-width=".6"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="88"/><g class="lm-lens__blades" fill="currentColor" fill-opacity=".08">${blades}</g><circle cx="100" cy="100" r="39" stroke-dasharray="2 7"/></svg>`;
}

export function lumiereDecoration(section) {
  return `<div class="lm-scene ${section === 'cover' || section === 'closing' ? 'lm-scene--hero' : ''}" aria-hidden="true">
    <span class="lm-optic">${lensArtwork()}</span>
    <span class="lm-beam"><i></i></span>
    <span class="lm-trail"><svg viewBox="0 0 360 240" fill="none" stroke="currentColor"><path d="M-20 200C100 270 40-40 220 80S390 220 400 20"/><path d="M-20 211C100 281 40-29 220 91S390 231 400 31" stroke-dasharray="1 6"/><path d="M-20 222C100 292 40-18 220 102S390 242 400 42"/></svg></span>
    <span class="lm-perforation lm-perforation--left"></span><span class="lm-perforation lm-perforation--right"></span>
    <span class="lm-focus lm-focus--tl"></span><span class="lm-focus lm-focus--br"></span>
    ${section === 'cover' ? '<span class="lm-shutter lm-shutter--top"></span><span class="lm-shutter lm-shutter--bottom"></span>' : ''}
  </div>`;
}
