import React, { createContext, useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  firebaseOnAuthStateChanged,
  firebaseSignInWithGoogle,
  firebaseSignInWithEmail,
  firebaseSignUpWithEmail,
  firebaseResetPassword,
  firebaseSignOut,
} from '../services/firebase.js'

export const AuthContext = createContext(null)

const FIREBASE_NOT_CONFIGURED =
  !import.meta.env.VITE_FIREBASE_API_KEY

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (FIREBASE_NOT_CONFIGURED) {
      // Allows the UI to be explored without live Firebase credentials.
      const stored = localStorage.getItem('nyaya_demo_user')
      if (stored) setUser(JSON.parse(stored))
      setLoading(false)
      return
    }
    const unsubscribe = firebaseOnAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const persistDemoUser = (demoUser) => {
    localStorage.setItem('nyaya_demo_user', JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signInWithGoogle = useCallback(async () => {
    if (FIREBASE_NOT_CONFIGURED) {
      persistDemoUser({
        uid: 'demo-google-uid',
        displayName: 'Demo User',
        email: 'demo.user@nyaya.ai',
        photoURL: null,
      })
      toast.success('Signed in with Google (demo mode)')
      return
    }
    const cred = await firebaseSignInWithGoogle()
    toast.success(`Welcome, ${cred.user.displayName || 'counsel'}`)
    return cred
  }, [])

  const signUpWithEmail = useCallback(async (name, email, password) => {
    if (FIREBASE_NOT_CONFIGURED) {
      persistDemoUser({ uid: 'demo-uid', displayName: name, email, photoURL: null })
      toast.success('Account created (demo mode)')
      return
    }
    const cred = await firebaseSignUpWithEmail(name, email, password)
    toast.success('Account created successfully')
    return cred
  }, [])

  const signInWithEmail = useCallback(async (email, password) => {
    if (FIREBASE_NOT_CONFIGURED) {
      persistDemoUser({ uid: 'demo-uid', displayName: email.split('@')[0], email, photoURL: null })
      toast.success('Signed in (demo mode)')
      return
    }
    const cred = await firebaseSignInWithEmail(email, password)
    toast.success('Signed in successfully')
    return cred
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (FIREBASE_NOT_CONFIGURED) {
      toast.success('Password reset link sent (demo mode)')
      return
    }
    await firebaseResetPassword(email)
    toast.success('Password reset email sent')
  }, [])

  const logout = useCallback(async () => {
    if (FIREBASE_NOT_CONFIGURED) {
      localStorage.removeItem('nyaya_demo_user')
      setUser(null)
      toast.success('Signed out')
      return
    }
    await firebaseSignOut()
    toast.success('Signed out')
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    resetPassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
