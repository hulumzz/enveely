import {requireFirebaseUser,json,getOwnedInvitation} from '../../_lib/firebase-admin.js';
import {publicPaymentOrder} from '../../_lib/payment-order.js';
import {calculatePackage,validDesign,UNIQUE_CODES} from '../../../src/data/plans.js';
import {consumeQuota} from '../../_lib/request-limit.js';
export async function onRequestGet(context) {
 try {
  const user=await requireFirebaseUser(context.request,context.env);
  if(!user)return json({message:'Silakan masuk kembali.'},401);
  if(!context.env.PAYMENTS_DB)return json({message:'Pembayaran belum tersedia.'},503);
  const cursor=new URL(context.request.url).searchParams.get('cursor') || '';
  const result=await context.env.PAYMENTS_DB.prepare('SELECT * FROM payment_orders WHERE uid=? AND (?=\'\' OR updated_at || id < ?) ORDER BY updated_at DESC,id DESC LIMIT 100').bind(user.localId,cursor,cursor).all();
  return json({orders:result.results.map(publicPaymentOrder),cursor:result.results.length===100?result.results.at(-1).updated_at+result.results.at(-1).id:null});
 }catch{return json({message:'Riwayat pembayaran belum dapat dimuat.'},502);}
}
export async function onRequestPost(context) {
 try {
  const user=await requireFirebaseUser(context.request,context.env);
  if(!user)return json({message:'Silakan masuk kembali.'},401);
  if(!user.emailVerified)return json({message:'Verifikasi email sebelum melakukan pembayaran.'},403);
  const {invitationId,durationMonths=3}=await context.request.json();
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(invitationId||''))return json({message:'ID tidak valid.'},400);
  const fields=await getOwnedInvitation(context.request,context.env,invitationId,user);
  if(!fields)return json({message:'Undangan ini bukan milik akun Anda.'},403);
  const design=fields.design?.mapValue?.fields;
  const variantId=design?.variantId?.stringValue, templateId=design?.templateId?.stringValue;
  const pkg=calculatePackage(variantId,durationMonths);
  if(!pkg?.paid || !validDesign({templateId,variantId}))return json({message:'Paket desain tidak valid.'},400);
  const db=context.env.PAYMENTS_DB;
  const open=await db.prepare("SELECT * FROM payment_orders WHERE uid=? AND invitation_id=? AND status IN ('draft','pending_review','ai_match','activation_pending') LIMIT 1").bind(user.localId,invitationId).first();
  if(open) {
   if(open.variant_id!==variantId)return json({message:'Selesaikan pesanan desain sebelumnya sebelum membuat pesanan baru.'},409);
   if(open.status==='draft')await db.prepare("UPDATE payment_orders SET duration_months=?,base_price=?,extension_fee=?,expected_total=?,updated_at=? WHERE id=? AND status='draft'").bind(pkg.durationMonths,pkg.basePrice,pkg.extensionFee,pkg.subtotal+open.unique_code,new Date().toISOString(),open.id).run();
   return json({order:publicPaymentOrder(await db.prepare('SELECT * FROM payment_orders WHERE id=?').bind(open.id).first())});
  }
  const active=await db.prepare("SELECT * FROM payment_orders WHERE uid=? AND invitation_id=? AND variant_id=? AND status='active' AND expires_at>? ORDER BY expires_at DESC LIMIT 1").bind(user.localId,invitationId,variantId,new Date().toISOString()).first();
  if(active)return json({order:publicPaymentOrder(active)});
  if(!await consumeQuota(context.env,user.localId,'checkout',20,86400))return json({message:'Batas pesanan harian tercapai.'},429);
  const id=`pay_${crypto.randomUUID().replace(/-/g,'')}`, now=new Date().toISOString();
  const uniqueCode=UNIQUE_CODES[crypto.getRandomValues(new Uint32Array(1))[0]%UNIQUE_CODES.length];
  await db.prepare("INSERT INTO payment_orders(id,uid,invitation_id,variant_id,duration_months,base_price,extension_fee,unique_code,expected_total,status,proof_key,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,'draft','',?,?) ON CONFLICT DO NOTHING").bind(id,user.localId,invitationId,variantId,pkg.durationMonths,pkg.basePrice,pkg.extensionFee,uniqueCode,pkg.subtotal+uniqueCode,now,now).run();
  const row=await db.prepare("SELECT * FROM payment_orders WHERE uid=? AND invitation_id=? AND status IN ('draft','pending_review','ai_match','activation_pending') LIMIT 1").bind(user.localId,invitationId).first();
  return json({order:publicPaymentOrder(row)});
 }catch(error){console.error(JSON.stringify({event:'checkout_error',message:error.message}));return json({message:'Pesanan belum dapat dibuat.'},502);}
}
