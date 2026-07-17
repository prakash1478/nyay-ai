import React from 'react'
import { Sparkles } from 'lucide-react'
import suggestedQuestions from '../../data/suggestedQuestions.js'

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-10">
      <span className="inline-flex w-14 h-14 rounded-2xl bg-ink-fade items-center justify-center mb-5 shadow-soft">
        <Sparkles className="w-6 h-6 text-brass-400" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
        Ask me anything legal
      </h2>
      <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8">
        I can help with consumer disputes, tenancy, employment, cyber crime, and more.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 text-left">
        {suggestedQuestions.slice(0, 6).map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="card px-4 py-3 text-sm text-ink-700 dark:text-parchment-200 hover:border-brass-400 hover:shadow-gold transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
