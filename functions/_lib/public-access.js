import {adminDocument,decodeFields} from './firebase-admin.js';
import {validDesign} from '../../src/data/plans.js';
export async function activeInvitation(env,id,token) {
 const document=await adminDocument(env,`invitations/${id}`,token);
 if(!document)return null;
 const invitation=decodeFields(document.fields);
 if(invitation.status!=='published' || !validDesign(invitation.design))return null;
 if(invitation.design.variantId==='serena-paper' && Date.parse(invitation.freeActivatedAt||'')+7*86400000>Date.now())return {document,invitation};
 const entitlement=await adminDocument(env,`entitlements/${id}`,token);
 const data=decodeFields(entitlement?.fields);
 return data.active===true && data.ownerUid===invitation.ownerUid && data.variantId===invitation.design.variantId && Date.parse(data.expiresAt)>Date.now() ? {document,invitation} : null;
}
