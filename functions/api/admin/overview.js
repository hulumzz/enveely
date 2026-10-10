import {json,requireFirebaseUser,isPaymentAdmin} from '../../_lib/firebase-admin.js';
import {readInsights} from '../../_lib/insights.js';
export async function onRequestGet({request,env}) {
 try{const user=await requireFirebaseUser(request,env);if(!isPaymentAdmin(user,env))return json({message:'Akses admin diperlukan.'},403);
 if(!env.PAYMENTS_DB)return json({message:'Database belum tersedia.'},503);
 const days=Number(new URL(request.url).searchParams.get('days') || '30');if(![7,30].includes(days))return json({message:'Periode tidak valid.'},400);
 return json(await readInsights(env,days));
 }catch{ return json({message:'Ringkasan belum dapat dimuat. Coba kembali.'},503); }
}
