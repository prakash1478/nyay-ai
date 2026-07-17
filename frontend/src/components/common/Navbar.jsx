import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Scale, Menu, X, Bell } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import useAuth from '../../hooks/useAuth.js'
import { NAV_LINKS, ROUTES, APP_NAME } from '../../utils/constants.js'
import { classNames } from '../../utils/helpers.js'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <span className="font-display font-semibold text-lg text-ink-900 dark:text-parchment-100 tracking-tight">
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
          <LanguageSelector compact />
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink-600 dark:text-parchment-200 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-crimson-500" />
              </button>
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
            <div className="flex items-center justify-between px-4 py-3">
              <LanguageSelector />
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
