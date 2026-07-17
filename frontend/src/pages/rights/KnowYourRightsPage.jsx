import React from 'react'
import { ShieldCheck } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import CategoryCard from '../../components/rights/CategoryCard.jsx'
import rightsData from '../../data/rightsData.js'

export default function KnowYourRightsPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Know Your Rights' }]} />

      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
            Know Your Rights
          </h1>
          <p className="text-sm text-ink-500 dark:text-parchment-400">
            Plain-language guides across everyday legal categories.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
        {rightsData.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
