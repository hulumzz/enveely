// Server-only Firebase helpers for Pages Functions. All credentials are
// Cloudflare encrypted secrets; no service account material reaches the app.

export async function requireFirebaseUser(request, env) {
  const authorization = request.headers.get('authorization') || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!idToken || !env.FIREBASE_WEB_API_KEY) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.users?.[0] || null;
}

export function isPaymentAdmin(user, env) {
  const allowList = String(env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(user?.emailVerified && user?.email && allowList.includes(String(user.email).toLowerCase()));
}

export async function getOwnedInvitation(request, env, invitationId, user) {
  const token = (request.headers.get('authorization') || '').slice(7);
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/invitations/${encodeURIComponent(invitationId)}`, {
    headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const doc = await response.json();
  return doc.fields?.ownerUid?.stringValue === user.localId ? doc.fields : null;
}

export async function writeEntitlement(env, { invitationId, ownerUid, expiresAt, orderId, variantId, invitationDocument }) {
  const accessToken = await firebaseServiceAccessToken(env);
  if (!accessToken) throw new Error('Firebase Admin belum dikonfigurasi.');
  const existing = await adminDocument(env, `entitlements/${invitationId}`, accessToken);
  if (existing?.fields?.orderId?.stringValue === orderId) return;
  const invitation = invitationDocument || await adminDocument(env, `invitations/${invitationId}`, accessToken);
  if(!invitation || invitation.fields?.status?.stringValue==='deleting')throw new Error('Undangan tidak tersedia.');
  const root=firestoreRoot(env).split('/v1/')[1];
  await adminCommit(env,[
    {verify:`${root}/invitations/${invitationId}`,currentDocument:{updateTime:invitation.updateTime}},
    {update:{name:`${root}/entitlements/${invitationId}`,fields:{
      ownerUid:{stringValue:ownerUid},active:{booleanValue:true},orderId:{stringValue:orderId},variantId:{stringValue:variantId},expiresAt:{timestampValue:expiresAt},activatedAt:{timestampValue:new Date().toISOString()},
    }},currentDocument:existing ? {updateTime:existing.updateTime} : {exists:false}},
  ],accessToken);
}

export async function firebaseServiceAccessToken(env, scope = 'https://www.googleapis.com/auth/datastore') {
  const serviceEmail = String(env.FIREBASE_SERVICE_ACCOUNT_EMAIL || '');
  const privateKey = String(env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!serviceEmail || !privateKey) return '';
  const issuedAt = Math.floor(Date.now() / 1000);
  const assertion = await signedJwt({
    iss: serviceEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: issuedAt,
    exp: issuedAt + 3600,
  }, privateKey);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    signal: AbortSignal.timeout(12_000),
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) return '';
  const payload = await response.json();
  return String(payload.access_token || '');
}

async function signedJwt(payload, privateKeyPem) {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = base64Url(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${header}.${body}`);
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, data);
  return `${header}.${body}.${base64Url(signature)}`;
}

function pemToArrayBuffer(pem) {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer;
}

function base64Url(value) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
    },
  });
}

export function firestoreRoot(env) {
  if(!/^[a-z0-9-]+$/.test(env.FIREBASE_PROJECT_ID || '')) throw new Error('Firebase project tidak valid.');
  return `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
}
export async function adminDocument(env, path, token) {
  const response=await fetch(`${firestoreRoot(env)}/${path}`,{headers:{authorization:`Bearer ${token || await firebaseServiceAccessToken(env)}`},signal:AbortSignal.timeout(12_000)});
  if(response.status===404) return null;
  if(!response.ok) throw new Error(`Firestore read ${response.status}`);
  return response.json();
}
export async function adminCommit(env,writes,token) {
  const response=await fetch(`${firestoreRoot(env)}:commit`,{method:'POST',headers:{authorization:`Bearer ${token || await firebaseServiceAccessToken(env)}`,'content-type':'application/json'},body:JSON.stringify({writes}),signal:AbortSignal.timeout(15_000)});
  if(!response.ok) throw new Error(`Firestore commit ${response.status}`);
  return response.json();
}
export function decodeFields(fields={}) {
  const value=v=>v.stringValue ?? v.booleanValue ?? (v.integerValue!==undefined ? Number(v.integerValue) : undefined) ?? v.doubleValue ?? v.timestampValue ?? (v.mapValue ? decodeFields(v.mapValue.fields) : undefined) ?? (v.arrayValue ? (v.arrayValue.values || []).map(value) : undefined) ?? null;
  return Object.fromEntries(Object.entries(fields).map(([key,v])=>[key,value(v)]));
}
export function encodeFields(object) {
  const value=v=> typeof v==='string' ? {stringValue:v} : typeof v==='boolean' ? {booleanValue:v} : typeof v==='number' ? (Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v}) : Array.isArray(v) ? {arrayValue:{values:v.map(value)}} : v===null ? {nullValue:null} : {mapValue:{fields:encodeFields(v)}};
  return Object.fromEntries(Object.entries(object).map(([key,v])=>[key,value(v)]));
}
