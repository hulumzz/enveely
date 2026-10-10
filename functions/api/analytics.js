import {json} from '../_lib/firebase-admin.js';
import {boundedJson} from '../_lib/body.js';
import {consumeQuota} from '../_lib/request-limit.js';
import {templatePlans} from '../../src/data/plans.js';
const events=new Set(['page_view','template_preview','checkout_start','proof_submitted','published','whatsapp_click','create_invitation']);
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export async function hashAnalytics(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('');}
export function analyticsDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function validAnalyticsPayload(body){return body && body.consent===true && events.has(body.event) && uuid.test(body.session || '') && uuid.test(body.eventId || '') && typeof body.templateId==='string' && (body.templateId==='' || Object.keys(templatePlans).some(variant=>variant.startsWith(body.templateId+'-'))) && Object.keys(body).every(key=>['consent','event','session','eventId','templateId'].includes(key));}
export async function onRequestPost({request,env}) {
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({message:'Origin tidak diizinkan.'},403);
 let body;try{body=await boundedJson(request,2048);}catch{return json({message:'Request tidak valid.'},400);}
 if(!body || typeof body!=='object' || Array.isArray(body))return json({message:'Request tidak valid.'},400);
 if(body.consent!==true)return new Response(null,{status:204});
 if(!validAnalyticsPayload(body))return json({message:'Event tidak valid.'},400);
 if(!env.PAYMENTS_DB)return json({message:'Statistik belum tersedia.'},503);
 try {
  const day=analyticsDay(),ip=await hashAnalytics(`${day}:${request.headers.get('cf-connecting-ip') || 'unknown'}`);
  if(!await consumeQuota(env,ip,'analytics',100,60))return json({message:'Terlalu banyak event.'},429);
  const visitor=await hashAnalytics(`${day}:${body.session}`),eventHash=await hashAnalytics(`${day}:${body.session}:${body.eventId}`),db=env.PAYMENTS_DB;
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO analytics_events(event_hash,day,event,template_id,visitor_hash) VALUES(?,?,?,?,?)').bind(eventHash,day,body.event,body.templateId,visitor),
   db.prepare('INSERT INTO analytics_daily(day,event,template_id,count) SELECT ?,?,?,1 WHERE changes()=1 ON CONFLICT(day,event,template_id) DO UPDATE SET count=count+1').bind(day,body.event,body.templateId),
   db.prepare('INSERT OR IGNORE INTO analytics_sessions(day,visitor_hash) VALUES(?,?)').bind(day,visitor),
  ]);
  return new Response(null,{status:204});
 }catch{ return json({message:'Statistik belum dapat dicatat.'},503); }
}
