// Original stylized carving and textile geometry; no sacred motif claims.
// Raster wayang/kayon illustrations were generated for this family (see docs).
export function carvedCorner() {
  const leaves = Array.from({ length: 6 }, (_, i) => `<g transform="translate(${i * 18} ${i * 10})"><path d="M22 36Q-5 14 18 6Q32 10 22 36Z"/><path d="M24 37Q50 16 53 34Q49 47 24 37Z"/></g>`).join('');
  return `<svg viewBox="0 0 180 150" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 142V20Q8 8 20 8H172M15 132V26Q15 15 26 15H160"/><path d="M18 22C80 5 151 60 142 110C130 145 82 133 95 107C103 92 129 97 126 113M20 26C35 90 10 104 43 117C74 130 85 103 65 95C52 90 46 108 60 109"/>${leaves}<path d="m22 22 11-9 10 9-10 10Z" fill="currentColor"/><circle cx="142" cy="110" r="5"/></svg>`;
}

export function pusakaDecoration(section) {
  const stage = section === 'cover' || section === 'closing';
  return `<div class="pk-scene ${stage ? 'pk-scene--stage' : ''}" aria-hidden="true">
    <span class="pk-frame"></span><span class="pk-batik"></span>
    ${['tl','tr','bl','br'].map(pos => `<span class="pk-corner pk-corner--${pos}">${carvedCorner()}</span>`).join('')}
    <span class="pk-entry pk-entry--kayon"><span class="pk-kayon-idle"><img src="/art/pusaka/gunungan.webp" alt="" width="700" height="1050" loading="${section === 'cover' ? 'eager' : 'lazy'}"/></span></span>
    <span class="pk-entry pk-entry--puppet"><span class="pk-puppet-idle"><img src="/art/pusaka/wayang.webp" alt="" width="700" height="1050" loading="${section === 'cover' ? 'eager' : 'lazy'}"/></span></span>
    ${stage ? '<span class="pk-entry pk-entry--partner"><span class="pk-puppet-idle"><img src="/art/pusaka/wayang.webp" alt="" width="700" height="1050"/></span></span>' : ''}
    <span class="pk-lamp"><i></i></span><span class="pk-dust"><i></i><i></i><i></i></span>
    ${section === 'cover' ? '<span class="pk-curtain pk-curtain--left"></span><span class="pk-curtain pk-curtain--right"></span>' : ''}
  </div>`;
}
