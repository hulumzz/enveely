// Enveely — Firebase initialization (lazy, modular SDK v10).
// MVP scope: App + Analytics + Firestore. Storage intentionally unused
// (images go through ImageService -> ImgBB/Freeimage.host; Blueprint-1.md §42).

import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

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
    const fbApp = getFirebaseApp();
    if (!fbApp) return null;
    if (!(await analyticsSupported())) return null;
    analytics = analytics || getAnalytics(fbApp);
    return analytics;
  } catch {
    return null;
  }
}

export { configValid };
