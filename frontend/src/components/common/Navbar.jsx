import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Scale, Menu, X, Bell, Clock, FileText, X as CloseIcon } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import useAuth from '../../hooks/useAuth.js'
import { NAV_LINKS, ROUTES, APP_NAME } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'
import { getAnalysisHistory } from '../../services/api.js'

const DISMISSED_KEY = 'nyaya_dismissed_notifs'
const REMINDER_DAYS = 10

function daysAgo(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function formatDocName(name) {
  if (!name) return 'Document'
  return name.length > 36 ? name.slice(0, 33) + '...' : name
}

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const buildNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const dismissed = new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'))
      const analyses = await getAnalysisHistory()
      const overdue = analyses
        .filter(a => !dismissed.has(a.id) && daysAgo(a.created_at) >= REMINDER_DAYS)
        .map(a => ({
          id: a.id,
          docName: a.document_name || 'Document',
          analyzedAt: a.created_at,
          daysSince: daysAgo(a.created_at),
        }))
      setNotifications(overdue)
    } catch { /* ignore */ }
  }, [isAuthenticated])

  useEffect(() => {
    buildNotifications()
    const interval = setInterval(buildNotifications, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [buildNotifications])

  const dismiss = (id) => {
    const dismissed = new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'))
    dismissed.add(id)
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed]))
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <header
      className={classNames(
        'sticky top-0 z-40 transition-all duration-300 border-b',
        scrolled
          ? 'bg-parchment-100/90 dark:bg-ink-950/90 backdrop-blur-md border-ink-900/8 dark:border-parchment-100/10 shadow-sm'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-ink-fade flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <Scale className="w-4.5 h-4.5 text-brass-400" size={18} />
          </span>
          <span className="font-display font-bold italic text-xl text-brass-600 dark:text-brass-400 tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                classNames(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ink-900 text-parchment-100 dark:bg-brass-500 dark:text-ink-950'
                    : 'text-ink-600 dark:text-parchment-300 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifOpen(o => !o)}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink-600 dark:text-parchment-200 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-crimson-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none shadow-sm">
                      {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-ink-800 rounded-2xl shadow-xl border border-ink-900/10 dark:border-parchment-100/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-ink-900/8 dark:border-parchment-100/10">
                      <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100">Document reminders</p>
                      <p className="text-[11px] text-ink-400 dark:text-parchment-500">Analyses older than {REMINDER_DAYS} days</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 mx-auto text-ink-300 dark:text-parchment-600 mb-2" />
                          <p className="text-xs text-ink-400 dark:text-parchment-500">All caught up!</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5 transition-colors group">
                            <span className="w-8 h-8 rounded-lg bg-brass-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4 text-brass-600 dark:text-brass-400" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-ink-900 dark:text-parchment-100 truncate">
                                {formatDocName(n.docName)}
                              </p>
                              <p className="text-[11px] text-ink-400 dark:text-parchment-500 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Analyzed {n.daysSince} days ago — review recommended
                              </p>
                            </div>
                            <button
                              onClick={() => dismiss(n.id)}
                              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-ink-300 dark:text-parchment-600 hover:text-ink-600 dark:hover:text-parchment-300 hover:bg-ink-900/10 dark:hover:bg-parchment-100/10 opacity-0 group-hover:opacity-100 transition-all"
                              aria-label="Dismiss"
                            >
                              <CloseIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <Link
                      to={ROUTES.DOCUMENT_ANALYZER}
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 text-center text-xs font-semibold text-brass-600 dark:text-brass-400 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5 border-t border-ink-900/8 dark:border-parchment-100/10 transition-colors"
                    >
                      View all documents
                    </Link>
                  </div>
                )}
              </div>
              <ProfileDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to={ROUTES.LOGIN} className="btn-secondary !px-5 !py-2 text-sm">
                Log in
              </Link>
              <Link to={ROUTES.SIGNUP} className="btn-primary !px-5 !py-2 text-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-ink-700 dark:text-parchment-200"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-900/8 dark:border-parchment-100/10 bg-parchment-100 dark:bg-ink-950 animate-slide-up">
          <div className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  classNames(
                    'px-4 py-3 rounded-xl text-sm font-medium',
                    isActive
                      ? 'bg-ink-900 text-parchment-100 dark:bg-brass-500 dark:text-ink-950'
                      : 'text-ink-600 dark:text-parchment-300'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-end px-4 py-3">
              <ThemeToggle />
            </div>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="btn-secondary w-full">
                  Log in
                </Link>
                <Link to={ROUTES.SIGNUP} onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Sign up
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="px-4 pt-2">
                <ProfileDropdown />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
