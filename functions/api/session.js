import {requireFirebaseUser,json} from '../_lib/firebase-admin.js';
export async function onRequestPost({request,env}) {
 const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Sesi tidak valid.'},401);
 const token=request.headers.get('authorization').slice(7);
 const response=json({ok:true});response.headers.set('set-cookie',`env_media=${encodeURIComponent(token)}; Path=/media; HttpOnly; Secure; SameSite=Strict; Max-Age=3300`);return response;
}
export function onRequestDelete() {const response=json({ok:true});response.headers.set('set-cookie','env_media=; Path=/media; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return response;}
