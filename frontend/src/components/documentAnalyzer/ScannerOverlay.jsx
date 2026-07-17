import React from 'react'
import { motion } from 'framer-motion'

export default function ScannerOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-5/6 h-3/5 border border-brass-400/50 rounded-xl relative">
          <div className="absolute -top-0.5 -left-0.5 w-5 h-5 border-t-2 border-l-2 border-brass-400 rounded-tl-lg" />
          <div className="absolute -top-0.5 -right-0.5 w-5 h-5 border-t-2 border-r-2 border-brass-400 rounded-tr-lg" />
          <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-2 border-l-2 border-brass-400 rounded-bl-lg" />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-2 border-r-2 border-brass-400 rounded-br-lg" />
          <motion.div
            className="absolute left-2 right-2 h-px bg-brass-400/70 shadow-[0_0_8px_rgba(184,147,95,0.5)]"
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full whitespace-nowrap">
        Position document within frame
      </p>
    </div>
  )
}
