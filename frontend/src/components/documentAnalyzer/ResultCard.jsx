import React from 'react'
import { classNames } from '../../utils/helpers.js'

export default function ResultCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={classNames('card p-6', className)}>
      <div className="flex items-center gap-2.5 mb-4">
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-brass-500/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brass-600 dark:text-brass-400" />
          </span>
        )}
        <h3 className="font-display font-semibold text-ink-900 dark:text-parchment-100">{title}</h3>
      </div>
      {children}
    </div>
  )
}
