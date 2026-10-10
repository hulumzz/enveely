import {isPaymentAdmin,json,requireFirebaseUser} from '../../../_lib/firebase-admin.js';
export async function onRequestGet({request,env}) {
 try{const user=await requireFirebaseUser(request,env);if(!isPaymentAdmin(user,env))return json({message:'Akses admin diperlukan.'},403);if(!env.PAYMENTS_DB)return json({message:'Database pembayaran belum tersedia.'},503);
 const params=new URL(request.url).searchParams,status=params.get('status')||'queue',cursor=params.get('cursor')||'';
 if(!['queue','all','draft','pending_review','ai_match','activation_pending','active','rejected','refunded','expired'].includes(status) || (cursor && !/^[A-Za-z0-9_:.-]{25,120}$/.test(cursor)))return json({message:'Filter tidak valid.'},400);
 const where=status==='queue'?"status IN ('pending_review','ai_match','activation_pending')":status==='all'?'1=1':status==='expired'?"status='active' AND expires_at<=?":'status=?';
 const args=status==='queue'||status==='all'?[]:status==='expired'?[new Date().toISOString()]:[status];
 const result=await env.PAYMENTS_DB.prepare(`SELECT id,invitation_id,variant_id,duration_months,expected_total,status,transaction_ref,activation_error,ai_transaction_ref,ai_amount,ai_confidence,ai_summary,created_at,updated_at,reviewed_at,expires_at FROM payment_orders WHERE ${where} AND (?='' OR updated_at || id < ?) ORDER BY updated_at DESC,id DESC LIMIT 31`).bind(...args,cursor,cursor).all();
 return json({orders:result.results.slice(0,30),cursor:result.results.length>30?result.results[29].updated_at+result.results[29].id:null});
 }catch{return json({message:'Antrean pembayaran belum dapat dimuat.'},503);}
}
