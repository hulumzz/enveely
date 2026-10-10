import {state,subscribe,setLocale} from '../state.js';
import {t,applyTranslations} from '../i18n.js';
import {analyticsEvents,recordProductEvent} from '../services/analytics.js';
import {onAuthChange,logout,getAuthToken} from '../services/auth.js';
import {icon} from '../core/icons.js';
import {brand,supportUrl} from '../core/brand.js';
import {esc} from '../core/format.js';
import {openModal,toast} from './overlays.js';
import {navigate} from '../router.js';
let shellRoot,shellUser=null,adminUid='',isAdmin=false,pageDispose;
const accountNav=[['/dashboard','Beranda','home'],['/dashboard/templates','Koleksi desain','layers'],['/dashboard/invitations','Undangan saya','mail'],['/dashboard/guests','Tamu & ucapan','users'],['/dashboard/payments','Pembayaran','wallet'],['/dashboard/profile','Profil & akun','user']];
const adminNav=[['/admin','Ringkasan','home'],['/admin/payments','Pembayaran','wallet'],['/admin/analytics','Analitik','chart'],['/admin/reviews','Ulasan pengguna','chat']];
function navMarkup(items){return items.map(([href,label,name])=>`<a href="${href}" data-link>${icon(name,{size:20})}<span>${label}</span></a>`).join('');}

export function mountAppShell(root) {
 shellRoot=root;
 root.innerHTML=`
 <header class="navbar site-header"><div class="navbar__inner container">
  <a href="/" data-link class="navbar__logo" aria-label="Enveely, beranda">enveely<span class="brand-period">.</span></a>
  <nav class="navbar__links" id="nav-links" aria-label="Navigasi utama">
   <a href="/templates" data-link>Desain undangan</a><a href="/#how-it-works" data-link>Cara membuat</a><a href="/#pricing" data-link>Harga</a>
   <div class="navbar__links-actions"><a href="/login" data-link class="nav-secondary" data-auth="out">Masuk</a><a href="/create" data-link class="btn btn--primary btn--sm" data-auth="out">Buat undangan ${icon('arrowRight',{size:16})}</a><a href="/dashboard" data-link class="btn btn--primary btn--sm" data-auth="in">Dashboard ${icon('arrowRight',{size:16})}</a></div>
  </nav>
  <div class="navbar__actions"><div class="lang-switch" role="group" aria-label="Bahasa"><button type="button" data-locale="id" class="lang-switch__btn">ID</button><button type="button" data-locale="en" class="lang-switch__btn">EN</button></div><button type="button" class="navbar__toggle icon-button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-links">${icon('menu',{size:22})}</button></div>
 </div></header>
 <div class="workspace-layout">
  <aside class="workspace-sidebar" id="workspace-navigation" aria-label="Navigasi akun" inert>
   <a href="/dashboard" data-link class="workspace-brand">enveely<span>.</span></a>
   <nav data-workspace-nav aria-label="Menu akun">${navMarkup(accountNav)}</nav>
   <a href="/admin" data-link class="workspace-admin" data-admin-link hidden>${icon('shield',{size:18})}<span>Dashboard admin</span></a>
   <div class="workspace-assistance"><strong>Perlu dibantu?</strong><p>Konsultasikan desain atau pesan terima jadi.</p><a href="${supportUrl()}" target="_blank" rel="noopener noreferrer" data-support>${icon('whatsapp',{size:18})} Chat tim Enveely</a></div>
   <a class="workspace-user" href="/dashboard/profile" data-link><span class="workspace-avatar" data-user-initial>E</span><span><strong data-user-name>Akun Enveely</strong><small data-user-email></small></span></a>
   <button type="button" class="workspace-logout" data-shell-logout>${icon('logout',{size:18})} Keluar</button><small class="workspace-signature">by Nalaro Digital</small>
  </aside>
  <button type="button" class="workspace-scrim" aria-label="Tutup menu akun" tabindex="-1"></button>
  <div class="workspace-main"><header class="workspace-topbar"><button type="button" class="icon-button" data-workspace-toggle aria-label="Buka navigasi akun" aria-expanded="false" aria-controls="workspace-navigation">${icon('menu',{size:21})}</button><span data-workspace-title>Beranda</span><div><a href="/templates" data-link class="workspace-view-site">Cari desain ${icon('layers',{size:17})}</a><a href="/dashboard/profile" data-link class="workspace-avatar" data-user-initial aria-label="Profil akun">E</a></div></header><main id="page-outlet" class="page-outlet"></main></div>
 </div>
 <footer class="site-footer"><div class="container"><div class="site-footer__intro"><div><a href="/" data-link class="site-footer__brand">enveely<span>.</span></a><p>Undangan digital, dari pilih desain<br>sampai siap dibagikan.</p><a href="https://nalaro.digital" target="_blank" rel="noopener noreferrer" class="site-footer__parent">Enveely by Nalaro Digital ${icon('external',{size:15})}</a></div><div class="site-footer__contact"><h2>Mulai dari obrolan singkat.</h2><a href="${supportUrl()}" target="_blank" rel="noopener noreferrer" data-support>${brand.phone} ${icon('arrowRight',{size:22})}</a><a href="mailto:${brand.email}">${brand.email}</a></div></div>
 <div class="site-footer__links"><nav aria-label="Desain dan akun"><strong>Undangan</strong><a href="/templates" data-link>Pilih desain</a><a href="/create" data-link>Buat undangan</a><a href="/dashboard" data-link>Dashboard</a></nav><nav aria-label="Informasi layanan"><strong>Panduan</strong><a href="/#how-it-works" data-link>Cara membuat</a><a href="/#pricing" data-link>Harga & masa tayang</a><a href="/help" data-link>Bantuan</a></nav><nav aria-label="Kebijakan"><strong>Informasi</strong><a href="/privacy" data-link>Privasi</a><a href="/terms" data-link>Ketentuan</a><button type="button" data-analytics-settings>Preferensi analitik</button></nav><div class="site-footer__note">Bisa edit sendiri.<br>Bisa dibantu sampai jadi.<a href="${supportUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn--light" data-support>Pesan lewat WhatsApp ${icon('whatsapp',{size:18})}</a></div></div><div class="site-footer__base"><span>© ${new Date().getFullYear()} Enveely</span><span>Bagian dari Nalaro Digital</span></div></div></footer>
 <a class="support-float" href="${supportUrl()}" target="_blank" rel="noopener noreferrer" data-support aria-label="Bingung pilih desain? Chat Enveely di WhatsApp">${icon('whatsapp',{size:23})}<span><strong>Bingung pilih desain?</strong><small>Chat tim Enveely</small></span></a>
 <div id="toast-root" aria-live="polite"></div>`;
 root.querySelectorAll('[data-locale]').forEach(button=>button.addEventListener('click',()=>{setLocale(button.dataset.locale);analyticsEvents.languageChanged(button.dataset.locale);}));
 const publicToggle=root.querySelector('.navbar__toggle');
 publicToggle.addEventListener('click',()=>{const open=document.body.classList.toggle('nav-open');publicToggle.setAttribute('aria-expanded',String(open));});
 root.querySelector('[data-workspace-toggle]').addEventListener('click',()=>setSidebar(!document.body.classList.contains('workspace-nav-open')));
 root.querySelector('.workspace-scrim').addEventListener('click',()=>setSidebar(false));
 root.addEventListener('click',event=>{if(event.target.closest('a[data-link]')){setSidebar(false);document.body.classList.remove('nav-open');publicToggle.setAttribute('aria-expanded','false');}if(event.target.closest('[data-support]'))recordProductEvent('whatsapp_click');});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){setSidebar(false);document.body.classList.remove('nav-open');publicToggle.setAttribute('aria-expanded','false');}if(event.key==='Tab' && document.body.classList.contains('workspace-nav-open')){const controls=[...root.querySelectorAll('.workspace-sidebar a:not([hidden]),.workspace-sidebar button')].filter(node=>node.getClientRects().length);if(event.shiftKey && document.activeElement===controls[0]){event.preventDefault();controls.at(-1)?.focus();}else if(!event.shiftKey && document.activeElement===controls.at(-1)){event.preventDefault();controls[0]?.focus();}}});
 document.addEventListener('env:navigate',()=>{pageDispose?.();pageDispose=null;setSidebar(false);reflectShell();});
 root.querySelector('[data-shell-logout]').addEventListener('click',()=>openModal({title:'Keluar dari akun?',body:'<p>Undangan yang sudah tersinkron tetap tersimpan di akunmu.</p>',actions:[{label:'Batal'},{label:'Keluar',kind:'primary',onClick:async()=>{await logout();setShellUser(null);navigate('/');}}]}));
 root.querySelector('[data-analytics-settings]').addEventListener('click',showAnalyticsSettings);
 matchMedia('(max-width: 900px)').addEventListener('change',()=>setSidebar(false));
 onAuthChange(setShellUser);
 subscribe('app',()=>reflectLocale());reflectLocale();reflectShell();
}
export function setShellUser(user){shellUser=user;reflectShell();if(user && adminUid!==user.uid){adminUid=user.uid;isAdmin=false;getAuthToken().then(token=>fetch('/api/account',{headers:{authorization:`Bearer ${token}`}})).then(r=>r.ok?r.json():{}).then(data=>{if(shellUser?.uid===user.uid){isAdmin=data.admin===true;reflectShell();}}).catch(()=>{});}else if(!user){adminUid='';isAdmin=false;reflectShell();}}
function reflectShell(){
 if(!shellRoot)return;
 const path=location.pathname,workspace=!!shellUser && /^\/(dashboard|admin|builder|checkout|create|templates)(\/|$)/.test(path),invitation=/^\/invite\//.test(path);
 document.body.classList.toggle('is-workspace',workspace);document.body.classList.toggle('is-editor',workspace && path.startsWith('/builder/') && !path.endsWith('/preview'));document.body.classList.toggle('is-invitation',invitation);document.body.classList.toggle('is-login',path==='/login');
 const sidebar=shellRoot.querySelector('.workspace-sidebar');sidebar.inert=!workspace || (matchMedia('(max-width: 900px)').matches && !document.body.classList.contains('workspace-nav-open'));
 const admin=path.startsWith('/admin'),items=admin?adminNav:accountNav,nav=shellRoot.querySelector('[data-workspace-nav]');
 if(nav.dataset.mode!==(admin?'admin':'account')){nav.innerHTML=navMarkup(items)+(admin?'<a href="/dashboard" data-link>'+icon('arrowLeft',{size:20})+'<span>Kembali ke akun</span></a>':'');nav.dataset.mode=admin?'admin':'account';}
 let title=items.find(([href])=>href===path)?.[1] || (path.startsWith('/builder/')?'Editor undangan':path.startsWith('/checkout/')?'Aktivasi undangan':path.startsWith('/templates')?'Koleksi desain':path==='/create'?'Undangan baru':'Beranda');
 nav.querySelectorAll('a').forEach(a=>{const active=a.getAttribute('href')===path || (a.getAttribute('href')==='/dashboard/templates' && path.startsWith('/templates'));a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 shellRoot.querySelector('[data-workspace-title]').textContent=title;shellRoot.querySelector('[data-admin-link]').hidden=!isAdmin || admin;
 shellRoot.querySelectorAll('[data-auth]').forEach(el=>{el.hidden=el.dataset.auth!==(shellUser?'in':'out');el.style.display=el.hidden?'none':'';});
 const name=shellUser?.displayName || 'Akun Enveely';shellRoot.querySelector('[data-user-name]').textContent=name;shellRoot.querySelector('[data-user-email]').textContent=shellUser?.email || '';shellRoot.querySelectorAll('[data-user-initial]').forEach(el=>el.textContent=name.charAt(0).toUpperCase());
}
function setSidebar(open){document.body.classList.toggle('workspace-nav-open',open);const toggle=shellRoot?.querySelector('[data-workspace-toggle]');toggle?.setAttribute('aria-expanded',String(open));const sidebar=shellRoot?.querySelector('.workspace-sidebar');if(sidebar){sidebar.inert=!document.body.classList.contains('is-workspace') || (matchMedia('(max-width: 900px)').matches && !open);if(open)sidebar.querySelector('a')?.focus();else if(sidebar.contains(document.activeElement))toggle?.focus();}}
function reflectLocale(){shellRoot?.querySelectorAll('[data-locale]').forEach(el=>{const active=el.dataset.locale===state.app.locale;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',String(active));});applyTranslations(shellRoot);}
export function showAnalyticsSettings(){openModal({title:'Preferensi analitik',body:'<p>Izinkan statistik penggunaan untuk membantu kami memperbaiki Enveely. Nama, email, isi undangan, dan aktivitas tamu tidak dikirim.</p>',actions:[{label:'Tidak izinkan',onClick:async()=>{const {setAnalyticsConsent}=await import('../services/firebase.js');await setAnalyticsConsent(false);toast('Analitik dinonaktifkan.');}},{label:'Izinkan',kind:'primary',onClick:async()=>{const {setAnalyticsConsent}=await import('../services/firebase.js');await setAnalyticsConsent(true);recordProductEvent('page_view');toast('Preferensi analitik disimpan.');}}]});}
export function renderPage(html,setup){const outlet=document.getElementById('page-outlet');if(!outlet)return;pageDispose?.();pageDispose=null;reflectShell();outlet.innerHTML=html;applyTranslations(outlet);const result=typeof setup==='function'?setup(outlet):null;if(typeof result==='function')pageDispose=result;window.scrollTo({top:0,behavior:'instant'});}
export {t};
