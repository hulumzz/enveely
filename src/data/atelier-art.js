// Decorative artwork is local SVG: no external image requests or duplicated IDs.
const flower = (x, y, s, angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})"><g fill="var(--petal, #b97882)" stroke="var(--inv-bg)" stroke-width=".6">${Array.from({length: 9}, (_, i) => `<ellipse rx="12" ry="25" cy="-15" transform="rotate(${i * 40})" opacity="${.55 + (i % 3) * .15}"/>`).join('')}</g><circle r="10" fill="var(--inv-accent)"/><path d="M-6 1Q0-10 6 1Q0 10-6 1M-3 0Q0-5 3 0" fill="none" stroke="var(--inv-bg)" stroke-width="1"/></g>`;
const foliage = `<g fill="var(--leaf, #77836b)" stroke="var(--leaf, #77836b)" stroke-width="1.2"><path d="M10 320Q65 200 210 40M5 265Q50 135 95 30M45 250Q155 215 270 180" fill="none"/>${Array.from({length: 10}, (_, i) => { const x = 25 + i * 19, y = 285 - i * 24; return `<path d="M${x} ${y}q-38-8-28-43q32 7 28 43Z" opacity=".65"/><path d="M${x} ${y}q8-37 43-32q-8 30-43 32Z" opacity=".45"/>`; }).join('')}</g>`;
const bird = `<g fill="var(--inv-accent)"><path d="M190 82q-38-45-65-23q33 4 43 30q-29-8-41 7q25 15 50 5q17 16 29 3l21-6-18-4q-1-13-13-10Z"/><path d="M172 88q-9-45 25-52q-14 28-9 51Z" opacity=".65"/></g>`;
const lattice = `<g fill="none" stroke="currentColor" stroke-width="1">${Array.from({length: 7}, (_, i) => `<path d="M${12+i*14} 315V${90-i*10}Q${12+i*14} ${12+i*4} ${110+i*12} ${12+i*4}H290" opacity="${.9-i*.1}"/>`).join('')}<path d="M45 125q45-95 90 0q-45 95-90 0Zm0 100q45-95 90 0q-45 95-90 0Z"/><path d="M55 125h70M90 85v80M55 225h70M90 185v80" opacity=".5"/></g>`;
export function atelierDecoration(design, section) {
  const family = design.templateId;
  const floral = ['amora', 'meadow', 'botanica', 'tempwed'].includes(family);
  const featured = ['cover', 'couple', 'quote', 'event', 'closing'].includes(section);
  if (!featured) return '';
  let art = '';
  if (floral) art = foliage + (family === 'meadow' ? flower(68, 207, .48) + flower(160, 130, .32) : flower(55, 230, .95, 10) + flower(110, 165, .7, 30) + flower(55, 130, .55) + flower(183, 91, .45)) + (['botanica', 'tempwed'].includes(family) ? bird : '');
  else if (family === 'nusantara') art = lattice;
  else if (family === 'elysian') art = '<path d="M20 300V20H280M28 280V28H260" fill="none" stroke="currentColor"/><path d="m40 60 10-20 10 20-10 20Z" fill="currentColor"/>';
  else if (family === 'serena') art = '<g fill="none" stroke="currentColor" opacity=".5"><ellipse cx="100" cy="180" rx="60" ry="135" transform="rotate(25 100 180)"/><ellipse cx="110" cy="175" rx="60" ry="135" transform="rotate(35 110 175)"/></g>';
  else art = '<path d="M20 90V20H90M20 240v60h70" fill="none" stroke="currentColor"/><circle cx="35" cy="40" r="3" fill="currentColor"/>';
  if (family === 'tempwed') art = lattice + art;
  if (family === 'botanica') art = `<g transform="translate(0 20) scale(.9 1)">${art}</g>` + bird;
  const svg = `<svg viewBox="0 0 300 340" fill="none" aria-hidden="true">${art}</svg>`;
  return `<div class="atelier-art atelier-art--${floral ? 'botanical' : 'linear'}" aria-hidden="true"><span class="atelier-art__left">${svg}</span><span class="atelier-art__right">${svg}</span></div>`;
}
