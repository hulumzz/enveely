import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
const modulePath=process.env.PLAYWRIGHT_MODULE_PATH;
if(!modulePath)throw new Error('Set PLAYWRIGHT_MODULE_PATH to the Playwright entrypoint.');
const {chromium}=await import(pathToFileURL(modulePath).href);
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8788';
const dir='.pages-config-scratch/browser';fs.mkdirSync(dir,{recursive:true});
const email=`enveely-qa-${Date.now()}@example.invalid`,password=`Qa-${randomUUID()}!`;
const state={email,password,base,invitationIds:[]};
const save=()=>{fs.writeFileSync(path.join(dir,'test-state.json'),JSON.stringify(state));if(state.uid)fs.writeFileSync(path.join(dir,`test-state-${state.uid}.json`),JSON.stringify(state));};save();
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',async response=>{if(response.url().includes('accounts:signUp') && response.ok()){const payload=await response.json();state.uid=payload.localId;state.idToken=payload.idToken;save();}});
page.on('response',async response=>{if(response.url().endsWith('/api/media/upload') && response.ok()){const payload=await response.json();state.mediaKeys=[...(state.mediaKeys||[]),payload.id];save();}});
const go=route=>page.goto(`${base}${route}`,{waitUntil:'domcontentloaded'});
const login=async (p)=>{await p.goto(`${base}/login`,{waitUntil:'domcontentloaded'});await p.locator('[name="email"]').fill(email);await p.locator('[name="password"]').fill(password);await p.locator('[data-submit]').click();await p.locator('.account-shell').waitFor({timeout:30000});};
try {
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const route of ['/','/templates','/help','/privacy','/terms','/login']) {
      await go(route);await page.locator('#page-outlet h1').first().waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} overflow at ${width}`);
    }
    await page.screenshot({path:path.join(dir,`public-${width}.png`)});
  }
  await page.setViewportSize({width:1440,height:1000});
  await go('/login?mode=register');
  await page.locator('[name="name"]').fill('Enveely QA');await page.locator('[name="email"]').fill(email);await page.locator('[name="password"]').fill(password);await page.locator('[data-submit]').click();
  await page.locator('.account-shell').waitFor({timeout:30000});
  await go('/dashboard/profile');await page.locator('[data-profile-form]').waitFor();
  await page.locator('[name="displayName"]').fill('Enveely QA Updated');await page.locator('[data-profile-form] [type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('.profile-card--identity h3')?.textContent==='Enveely QA Updated');
  await go('/create?template=serena&variant=serena-paper');
  await page.locator('[name="groomName"]').fill('Mempelai QA');await page.locator('[name="brideName"]').fill('Pasangan QA');await page.locator('[name="weddingDate"]').fill('2026-12-12');
  await page.locator('#create-basics [type="submit"]').click();await page.locator('[data-builder]').waitFor({timeout:30000});
  const id=new URL(page.url()).pathname.split('/').at(-1);state.invitationIds.push(id);save();
  await page.locator('[data-nav-item="event"]').click();await page.locator('[data-add-event]').click();
  await page.locator('[name="events.0.title"]').fill('Acara QA');await page.locator('[name="events.0.venue"]').fill('Tempat QA');await page.locator('[name="events.0.address"]').fill('Jakarta');
  await page.locator('[data-nav-item="cover"]').click();await page.locator('[data-photo-path="coverImage"] input').setInputFiles('public/logo.png');
  await page.waitForFunction(()=>document.querySelector('[data-photo-path="coverImage"] img')?.getAttribute('src')?.startsWith('/media/'),null,{timeout:60000});
  await page.waitForFunction(()=>document.querySelector('[data-save-status]')?.textContent==='Tersimpan di akun',null,{timeout:30000});
  await page.locator('[data-act="publish"]').click();await page.getByRole('button',{name:'Tayangkan Sekarang',exact:true}).click();
  await page.getByText('Undangan Sudah Tayang ✨',{exact:true}).waitFor({timeout:30000});
  await page.getByRole('button',{name:'Selesai',exact:true}).click();
  for(const width of [320,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:path.join(dir,`builder-${width}.png`)});}
  const second=await browser.newContext();const other=await second.newPage();await login(other);
  await other.goto(`${base}/builder/${id}`,{waitUntil:'domcontentloaded'});await other.locator('[data-builder]').waitFor({timeout:30000});
  assert.equal(await other.locator('.builder__title').textContent(),'Mempelai QA & Pasangan QA · serena');
  const guest=await browser.newContext({viewport:{width:390,height:844}});const publicPage=await guest.newPage();
  const response=await publicPage.goto(`${base}/invite/${id}?to=Tamu%20QA`,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
  assert.match(await publicPage.title(),/Mempelai QA/);
  await publicPage.locator('[data-open-invite]').click();await publicPage.locator('[data-gate]').waitFor({state:'detached'});
  await publicPage.locator('[data-rsvp-form] [name="name"]').fill('Tamu QA');await publicPage.locator('[data-rsvp-form] [type="submit"]').click();
  await publicPage.getByText('Konfirmasi kehadiran berhasil dikirim.',{exact:true}).waitFor({timeout:30000});
  await publicPage.locator('[data-wishes-form] [name="name"]').fill('Tamu QA');await publicPage.locator('[data-wishes-form] [name="message"]').fill('Ucapan QA untuk pengujian.');await publicPage.locator('[data-wishes-form] [type="submit"]').click();
  await publicPage.getByText('Ucapan berhasil dikirim dan menunggu persetujuan pemilik undangan.',{exact:true}).waitFor({timeout:30000});
  await go('/dashboard/guests');await page.locator('[data-moderate-wish]').waitFor({timeout:30000});await page.locator('[data-moderate-wish]').first().click();await page.getByRole('button',{name:'Sembunyikan',exact:true}).waitFor();
  await publicPage.reload({waitUntil:'domcontentloaded'});await publicPage.locator('[data-open-invite]').click();await publicPage.locator('[data-gate]').waitFor({state:'detached'});await publicPage.locator('[data-wishes-list]').getByText('Ucapan QA untuk pengujian.',{exact:true}).waitFor({timeout:30000});
  const ai=await page.request.post(`${base}/api/editor/suggest`,{headers:{authorization:`Bearer ${state.idToken}`},data:{task:'field',field:'coverEyebrow',context:{names:{groom:'Mempelai QA',bride:'Pasangan QA'}}},timeout:90000});
  assert.equal(ai.status(),200,`AI HTTP ${ai.status()}`);const suggestion=await ai.json();assert.equal(suggestion.source,'cloudflare');assert.ok(suggestion.value.length>0);
  assert.equal((await page.request.get(`${base}/api/admin/payments`,{headers:{authorization:`Bearer ${state.idToken}`}})).status(),403);
  await go('/create?template=amora&variant=amora-garden');
  await page.locator('[name="groomName"]').fill('Checkout QA');await page.locator('[name="brideName"]').fill('Pasangan QA');await page.locator('[name="weddingDate"]').fill('2026-12-12');
  await page.locator('#create-basics [type="submit"]').click();await page.locator('[data-builder]').waitFor({timeout:30000});
  const paidId=new URL(page.url()).pathname.split('/').at(-1);state.invitationIds.push(paidId);save();
  await go(`/checkout/${paidId}`);await page.locator('[data-qris] img').waitFor({timeout:30000});
  const firstTotal=await page.locator('.order-summary__total dd').textContent();await page.locator('[data-duration="6"]').click();await page.locator('[data-duration="6"].is-active').waitFor();
  const finalTotal=await page.locator('.order-summary__total dd').textContent();const rupiah=value=>Number(value.replace(/\D/g,''));assert.equal(rupiah(finalTotal)-rupiah(firstTotal),15000);
  for(const width of [320,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`checkout overflow ${width}`);}
  await go('/dashboard/invitations');await page.locator('[data-invitation-filter="published"]').click();assert.equal(await page.locator('.invite-card').count(),1);
  await page.locator('[data-invitation-filter="draft"]').click();assert.equal(await page.locator('.invite-card').count(),1);
  await page.locator('[data-invitation-filter="all"]').click();
  for(const invitationId of [paidId,id]){await page.locator(`[data-delete="${invitationId}"]`).click();await page.getByRole('button',{name:'Hapus Undangan',exact:true}).click();await page.locator(`[data-delete="${invitationId}"]`).waitFor({state:'detached',timeout:30000});}
  await page.getByText('Belum ada undangan',{exact:true}).waitFor({timeout:30000});
  const gone=await publicPage.goto(`${base}/invite/${id}`,{waitUntil:'domcontentloaded'});assert.equal(gone.status(),404);
  for(const key of state.mediaKeys || [])assert.equal((await page.request.get(`${base}/media/${key}`)).status(),404,'Deleted invitation photo still publicly available');
  state.cleanedInvitations=true;save();
  assert.deepEqual(errors,[]);
  console.log('PASS: 18 public route/viewport checks, real registration/login/profile, create/upload/cloud/publish, second browser recovery, RSVP/wishes/moderation, Workers AI, admin authorization, QRIS/duration totals, filter/cascade delete, server OG and public 404.');
  await second.close();await guest.close();
}finally{await browser.close();}
