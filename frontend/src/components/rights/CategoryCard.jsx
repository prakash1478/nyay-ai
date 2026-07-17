import React from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { ROUTES } from '../../utils/constants.js'

const ACCENTS = {
  crimson: 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400',
  brass: 'bg-brass-500/10 text-brass-600 dark:text-brass-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  ink: 'bg-ink-900/10 text-ink-700 dark:bg-parchment-100/10 dark:text-parchment-200',
}

export default function CategoryCard({ category }) {
  const Icon = Icons[category.icon] || Icons.Scale

  return (
    <Link
      to={ROUTES.RIGHTS_CATEGORY.replace(':categoryId', category.id)}
      className="group card p-6 flex flex-col hover:-translate-y-1 hover:shadow-gold transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${ACCENTS[category.color]}`}>
          <Icon className="w-5 h-5" />
        </span>
        <ArrowUpRight className="w-4.5 h-4.5 text-ink-300 dark:text-parchment-500 group-hover:text-brass-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100 mb-1.5">
        {category.title}
      </h3>
      <p className="text-sm text-ink-500 dark:text-parchment-400 leading-relaxed">{category.description}</p>
    </Link>
  )
}
