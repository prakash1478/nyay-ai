import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/constants.js'

function GoogleGlyph() {
  return (
    <svg className="w-4.5 h-4.5" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.7 6.5 29.1 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11.3 0 20.5-9.2 20.5-20.5 0-1.4-.1-2.7-.4-4z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C33.7 6.5 29.1 4.5 24 4.5c-7.6 0-14.1 4.3-17.4 10.2z" />
      <path fill="#4CAF50" d="M24 45.5c5.1 0 9.7-1.9 13.1-5.1l-6.1-5.1c-2 1.4-4.5 2.2-7 2.2-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.8 41.1 16.4 45.5 24 45.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6l6.1 5.1C40.4 36.5 44.5 31.1 44.5 25c0-1.4-.1-2.7-.9-4.5z" />
    </svg>
  )
}

export default function GoogleButton({ label = 'Continue with Google' }) {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      navigate(ROUTES.HOME)
    } catch (err) {
      toast.error(err?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-full border border-ink-900/15 dark:border-parchment-100/15 bg-white dark:bg-ink-800 px-6 py-3 text-sm font-semibold text-ink-800 dark:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <GoogleGlyph />}
      {label}
    </button>
  )
}
