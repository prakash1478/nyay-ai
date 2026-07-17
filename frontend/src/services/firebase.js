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

// Populate these values in a .env file at the project root, e.g.
// VITE_FIREBASE_API_KEY=xxxx
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export const firebaseSignInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const firebaseSignUpWithEmail = async (name, email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (name) await updateProfile(cred.user, { displayName: name })
  return cred
}

export const firebaseSignInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const firebaseResetPassword = (email) => sendPasswordResetEmail(auth, email)

export const firebaseSignOut = () => signOut(auth)

export const firebaseOnAuthStateChanged = (callback) => onAuthStateChanged(auth, callback)

export default app
