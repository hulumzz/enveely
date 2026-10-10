import {json,adminDocument,adminCommit,encodeFields,firestoreRoot,firebaseServiceAccessToken} from '../../_lib/firebase-admin.js';
import {activeInvitation} from '../../_lib/public-access.js';
import {consumeQuota} from '../../_lib/request-limit.js';
import {sha256} from '../../_lib/image-validation.js';
import {boundedJson} from '../../_lib/body.js';
export function onRequestGet({env}) {return json({sitekey:env.TURNSTILE_SITE_KEY||''});}
export async function onRequestPost({request,env,params}) {
 try {
  const id=String(params.id||'');if(!/^[A-Za-z0-9_-]{8,80}$/.test(id))return json({message:'Undangan tidak valid.'},400);
  if(!env.TURNSTILE_SECRET_KEY)return json({message:'Konfirmasi tamu sedang tidak tersedia. Coba kembali nanti.'},503);
  const payload=await boundedJson(request,4096);
  if(!['rsvp','wish'].includes(payload.kind) || !/^[a-f0-9-]{36}$/.test(payload.requestId||'') || typeof payload.token!=='string' || payload.token.length>2048)return json({message:'Data konfirmasi tidak valid.'},400);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  const quotaId=await sha256(new TextEncoder().encode(ip));
  if(!await consumeQuota(env,quotaId,'guest-attempt',30,3600))return json({message:'Terlalu banyak percobaan. Coba kembali nanti.'},429);
  const challenge=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:payload.token,remoteip:ip,idempotency_key:payload.requestId}),signal:AbortSignal.timeout(10_000)});
  const result=await challenge.json();
  if(!result.success || result.hostname!==new URL(request.url).hostname || result.action!==payload.kind)return json({message:'Verifikasi belum berhasil. Silakan coba kembali.'},403);
  const accessToken=await firebaseServiceAccessToken(env);
  const active=await activeInvitation(env,id,accessToken);if(!active)return json({message:'Undangan sudah tidak aktif.'},410);
  const name=String(payload.data?.name||'').trim(),message=String(payload.data?.message||'').trim();
  if(!name || name.length>80 || message.length>500 || (payload.kind==='wish' && !message))return json({message:'Periksa nama dan isi pesan.'},400);
  const data={name,message};const {content,sections}=active.invitation;
  const enabled=section=>!sections?.some(s=>s.id===section && s.enabled===false);
  if(payload.kind==='rsvp') {
   if(content?.rsvpSettings?.enabled===false || !enabled('rsvp'))return json({message:'RSVP telah ditutup.'},410);
   if(!['attending','not-attending'].includes(payload.data?.attendance))return json({message:'Pilih kehadiran.'},400);
   const count=Number(payload.data?.guestCount||1),max=Math.min(20,Math.max(1,Number(content?.rsvpSettings?.maxGuestCount||5)));
   if(!Number.isInteger(count) || count<1 || count>max)return json({message:`Jumlah tamu maksimal ${max}.`},400);
   Object.assign(data,{attendance:payload.data.attendance,guestCount:count});
  } else {if(content?.wishesEnabled===false || !enabled('wishes'))return json({message:'Ucapan telah ditutup.'},410);data.approved=false;}
  const path=`invitations/${id}/${payload.kind==='rsvp'?'rsvps':'wishes'}/${payload.requestId}`;
  const existing=await adminDocument(env,path,accessToken);if(existing)return json({cloud:true,duplicate:true});
  if(!await consumeQuota(env,quotaId,`guest-${id}`,6,3600) || !await consumeQuota(env,id,'guest-total',2000,86400))return json({message:'Batas pengiriman tercapai. Hubungi pemilik undangan.'},429);
  await adminCommit(env,[{verify:active.document.name || `${firestoreRoot(env).split('/v1/')[1]}/invitations/${id}`,currentDocument:{updateTime:active.document.updateTime}},{update:{name:`${firestoreRoot(env).split('/v1/')[1]}/${path}`,fields:encodeFields(data)},currentDocument:{exists:false},updateTransforms:[{fieldPath:'createdAt',setToServerValue:'REQUEST_TIME'}]}],accessToken);
  return json({cloud:true});
 }catch(error){console.error(JSON.stringify({event:'guest_submission_failed',message:error.message}));return json({message:'Konfirmasi belum terkirim. Periksa koneksi lalu coba kembali.'},502);}
}
