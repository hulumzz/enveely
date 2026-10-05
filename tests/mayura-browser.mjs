// Run against a local Vite server. Playwright is a test-only dependency;
// PLAYWRIGHT_MODULE_PATH can point to an installation outside the project.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { sampleInvitation } from '../src/data/sample-invitation.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : 'playwright');
const base = process.env.MAYURA_BASE_URL || 'http://127.0.0.1:5173';
const out = process.env.MAYURA_SCREENSHOT_DIR || join(tmpdir(), 'enveely-mayura-review');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_BROWSER_CHANNEL === 'bundled'
  ? {} : { channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL || 'chrome' }) });
const errors = [], results = [];
// Catalogs can request unrelated external fonts after their individual canvas
// is ready. Screenshots use the current rendered state without waiting on those.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';
async function visit(page, url) { await page.goto(url, { waitUntil:'domcontentloaded' }); }

async function ready(page, selector = '.inv--mayura') {
  await page.locator(selector).first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1050);
}

async function scrollToSection(page, section) {
  await page.evaluate((section) => {
    const canvas = document.querySelector('.device-frame__inner');
    const target = canvas.querySelector(`[data-section="${section}"]`);
    canvas.scrollTo({ top: canvas.scrollTop + target.getBoundingClientRect().top - canvas.getBoundingClientRect().top, behavior: 'instant' });
  }, section);
  await page.waitForTimeout(1050);
}

async function measure(page) {
  return page.evaluate(() => {
    const inv = document.querySelector('.device-frame .inv');
    const frame = document.querySelector('.device-frame__inner');
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
    return {
      viewportOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      inv: rect(inv), frame: rect(frame), nav: rect(inv.querySelector('.inv-nav')),
      portraitImage: inv.querySelector('.aviary__portrait img')?.naturalWidth || 0,
      cover: rect(inv.querySelector('.sec--cover')),
      names: rect(inv.querySelector('.cover__names')), button: rect(inv.querySelector('[data-open-cover]')),
      scene: { position: getComputedStyle(inv.querySelector('.my-scene')).position, height: inv.querySelector('.my-scene').getBoundingClientRect().height },
      infoColumns: getComputedStyle(inv.querySelector('.info__cards')).gridTemplateColumns.split(' ').length,
      paragraphs: [...inv.querySelectorAll('.info__body p')].map(p => ({ ...rect(p), card: rect(p.closest('.info__card')), scrollWidth: p.scrollWidth, clientWidth: p.clientWidth })),
      controls: [...inv.querySelectorAll('.inv-nav__item')].map(rect),
      radios: [...inv.querySelectorAll('.fld--choice input')].map(rect),
    };
  });
}

try {
  const context = await browser.newContext();
  // External Maps loading is outside this local visual check.
  await context.route('https://www.google.com/maps**', route => route.fulfill({ contentType:'text/html', body:'<!doctype html><html><body style="background:#ebe6d9"></body></html>' }));
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const variant of ['mayura-jade', 'mayura-pearl', 'mayura-garnet']) {
      await visit(page, `${base}/templates/mayura/preview/${variant}`);
      await ready(page);
      const m = await measure(page);
      assert.equal(m.viewportOverflow, false, `${variant}/${width}: page fits viewport`);
      assert.ok(m.portraitImage > 0, `${variant}/${width}: photo loaded`);
      assert.equal(m.scene.position, 'absolute', 'decorative layer cannot enter layout flow');
      assert.ok(m.scene.height > 500, 'background spans the cover');
      assert.ok(m.names.bottom <= m.button.y, 'names never overlap the button');
      assert.ok(m.button.bottom <= m.nav.y + 2, `${variant}/${width}: opening action remains above navigation`);
      assert.equal(m.infoColumns, 1, 'mobile canvas stays one column on desktop');
      for (const p of m.paragraphs) {
        assert.ok(p.width >= 110, 'paragraph uses the text column, not the icon column');
        assert.ok(p.x >= p.card.x && p.right <= p.card.right + 1, 'copy fits card');
        assert.ok(p.scrollWidth <= p.clientWidth + 1, 'long words wrap inside the card');
      }
      assert.ok(m.nav.x >= m.frame.x && m.nav.right <= m.frame.right + 1, 'navigation stays in device');
      m.controls.forEach(c => assert.ok(c.width >= 44 && c.height >= 44, 'navigation has usable tap targets'));
      m.radios.forEach(c => assert.ok(c.width >= 14 && c.width <= 20, 'radio controls leave enough width for their labels'));
      if (width === 390) await page.screenshot({ path: join(out, `${variant}-390.png`) });
      if (width === 1440) {
        await page.locator('[data-device="desktop"]').click();
        await page.waitForFunction(() => document.querySelector('.device-frame .inv').getBoundingClientRect().width > 900);
        const desktop = await measure(page);
        assert.ok(desktop.inv.width > 900, 'desktop mode expands the invitation');
        assert.equal(desktop.viewportOverflow, false);
        await page.screenshot({ path: join(out, `${variant}-desktop.png`) });
        await page.locator('[data-device="mobile"]').click();
        await page.waitForFunction(() => document.querySelector('.device-frame .inv').getBoundingClientRect().width < 440);
      }
      results.push({ variant, width, paragraphWidth: m.paragraphs[0].width });
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, `${base}/templates/mayura/preview/mayura-jade`);
  await ready(page);
  await page.waitForFunction(() => document.querySelector('.sec--cover').classList.contains('my-in-view'));
  const running = await page.locator('.sec--cover .my-bird-idle').first().evaluate(el => getComputedStyle(el).animationPlayState);
  assert.equal(running, 'running', 'visible ornament animates');
  const outerBeforeOpen = await page.evaluate(() => window.scrollY);
  const openBox = await page.locator('[data-open-cover]').boundingBox();
  await page.mouse.click(openBox.x + openBox.width / 2, openBox.y + openBox.height / 2);
  await page.waitForTimeout(1200);
  assert.ok(await page.locator('.device-frame__inner').evaluate(el => el.scrollTop) > 400, 'open scrolls inside the device');
  assert.equal(await page.evaluate(() => window.scrollY), outerBeforeOpen, 'opening does not shift application chrome');
  for (const section of ['welcome', 'couple', 'quote', 'event', 'countdown', 'story', 'gallery', 'map', 'info', 'rsvp', 'gift', 'wishes', 'closing']) {
    await scrollToSection(page, section);
    const scene = page.locator(`[data-section="${section}"] > .my-scene`);
    assert.equal(await scene.count(), 1, `${section}: ornament is an independent section frame`);
    assert.equal(await scene.locator('.my-canopy,.my-fan').count(), 4, `${section}: frame has all four decorated corners`);
    assert.equal(await scene.locator('img').evaluateAll(nodes => nodes.every(img => img.complete && img.naturalWidth > 0)), true, `${section}: garden artwork loaded`);
    await page.screenshot({ path: join(out, `jade-${section}-390.png`) });
  }
  assert.equal(await page.locator('.sec--cover .my-bird-idle').first().evaluate(el => getComputedStyle(el).animationPlayState), 'paused', 'offscreen animation stops');
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('.sec--cover .my-entry--bird').evaluate(el => getComputedStyle(el).opacity), '0', 'offscreen puppet leaves the scene');
  const closing = await page.locator('.sec--closing').evaluate(section => {
    const names = section.querySelector('.closing__names').getBoundingClientRect();
    const left = section.querySelector('.my-entry--bird').getBoundingClientRect();
    const right = section.querySelector('.my-entry--partner').getBoundingClientRect();
    return { namesX: names.x, namesRight: names.right, leftRight: left.right, rightX: right.x };
  });
  assert.ok(closing.namesX >= closing.leftRight - 3 && closing.namesRight <= closing.rightX + 3, 'closing names occupy their own space between peacock silhouettes');
  const progress = await page.locator('.inv').evaluate(el => Number(el.style.getPropertyValue('--my-progress')));
  assert.ok(progress > .9, 'journey track reaches the closing section');
  await scrollToSection(page, 'gallery');
  const photo = page.locator('.gallery__item').first();
  await photo.focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('.inv-lightbox__img').naturalWidth > 0);
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.inv-lightbox').getAttribute('aria-modal'), 'true');
  const lightboxFits = await page.evaluate(() => {
    const image = document.querySelector('.inv-lightbox__img').getBoundingClientRect();
    const frame = document.querySelector('.device-frame__inner').getBoundingClientRect();
    return image.x >= frame.x && image.right <= frame.right + 1 && image.y >= frame.y && image.bottom <= frame.bottom + 1;
  });
  assert.ok(lightboxFits, 'enlarged photo stays visible within preview');
  await page.keyboard.press('Escape');
  await photo.press('Enter');
  await page.waitForTimeout(350);
  assert.ok(await page.locator('.inv-lightbox__img').evaluate(el => el.naturalWidth > 0), 'rapid reopen does not clear the image');
  await page.keyboard.press('Escape');

  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const variant of ['mayura-pearl', 'mayura-garnet']) {
    await visit(page, `${base}/templates/mayura/preview/${variant}`);
    await ready(page);
    for (const section of ['couple', 'event', 'gallery', 'rsvp']) {
      await scrollToSection(page, section);
      await page.screenshot({ path: join(out, `${variant}-${section}-390.png`) });
    }
  }
  await visit(page, `${base}/templates/mayura/preview/mayura-pearl`);
  await ready(page);
  assert.equal(await page.locator('.my-pending').count(), 0, 'reduced motion keeps all content readable');
  assert.equal(await page.locator('.my-bird-idle').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => document.querySelector('.sec--cover').classList.contains('my-in-view'));
  assert.equal(await page.locator('.sec--cover .my-bird-idle').first().evaluate(el => getComputedStyle(el).animationPlayState), 'running', 'animation resumes after reduced-motion setting changes');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Stress fixture uses the real renderer and interactions in the real device.
  const longDraft = sampleInvitation('mayura', 'mayura-garnet');
  longDraft.content.groom.name = 'Muhammad Raka Aditya Wiratama, S.T., M.Eng.';
  longDraft.content.bride.name = 'Alya Paramita Kusumaningrum, S.Farm., Apt.';
  longDraft.content.guestName = 'Bapak Muhammad & Ibu Siti beserta seluruh keluarga';
  longDraft.content.coverImage = '';
  longDraft.content.infoSettings = { dressCode: 'Busana formal dengan warna pilihan kalian.\nMohon mengenakan pakaian yang nyaman untuk merayakan hari bahagia kami.', access: 'Lokasi parkir tersedia di basement gedung. '.repeat(8) + 'AlamatTanpaSpasi'.repeat(10), notes: 'Kursi roda dapat mengakses pintu utama. Anak-anak tetap dalam pendampingan keluarga.' };
  longDraft.content.events[0].venue = 'Gedung Pertemuan Keluarga Besar Kusumaningrum dan Wiratama';
  longDraft.content.gallery = [longDraft.content.gallery[0]];
  await page.evaluate(async draft => {
    document.dispatchEvent(new Event('env:navigate'));
    const { renderInvitation } = await import('/src/engine/renderer.js');
    const { attachInvitationInteractions } = await import('/src/engine/interactions.js');
    const canvas = document.querySelector('.device-frame__inner');
    canvas.scrollTop = 0;
    canvas.innerHTML = renderInvitation(draft);
    attachInvitationInteractions(canvas, { demo: true });
  }, longDraft);
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    const m = await measure(page);
    assert.equal(m.viewportOverflow, false, 'long invitation fits viewport');
    assert.ok(m.names.right <= m.inv.right + 1 && m.names.x >= m.inv.x, 'long names stay in canvas');
    m.paragraphs.forEach(p => assert.ok(p.scrollWidth <= p.clientWidth + 1 && p.width >= 110));
  }
  assert.equal(await page.locator('.aviary__initials').count(), 1, 'no-photo cover has a designed fallback');
  await scrollToSection(page, 'info');
  await page.screenshot({ path: join(out, 'long-content-info.png') });

  // Catalog carousel uses real hydrated section covers, rather than screenshots.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await visit(page, `${base}/templates`);
    const card = page.locator('.tpl-card--mayura');
    await card.scrollIntoViewIfNeeded();
    await card.locator('.inv-frame.is-painted').first().waitFor();
    for (let i = 0; i < 3; i++) {
      await card.locator('.tpl-card__dot').nth(i).click();
      await page.waitForTimeout(600);
      const geometry = await card.locator('.tpl-card__slide').nth(i).evaluate(el => {
        const frame = el.querySelector('.inv-frame'), inv = el.querySelector('.inv');
        const outer = frame.getBoundingClientRect(), inner = inv.getBoundingClientRect();
        return { painted: frame.classList.contains('is-painted'), widthRatio: inner.width / outer.width, heightRatio: inner.height / outer.height, imageLoaded: inv.querySelector('.aviary__portrait img').naturalWidth > 0 };
      });
      assert.ok(geometry.painted && geometry.imageLoaded && geometry.widthRatio >= .9 && geometry.heightRatio <= 1.01, 'each slide remains visible and fills the card');
    }
    await page.screenshot({ path: join(out, `catalog-${width}.png`) });
  }
  await context.close();

  // Auth/backend are mocked only for editor/public local-draft visual checks.
  const editor = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await editor.route('https://www.google.com/maps**', route => route.fulfill({ contentType:'text/html', body:'<!doctype html><html><body style="background:#ebe6d9"></body></html>' }));
  const authExports = ['registerWithEmail', 'loginWithEmail', 'loginWithGoogle', 'sendPasswordReset', 'logout', 'getAuthToken'];
  await editor.route('**/src/services/auth.js', route => route.fulfill({ contentType: 'application/javascript', body: `export async function getCurrentUser(){return {uid:'visual-fixture',displayName:'Visual Fixture'}}; export function onAuthChange(cb){cb({uid:'visual-fixture',displayName:'Visual Fixture'});return ()=>{}}; ${authExports.map(name => `export async function ${name}(){return null}`).join(';')}` }));
  await editor.route('**/src/services/firebase.js', route => route.fulfill({ contentType: 'application/javascript', body: 'export const configValid=false;export function isFirebaseConfigured(){return false} export function getFirebaseApp(){return null}export async function getDb(){return null}export async function initAnalytics(){}' }));
  const fixture = sampleInvitation('mayura', 'mayura-jade');
  fixture.id = 'mayura-visual-fixture'; fixture.content.guestName = 'Ulum & Keluarga';
  await editor.addInitScript(draft => {
    const variant = new URLSearchParams(location.search).get('variant');
    if (['mayura-jade', 'mayura-pearl', 'mayura-garnet'].includes(variant)) draft.design.variantId = variant;
    localStorage.setItem('env_draft_' + draft.id, JSON.stringify(draft));
    localStorage.setItem('env_draft_index', JSON.stringify([draft.id]));
  }, fixture);
  const editPage = await editor.newPage();
  editPage.on('pageerror', e => errors.push(e.message));
  await visit(editPage, `${base}/create`);
  await editPage.locator('[data-pick-template="mayura"]').first().click();
  await editPage.locator('[data-variant-thumb="mayura-pearl"]').first().click();
  assert.ok(editPage.url().includes('variant=mayura-pearl'), 'new family can be selected through creation wizard');
  await visit(editPage, `${base}/builder/${fixture.id}`);
  await ready(editPage, '.builder__device .inv--mayura');
  await editPage.screenshot({ path: join(out, 'editor-desktop.png') });
  await editPage.locator('[data-nav-item="info"]').click();
  await editPage.waitForTimeout(800);
  assert.ok(await editPage.locator('.builder__device .info__body p').first().evaluate(el => el.getBoundingClientRect().width) > 110);
  await editPage.screenshot({ path: join(out, 'editor-info.png') });
  for (const width of [320, 390, 1440]) {
    await editPage.setViewportSize({ width, height: 1000 });
    await visit(editPage, `${base}/builder/${fixture.id}/preview`);
    await ready(editPage);
    assert.equal((await measure(editPage)).viewportOverflow, false, 'draft preview fits viewport');
  }
  await editPage.setViewportSize({ width: 390, height: 844 });
  await visit(editPage, `${base}/invite/${fixture.id}?to=Ulum`);
  await ready(editPage, '.invite-gate--mayura .aviary__portrait');
  assert.ok(await editPage.locator('.invite-gate .inv').evaluate(el => el.getBoundingClientRect().width >= innerWidth * .95), 'public gate has a full-width invitation canvas');
  assert.equal(await editPage.locator('.invite-gate .cover__guest-name').textContent(), 'Ulum');
  assert.equal(await editPage.locator('.invite-body').evaluate(el => el.inert), true, 'gate protects hidden interactive content');
  assert.equal(await editPage.locator('.invite-body').evaluate(el => getComputedStyle(el).visibility), 'hidden', 'underlying canvas stays hidden during opening');
  await editPage.screenshot({ path: join(out, 'public-gate.png') });
  await editPage.locator('[data-open-invite]').click();
  await editPage.locator('[data-gate]').waitFor({ state: 'detached' });
  assert.equal(await editPage.locator('.invite-body').evaluate(el => el.inert), false);
  await editPage.waitForTimeout(1050);
  assert.ok(await editPage.evaluate(() => document.querySelector('.welcome__text').getBoundingClientRect().top >= document.querySelector('.navbar').getBoundingClientRect().bottom), 'public opening copy stays below the product navbar');
  await editPage.screenshot({ path: join(out, 'public-open.png') });
  for (const width of [320, 390, 1440]) {
    await editPage.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const variant of ['mayura-jade', 'mayura-pearl', 'mayura-garnet']) {
      await visit(editPage, `${base}/invite/${fixture.id}?to=Ulum&variant=${variant}`);
      await ready(editPage, `.invite-gate .inv--v-${variant}`);
      assert.equal(await editPage.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'public gate fits screen');
      assert.equal(await editPage.locator('.invite-gate .cover__guest-name').textContent(), 'Ulum');
      // Capture the transition in the page before its removal timer, so browser
      // protocol latency cannot accidentally measure the second (body) cover.
      await editPage.evaluate(() => {
        const gate = document.querySelector('.invite-gate');
        window.mayuraTransition = new Promise(resolve => gate.addEventListener('click', () => {
          requestAnimationFrame(() => setTimeout(() => resolve({
            transform: getComputedStyle(gate).transform,
            curtainTransform: getComputedStyle(gate.querySelector('.my-leaf-door--left')).transform,
            puppetTranslate: getComputedStyle(gate.querySelector('.my-entry--bird')).translate,
            puppetOpacity: Number(getComputedStyle(gate.querySelector('.my-entry--bird')).opacity),
            bodyVisibility: getComputedStyle(document.querySelector('.invite-body')).visibility,
          }), 160));
        }, { once: true }));
      });
      await editPage.locator('[data-open-invite]').click();
      const transition = await editPage.evaluate(() => window.mayuraTransition);
      assert.equal(transition.transform, 'none', 'stage transition preserves canvas scale');
      assert.notEqual(transition.curtainTransform, 'none', `${variant}/${width}: stage curtain opens before the reveal`);
      assert.notEqual(transition.puppetTranslate, '0px 0px', `${variant}/${width}: peacock leaves with the opening curtain`);
      assert.ok(transition.puppetOpacity < .94, 'peacock fades while exiting');
      assert.equal(transition.bodyVisibility, 'hidden', 'opening transition cannot show duplicate canvases');
      if (width === 390 && await editPage.locator('.invite-gate').count()) await editPage.screenshot({ path: join(out, `${variant}-gate-transition.png`) });
      await editPage.locator('[data-gate]').waitFor({ state: 'detached' });
      assert.equal(await editPage.locator('.invite-body').evaluate(el => el.inert), false);
      assert.equal(await editPage.locator('.invite-body .inv').evaluate(el => el.classList.contains('is-opened')), true);
    }
  }
  await editor.close();
  assert.deepEqual(errors, [], 'no uncaught browser errors');
  await writeFile(join(out, 'results.json'), JSON.stringify({ results, errors, checks: ['responsive layouts', 'motion/reduced motion', 'long copy', 'gallery keyboard/reopen', 'catalog slides', 'editor/local draft/public gate'] }, null, 2));
  console.log(`PASS: ${results.length} variant/viewport cases, desktop mode, long content, motion/reduced motion, gallery, catalog, editor/draft/public gate. Screenshots: ${out}`);
} finally {
  await browser.close();
}
