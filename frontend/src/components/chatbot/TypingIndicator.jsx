import React from 'react'
import { Scale } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <span className="w-8 h-8 rounded-full bg-ink-fade flex items-center justify-center shrink-0">
        <Scale className="w-4 h-4 text-brass-400" />
      </span>
      <div className="bg-white dark:bg-ink-800 border border-ink-900/5 dark:border-parchment-100/10 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-400 dark:bg-parchment-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-ink-400 dark:bg-parchment-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-ink-400 dark:bg-parchment-400 animate-bounce" />
      </div>
    </div>
  )
}
