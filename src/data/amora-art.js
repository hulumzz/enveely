// Original artwork lives in public/art/amora. Decorative layers never cover
// interactive content and can animate independently of the invitation layout.
const bird = `<svg viewBox="0 0 100 60" fill="none" aria-hidden="true"><path d="M8 39c13-22 24-16 36-3 9-17 24-26 46-20-17 4-27 14-34 24M38 41c7 8 18 8 26 2l13-4-12-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;

export function amoraDecoration(section) {
  const immersive = ['cover', 'quote', 'closing'].includes(section);
  const flourish = ['cover', 'couple', 'event', 'rsvp', 'closing'].includes(section);
  return `<div class="amora-scene ${immersive ? 'amora-scene--immersive' : ''} ${flourish ? 'amora-scene--flourish' : ''}" aria-hidden="true">
    ${immersive ? '<span class="amora-scene__garden"></span>' : ''}
    <span class="amora-scene__grain"></span>
    ${flourish ? `<span class="amora-flower amora-flower--left"><img src="/art/amora/botanical-corner.webp" alt="" width="1024" height="1536" loading="${section === 'cover' ? 'eager' : 'lazy'}"/></span><span class="amora-flower amora-flower--right"><img src="/art/amora/botanical-corner.webp" alt="" width="1024" height="1536" loading="lazy"/></span>` : ''}
    ${['cover', 'closing'].includes(section) ? `<span class="amora-scene__bird">${bird}</span><span class="amora-scene__moon"></span><span class="amora-scene__petals">${Array.from({ length: 5 }, (_, i) => `<i style="--petal-i:${i}"></i>`).join('')}</span>` : ''}
  </div>`;
}
