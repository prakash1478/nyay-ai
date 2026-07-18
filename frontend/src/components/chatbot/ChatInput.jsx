import React, { useState, useEffect, useRef } from 'react'
import { Send, Mic, CircleStop } from 'lucide-react'
import toast from 'react-hot-toast'
import useSpeechToText from '../../hooks/useSpeechToText.js'
import { classNames } from '../../utils/helpers.js'

export default function ChatInput({ onSend, isGenerating, onStop }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const { isListening, transcript, supported, startListening, stopListening } = useSpeechToText()

  useEffect(() => {
    if (transcript) setValue(transcript)
  }, [transcript])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [value])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || isGenerating) return
    onSend(value.trim())
    setValue('')
  }

  const handleMicClick = () => {
    if (!supported) {
      toast.error('Voice typing is not supported in this browser.')
      return
    }
    isListening ? stopListening() : startListening()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 bg-white dark:bg-ink-800 border border-ink-900/10 dark:border-parchment-100/10 rounded-2xl p-2 shadow-card focus-within:border-brass-400 transition-colors">
        <button
          type="button"
          onClick={handleMicClick}
          className={classNames(
            'w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors',
            isListening
              ? 'bg-crimson-500 text-white animate-pulse'
              : 'text-ink-500 dark:text-parchment-300 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10'
          )}
          aria-label="Voice typing"
        >
          <Mic className="w-4.5 h-4.5" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Ask a legal question…"
          className="flex-1 resize-none bg-transparent outline-none text-sm text-ink-800 dark:text-parchment-100 placeholder:text-ink-400 dark:placeholder:text-parchment-500 py-2.5 max-h-36 scrollbar-thin"
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="w-10 h-10 shrink-0 rounded-xl bg-crimson-500 text-white flex items-center justify-center hover:bg-crimson-600 transition-colors"
            aria-label="Stop generating"
          >
            <CircleStop className="w-4.5 h-4.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-10 h-10 shrink-0 rounded-xl bg-ink-900 dark:bg-brass-500 text-parchment-100 dark:text-ink-950 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-[11px] text-ink-400 dark:text-parchment-500 mt-2 px-1">
        <span className="font-display font-semibold text-brass-600 dark:text-brass-400">Nyay AI</span> provides general legal information, not a substitute for professional legal advice.
      </p>
    </form>
  )
}
