import {firestoreRoot} from '../_lib/firebase-admin.js';
export async function onRequestGet({request,env,params}) {
 try {
  const key=String(params.key||'');if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)||!env.INVITATION_MEDIA)return new Response('Not found',{status:404});
  const metadata=await env.INVITATION_MEDIA.head(key);if(!metadata)return new Response('Not found',{status:404});
  const id=metadata.customMetadata?.invitationId;
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(id||''))return new Response('Not found',{status:404});
  const endpoint=`${firestoreRoot(env)}/invitations/${id}`;
  let result=await fetch(endpoint,{signal:AbortSignal.timeout(8000)});
  if(!result.ok) {
   const cookie=request.headers.get('cookie')?.match(/(?:^|;\s*)env_media=([^;]+)/)?.[1];
   if(!cookie)return new Response('Not found',{status:404});
   result=await fetch(endpoint,{headers:{authorization:`Bearer ${decodeURIComponent(cookie)}`},signal:AbortSignal.timeout(8000)});
   if(!result.ok)return new Response('Not found',{status:404});
  }
  const document=await result.json();if(document.fields?.status?.stringValue==='deleting')return new Response('Not found',{status:404});
  const object=await env.INVITATION_MEDIA.get(key);if(!object)return new Response('Not found',{status:404});
  const headers=new Headers({'cache-control':'private, no-store','x-content-type-options':'nosniff','vary':'Cookie'});object.writeHttpMetadata(headers);return new Response(object.body,{headers});
 }catch{return new Response('Media unavailable',{status:503});}
}
