import {requireFirebaseUser,json,getOwnedInvitation} from '../../_lib/firebase-admin.js';
import {consumeQuota} from '../../_lib/request-limit.js';
import {validImageBytes} from '../../_lib/image-validation.js';
const MAX_BYTES=4*1024*1024,TYPES={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
export async function onRequestPost({request,env}) {
 let key='';
 try {
  if(Number(request.headers.get('content-length'))>MAX_BYTES+100_000)return json({message:'Foto maksimal 4 MB setelah kompresi.'},413);
  const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Silakan masuk untuk mengunggah foto.'},401);
  if(!user.emailVerified)return json({message:'Verifikasi email sebelum mengunggah foto.'},403);
  if(!env.INVITATION_MEDIA || !env.PAYMENTS_DB)return json({message:'Penyimpanan foto belum tersedia.'},503);
  const form=await request.formData(),id=String(form.get('invitationId')||''),photo=form.get('photo');
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(id)||!(photo instanceof File)||!TYPES[photo.type]||photo.size<1||photo.size>MAX_BYTES)return json({message:'Data foto tidak valid.'},400);
  const fields=await getOwnedInvitation(request,env,id,user);
  if(!fields || fields.status?.stringValue==='deleting')return json({message:'Undangan tidak tersedia.'},403);
  if(!await consumeQuota(env,user.localId,'media',30))return json({message:'Batas upload per jam tercapai.'},429);
  const bytes=await photo.arrayBuffer();if(!validImageBytes(bytes,photo.type))return json({message:'Isi berkas bukan gambar yang valid.'},400);
  key=`${crypto.randomUUID()}.${TYPES[photo.type]}`;
  const reserved=await env.PAYMENTS_DB.prepare('INSERT INTO media_assets(key,uid,invitation_id,bytes,created_at) SELECT ?,?,?,?,? WHERE COALESCE((SELECT SUM(bytes) FROM media_assets WHERE uid=?),0)+?<=268435456').bind(key,user.localId,id,photo.size,new Date().toISOString(),user.localId,photo.size).run();
  if(!reserved.meta.changes)return json({message:'Penyimpanan akun mencapai 256 MB. Hapus undangan atau foto yang tidak diperlukan.'},413);
  await env.INVITATION_MEDIA.put(key,bytes,{httpMetadata:{contentType:photo.type},customMetadata:{uid:user.localId,invitationId:id}});
  const url=`/media/${key}`;
  return json({provider:'r2',id:key,url,thumbUrl:url,mediumUrl:url,size:photo.size,mimeType:photo.type});
 }catch{if(key)await env.PAYMENTS_DB.prepare('DELETE FROM media_assets WHERE key=?').bind(key).run().catch(()=>{});return json({message:'Foto belum dapat diunggah. Coba kembali.'},502);}
}
