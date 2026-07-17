import React from 'react'
import { riskLevelMeta } from '../../utils/helpers.js'

export default function RiskMeter({ score }) {
  const meta = riskLevelMeta(score)
  const colorMap = {
    crimson: '#C13B3B',
    brass: '#B8935F',
    emerald: '#2A7A61',
  }
  const circumference = 2 * Math.PI * 42

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-ink-900/8 dark:text-parchment-100/10" />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={colorMap[meta.color]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (score / 100) * circumference}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-display font-semibold text-ink-900 dark:text-parchment-100">{score}</span>
          <span className="text-[10px] text-ink-400 dark:text-parchment-500">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-400 dark:text-parchment-500 mb-1">Overall Risk Score</p>
        <p className={`font-display text-lg font-semibold`} style={{ color: colorMap[meta.color] }}>
          {meta.label}
        </p>
        <p className="text-xs text-ink-500 dark:text-parchment-400 mt-1 max-w-xs">
          Based on clause language, obligations, and deviation from standard terms.
        </p>
      </div>
    </div>
  )
}
