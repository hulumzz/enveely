import {requireFirebaseUser,getOwnedInvitation,json} from '../../_lib/firebase-admin.js';

// Delete guest data before its parent, so ownership rules remain enforceable.
// Payment records are retained for the merchant's transaction audit.
export async function onRequestDelete({request,env,params}) {
  try {
    const user=await requireFirebaseUser(request,env);
    if(!user)return json({message:'Silakan masuk kembali.'},401);
    const id=String(params.id || '');
    if(!/^[A-Za-z0-9_-]{8,80}$/.test(id))return json({message:'ID undangan tidak valid.'},400);
    const fields=await getOwnedInvitation(request,env,id,user);
    if(!fields)return json({message:'Undangan ini bukan milik akun Anda.'},403);
    const root=`projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    const headers={authorization:request.headers.get('authorization'),'content-type':'application/json'};
    const call=async(path,options={})=>{
      const response=await fetch(`https://firestore.googleapis.com/v1/${path}`,{...options,headers,signal:AbortSignal.timeout(15_000)});
      if(!response.ok)throw new Error(`firestore_${response.status}`);
      return response.json();
    };
    const commit=names=>call(`${root.replace('/documents','')}/documents:commit`,{method:'POST',body:JSON.stringify({writes:names.map(name=>({delete:name}))})});
    let removed=0;
    for(const collection of ['rsvps','wishes']) {
      // Query the first page repeatedly after each successful deletion.
      for(let page=0;page<100;page++) {
        const result=await call(`${root}/invitations/${id}/${collection}?pageSize=100`);
        const docs=result.documents || [];
        if(!docs.length)break;
        await commit(docs.map(doc=>doc.name));removed+=docs.length;
        if(page===99)return json({message:'Sebagian besar data tamu telah dibersihkan. Ulangi penghapusan untuk menyelesaikannya.'},409);
      }
    }
    const media=new Set();
    const visit=value=>{
      if(!value || typeof value!=='object')return;
      if(typeof value.stringValue==='string') {
        const match=value.stringValue.match(/^\/media\/([a-f0-9-]{36}\.(?:jpg|png|webp))$/);
        if(match)media.add(match[1]);
      }
      for(const nested of Object.values(value))visit(nested);
    };
    visit(fields);
    for(const key of media) {
      const object=await env.INVITATION_MEDIA?.head(key);
      if(object?.customMetadata?.uid===user.localId && object.customMetadata.invitationId===id)await env.INVITATION_MEDIA.delete(key);
    }
    await commit([`${root}/invitations/${id}`,`${root}/invitationControl/${id}`]);
    return json({deleted:true,guestResponsesRemoved:removed});
  } catch {
    return json({message:'Penghapusan belum selesai. Coba kembali saat terhubung; undangan tetap tersedia sampai penghapusan selesai.'},502);
  }
}
