import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-parchment-400 mb-6">
      <Link to="/" className="flex items-center gap-1 hover:text-brass-600 dark:hover:text-brass-400 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3.5 h-3.5" />
          {item.to ? (
            <Link to={item.to} className="hover:text-brass-600 dark:hover:text-brass-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-700 dark:text-parchment-200 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
