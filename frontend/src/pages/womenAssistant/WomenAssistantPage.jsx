import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { HeartHandshake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import EmergencyBanner from '../../components/womenAssistant/EmergencyBanner.jsx'
import QuickActions from '../../components/womenAssistant/QuickActions.jsx'
import CategorySection from '../../components/womenAssistant/CategorySection.jsx'
import { WOMEN_CATEGORIES } from '../../data/womenLegalData.js'
import { classNames } from '../../utils/helpers.js'

const TAB_ACCENTS = {
  crimson: 'data-[active=true]:border-crimson-500 data-[active=true]:text-crimson-700 dark:data-[active=true]:text-crimson-400',
  brass: 'data-[active=true]:border-brass-500 data-[active=true]:text-brass-700 dark:data-[active=true]:text-brass-400',
  emerald: 'data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-700 dark:data-[active=true]:text-emerald-400',
  ink: 'data-[active=true]:border-ink-900 dark:data-[active=true]:border-parchment-100 data-[active=true]:text-ink-700 dark:data-[active=true]:text-parchment-200',
}

export default function WomenAssistantPage() {
  const [activeTab, setActiveTab] = useState(WOMEN_CATEGORIES[0].id)
  const activeCategory = WOMEN_CATEGORIES.find((c) => c.id === activeTab)

  return (
    <div>
      <Breadcrumb items={[{ label: "Women's Legal Assistant" }]} />

      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-xl bg-crimson-500/10 flex items-center justify-center">
          <HeartHandshake className="w-5.5 h-5.5 text-crimson-600 dark:text-crimson-400" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
            Women's Legal Assistant
          </h1>
          <p className="text-sm text-ink-500 dark:text-parchment-400">
            Specialised legal guidance on domestic violence, workplace harassment, matrimonial disputes, property rights, cybercrime, and the POSH Act.
          </p>
        </div>
      </div>

      <div className="mt-6 mb-8">
        <EmergencyBanner />
      </div>

      <div className="mb-8">
        <QuickActions />
      </div>

      <div className="mb-6">
        <nav className="flex gap-1 overflow-x-auto scrollbar-thin pb-1 -mb-1" role="tablist">
          {WOMEN_CATEGORIES.map((category) => {
            const Icon = Icons[category.icon] || Icons.Scale
            const isActive = activeTab === category.id
            const accent = TAB_ACCENTS[category.color] || TAB_ACCENTS.crimson

            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isActive}
                data-active={isActive}
                onClick={() => setActiveTab(category.id)}
                className={classNames(
                  'relative flex items-center gap-2 shrink-0 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase rounded-lg border-b-2 border-transparent text-ink-400 dark:text-parchment-500 hover:text-ink-700 dark:hover:text-parchment-200 transition-all duration-200',
                  accent
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.title}</span>
                <span className="sm:hidden">
                  {category.title.length > 10 ? category.title.slice(0, 10) + '…' : category.title}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-lg bg-ink-900/5 dark:bg-parchment-100/5 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <CategorySection category={activeCategory} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 p-5 rounded-xl2 bg-crimson-500/5 border border-crimson-500/10 dark:bg-crimson-500/5 dark:border-crimson-500/20">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-crimson-500/10 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
          </span>
          <div>
            <p className="font-display font-semibold text-sm text-ink-900 dark:text-parchment-100 mb-1">
              Need more help? Talk to Nyay AI
            </p>
            <p className="text-xs text-ink-500 dark:text-parchment-400 leading-relaxed">
              Our AI assistant can answer your legal questions in plain language across Hindi, Tamil, Bengali, and other Indian languages. Ask about procedures, file formats, or get personalised guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
