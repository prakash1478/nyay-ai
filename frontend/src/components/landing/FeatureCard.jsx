import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function FeatureCard({ icon: Icon, index, title, description, points = [], to, accent = 'brass' }) {
  const accentClasses = {
    brass: 'bg-brass-500/10 text-brass-600 dark:text-brass-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    crimson: 'bg-crimson-500/10 text-crimson-600 dark:text-crimson-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <Link
        to={to}
        className="group card p-7 h-full flex flex-col hover:-translate-y-1 hover:shadow-gold transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-6">
          <span className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClasses[accent]}`}>
            <Icon className="w-5.5 h-5.5" size={22} />
          </span>
          <ArrowUpRight className="w-5 h-5 text-ink-300 dark:text-parchment-500 group-hover:text-brass-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <span className="text-[11px] font-mono text-ink-400 dark:text-parchment-500 mb-2">
          Module {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100 mb-2.5">
          {title}
        </h3>
        <p className="text-sm text-ink-500 dark:text-parchment-400 leading-relaxed mb-5">{description}</p>
        <ul className="mt-auto space-y-2 pt-4 border-t border-ink-900/8 dark:border-parchment-100/10">
          {points.map((point, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-ink-500 dark:text-parchment-400">
              <span className="w-1 h-1 rounded-full bg-brass-500 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </Link>
    </motion.div>
  )
}
