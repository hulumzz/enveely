export function royalCrown() {
  return `<svg viewBox="0 0 100 65" fill="none" aria-hidden="true"><path d="m14 23 17 17L50 13l19 27 17-17-8 31H22Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="2"/><path d="M23 58h54M28 48h44" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="9" r="4" fill="currentColor"/><circle cx="13" cy="19" r="3" fill="currentColor"/><circle cx="87" cy="19" r="3" fill="currentColor"/><path d="m50 31 5 7-5 7-5-7Z" fill="currentColor"/></svg>`;
}

// Independent palace frame in every chapter; artwork never participates in layout.
export function serenaDecoration(section) {
  return `<div class="sr-scene sr-scene--${section}" aria-hidden="true">
    <span class="sr-vault"></span><span class="sr-damask"></span>
    ${['tl','tr','bl','br'].map(pos => `<span class="sr-entry sr-filigree sr-filigree--${pos}"><img src="/art/serena/corner.webp" width="700" height="665" alt="" loading="eager"/></span>`).join('')}
    ${['left','right'].map(pos => `<span class="sr-entry sr-curtain sr-curtain--${pos}"><span class="sr-silk-idle"><img src="/art/serena/curtain.webp" width="600" height="570" alt="" loading="eager"/></span></span>`).join('')}
    <span class="sr-entry sr-palace"><img src="/art/serena/palace.webp" width="1100" height="440" alt="" loading="eager"/></span>
    <span class="sr-entry sr-flock"><span class="sr-flight sr-flight--one"><img src="/art/serena/dove.webp" width="500" height="417" alt="" loading="eager"/></span><span class="sr-flight sr-flight--two"><img src="/art/serena/dove.webp" width="500" height="417" alt="" loading="eager"/></span></span>
    <span class="sr-sparkles"><i></i><i></i><i></i></span>
  </div>`;
}
