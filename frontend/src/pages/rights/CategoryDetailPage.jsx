import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { BookOpen, Phone, HelpCircle, CheckCircle2 } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import EmergencyContacts from '../../components/rights/EmergencyContacts.jsx'
import FAQAccordion from '../../components/rights/FAQAccordion.jsx'
import rightsData from '../../data/rightsData.js'
import { ROUTES } from '../../utils/constants.js'

const ACCENTS = {
  crimson: 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400',
  brass: 'bg-brass-500/10 text-brass-600 dark:text-brass-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  ink: 'bg-ink-900/10 text-ink-700 dark:bg-parchment-100/10 dark:text-parchment-200',
}

export default function CategoryDetailPage() {
  const { categoryId } = useParams()
  const category = rightsData.find((c) => c.id === categoryId)

  if (!category) return <Navigate to={ROUTES.RIGHTS} replace />

  const Icon = Icons[category.icon] || Icons.Scale

  return (
    <div>
      <Breadcrumb items={[{ label: 'Know Your Rights', to: ROUTES.RIGHTS }, { label: category.title }]} />

      <div className="flex items-center gap-4 mb-10">
        <span className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${ACCENTS[category.color]}`}>
          <Icon className="w-6.5 h-6.5" size={26} />
        </span>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-parchment-100">
            {category.title} Rights
          </h1>
          <p className="text-sm text-ink-500 dark:text-parchment-400 mt-1">{category.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brass-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-brass-600 dark:text-brass-400" />
              </span>
              <h2 className="font-display font-semibold text-ink-900 dark:text-parchment-100">Your Rights</h2>
            </div>
            <ul className="space-y-3">
              {category.rights.map((right, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink-600 dark:text-parchment-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brass-500 shrink-0" />
                  <span className="leading-relaxed">{right}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brass-500/10 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-brass-600 dark:text-brass-400" />
              </span>
              <h2 className="font-display font-semibold text-ink-900 dark:text-parchment-100">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQAccordion faqs={category.faqs} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-crimson-500/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
              </span>
              <h2 className="font-display font-semibold text-ink-900 dark:text-parchment-100">
                Emergency Contacts
              </h2>
            </div>
            <EmergencyContacts contacts={category.emergencyContacts} />
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              <h2 className="font-display font-semibold text-ink-900 dark:text-parchment-100">Related Acts</h2>
            </div>
            <ul className="space-y-2">
              {category.acts.map((act) => (
                <li key={act} className="text-sm text-ink-600 dark:text-parchment-300 pb-2 border-b border-ink-900/8 dark:border-parchment-100/10 last:border-0 last:pb-0">
                  {act}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
