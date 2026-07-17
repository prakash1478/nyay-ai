import React from 'react'
import { Sun, Moon } from 'lucide-react'
import useTheme from '../../hooks/useTheme.js'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`relative w-10 h-10 rounded-full flex items-center justify-center text-ink-600 dark:text-parchment-200 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors ${className}`}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  )
}
