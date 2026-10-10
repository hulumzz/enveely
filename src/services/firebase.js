// Enveely — Firebase initialization (lazy, modular SDK v10).
// MVP scope: App + Analytics + Firestore. Storage intentionally unused
// (images go through ImageService -> ImgBB/Freeimage.host; Blueprint-1.md §42).

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let db = null;
let analytics = null;
let configValid = false;

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/** Initialize Firebase once. Safe to call repeatedly. Returns the FirebaseApp or null. */
export function getFirebaseApp() {
  if (app) return app;
  if (!isFirebaseConfigured()) {
    console.warn('[ULWED] Firebase config missing (.env.local). Running in local-only mode.');
    return null;
  }
  configValid = true;
  app = initializeApp(firebaseConfig);
  return app;
}

/** Firestore instance (lazy). Returns null when Firebase is not configured. */
export async function getDb() {
  if (db) return db;
  const fbApp = getFirebaseApp();
  if (!fbApp) return null;
  const { getFirestore } = await import('firebase/firestore');
  db = getFirestore(fbApp);
  return db;
}

/** Analytics (lazy, only where supported). Never blocks the app. */
export async function initAnalytics() {
  try {
    if(localStorage.getItem('env_analytics_consent')!=='yes' || navigator.doNotTrack==='1' || navigator.globalPrivacyControl || /^\/(invite|admin)(\/|$)/.test(location.pathname))return null;
    const fbApp = getFirebaseApp();
    if (!fbApp) return null;
    const {getAnalytics,isSupported:analyticsSupported} = await import('firebase/analytics');
    if (!(await analyticsSupported())) return null;
    analytics = analytics || getAnalytics(fbApp);
    const {setAnalyticsCollectionEnabled}=await import('firebase/analytics');setAnalyticsCollectionEnabled(analytics,true);
    return analytics;
  } catch {
    return null;
  }
}

export { configValid };

export async function setAnalyticsConsent(allowed) {
  try {localStorage.setItem('env_analytics_consent',allowed?'yes':'no');}catch{}
  if(analytics){const {setAnalyticsCollectionEnabled}=await import('firebase/analytics');setAnalyticsCollectionEnabled(analytics,allowed && navigator.doNotTrack!=='1' && !navigator.globalPrivacyControl && !/^\/(invite|admin)(\/|$)/.test(location.pathname));}
  if(allowed)await initAnalytics();
}
