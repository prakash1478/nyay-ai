import React from 'react'
import { Phone, Shield, ExternalLink } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const ACTIONS = [
  {
    label: 'Call Women Helpline (181)',
    icon: Phone,
    href: 'tel:181',
    color: 'crimson',
    description: '24x7 national helpline for women in distress',
  },
  {
    label: 'File Cyber Complaint',
    icon: Shield,
    href: 'https://cybercrime.gov.in',
    external: true,
    color: 'brass',
    description: 'Report cyber crimes at the official portal',
  },
]

const COLOR_STYLES = {
  crimson: {
    bg: 'bg-crimson-500/10 hover:bg-crimson-500/20 dark:bg-crimson-500/10 dark:hover:bg-crimson-500/20',
    text: 'text-crimson-700 dark:text-crimson-300',
    icon: 'text-crimson-600 dark:text-crimson-400',
    ring: 'focus-visible:ring-crimson-500/40',
  },
  brass: {
    bg: 'bg-brass-500/10 hover:bg-brass-500/20 dark:bg-brass-500/10 dark:hover:bg-brass-500/20',
    text: 'text-brass-700 dark:text-brass-300',
    icon: 'text-brass-600 dark:text-brass-400',
    ring: 'focus-visible:ring-brass-500/40',
  },
}

export default function QuickActions() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-sm text-ink-900 dark:text-parchment-100 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const style = COLOR_STYLES[action.color]
          const Icon = action.icon

          const content = (
            <div
              className={classNames(
                'relative flex flex-col items-center gap-2 rounded-xl border border-ink-900/8 dark:border-parchment-100/10 px-3 py-4 transition-all duration-200 cursor-pointer group',
                style.bg,
                style.ring
              )}
            >
              <span
                className={classNames(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                  style.bg
                )}
              >
                <Icon className={classNames('w-5 h-5', style.icon)} />
              </span>
              <span className={classNames('text-xs font-semibold text-center leading-tight', style.text)}>
                {action.label}
              </span>
              {action.external && (
                <ExternalLink className="w-3 h-3 absolute top-2 right-2 text-ink-400 dark:text-parchment-500 opacity-50" />
              )}
            </div>
          )

          if (action.href && action.external) {
            return (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            )
          }

          if (action.href && action.href.startsWith('tel:')) {
            return (
              <a key={action.label} href={action.href}>
                {content}
              </a>
            )
          }

          return (
            <button
              key={action.label}
              type="button"
              className="w-full text-left"
              onClick={action.onClick}
            >
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
