// Four original illustrations compose a living frame around every section.
const butterfly = `<svg viewBox="0 0 80 70" fill="none"><g class="md-wing md-wing--left"><path d="M39 40C9 43-2 8 20 8c15 0 17 20 19 32ZM39 40C8 30 10 64 27 61c9-1 10-10 12-21Z" fill="currentColor" fill-opacity=".6" stroke="currentColor"/></g><g class="md-wing md-wing--right"><path d="M41 40C71 43 82 8 60 8c-15 0-17 20-19 32ZM41 40C72 30 70 64 53 61c-9-1-10-10-12-21Z" fill="currentColor" fill-opacity=".6" stroke="currentColor"/></g><path d="M40 24v27m0-26-5-8m5 8 5-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
export function meadowDecoration(section) {
  const hero = section === 'cover' || section === 'closing';
  return `<div class="md-scene ${hero ? 'md-scene--storybook' : ''}" aria-hidden="true">
    <span class="md-linen"></span><span class="md-frame"></span>
    ${['tl','br'].map(pos => `<span class="md-entry md-garland md-garland--${pos}"><span class="md-foliage-idle"><img src="/art/meadow/corner.webp" width="900" height="822" alt="" loading="eager"/></span></span>`).join('')}
    <span class="md-entry md-lantern"><span class="md-lantern-idle"><img src="/art/meadow/lantern.webp" width="450" height="675" alt="" loading="eager"/></span></span>
    <span class="md-entry md-bird"><span class="md-bird-idle"><img src="/art/meadow/bird.webp" width="600" height="400" alt="" loading="eager"/></span></span>
    <span class="md-entry md-cottage"><img src="/art/meadow/cottage.webp" width="1100" height="550" alt="" loading="eager"/><span class="md-window-glow"></span></span>
    <span class="md-entry md-butterfly">${butterfly}</span>
    <span class="md-fireflies"><i></i><i></i><i></i></span>
    ${section === 'cover' ? '<span class="md-book-leaf md-book-leaf--left"></span><span class="md-book-leaf md-book-leaf--right"></span>' : ''}
  </div>`;
}
