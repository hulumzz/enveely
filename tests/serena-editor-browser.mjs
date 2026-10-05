import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { sampleInvitation } from '../src/data/sample-invitation.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href);
const browser = await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext();
const fixture=sampleInvitation('serena','serena-paper');fixture.id='serena-editor-fit';fixture.content.guestName='Ulum & Keluarga';
const errors=[];
try {
  await context.route('https://www.google.com/maps**',route=>route.fulfill({contentType:'text/html',body:'<html></html>'}));
  await context.route('**/src/services/auth.js',route=>route.fulfill({contentType:'application/javascript',body:`export async function getCurrentUser(){return {uid:'visual-fixture',displayName:'Visual Fixture'}}; export function onAuthChange(cb){cb({uid:'visual-fixture',displayName:'Visual Fixture'});return ()=>{}}; ${['registerWithEmail','loginWithEmail','loginWithGoogle','sendPasswordReset','logout','getAuthToken'].map(n=>`export async function ${n}(){return null}`).join(';')}`}));
  await context.route('**/src/services/firebase.js',route=>route.fulfill({contentType:'application/javascript',body:'export const configValid=false;export function isFirebaseConfigured(){return false} export function getFirebaseApp(){return null}export async function getDb(){return null}export async function initAnalytics(){}'}));
  await context.addInitScript(draft=>{draft.design.variantId=localStorage.getItem('serena_visual_variant')||'serena-paper';localStorage.setItem('env_draft_'+draft.id,JSON.stringify(draft));localStorage.setItem('env_draft_index',JSON.stringify([draft.id]));},fixture);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY='1';
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const variant of ['serena-paper','serena-modern-white','serena-ink']) {
      await page.evaluate(variant=>localStorage.setItem('serena_visual_variant',variant),variant);
      await page.goto(`http://127.0.0.1:5173/builder/${fixture.id}`,{waitUntil:'domcontentloaded'});
      await page.locator('.builder__device .inv--serena').waitFor();await page.evaluate(()=>document.fonts.ready);
      const m=await page.locator('.builder__device .sec--cover').evaluate(el=>{const rect=el.getBoundingClientRect(),crown=el.querySelector('.royal__crown').getBoundingClientRect(),button=el.querySelector('[data-open-cover]').getBoundingClientRect();return {height:rect.height,crownGap:crown.top-rect.top,buttonBottom:button.bottom-rect.top,overflow:document.documentElement.scrollWidth>innerWidth+1};});
      assert.equal(m.overflow,false);assert.ok(m.height<900,'editor cover no longer follows desktop screen height');assert.ok(m.crownGap<120,'editor opening has a compact top gap');assert.ok(m.buttonBottom<m.height-55,'opening action fits above palace frame');
      if(width===1440&&variant==='serena-paper')await page.screenshot({path:'C:/Users/ulum/.codex/tmp/serena-review/editor-desktop-final.png'});
    }
    await page.goto(`http://127.0.0.1:5173/invite/${fixture.id}?to=Ulum`,{waitUntil:'domcontentloaded'});
    await page.locator('.invite-gate--serena').waitFor();await page.waitForTimeout(1100);
    assert.equal(await page.locator('.invite-body .sr-flight--one').first().evaluate(el=>getComputedStyle(el).animationPlayState),'paused','hidden body does not animate behind gate');
    await page.locator('[data-open-invite]').click();await page.locator('[data-gate]').waitFor({state:'detached'});await page.waitForTimeout(1100);
    assert.equal(await page.locator('.invite-body .sec--welcome .sr-flight--one').evaluate(el=>getComputedStyle(el).animationPlayState),'running','visible invitation resumes animation');
  }
  assert.deepEqual(errors,[]);console.log('PASS: 9 editor variant/viewport layouts and 3 hidden-body/open-gate motion cases, no browser errors.');
} finally { await browser.close(); }
