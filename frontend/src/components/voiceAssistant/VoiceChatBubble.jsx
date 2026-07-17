import React from 'react'
import { motion } from 'framer-motion'
import { Volume2, Scale } from 'lucide-react'
import { formatTime } from '../../utils/helpers.js'

export default function VoiceChatBubble({ message, onSpeak }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <span className="w-8 h-8 rounded-full bg-ink-fade flex items-center justify-center shrink-0 mt-0.5">
          <Scale className="w-4 h-4 text-brass-400" />
        </span>
      )}
      <div className={`group max-w-[80%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <span className="text-[11px] font-medium text-ink-400 dark:text-parchment-500 mb-1 px-1">
          {isUser ? 'You' : 'Nyaya AI'}
        </span>
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-ink-900 dark:bg-brass-500 text-parchment-100 dark:text-ink-950 rounded-2xl rounded-tr-sm'
              : 'bg-white dark:bg-ink-800 border border-ink-900/5 dark:border-parchment-100/10 text-ink-800 dark:text-parchment-100 rounded-2xl rounded-tl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-2 mt-1.5 px-1">
          <span className="text-[11px] text-ink-400 dark:text-parchment-500">
            {formatTime(new Date(message.timestamp))}
          </span>
          {!isUser && (
            <button
              onClick={() => onSpeak?.(message.content)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-400 hover:text-brass-600 dark:hover:text-brass-400"
              aria-label="Read aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
