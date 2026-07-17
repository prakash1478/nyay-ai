import React from 'react'
import { Scale } from 'lucide-react'

export default function Loader({ fullScreen = true, label = 'Preparing your case file…' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-brass-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-brass-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Scale className="w-6 h-6 text-brass-500" />
        </div>
      </div>
      <p className="text-sm font-medium text-ink-500 dark:text-parchment-300 tracking-wide">{label}</p>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-100 dark:bg-ink-950">
      {content}
    </div>
  )
}
