let script;
async function load() {
 if(window.turnstile)return;
 if(!script)script=new Promise((resolve,reject)=>{const el=document.createElement('script');el.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';el.onload=resolve;el.onerror=()=>{script=null;reject(new Error('Verifikasi belum dapat dimuat.'));};document.head.appendChild(el);});
 await script;
}
export async function guestChallenge(form,kind) {
 await load();
 const response=await fetch('/api/guests/config');const {sitekey}=await response.json();
 if(!sitekey)throw new Error('Konfirmasi tamu sedang tidak tersedia.');
 let holder=form.querySelector('[data-guest-challenge]');if(!holder){holder=document.createElement('div');holder.dataset.guestChallenge='';holder.setAttribute('aria-label','Verifikasi pengiriman');form.appendChild(holder);}
 return new Promise((resolve,reject)=>{
  let widget;const timer=setTimeout(()=>{window.turnstile.remove(widget);reject(new Error('Verifikasi belum selesai. Coba kembali.'));},120_000);
  widget=window.turnstile.render(holder,{sitekey,action:kind,callback:token=>{clearTimeout(timer);window.turnstile.remove(widget);resolve(token);},'error-callback':()=>{clearTimeout(timer);window.turnstile.remove(widget);reject(new Error('Verifikasi gagal. Coba kembali.'));}});
  document.addEventListener('env:navigate',()=>{clearTimeout(timer);window.turnstile.remove(widget);reject(new Error('Halaman telah ditutup.'));},{once:true});
 });
}
