import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, ArrowLeft } from 'lucide-react'
import { ROUTES } from '../utils/constants.js'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-ink-fade flex items-center justify-center shadow-soft rotate-3">
          <Scale className="w-9 h-9 text-brass-400" />
        </div>
        <p className="eyebrow mb-3 justify-center">Case not found</p>
        <h1 className="font-display text-6xl font-semibold text-ink-900 dark:text-parchment-100 mb-4">404</h1>
        <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8 leading-relaxed">
          This docket doesn't exist, or it's been moved. Let's get you back to solid ground.
        </p>
        <Link to={ROUTES.HOME} className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to homepage
        </Link>
      </div>
    </div>
  )
}
