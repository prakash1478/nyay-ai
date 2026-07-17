import React, { useRef, useState } from 'react'
import { Languages, Check, ChevronDown } from 'lucide-react'
import useLanguage from '../../hooks/useLanguage.js'
import useClickOutside from '../../hooks/useClickOutside.js'

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage, currentLanguage, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-ink-600 dark:text-parchment-200 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors"
      >
        <Languages className="w-4 h-4" />
        {!compact && <span>{currentLanguage.native}</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark border border-ink-900/5 dark:border-parchment-100/10 py-1.5 z-50 animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-ink-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors"
            >
              <span>
                {lang.native} <span className="text-ink-400 dark:text-parchment-400">· {lang.label}</span>
              </span>
              {language === lang.code && <Check className="w-4 h-4 text-brass-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
