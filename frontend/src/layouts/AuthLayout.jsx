import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Scale, ShieldCheck, MessagesSquare, FileSearch } from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle.jsx'
import { APP_NAME, ROUTES } from '../utils/constants.js'

const HIGHLIGHTS = [
  { icon: MessagesSquare, text: 'Conversational legal guidance in five Indian languages' },
  { icon: FileSearch, text: 'Instant risk analysis for contracts and agreements' },
  { icon: ShieldCheck, text: 'Plain-language rights guides across 8 categories' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-parchment-100 dark:bg-ink-950">
      {/* Left / brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-ink-fade relative overflow-hidden p-12 text-parchment-100">
        <div className="absolute inset-0 bg-brief-lines opacity-[0.06] pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-brass-500/10 blur-3xl" />

        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 relative z-10">
          <span className="w-10 h-10 rounded-full bg-brass-500/20 border border-brass-400/30 flex items-center justify-center">
            <Scale className="w-5 h-5 text-brass-300" />
          </span>
          <span className="font-semibold text-xl">{APP_NAME}</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="eyebrow text-brass-300 mb-4">Case File №001</p>
          <h2 className="font-display text-4xl leading-tight mb-6">
            Legal clarity, drafted in your language.
          </h2>
          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brass-300" />
                </span>
                <p className="text-sm text-parchment-200 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-parchment-400">
          Nyay AI does not constitute formal legal advice. Consult a licensed advocate for representation.
        </p>
      </div>

      {/* Right / form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to={ROUTES.HOME} className="lg:hidden flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-ink-fade flex items-center justify-center">
              <Scale className="w-4 h-4 text-brass-400" />
            </span>
            <span className="font-semibold text-ink-900 dark:text-parchment-100">{APP_NAME}</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
