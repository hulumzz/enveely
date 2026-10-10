import {requireFirebaseUser,isPaymentAdmin,json} from '../_lib/firebase-admin.js';
export async function onRequestGet({request,env}) {
  try {const user=await requireFirebaseUser(request,env);return user ? json({admin:isPaymentAdmin(user,env)}) : json({message:'Silakan masuk.'},401);}
  catch{return json({message:'Akun belum dapat diperiksa.'},503);}
}
