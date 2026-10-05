// Additional real-cover-photo fixture: avatar framing and edited content.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { sampleInvitation } from '../src/data/sample-invitation.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : 'playwright');
const base = process.env.BLOCKA_BASE_URL || 'http://127.0.0.1:5173';
const out = process.env.BLOCKA_SCREENSHOT_DIR;
if (out) await mkdir(out, { recursive:true });
const browser = await chromium.launch({ headless:true, channel:'chrome' });
try {
  const page = await browser.newPage();
  await page.route('https://www.google.com/maps**', route => route.fulfill({ contentType:'text/html', body:'<!doctype html><html><body></body></html>' }));
  const errors=[]; page.on('pageerror', e => errors.push(e.message));
  for (const width of [320,390,1440]) {
    await page.setViewportSize({ width, height:width < 768 ? 844 : 1000 });
    for (const variant of ['blocka-sky-party','blocka-sunshine','blocka-cloud-dancer']) {
      await page.goto(`${base}/templates/blocka/preview/${variant}`, { waitUntil:'domcontentloaded' });
      await page.locator('.block__avatars').waitFor();
      if (width === 1440) {
        await page.locator('[data-device="desktop"]').click();
        await page.waitForFunction(() => document.querySelector('.device-frame .inv').getBoundingClientRect().width > 900);
      }
      const fixture=sampleInvitation('blocka',variant);
      fixture.content.coverImage='/demo/modern.webp';
      fixture.content.guestName='Ulum & Keluarga';
      await page.evaluate(async fixture => {
        document.dispatchEvent(new Event('env:navigate'));
        const {renderInvitation}=await import('/src/engine/renderer.js');
        const {attachInvitationInteractions}=await import('/src/engine/interactions.js');
        const canvas=document.querySelector('.device-frame__inner');
        canvas.scrollTop=0; canvas.innerHTML=renderInvitation(fixture);
        attachInvitationInteractions(canvas,{demo:true});
      },fixture);
      await page.waitForFunction(() => [...document.querySelectorAll('.block__stage img')].every(img=>img.complete && img.naturalWidth>0));
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1100);
      const geometry=await page.evaluate(()=>{
        const inv=document.querySelector('.device-frame .inv');
        const rect=sel=>inv.querySelector(sel).getBoundingClientRect().toJSON();
        return { inv:inv.getBoundingClientRect().toJSON(), photo:rect('.block__portrait'), avatar:rect('.block__avatars'), names:rect('.cover__names'), button:rect('[data-open-cover]'), overflow:document.documentElement.scrollWidth>innerWidth+1 };
      });
      assert.equal(geometry.overflow,false);
      assert.ok(geometry.photo.width>=170 && geometry.photo.height>=160,`${variant}/${width}: user photo remains prominent`);
      assert.ok(geometry.avatar.width>=70 && geometry.avatar.height>=60,`${variant}/${width}: avatar is visible beside photo`);
      for(const r of [geometry.photo,geometry.avatar,geometry.names]) assert.ok(r.x>=geometry.inv.x-5 && r.right<=geometry.inv.right+5,`${variant}/${width}: cover stays in canvas`);
      assert.ok(geometry.avatar.bottom<=geometry.names.y+5 || width===1440 || variant==='blocka-cloud-dancer', 'avatar does not overlap following names');
      if(out && width===390) await page.screenshot({path:join(out,`${variant}-user-photo.png`)});
      // A personalized cover can be taller than the preview. Scroll its own
      // canvas as a guest would; locator.click's automatic ancestor scrolling
      // can also scroll the surrounding application before dispatching click.
      await page.evaluate(()=>{
        const canvas=document.querySelector('.device-frame__inner');
        const button=canvas.querySelector('[data-open-cover]').getBoundingClientRect();
        const nav=canvas.querySelector('.inv-nav').getBoundingClientRect();
        if(button.bottom>nav.top-12) canvas.scrollTo({top:canvas.scrollTop+button.bottom-nav.top+12,behavior:'instant'});
      });
      await page.waitForTimeout(200);
      const previous=await page.evaluate(()=>window.scrollY);
      const button=await page.locator('[data-open-cover]').boundingBox();
      await page.mouse.click(button.x+button.width/2,button.y+button.height/2);
      await page.waitForTimeout(1100);
      assert.ok(await page.locator('.device-frame__inner').evaluate(el=>el.scrollTop)>400);
      assert.equal(await page.evaluate(()=>window.scrollY),previous);
    }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: 9 user-photo cover cases, avatar framing, guest copy, opening action and desktop canvas');
} finally { await browser.close(); }
