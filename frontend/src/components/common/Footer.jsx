import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, Twitter, Linkedin, Github } from 'lucide-react'
import { APP_NAME, NAV_LINKS, ROUTES } from '../../utils/constants.js'

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/8 dark:border-parchment-100/10 bg-parchment-200/60 dark:bg-ink-900 mt-24">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-full bg-ink-fade flex items-center justify-center">
              <Scale className="w-4.5 h-4.5 text-brass-400" size={18} />
            </span>
            <span className="font-display font-semibold text-lg text-ink-900 dark:text-parchment-100">
              {APP_NAME}
            </span>
          </Link>
          <p className="text-sm text-ink-500 dark:text-parchment-400 max-w-sm leading-relaxed">
            Nyaya AI helps everyday people understand their legal standing — through conversation,
            document review, and plain-language rights guides. Not a substitute for a licensed advocate.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Modules</h4>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-ink-600 dark:text-parchment-300 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Company</h4>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-ink-600 dark:text-parchment-300 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">About</a></li>
            <li><a href="#" className="text-sm text-ink-600 dark:text-parchment-300 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-sm text-ink-600 dark:text-parchment-300 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-sm text-ink-600 dark:text-parchment-300 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-900/8 dark:border-parchment-100/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400 dark:text-parchment-400">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="text-ink-400 hover:text-brass-600 dark:hover:text-brass-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="LinkedIn" className="text-ink-400 hover:text-brass-600 dark:hover:text-brass-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" aria-label="GitHub" className="text-ink-400 hover:text-brass-600 dark:hover:text-brass-400 transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
