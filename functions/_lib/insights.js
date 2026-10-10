import {firebaseServiceAccessToken,firestoreRoot} from './firebase-admin.js';
export function reportingWindow(days=30,now=new Date()) {
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(now),end=new Date(new Date(`${day}T00:00:00+07:00`).getTime()+86400000),start=new Date(end.getTime()-days*86400000);
 return {start:start.toISOString(),end:end.toISOString(),previous:new Date(start.getTime()-days*86400000).toISOString(),days};
}
export async function invitationCounts(env,start) {
 try {
  const token=await firebaseServiceAccessToken(env);if(!token)throw new Error('No service identity');
  const count=async where=>{const response=await fetch(`${firestoreRoot(env)}:runAggregationQuery`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({structuredAggregationQuery:{structuredQuery:{from:[{collectionId:'invitations'}],...(where?{where}:{})},aggregations:[{alias:'total',count:{}}]}}),signal:AbortSignal.timeout(10_000)});if(!response.ok)throw new Error('Aggregation unavailable');const payload=await response.json(),value=payload.find(row=>row.result?.aggregateFields?.total)?.result.aggregateFields.total.integerValue;if(value===undefined)throw new Error('Aggregation missing');return Number(value);};
  const results=await Promise.allSettled([count(),count({fieldFilter:{field:{fieldPath:'status'},op:'EQUAL',value:{stringValue:'published'}}}),count({fieldFilter:{field:{fieldPath:'cloudCreatedAt'},op:'GREATER_THAN_OR_EQUAL',value:{timestampValue:start}}})]);
  return Object.fromEntries(['total','published','recent'].map((name,index)=>[name,results[index].status==='fulfilled'?results[index].value:null]));
 }catch{return {total:null,published:null,recent:null};}
}
export async function readInsights(env,days=30,now=new Date()) {
 const db=env.PAYMENTS_DB,window=reportingWindow(days,now),time=now.toISOString();
 const queries=[
  db.prepare(`SELECT COUNT(*) AS orders,COUNT(DISTINCT uid) AS buyers,
   COALESCE(SUM(CASE WHEN status IN ('pending_review','ai_match') THEN 1 ELSE 0 END),0) AS reviewPending,
   COALESCE(SUM(CASE WHEN status='activation_pending' THEN 1 ELSE 0 END),0) AS activationPending,
   COUNT(DISTINCT CASE WHEN status='active' AND expires_at>? THEN invitation_id END) AS activePackages,
   COALESCE(SUM(CASE WHEN status='active' AND expires_at<=? THEN 1 ELSE 0 END),0) AS expiredOrders FROM payment_orders`).bind(time,time),
  db.prepare(`SELECT COALESCE(SUM(expected_total),0) AS amount,COALESCE(SUM(base_price+extension_fee),0) AS packageSales,COUNT(*) AS approved FROM payment_orders WHERE status='active' AND reviewed_at>=? AND reviewed_at<?`).bind(window.start,window.end),
  db.prepare(`SELECT COALESCE(SUM(expected_total),0) AS amount,COUNT(*) AS approved FROM payment_orders WHERE status='active' AND reviewed_at>=? AND reviewed_at<?`).bind(window.previous,window.start),
  db.prepare(`SELECT date(reviewed_at,'+7 hours') AS day,COUNT(*) AS orders,SUM(expected_total) AS amount FROM payment_orders WHERE status='active' AND reviewed_at>=? AND reviewed_at<? GROUP BY 1 ORDER BY 1`).bind(window.start,window.end),
  db.prepare(`SELECT status,COUNT(*) AS count FROM payment_orders GROUP BY status ORDER BY count DESC`),
  db.prepare(`SELECT event,SUM(count) AS count FROM analytics_daily WHERE day>=date(?,'+7 hours') AND day<date(?,'+7 hours') GROUP BY event`).bind(window.start,window.end),
  db.prepare(`SELECT day,SUM(CASE WHEN event='page_view' THEN count ELSE 0 END) AS views,SUM(CASE WHEN event='whatsapp_click' THEN count ELSE 0 END) AS whatsapp FROM analytics_daily WHERE day>=date(?,'+7 hours') AND day<date(?,'+7 hours') GROUP BY day ORDER BY day`).bind(window.start,window.end),
  db.prepare(`SELECT COUNT(*) AS count FROM analytics_sessions WHERE day>=date(?,'+7 hours') AND day<date(?,'+7 hours')`).bind(window.start,window.end),
  db.prepare(`SELECT template_id AS templateId,SUM(count) AS previews FROM analytics_daily WHERE event='template_preview' AND template_id<>'' AND day>=date(?,'+7 hours') AND day<date(?,'+7 hours') GROUP BY template_id ORDER BY previews DESC LIMIT 6`).bind(window.start,window.end),
  db.prepare(`SELECT COUNT(*) AS count FROM payment_orders WHERE status='activation_pending' AND activation_started_at<?`).bind(new Date(now.getTime()-30*60000).toISOString()),
  db.prepare(`SELECT COUNT(*) AS count FROM deletion_jobs`),
  db.prepare(`SELECT COUNT(*) AS count FROM customer_reviews WHERE status='pending'`),
 ];
 const [data,counts]=await Promise.all([db.batch(queries),invitationCounts(env,window.start)]),rows=data.map(item=>item.results || []),events=Object.fromEntries(rows[5].map(row=>[row.event,row.count]));
 const insights=[];
 if(rows[9][0]?.count)insights.push({level:'warning',message:`${rows[9][0].count} aktivasi menunggu lebih dari 30 menit. Periksa antrean dan error aktivasi.`});
 if(rows[0][0].reviewPending)insights.push({level:'info',message:`${rows[0][0].reviewPending} bukti pembayaran perlu dicocokkan dengan transaksi merchant.`});
 if(rows[11][0].count)insights.push({level:'info',message:`${rows[11][0].count} ulasan menunggu persetujuan sebelum tampil di landing.`});
 if(!rows[7][0].count)insights.push({level:'info',message:'Belum ada sesi dengan izin analitik pada periode ini. Ini tidak berarti tidak ada pengunjung.'});
 if(counts.total===null)insights.push({level:'warning',message:'Statistik undangan sementara tidak tersedia. Angka pembayaran tetap berasal dari database transaksi.'});
 if(!insights.length)insights.push({level:'success',message:'Tidak ada antrean review atau aktivasi yang memerlukan perhatian saat ini.'});
 return {window,summary:{...rows[0][0],...rows[1][0],previousAmount:rows[2][0].amount,sessions:rows[7][0].count,views:events.page_view || 0,whatsapp:events.whatsapp_click || 0},invitations:counts,paymentTrend:rows[3],paymentStatuses:rows[4],visitorTrend:rows[6],events,topTemplates:rows[8],operations:{staleActivations:rows[9][0].count,deletions:rows[10][0].count,pendingReviews:rows[11][0].count},insights,generatedAt:now.toISOString()};
}
