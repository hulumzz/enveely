// Native geometry surrounds custom imagegen illustrations. Decorative only.
const cube = `<svg viewBox="0 0 100 112" fill="none"><path d="m50 2 47 27-47 27L3 29Z" fill="var(--bk-cube-light)"/><path d="m3 29 47 27v53L3 82Z" fill="var(--bk-cube-mid)"/><path d="m50 56 47-27v53l-47 27Z" fill="var(--bk-cube-dark)"/><path d="m50 2 47 27v53l-47 27L3 82V29Zm0 54v53M3 29l47 27 47-27" stroke="white" stroke-opacity=".7" stroke-width="2"/></svg>`;
const ring = `<svg viewBox="0 0 120 110" fill="none"><ellipse cx="49" cy="66" rx="28" ry="30" transform="rotate(-25 49 66)" stroke="#c98827" stroke-width="13"/><ellipse cx="49" cy="62" rx="28" ry="30" transform="rotate(-25 49 62)" stroke="#ffdf89" stroke-width="8"/><path d="m58 9 27-3 18 20-19 22-27-17Z" fill="#e9f7ff" stroke="#88b4d7" stroke-width="2"/><path d="m58 9 26 39 1-42 18 20-45 5" stroke="#a1c9e5" stroke-width="2"/><path d="M104 63v14m-7-7h14" stroke="#f1bc4d" stroke-width="3"/></svg>`;
const balloons = `<svg viewBox="0 0 140 200" fill="none"><path d="M40 85q45 57 35 106M99 66Q65 129 75 191" stroke="#8b99ae" stroke-width="2"/><rect x="5" y="18" width="67" height="67" rx="13" fill="var(--bk-cube-mid)" stroke="white" stroke-width="3"/><path d="m28 42 11-8 13 8v16L39 67 28 58Z" fill="white" fill-opacity=".6"/><rect x="69" y="3" width="58" height="63" rx="12" fill="#f8ca6f" stroke="#fff8e3" stroke-width="3"/><path d="m99 19 4 10 11 1-9 7 3 11-9-6-9 6 3-11-9-7 11-1Z" fill="#fff8e3"/></svg>`;
export function blockaDecoration(section) {
  const hero = section === 'cover' || section === 'closing';
  return `<div class="bk-scene ${hero ? 'bk-scene--hero' : ''}" aria-hidden="true">
    <span class="bk-grid"></span><span class="bk-frame"></span>
    <span class="bk-entry bk-cubes bk-cubes--tl"><span class="bk-idle">${cube}${cube}${cube}</span></span>
    <span class="bk-entry bk-cubes bk-cubes--br"><span class="bk-idle">${cube}${cube}${cube}</span></span>
    <span class="bk-entry bk-ring"><span class="bk-spin">${ring}</span></span>
    <span class="bk-entry bk-balloons"><span class="bk-sway">${balloons}</span></span>
    <span class="bk-entry bk-cloud bk-cloud--left"></span><span class="bk-entry bk-cloud bk-cloud--right"></span>
    <span class="bk-entry bk-island"><span class="bk-idle"><img src="/art/blocka/island.webp" width="1000" height="667" loading="eager" alt=""/></span></span>
    <span class="bk-sparks"><i></i><i></i><i></i></span>
    ${hero ? '<span class="bk-gate-panel bk-gate-panel--left"></span><span class="bk-gate-panel bk-gate-panel--right"></span>' : ''}
  </div>`;
}
