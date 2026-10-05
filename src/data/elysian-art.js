// Original engraved curves and folded stationery; no SVG ids across previews.
export function coutureSeal(initials = '') {
  const edge = Array.from({ length: 36 }, (_, i) => {
    const a = i * Math.PI / 18, r = i % 2 ? 43 : 46;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(' ');
  return `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><polygon points="${edge}" fill="currentColor"/><circle cx="50" cy="50" r="34" stroke="var(--ey-seal-ink)" stroke-width=".6"/><path d="M31 27q19-9 38 0M31 73q19 9 38 0" stroke="var(--ey-seal-ink)" stroke-width=".7"/><text x="50" y="56" text-anchor="middle" fill="var(--ey-seal-ink)" font-family="serif" font-size="19">${initials}</text></svg>`;
}
export function elysianDecoration(section) {
  const lines = Array.from({ length: 9 }, (_, i) => `<ellipse cx="150" cy="115" rx="${115 - i * 7}" ry="${80 - i * 5}" transform="rotate(${i * 7} 150 115)"/>`).join('');
  return `<div class="ey-scene ${section === 'cover' || section === 'closing' ? 'ey-scene--folio' : ''}" aria-hidden="true">
    <span class="ey-engraving"><svg viewBox="0 0 300 230" fill="none" stroke="currentColor" stroke-width=".65">${lines}<path d="M18 167C58 12 183 208 276 55M18 177C58 22 183 218 276 65"/></svg></span>
    <span class="ey-ribbon"><i></i></span><span class="ey-fold"></span>
    <span class="ey-scroll"><svg viewBox="0 0 180 160" fill="none" stroke="currentColor"><path d="M8 152C80 144 169 129 158 66 149 17 63 38 87 81 112 124 190 93 167 14M12 156C84 148 173 133 162 70"/><path d="M87 81C39 72 24 117 64 127" stroke-width=".5"/></svg></span>
    ${section === 'cover' ? '<span class="ey-envelope-flap"></span>' : ''}
  </div>`;
}
