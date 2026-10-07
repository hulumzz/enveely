import { requireFirebaseUser, json, getOwnedInvitation } from '../../_lib/firebase-admin.js';
import { consumeQuota } from '../../_lib/request-limit.js';

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function onRequestPost(context) {
  try {
    if (Number(context.request.headers.get('content-length')) > MAX_BYTES + 100_000) return json({message:'Foto maksimal 4 MB setelah kompresi.'},413);
    const user = await requireFirebaseUser(context.request, context.env);
    if (!user) return json({message:'Silakan masuk untuk mengunggah foto.'},401);
    if (!context.env.INVITATION_MEDIA) return json({message:'Penyimpanan foto belum tersedia.'},503);
    const form = await context.request.formData();
    const id = String(form.get('invitationId') || '');
    const photo = form.get('photo');
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(id) || !(photo instanceof File) || !TYPES[photo.type] || photo.size < 1 || photo.size > MAX_BYTES) return json({message:'Data foto tidak valid.'},400);
    if (!await getOwnedInvitation(context.request,context.env,id,user)) return json({message:'Undangan ini bukan milik akun Anda.'},403);
    if (!await consumeQuota(context.env,user.localId,'media',30)) return json({message:'Batas upload per jam tercapai. Coba kembali nanti.'},429);
    const key = `${crypto.randomUUID()}.${TYPES[photo.type]}`;
    await context.env.INVITATION_MEDIA.put(key, await photo.arrayBuffer(), {httpMetadata:{contentType:photo.type},customMetadata:{uid:user.localId,invitationId:id}});
    const url = `/media/${key}`;
    return json({provider:'r2',id:key,url,thumbUrl:url,mediumUrl:url,size:photo.size,mimeType:photo.type});
  } catch { return json({message:'Foto belum dapat diunggah. Coba kembali.'},502); }
}
