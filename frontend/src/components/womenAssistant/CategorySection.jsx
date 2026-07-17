import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { ChevronDown, BookOpen, ShieldCheck, ClipboardList, Phone, HeartHandshake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { classNames } from '../../utils/helpers.js'

const ACCENTS = {
  crimson: {
    bg: 'bg-crimson-500/10',
    text: 'text-crimson-600 dark:text-crimson-400',
    border: 'border-crimson-500/20',
    light: 'bg-crimson-500/5',
    icon: 'bg-crimson-500/15',
    dot: 'bg-crimson-500',
    badge: 'bg-crimson-500/10 text-crimson-700 dark:text-crimson-300',
  },
  brass: {
    bg: 'bg-brass-500/10',
    text: 'text-brass-600 dark:text-brass-400',
    border: 'border-brass-500/20',
    light: 'bg-brass-500/5',
    icon: 'bg-brass-500/15',
    dot: 'bg-brass-500',
    badge: 'bg-brass-500/10 text-brass-700 dark:text-brass-300',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    light: 'bg-emerald-500/5',
    icon: 'bg-emerald-500/15',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  ink: {
    bg: 'bg-ink-900/10',
    text: 'text-ink-700 dark:text-parchment-200',
    border: 'border-ink-900/20 dark:border-parchment-100/20',
    light: 'bg-ink-900/5 dark:bg-parchment-100/5',
    icon: 'bg-ink-900/15 dark:bg-parchment-100/15',
    dot: 'bg-ink-900 dark:bg-parchment-100',
    badge: 'bg-ink-900/10 dark:bg-parchment-100/10 text-ink-700 dark:text-parchment-200',
  },
}

const SECTIONS = [
  { id: 'rights', label: 'Know Your Rights', icon: ShieldCheck },
  { id: 'laws', label: 'Relevant Laws', icon: BookOpen },
  { id: 'steps', label: 'Step-by-Step Guide', icon: ClipboardList },
  { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
  { id: 'ngos', label: 'NGO Resources', icon: HeartHandshake },
]

export default function CategorySection({ category }) {
  const [openSections, setOpenSections] = useState(['rights'])
  const accent = ACCENTS[category.color] || ACCENTS.crimson
  const CategoryIcon = Icons[category.icon] || Icons.Scale

  const toggle = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const isOpen = (id) => openSections.includes(id)

  return (
    <div className="space-y-4">
      <div className={classNames('flex items-center gap-3 mb-2', accent.text)}>
        <span className={classNames('w-10 h-10 rounded-xl flex items-center justify-center', accent.icon)}>
          <CategoryIcon className="w-5 h-5" />
        </span>
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
          {category.title}
        </h2>
      </div>

      {SECTIONS.map((section) => {
        const expanded = isOpen(section.id)
        const items = category[section.id]

        return (
          <div
            key={section.id}
            className={classNames(
              'card overflow-hidden border transition-all duration-300',
              expanded ? accent.border : 'border-transparent'
            )}
          >
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ink-900/[0.02] dark:hover:bg-parchment-100/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={classNames('w-8 h-8 rounded-lg flex items-center justify-center', accent.bg)}>
                  <section.icon className={classNames('w-4 h-4', accent.text)} />
                </span>
                <span className="font-display font-semibold text-sm text-ink-900 dark:text-parchment-100">
                  {section.label}
                </span>
                {items && (
                  <span className={classNames('text-[10px] font-semibold tracking-wide uppercase rounded-full px-2 py-0.5', accent.badge)}>
                    {items.length}
                  </span>
                )}
              </div>
              <ChevronDown
                className={classNames(
                  'w-4 h-4 shrink-0 text-ink-400 dark:text-parchment-500 transition-transform duration-300',
                  expanded && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-ink-900/8 dark:border-parchment-100/10 pt-4">
                    {section.id === 'rights' && (
                      <ul className="space-y-2.5">
                        {category.rights.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-ink-600 dark:text-parchment-300">
                            <span className={classNames('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', accent.dot)} />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.id === 'laws' && (
                      <ul className="space-y-2">
                        {category.laws.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-ink-600 dark:text-parchment-300 pb-2.5 border-b border-ink-900/8 dark:border-parchment-100/10 last:border-0 last:pb-0"
                          >
                            <span className={classNames('mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0', accent.bg)}>
                              <BookOpen className={classNames('w-3 h-3', accent.text)} />
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.id === 'steps' && (
                      <ol className="space-y-3">
                        {category.steps.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-ink-600 dark:text-parchment-300">
                            <span
                              className={classNames(
                                'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                                accent.bg,
                                accent.text
                              )}
                            >
                              {i + 1}
                            </span>
                            <span className="leading-relaxed pt-0.5">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {section.id === 'contacts' && (
                      <div className="space-y-2.5">
                        {category.emergencyContacts.map((contact) => (
                          <a
                            key={contact.label}
                            href={`tel:${contact.number.replace(/\D/g, '')}`}
                            className={classNames(
                              'flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 hover:brightness-95 transition-all',
                              accent.border,
                              accent.light
                            )}
                          >
                            <span className="flex items-center gap-2 text-sm text-ink-700 dark:text-parchment-200">
                              <Phone className={classNames('w-3.5 h-3.5', accent.text)} />
                              {contact.label}
                            </span>
                            <span className={classNames('text-sm font-mono font-semibold', accent.text)}>
                              {contact.number}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}

                    {section.id === 'ngos' && (
                      <div className="space-y-2.5">
                        {category.ngos.map((ngo, i) => (
                          <div
                            key={i}
                            className={classNames(
                              'flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3',
                              accent.border
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={classNames('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', accent.bg)}>
                                <HeartHandshake className={classNames('w-4 h-4', accent.text)} />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-ink-800 dark:text-parchment-100">{ngo.name}</p>
                                <p className="text-xs text-ink-500 dark:text-parchment-400">{ngo.city}</p>
                              </div>
                            </div>
                            <a
                              href={`tel:${ngo.phone.replace(/\D/g, '')}`}
                              className={classNames(
                                'shrink-0 text-xs font-mono font-semibold px-2.5 py-1 rounded-lg',
                                accent.bg,
                                accent.text
                              )}
                            >
                              {ngo.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
