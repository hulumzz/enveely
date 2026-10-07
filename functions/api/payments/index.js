import {requireFirebaseUser,json} from '../../_lib/firebase-admin.js';
import {publicPaymentOrder} from '../../_lib/payment-order.js';
export async function onRequestGet(context) {
  try {
    const user=await requireFirebaseUser(context.request,context.env);
    if(!user)return json({message:'Silakan masuk kembali.'},401);
    if(!context.env.PAYMENTS_DB)return json({message:'Pembayaran belum tersedia.'},503);
    const result=await context.env.PAYMENTS_DB.prepare('SELECT * FROM payment_orders WHERE uid = ? ORDER BY updated_at DESC LIMIT 100').bind(user.localId).all();
    return json({orders:result.results.map(publicPaymentOrder)});
  }catch{return json({message:'Riwayat pembayaran belum dapat dimuat.'},502);}
}
