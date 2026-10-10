import {isInvitationLive} from '../src/core/invitation-status.js';
import assert from 'node:assert/strict';
import { frameGeometry, frameInvitation, invitationFrame } from '../src/ui/invitation-frame.js';
import { templateVariants } from '../src/data/variants.js';
import { renderInvitation } from '../src/engine/renderer.js';
import { wirePreviewCarousel } from '../src/ui/preview-carousel.js';
import { startCountdowns } from '../src/engine/interactions.js';
import { builderCss } from '../src/pages/builder.css.js';
import postcss from 'postcss';
import { readFile } from 'node:fs/promises';

for (const variant of templateVariants) for (const section of ['cover','couple','event','gallery','rsvp']) {
  const html = renderInvitation(frameInvitation(variant.parentTemplate, variant.id, section));
  assert.equal((html.match(/data-section=/g) || []).length, 1);
  assert.ok(html.includes('data-section="' + section + '"'));
  assert.ok(!html.includes('data-music-toggle'));
  assert.ok(!html.includes('data-inv-nav'));
}
assert.ok(invitationFrame({templateId:'amora',section:'couple'}).includes('data-preview-section="couple"'));
for (const width of [240,288,358,430]) for (const contentHeight of [760,1050,1600]) {
  const height = width * 680 / 430;
  const fit = frameGeometry(width,height,contentHeight);
  assert.ok(fit.scale * 430 <= width + .001);
  assert.ok(fit.scale * contentHeight <= height + .001);
  assert.ok(fit.left >= 0 && fit.top >= 0);
  if(contentHeight === 760) assert.ok(fit.scale * 430 > width * .85, 'cover fills over 85% of card width');
}
for(const width of [240,288,358,430]) for(const contentHeight of [760,1050,1600]) {
 const height=width*17.5/9,fit=frameGeometry(width,height,contentHeight,'cover');
 assert.ok(fit.scale*430>=width-.001 && fit.scale*contentHeight>=height-.001,'cover leaves no device gutters');
 assert.ok(fit.left<=.001 && fit.top<=.001,'cover crop stays centered');
}
assert.equal(frameGeometry(0,0,760),null,'hidden frame is not scaled to 1px');

const now=Date.parse('2026-10-10T00:00:00.000Z'),draft={id:'inv_real',status:'published',design:{variantId:'mayura-pearl'}};
assert.equal(isInvitationLive(draft,[{invitationId:draft.id,variantId:'mayura-pearl',status:'active',expiresAt:now-1},{invitationId:draft.id,variantId:'mayura-pearl',status:'active',expiresAt:now+1}],now),true,'renewal keeps an invitation live');
assert.equal(isInvitationLive(draft,[{invitationId:draft.id,variantId:'mayura-jade',status:'active',expiresAt:now+1}],now),false,'other design entitlement cannot activate this design');
assert.equal(isInvitationLive({...draft,status:'draft'},[{invitationId:draft.id,variantId:'mayura-pearl',status:'active',expiresAt:now+1}],now),false);
const free={...draft,design:{variantId:'serena-paper'},freeActivatedAt:{seconds:(now-7*86400000)/1000}};
assert.equal(isInvitationLive(free,[],now),false,'free expiry closes at its boundary');
assert.equal(isInvitationLive(free,[],now-1),true);
assert.equal(isInvitationLive({...free,freeActivatedAt:undefined},[],now),false,'missing activation is not assumed live');
class Element extends EventTarget {
  constructor(){ super(); this.attrs={}; this.classes=new Set(); this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)}; }
  setAttribute(k,v){this.attrs[k]=v;}
}
globalThis.document = new EventTarget();
let callbacks = new Map(), id = 0;
globalThis.requestAnimationFrame = fn => {callbacks.set(++id,fn);return id;};
globalThis.cancelAnimationFrame = key => callbacks.delete(key);
const flush=()=>{const pending=[...callbacks.values()];callbacks.clear();pending.forEach(fn=>fn());};
let reduced=false;
globalThis.matchMedia=()=>({matches:reduced});
let resizeCallback;
globalThis.ResizeObserver=class { constructor(fn){resizeCallback=fn;} observe(){} disconnect(){} };
const viewport=new Element();viewport.clientWidth=320;viewport.scrollLeft=0;
viewport.scrollTo=({left,behavior})=>{viewport.scrollLeft=left;viewport.lastBehavior=behavior;viewport.dispatchEvent(new Event('scroll'));};
const buttons=[new Element(),new Element(),new Element()], caption={}, next=new Element(),prev=new Element();
wirePreviewCarousel({viewport,track:{children:[{},{},{}]},buttons,caption,next,prev,labels:['Garden','Moonlit','Vintage']});
buttons[2].dispatchEvent(new Event('click'));flush();
assert.equal(viewport.scrollLeft,640);assert.equal(caption.textContent,'Vintage');assert.equal(buttons[2].attrs['aria-pressed'],'true');
next.dispatchEvent(new Event('click'));flush();assert.equal(viewport.scrollLeft,0);
viewport.scrollLeft=320;viewport.dispatchEvent(new Event('scroll'));flush();assert.equal(caption.textContent,'Moonlit','swipe updates caption');
viewport.clientWidth=430;resizeCallback();flush();assert.equal(viewport.scrollLeft,430,'resize retains selected slide');
reduced=true;prev.dispatchEvent(new Event('click'));flush();assert.equal(viewport.lastBehavior,'instant');
const key=new Event('keydown',{cancelable:true});key.key='End';viewport.dispatchEvent(key);flush();assert.equal(viewport.scrollLeft,860);assert.ok(key.defaultPrevented);
document.dispatchEvent(new Event('env:navigate'));assert.equal(callbacks.size,0);

let intervals=new Set(), sequence=0;
globalThis.setInterval=()=>{intervals.add(++sequence);return sequence;};
globalThis.clearInterval=handle=>intervals.delete(handle);
const cells=Object.fromEntries(['days','hours','minutes','seconds'].map(unit=>[unit,{textContent:''}]));
const counter={dataset:{countdownDate:'2099-01-01'},querySelector:selector=>cells[selector.match(/"(.*?)"/)[1]]};
const clean=startCountdowns({querySelectorAll:()=>[counter]});assert.equal(intervals.size,1);clean();assert.equal(intervals.size,0);
startCountdowns({querySelectorAll:()=>[counter]});document.dispatchEvent(new Event('env:navigate'));assert.equal(intervals.size,0);
for(const file of ['styles/platform.css','styles/landing-editorial.css','styles/product-layout.css','styles/landing.css','styles/pusaka.css','styles/mayura.css','styles/blocka.css','styles/meadow.css','styles/serena.css']) postcss.parse(await readFile(new URL('../'+file,import.meta.url),'utf8'));
postcss.parse(builderCss);
console.log(`PASS: ${templateVariants.length * 5} section previews, thumbnail geometry, slide click/swipe/keyboard/resize/reduced motion, editor timer cleanup, CSS parsing`);
