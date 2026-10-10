import fs from 'node:fs';
import assert from 'node:assert/strict';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,updateDoc,getDoc,deleteDoc,Timestamp,serverTimestamp,collection,query,where,orderBy,getDocs,writeBatch} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-enveely',firestore:{host:'127.0.0.1',port:8089,rules:fs.readFileSync('firestore.rules','utf8')}});
const owner=env.authenticatedContext('owner').firestore(),other=env.authenticatedContext('other').firestore(),guest=env.unauthenticatedContext().firestore();
const draft={id:'free',ownerUid:'owner',status:'draft',revision:1,design:{templateId:'serena',variantId:'serena-paper'},content:{gallery:[],events:[],story:[]},sections:[{id:'cover',enabled:true}]};
const ref=(db,id)=>doc(db,'invitations',id);
try {
 await assertSucceeds(getDoc(ref(owner,'missing')));
 await assertSucceeds(setDoc(ref(owner,'free'),draft));
 await assertFails(getDoc(ref(guest,'free')));
 await assertFails(updateDoc(ref(other,'free'),{revision:2}));
 await assertFails(setDoc(ref(owner,'bypass'),{...draft,design:{templateId:'lumiere',variantId:'serena-paper'}}));
 await assertFails(setDoc(ref(owner,'invalid'),{...draft,design:{templateId:'unknown',variantId:'unknown-free'}}));
 await assertFails(setDoc(ref(owner,'fake-clock'),{...draft,freeActivatedAt:Timestamp.fromMillis(Date.now()+86400000)}));
 await assertFails(updateDoc(ref(owner,'free'),{revision:2,freeActivatedAt:serverTimestamp(),status:'published'}));
 const batch=writeBatch(owner);batch.set(doc(owner,'activationLedger','free'),{ownerUid:'owner',startedAt:serverTimestamp()});batch.update(ref(owner,'free'),{revision:2,status:'published',freeActivatedAt:serverTimestamp()});
 await assertSucceeds(batch.commit());
 await assertSucceeds(getDoc(ref(guest,'free')));
 await assertFails(updateDoc(ref(owner,'free'),{revision:2,content:draft.content})); // stale revision
 await assertSucceeds(updateDoc(ref(owner,'free'),{revision:3,status:'draft'}));
 await assertFails(updateDoc(ref(owner,'free'),{revision:4,freeActivatedAt:serverTimestamp()}));
 await assertSucceeds(updateDoc(ref(owner,'free'),{revision:4,status:'published'}));
 await assertFails(deleteDoc(ref(owner,'free'))); // server cascade only
 await assertFails(deleteDoc(doc(owner,'activationLedger','free')));
 await assertFails(setDoc(doc(owner,'entitlements','free'),{ownerUid:'owner',active:true}));
 await env.withSecurityRulesDisabled(async ctx=>{
  const db=ctx.firestore();
  await setDoc(ref(db,'expired'),{...draft,status:'published',freeActivatedAt:Timestamp.fromMillis(Date.now()-8*86400000)});
  await setDoc(ref(db,'paid'),{...draft,status:'published',design:{templateId:'mayura',variantId:'mayura-pearl'}});
  await setDoc(doc(db,'entitlements','paid'),{ownerUid:'owner',active:true,variantId:'mayura-pearl',expiresAt:Timestamp.fromMillis(Date.now()+86400000)});
  await setDoc(doc(db,'invitations','free','rsvps','one'),{name:'Tamu',attendance:'attending',guestCount:2,message:'Halo',createdAt:Timestamp.now()});
  await setDoc(doc(db,'invitations','free','wishes','one'),{name:'Tamu',message:'Selamat!',approved:false,createdAt:Timestamp.now()});
 });
 await assertFails(getDoc(ref(guest,'expired')));
 await assertSucceeds(updateDoc(ref(owner,'expired'),{revision:2,content:{...draft.content,welcomeMessage:'Diedit setelah masa tayang habis'}}));
 await assertFails(getDoc(ref(guest,'expired')));
 await assertSucceeds(getDoc(ref(guest,'paid')));
 await assertFails(updateDoc(ref(owner,'paid'),{revision:2,design:{templateId:'lumiere',variantId:'serena-paper'}}));
 await assertFails(updateDoc(ref(owner,'paid'),{revision:2,design:{templateId:'lumiere',variantId:'lumiere-gallery'}}));
 await assertFails(setDoc(doc(guest,'invitations','free','rsvps','spam'),{name:'spam',attendance:'attending',guestCount:1,createdAt:serverTimestamp()}));
 await assertFails(setDoc(doc(guest,'invitations','free','wishes','spam'),{name:'spam',message:'spam',approved:false,createdAt:serverTimestamp()}));
 await assertFails(getDoc(doc(guest,'invitations','free','rsvps','one')));
 await assertSucceeds(getDoc(doc(owner,'invitations','free','rsvps','one')));
 await assertFails(getDoc(doc(guest,'invitations','free','wishes','one')));
 await assertFails(updateDoc(doc(owner,'invitations','free','wishes','one'),{name:'tampered',approved:true}));
 await assertSucceeds(updateDoc(doc(owner,'invitations','free','wishes','one'),{approved:true}));
 assert.equal((await assertSucceeds(getDocs(query(collection(guest,'invitations','free','wishes'),where('approved','==',true),orderBy('createdAt','desc'))))).size,1);
 await assertFails(deleteDoc(doc(other,'invitations','free','rsvps','one')));
 await assertSucceeds(deleteDoc(doc(owner,'invitations','free','rsvps','one')));
 console.log('PASS: ownership, missing document transaction read, design pairing, immutable trial ledger, revision conflicts, expiry editing, paid entitlement, anonymous writes blocked, private RSVPs, wish moderation, server-only cascade.');
}finally{await env.cleanup();}
