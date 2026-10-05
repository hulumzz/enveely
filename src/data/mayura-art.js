// Original vector feathers complement the generated garden illustrations.
export function plumeFan() {
  return `<svg viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.1">${Array.from({ length: 9 }, (_, i) => `<g class="my-quill" style="--quill:${i}" transform="rotate(${(i-4)*16} 120 145)"><path d="M120 145C86 110 98 56 120 12C142 56 154 110 120 145Z" fill="currentColor" fill-opacity=".08"/><path d="M120 145V25M120 115l-19-21m19 8 21-22m-21 9-16-20m16 4 15-18"/><ellipse cx="120" cy="44" rx="10" ry="17"/><ellipse cx="120" cy="44" rx="4" ry="7" fill="currentColor" fill-opacity=".5"/></g>`).join('')}<path d="M50 150Q120 138 190 150M70 157Q120 149 170 157"/></svg>`;
}
export function mayuraDecoration(section) {
  const hero = section === 'cover' || section === 'closing';
  // These two shared assets are already needed by the cover. Reuse their cache
  // eagerly: transformed edge art can fall outside browser lazy-load bounds.
  const loading = 'eager';
  return `<div class="my-scene ${hero ? 'my-scene--garden' : ''}" aria-hidden="true">
    <span class="my-inlay"></span><span class="my-lattice"></span>
    ${['tl','br'].map(pos => `<span class="my-entry my-canopy my-canopy--${pos}"><span class="my-canopy-idle"><img src="/art/mayura/canopy.webp" alt="" width="900" height="900" loading="${loading}"/></span></span>`).join('')}
    ${['tr','bl'].map(pos => `<span class="my-entry my-fan my-fan--${pos}">${plumeFan()}</span>`).join('')}
    <span class="my-entry my-entry--bird"><span class="my-bird-idle"><img src="/art/mayura/peacock.webp" alt="" width="700" height="1050" loading="${loading}"/></span></span>
    ${hero ? `<span class="my-entry my-entry--partner"><span class="my-bird-idle"><img src="/art/mayura/peacock.webp" alt="" width="700" height="1050" loading="${loading}"/></span></span>` : ''}
    <span class="my-shimmer"></span><span class="my-fireflies"><i></i><i></i><i></i></span>
    ${section === 'cover' ? '<span class="my-leaf-door my-leaf-door--left"></span><span class="my-leaf-door my-leaf-door--right"></span>' : ''}
  </div>`;
}
