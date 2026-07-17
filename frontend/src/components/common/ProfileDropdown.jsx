import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, ChevronDown } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import useClickOutside from '../../hooks/useClickOutside.js'
import { getInitials } from '../../utils/helpers.js'
import { ROUTES } from '../../utils/constants.js'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  useClickOutside(ref, () => setOpen(false))

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-ink-fade text-parchment-100 flex items-center justify-center text-xs font-semibold overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            getInitials(user.displayName || user.email || 'U')
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-ink-500 dark:text-parchment-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark border border-ink-900/5 dark:border-parchment-100/10 py-1.5 z-50 animate-fade-in">
          <div className="px-4 py-2.5 border-b border-ink-900/5 dark:border-parchment-100/10">
            <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100 truncate">
              {user.displayName || 'Counsel'}
            </p>
            <p className="text-xs text-ink-400 dark:text-parchment-400 truncate">{user.email}</p>
          </div>
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors">
            <User className="w-4 h-4" /> My Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-crimson-600 dark:text-crimson-400 hover:bg-crimson-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
