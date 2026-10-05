// Original geometric artwork: interlaced ribbons, radial seals and folded fans.
// No SVG ids: multiple invitation previews may share the same document.
export function ceremonialSeal() {
  const rays = Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15} 100 100)" d="M100 7 104 26 100 38 96 26Z"/>`).join('');
  const knots = Array.from({ length: 12 }, (_, i) => `<path transform="rotate(${i * 30} 100 100)" d="m100 40 12 16-12 16-12-16Z" fill="none"/>`).join('');
  return `<svg class="nt-seal" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true"><g class="nt-seal__outer" opacity=".8">${rays}<circle cx="100" cy="100" r="81" fill="none" stroke="currentColor" stroke-width=".7"/></g><g class="nt-seal__inner" stroke="currentColor" stroke-width=".8">${knots}<circle cx="100" cy="100" r="36" fill="none"/><circle cx="100" cy="100" r="31" fill="none"/></g></svg>`;
}

function weave() {
  const threads = Array.from({ length: 12 }, (_, i) => `<path d="m0 ${i * 40 - 40} 60 60-60 60m120-120-60 60 60 60"/><path d="m0 ${i * 40 - 20} 60 60-60 60m120-120-60 60 60 60" opacity=".4"/>`).join('');
  return `<svg viewBox="0 0 120 440" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true">${threads}<path d="M12 0v440M108 0v440" stroke-width="3"/></svg>`;
}

function fan() {
  const ribs = Array.from({ length: 13 }, (_, i) => {
    const angle = (i * 15 - 90) * Math.PI / 180;
    return `<path d="M160 166 ${160 + Math.sin(angle) * 148} ${166 - Math.cos(angle) * 148}"/>`;
  }).join('');
  return `<svg viewBox="0 0 320 185" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 166a148 148 0 0 1 296 0Z" fill="currentColor" fill-opacity=".1"/><path d="M24 166a136 136 0 0 1 272 0"/>${ribs}<path d="m12 166 30-20 18 20 20-25 20 25 20-25 20 25 20-25 20 25 20-25 20 25 20-25 20 25 18-20 30 20"/><circle cx="160" cy="166" r="9" fill="currentColor"/></svg>`;
}

export function nusantaraDecoration(section) {
  const hero = section === 'cover' || section === 'closing';
  return `<div class="nt-scene ${hero ? 'nt-scene--ceremony' : ''}" aria-hidden="true">
    <span class="nt-entry nt-entry--weave-left">${weave()}</span>
    <span class="nt-entry nt-entry--weave-right">${weave()}</span>
    <span class="nt-entry nt-entry--seal">${ceremonialSeal()}</span>
    <span class="nt-entry nt-entry--fan"><span class="nt-fan-idle">${fan()}</span></span>
    <span class="nt-entry nt-entry--ribbon"><span class="nt-ribbon-idle"></span></span>
    ${section === 'cover' ? '<span class="nt-door nt-door--left"></span><span class="nt-door nt-door--right"></span>' : ''}
  </div>`;
}
