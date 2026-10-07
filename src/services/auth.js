// Enveely — Firebase Authentication service (email/password + Google).
// Graceful: returns { ok:false, reason:'unconfigured' } when Firebase env
// vars are missing so the UI can explain instead of crashing.

import { getFirebaseApp, isFirebaseConfigured } from './firebase.js';
import { getDeviceId } from '../core/device.js';

let authInstance = null;

async function authOrNull() {
  if (!isFirebaseConfigured()) return null;
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  const { getAuth } = await import('firebase/auth');
  authInstance = getAuth(app);
  return authInstance;
}

function humanize(error) {
  const code = error?.code || '';
  const map = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan. Coba daftar dulu.',
    'auth/wrong-password': 'Password salah.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/email-already-in-use': 'Email sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Password terlalu lemah (minimal 6 karakter).',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
    'auth/popup-closed-by-user': 'Jendela Google ditutup sebelum selesai.',
    'auth/network-request-failed': 'Koneksi bermasalah. Periksa internet Anda.',
  };
  return map[code] || 'Terjadi kesalahan. Silakan coba lagi.';
}

/** Create account with email+password. */
export async function registerWithEmail(email, password, displayName = '') {
  const auth = await authOrNull();
  if (!auth) return { ok: false, reason: 'unconfigured' };
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (String(displayName).trim()) {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(cred.user, { displayName: String(displayName).trim().slice(0, 80) });
    }
    await linkDeviceOwnership(cred.user);
    return { ok: true, user: publicUser(cred.user) };
  } catch (err) {
    return { ok: false, message: humanize(err) };
  }
}

/** Sign in with email+password. */
export async function loginWithEmail(email, password) {
  const auth = await authOrNull();
  if (!auth) return { ok: false, reason: 'unconfigured' };
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await linkDeviceOwnership(cred.user);
    return { ok: true, user: publicUser(cred.user) };
  } catch (err) {
    return { ok: false, message: humanize(err) };
  }
}

/** Google popup sign-in. */
export async function loginWithGoogle() {
  const auth = await authOrNull();
  if (!auth) return { ok: false, reason: 'unconfigured' };
  try {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await linkDeviceOwnership(cred.user);
    return { ok: true, user: publicUser(cred.user) };
  } catch (err) {
    return { ok: false, message: humanize(err) };
  }
}

/** Associate current device drafts with this user (migration hook). */
async function linkDeviceOwnership(user) {
  const { setDraftOwner } = await import('./draft-store.js');
  setDraftOwner(user.uid);
  try {
    localStorage.setItem('env_user_device_link', JSON.stringify({
      uid: user.uid,
      deviceId: getDeviceId(),
      at: Date.now(),
    }));
  } catch {
    /* ignore */
  }
}

/** Subscribe to auth state changes. Returns unsubscribe fn. */
export async function onAuthChange(callback) {
  const auth = await authOrNull();
  if (!auth) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, async (user) => {
    const { setDraftOwner } = await import('./draft-store.js');
    setDraftOwner(user?.uid || '');
    callback(user ? publicUser(user) : null);
  });
}

/** Resolve the current Firebase user once, after the initial auth check. */
export async function getCurrentUser() {
  const auth = await authOrNull();
  if (!auth) return null;
  if (auth.currentUser) { await linkDeviceOwnership(auth.currentUser); return publicUser(auth.currentUser); }
  const { onAuthStateChanged } = await import('firebase/auth');
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) await linkDeviceOwnership(user);
      resolve(user ? publicUser(user) : null);
    });
  });
}

/** Fresh ID token for authenticated server endpoints. */
export async function getAuthToken() {
  const auth = await authOrNull();
  if (!auth?.currentUser) return '';
  return auth.currentUser.getIdToken();
}

export async function sendPasswordReset(email) {
  const auth = await authOrNull();
  if (!auth) return { ok: false, reason: 'unconfigured' };
  try {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (err) {
    return { ok: false, message: humanize(err) };
  }
}

/** Sign out. */
export async function logout() {
  const auth = await authOrNull();
  if (!auth) return;
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}

function publicUser(user) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : ''),
    photoURL: user.photoURL || '',
    emailVerified: user.emailVerified,
  };
}

export async function updateDisplayName(displayName) {
  const auth = await authOrNull();
  if (!auth?.currentUser) throw new Error('Silakan masuk kembali.');
  const name = String(displayName || '').trim().slice(0,80);
  if (!name) throw new Error('Isi nama tampilan terlebih dahulu.');
  const { updateProfile } = await import('firebase/auth');
  await updateProfile(auth.currentUser,{displayName:name});
  return publicUser(auth.currentUser);
}

export async function sendVerificationEmail() {
  const auth = await authOrNull();
  if (!auth?.currentUser) throw new Error('Silakan masuk kembali.');
  const { sendEmailVerification } = await import('firebase/auth');
  await sendEmailVerification(auth.currentUser);
}
