import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="divide-y divide-ink-900/8 dark:divide-parchment-100/10">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="py-3.5">
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 text-left"
            >
              <span className="text-sm font-medium text-ink-800 dark:text-parchment-100">{faq.q}</span>
              <ChevronDown
                className={classNames(
                  'w-4 h-4 shrink-0 text-ink-400 transition-transform',
                  isOpen && 'rotate-180 text-brass-500'
                )}
              />
            </button>
            {isOpen && (
              <p className="text-sm text-ink-500 dark:text-parchment-400 leading-relaxed mt-2.5 pr-8 animate-fade-in">
                {faq.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
