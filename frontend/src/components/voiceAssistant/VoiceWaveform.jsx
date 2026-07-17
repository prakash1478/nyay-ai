import React from 'react'
import { motion } from 'framer-motion'

const BAR_COUNT = 5

const randomHeight = () => Math.random() * 32 + 8

export default function VoiceWaveform({ active = false, color = 'bg-brass-500' }) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-10">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className={`w-[3px] rounded-full ${color}`}
          animate={
            active
              ? {
                  height: [randomHeight(), randomHeight(), randomHeight(), randomHeight(), randomHeight()],
                  opacity: [0.6, 1, 0.7, 0.9, 0.5],
                }
              : { height: 6, opacity: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  )
}
