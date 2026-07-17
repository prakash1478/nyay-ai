import React from 'react'
import { Phone, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { classNames } from '../../utils/helpers.js'

export default function EmergencyBanner({ className = '' }) {
  return (
    <div
      className={classNames(
        'relative overflow-hidden rounded-xl2 bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-800 dark:from-crimson-900 dark:via-crimson-800 dark:to-crimson-950 px-5 py-4 sm:py-5 shadow-lg shadow-crimson-500/20',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)' }} />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-2 ring-white/20"
          >
            <Phone className="w-5 h-5 text-white" />
          </motion.span>
          <div>
            <p className="font-display text-[10px] tracking-[0.2em] uppercase text-white/60 font-semibold">
              Emergency
            </p>
            <p className="text-xs font-medium text-white/80">24 x 7 Helplines</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-5">
          <a
            href="tel:181"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2.5 hover:bg-white/25 transition-colors group"
          >
            <span className="w-7 h-7 rounded-full bg-crimson-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-semibold text-white">Women Helpline</span>
            <span className="text-sm font-mono font-bold text-white/90">181</span>
          </a>

          <a
            href="tel:112"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2.5 hover:bg-white/25 transition-colors group"
          >
            <span className="w-7 h-7 rounded-full bg-crimson-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-semibold text-white">Police</span>
            <span className="text-sm font-mono font-bold text-white/90">112</span>
          </a>
        </div>

        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-semibold text-white/50 shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-300" />
          SOS Active
        </motion.span>
      </div>
    </div>
  )
}
