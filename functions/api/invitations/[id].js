import {requireFirebaseUser,json} from '../../_lib/firebase-admin.js';
import {deleteInvitation} from '../../_lib/delete-invitation.js';
export async function onRequestDelete({request,env,params}) {
 try {
  const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Silakan masuk kembali.'},401);
  const id=String(params.id||'');if(!/^[A-Za-z0-9_-]{8,80}$/.test(id))return json({message:'ID tidak valid.'},400);
  const result=await deleteInvitation(env,id,user.localId);
  return json(result,result.deleted?200:202);
 }catch(error){return json({message:error.message==='ownership'?'Undangan ini bukan milik akun Anda.':'Penghapusan belum selesai. Tautan publik ditutup; coba hapus kembali.'},error.message==='ownership'?403:502);}
}
