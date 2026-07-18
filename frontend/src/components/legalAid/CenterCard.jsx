import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Scale, Users, Heart } from 'lucide-react'

const TYPE_META = {
  'NALSA': { icon: Scale, color: 'emerald', label: 'NALSA' },
  'Nyaya Bandhu': { icon: Users, color: 'brass', label: 'Nyaya Bandhu' },
  'Tele-Law': { icon: Phone, color: 'crimson', label: 'Tele-Law' },
  'Pro Bono': { icon: Heart, color: 'ink', label: 'Pro Bono' },
}

const BADGE_COLORS = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  brass: 'bg-brass-500/10 text-brass-600 dark:text-brass-400 border-brass-500/20',
  crimson: 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400 border-crimson-500/20',
  ink: 'bg-ink-900/10 text-ink-700 dark:bg-parchment-100/10 dark:text-parchment-200 border-ink-900/10 dark:border-parchment-100/10',
}

const ICON_WRAPPER = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  brass: 'bg-brass-500/10 text-brass-600 dark:text-brass-400',
  crimson: 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400',
  ink: 'bg-ink-900/10 text-ink-700 dark:bg-parchment-100/10 dark:text-parchment-200',
}

const STATUS_COLORS = {
  true: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  false: 'text-crimson-600 dark:text-crimson-400 bg-crimson-500/10',
}

function formatDistance(center) {
  if (center.distance != null) {
    return `${center.distance} km`
  }
  return 'Check location'
}

export default function CenterCard({ center, index, isSelected, onSelect }) {
  const meta = TYPE_META[center.type] || TYPE_META['NALSA']
  const Icon = meta.icon
  const badgeColor = BADGE_COLORS[meta.color]
  const iconWrapper = ICON_WRAPPER[meta.color]
  const distance = formatDistance(center)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`card p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold ${
        isSelected ? 'ring-2 ring-brass-500 shadow-gold' : ''
      }`}
      onClick={() => onSelect(center.id)}
    >
      <div className="flex items-start gap-4">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconWrapper}`}>
          <Icon className="w-5 h-5" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-base font-semibold text-ink-900 dark:text-parchment-100 truncate">
              {center.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${badgeColor}`}>
              {meta.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-parchment-400 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{center.address}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            <a
              href={`tel:${center.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-brass-600 dark:text-brass-400 hover:underline"
            >
              <Phone className="w-3 h-3" />
              {center.phone}
            </a>

            <span className="inline-flex items-center gap-1 text-ink-400 dark:text-parchment-500">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>

            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[center.open]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${center.open ? 'bg-emerald-500' : 'bg-crimson-500'}`} />
              {center.open ? 'Open now' : 'Closed'}
            </span>
          </div>

          {center.services && (
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              {center.services.map((service, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-ink-900/5 dark:bg-parchment-100/5 text-ink-500 dark:text-parchment-400"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
