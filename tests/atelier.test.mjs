import assert from 'node:assert/strict';
import { templateVariants, resolveDesign } from '../src/data/variants.js';
import { sampleInvitation } from '../src/data/sample-invitation.js';
import { renderInvitation } from '../src/engine/renderer.js';
import { initInvitationMusic, stopInvitationMusic } from '../src/engine/music.js';
for (const variant of templateVariants) {
  const invitation = sampleInvitation(variant.parentTemplate, variant.id);
  const html = renderInvitation(invitation);
  assert.ok(html.includes(`inv--v-${variant.id}`));
  assert.ok(html.includes('atelier-art'));
  assert.ok(html.includes('data-rsvp-form'));
  assert.ok(!html.includes('undefined'));
  invitation._lite = true;
  assert.ok(!renderInvitation(invitation).includes('<iframe'));
}
assert.equal(resolveDesign('amora', 'elysian-noir').variantId, 'amora-garden');
globalThis.document = new EventTarget();
let frames = new Map(), id = 0;
globalThis.requestAnimationFrame = fn => { frames.set(++id, fn); return id; };
globalThis.cancelAnimationFrame = key => frames.delete(key);
const advance = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(performance.now() + 2000)); };
const audios = [];
globalThis.Audio = class extends EventTarget {
  constructor(src) { super(); this.src = src; this.volume = 1; this.paused = true; audios.push(this); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute() { this.src = ''; }
  load() {}
};
const button = new EventTarget();
button.attributes = {};
button.setAttribute = (k,v) => button.attributes[k] = v;
const icon = {};
const wrap = { dataset: { musicSrc:'local-test.mp3', musicVolume:'0.55' }, querySelector:s => s.includes('toggle') ? button : icon };
const root = new EventTarget();
root.querySelector = () => wrap;
initInvitationMusic(root);
const first = audios.at(-1);
assert.equal(first.paused, true, 'no playback before gesture');
button.dispatchEvent(new Event('click'));
await Promise.resolve();
assert.equal(first.volume, 0, 'fade starts silently');
advance();
assert.equal(first.volume, .55);
button.dispatchEvent(new Event('click'));
assert.equal(first.paused, false, 'pause waits for fade');
advance();
assert.equal(first.volume, 0);
assert.equal(first.paused, true);
wrap.dataset.musicVolume = '0';
initInvitationMusic(root);
assert.equal(first.src, '', 'old audio released');
button.dispatchEvent(new Event('click'));
await Promise.resolve(); advance();
assert.equal(audios.at(-1).volume, 0, 'zero volume preserved');
document.dispatchEvent(new Event('env:navigate'));
assert.equal(audios.at(-1).paused, true);
assert.equal(audios.at(-1).src, '', 'route cleanup uses document event');
assert.equal(frames.size, 0);
stopInvitationMusic();
console.log(`PASS: ${templateVariants.length} full/lite renders, family fallback, music fade/pause/zero-volume/route cleanup`);
