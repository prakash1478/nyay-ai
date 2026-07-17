import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, CircleStop, Volume2, Square, MessageSquare, RotateCcw, Sparkles } from 'lucide-react'
import useSpeechToText from '../../hooks/useSpeechToText.js'
import useTextToSpeech from '../../hooks/useTextToSpeech.js'
import useLanguage from '../../hooks/useLanguage.js'
import VoiceWaveform from '../../components/voiceAssistant/VoiceWaveform.jsx'
import VoiceChatBubble from '../../components/voiceAssistant/VoiceChatBubble.jsx'

const LEGAL_RESPONSES = [
  "Under Indian consumer protection law, you're entitled to file a complaint within two years of the transaction. Would you like the exact filing steps for your state's consumer forum?",
  'Tenancy notice periods vary by state, but most Rent Control Acts require at least 15-30 days written notice before eviction proceedings can begin. Do you have a written lease?',
  "Under the IT Act 2000, cyberstalking and online harassment are cognizable offences. You can file a complaint at your nearest cyber cell or via cybercrime.gov.in.",
  'The Payment of Wages Act requires wages to be paid within 7-10 days of the wage period ending. If your employer has withheld pay beyond this, you may file a claim with the labour commissioner.',
  'Under the POSH Act, every workplace with 10+ employees must have an Internal Committee to address complaints of sexual harassment. Would you like a checklist for filing a formal complaint?',
]

async function getAIReply(text) {
  await new Promise(r => setTimeout(r, 900 + Math.random() * 700))
  return LEGAL_RESPONSES[Math.floor(Math.random() * LEGAL_RESPONSES.length)]
}

export default function VoiceAssistantPage() {
  const [phase, setPhase] = useState('idle')
  const [conversation, setConversation] = useState([])
  const [error, setError] = useState(null)
  const { language } = useLanguage()
  const transcriptRef = useRef('')

  const {
    isListening,
    transcript,
    supported,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechToText({ lang: language === 'hi' ? 'hi-IN' : 'en-IN' })

  const { speak, stop: stopTts, isPlaying } = useTextToSpeech()

  transcriptRef.current = transcript

  const handleProcessTranscript = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setPhase('idle')
      return
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }

    setConversation(prev => [...prev, userMessage])
    setPhase('processing')
    setError(null)

    try {
      const reply = await getAIReply(trimmed)
      const aiMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: reply,
        timestamp: new Date().toISOString(),
      }
      setConversation(prev => [...prev, aiMessage])
      setPhase('result')
      speak(reply, language === 'hi' ? 'hi' : 'en')
    } catch (err) {
      setError('Failed to get a response. Please try again.')
      setPhase('idle')
    }
  }, [speak, language])

  useEffect(() => {
    if (!isListening && phase === 'listening') {
      const finalText = transcriptRef.current
      handleProcessTranscript(finalText)
    }
  }, [isListening, phase, handleProcessTranscript])

  const handleMicClick = () => {
    if (phase === 'idle' || phase === 'result') {
      setTranscript('')
      setPhase('listening')
      startListening()
    }
  }

  const handleStopListening = () => {
    stopListening()
  }

  const handleStopTts = () => {
    stopTts()
  }

  const handleClear = () => {
    if (isPlaying) stopTts()
    if (isListening) stopListening()
    setConversation([])
    setPhase('idle')
    setTranscript('')
    setError(null)
  }

  const handleReSpeak = (text) => {
    speak(text, language === 'hi' ? 'hi' : 'en')
  }

  const showTranscript = phase === 'listening' && transcript

  return (
    <div className="flex flex-col h-full bg-parchment-100 dark:bg-ink-950">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-ink-900/8 dark:border-parchment-100/10 bg-parchment-100/80 dark:bg-ink-950/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-brass-500/10 flex items-center justify-center">
            <MessageSquare className="w-4.5 h-4.5 text-brass-600 dark:text-brass-400" />
          </span>
          <div>
            <h1 className="font-display font-semibold text-ink-900 dark:text-parchment-100">Voice Assistant</h1>
            <p className="text-xs text-ink-400 dark:text-parchment-500">Speak your legal query aloud</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(conversation.length > 0 || phase !== 'idle') && (
            <button
              onClick={handleClear}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 dark:text-parchment-300 hover:bg-crimson-500/10 hover:text-crimson-600 transition-colors"
              aria-label="Start over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6 flex flex-col">
        {!supported ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <span className="w-14 h-14 rounded-2xl bg-crimson-500/10 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-crimson-500" />
              </span>
              <h2 className="font-display font-semibold text-ink-900 dark:text-parchment-100 mb-2">
                Speech recognition not supported
              </h2>
              <p className="text-sm text-ink-500 dark:text-parchment-400 leading-relaxed">
                Your browser does not support the Web Speech API. Try using Chrome or Edge, or type your query in the chatbot instead.
              </p>
            </div>
          </div>
        ) : conversation.length === 0 && phase === 'idle' ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <span className="w-16 h-16 rounded-2xl bg-brass-500/10 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-7 h-7 text-brass-500" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
                Ask a legal question
              </h2>
              <p className="text-sm text-ink-500 dark:text-parchment-400 max-w-sm">
                Tap the microphone and ask anything about Indian law — consumer rights, tenancy, cyber crime, labour laws, and more.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-5 pb-6">
            {conversation.map((msg) => (
              <VoiceChatBubble key={msg.id} message={msg} onSpeak={handleReSpeak} />
            ))}

            {phase === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <span className="w-8 h-8 rounded-full bg-ink-fade flex items-center justify-center shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4 text-brass-400" />
                </span>
                <div className="max-w-[80%] sm:max-w-[70%] flex flex-col">
                  <span className="text-[11px] font-medium text-ink-400 dark:text-parchment-500 mb-1 px-1">
                    Nyaya AI
                  </span>
                  <div className="px-4 py-3 bg-white dark:bg-ink-800 border border-ink-900/5 dark:border-parchment-100/10 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-brass-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-brass-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-brass-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                        />
                      </div>
                      <span className="text-sm text-ink-400 dark:text-parchment-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end">
                  <span className="text-[11px] font-medium text-ink-400 dark:text-parchment-500 mb-1 px-1">
                    You
                  </span>
                  <div className="px-4 py-3 bg-ink-900/90 dark:bg-brass-500/90 text-parchment-100 dark:text-ink-950 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
                    {transcript}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-[2px] h-4 bg-parchment-100 dark:text-ink-950 ml-0.5 align-text-bottom"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-sm text-crimson-500">{error}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {isPlaying && (
        <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-ink-900/8 dark:border-parchment-100/10 bg-parchment-100/80 dark:bg-ink-950/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VoiceWaveform active={true} color="bg-brass-500" />
              <span className="text-xs text-ink-500 dark:text-parchment-400">Nyaya AI is speaking...</span>
            </div>
            <button
              onClick={handleStopTts}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 dark:text-parchment-300 hover:bg-crimson-500/10 hover:text-crimson-600 transition-colors"
              aria-label="Stop speaking"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 px-4 sm:px-6 pb-8 pt-6">
        <div className="flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {phase === 'listening' ? (
              <motion.div
                key="listening"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-crimson-500/20"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <button
                    onClick={handleStopListening}
                    className="relative w-16 h-16 rounded-full bg-crimson-500 flex items-center justify-center shadow-lg shadow-crimson-500/25 hover:bg-crimson-600 transition-colors"
                    aria-label="Stop recording"
                  >
                    <CircleStop className="w-7 h-7 text-white" />
                  </button>
                </div>
                <span className="text-sm font-medium text-crimson-600 dark:text-crimson-400">Listening...</span>
              </motion.div>
            ) : phase === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-brass-500/20 flex items-center justify-center">
                  <div className="flex gap-1">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-brass-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-brass-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-2 h-2 rounded-full bg-brass-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-brass-600 dark:text-brass-400">Processing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <button
                    onClick={handleMicClick}
                    className="w-16 h-16 rounded-full bg-brass-500 flex items-center justify-center shadow-lg shadow-brass-500/25 hover:bg-brass-600 transition-colors"
                    aria-label="Tap to speak"
                  >
                    <Mic className="w-7 h-7 text-white" />
                  </button>
                </div>
                <span className="text-sm font-medium text-ink-500 dark:text-parchment-400">
                  {conversation.length > 0 ? 'Tap to ask another question' : 'Tap to speak'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
