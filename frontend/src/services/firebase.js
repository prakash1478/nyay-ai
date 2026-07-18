import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'

const IS_CONFIGURED = !!import.meta.env.VITE_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let auth = null
let googleProvider = null

if (IS_CONFIGURED) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (e) {
    console.warn('Firebase initialization failed:', e)
  }
}

const noopAsync = async () => {}

export const firebaseSignInWithGoogle = auth
  ? () => signInWithPopup(auth, googleProvider)
  : noopAsync

export const firebaseSignUpWithEmail = auth
  ? async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(cred.user, { displayName: name })
      return cred
    }
  : noopAsync

export const firebaseSignInWithEmail = auth
  ? (email, password) => signInWithEmailAndPassword(auth, email, password)
  : noopAsync

export const firebaseResetPassword = auth
  ? (email) => sendPasswordResetEmail(auth, email)
  : noopAsync

export const firebaseSignOut = auth
  ? () => signOut(auth)
  : noopAsync

export const firebaseOnAuthStateChanged = auth
  ? (callback) => onAuthStateChanged(auth, callback)
  : (callback) => { callback(null); return noopAsync }

export default app
