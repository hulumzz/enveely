import {initAnalytics} from './firebase.js';
const events=new Set(['page_view','template_preview','checkout_start','proof_submitted','published','whatsapp_click','create_invitation']);
const families=new Set(['serena','amora','lumiere','elysian','mayura','pusaka','nusantara','meadow','tempwed','botanica','blocka']);
export function hasAnalyticsConsent(){try{return localStorage.getItem('env_analytics_consent')==='yes' && navigator.doNotTrack!=='1' && !navigator.globalPrivacyControl;}catch{return false;}}
export function recordProductEvent(event,{templateId=''}={}) {
 if(!hasAnalyticsConsent() || !events.has(event) || /^\/(invite|admin)(\/|$)/.test(location.pathname))return;
 try {
  const day=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'}),key=`env_analytics_session_${day}`;
  let session=sessionStorage.getItem(key);if(!session){session=crypto.randomUUID();sessionStorage.setItem(key,session);}
  const body=JSON.stringify({consent:true,event,eventId:crypto.randomUUID(),session,templateId:families.has(templateId)?templateId:''});
  fetch('/api/analytics',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true}).catch(()=>{});
 }catch{}
}
async function track(eventName,params={}){try{if(!hasAnalyticsConsent())return;const analytics=await initAnalytics();if(!analytics)return;const {logEvent}=await import('firebase/analytics');logEvent(analytics,eventName,params);}catch{}}
export const analyticsEvents={
 landingView:()=>track('landing_view'),viewTemplate:id=>track('view_template',{template_id:id}),templatePreview:id=>{recordProductEvent('template_preview',{templateId:id});return track('template_preview',{template_id:id});},
 createInvitation:id=>{recordProductEvent('create_invitation',{templateId:id});return track('create_invitation',{template_id:id});},editorOpen:()=>track('editor_open'),imageUploaded:()=>track('image_uploaded'),previewOpen:()=>track('preview_open'),
 publishInvitation:()=>{recordProductEvent('published');return track('publish_invitation');},shareWhatsapp:()=>track('share_whatsapp'),shareUrl:()=>track('share_url'),rsvpSubmitted:()=>{},languageChanged:locale=>track('language_changed',{locale}),
};
let lastPage='';document.addEventListener('env:navigate',()=>{const path=location.pathname;if(path.startsWith('/invite/'))return;if(path!==lastPage){lastPage=path;recordProductEvent('page_view');}});
