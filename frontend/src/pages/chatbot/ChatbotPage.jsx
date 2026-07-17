import React, { useState, useRef, useEffect, useCallback } from 'react'
import { PanelLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ChatBubble from '../../components/chatbot/ChatBubble.jsx'
import TypingIndicator from '../../components/chatbot/TypingIndicator.jsx'
import ChatInput from '../../components/chatbot/ChatInput.jsx'
import ChatSidebar from '../../components/chatbot/ChatSidebar.jsx'
import SuggestedQuestions from '../../components/chatbot/SuggestedQuestions.jsx'
import LanguageSelector from '../../components/common/LanguageSelector.jsx'
import useLanguage from '../../hooks/useLanguage.js'
import { sendChatMessage } from '../../services/api.js'

function createSession() {
  return { id: crypto.randomUUID(), title: 'New conversation', messages: [] }
}

export default function ChatbotPage() {
  const [sessions, setSessions] = useState(() => [createSession()])
  const [activeId, setActiveId] = useState(() => sessions[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { language } = useLanguage()
  const abortRef = useRef(null)
  const scrollRef = useRef(null)

  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeSession?.messages, isGenerating])

  const updateSession = (id, updater) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)))
  }

  const handleSend = useCallback(
    async (text) => {
      const userMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date().toISOString() }
      updateSession(activeId, (s) => ({
        ...s,
        title: s.messages.length === 0 ? text.slice(0, 40) : s.title,
        messages: [...s.messages, userMessage],
      }))

      setIsGenerating(true)
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const reply = await sendChatMessage(text, { signal: controller.signal })
        updateSession(activeId, (s) => ({ ...s, messages: [...s.messages, reply] }))
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Something went wrong. Please try again.')
        }
      } finally {
        setIsGenerating(false)
      }
    },
    [activeId]
  )

  const handleStop = () => {
    abortRef.current?.abort()
    setIsGenerating(false)
  }

  const handleNewChat = () => {
    const session = createSession()
    setSessions((prev) => [session, ...prev])
    setActiveId(session.id)
    setSidebarOpen(false)
  }

  const handleDeleteChat = (id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (next.length === 0) {
        const fresh = createSession()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  const handleClearChat = () => {
    updateSession(activeId, (s) => ({ ...s, messages: [], title: 'New conversation' }))
    toast.success('Conversation cleared')
  }

  return (
    <div className="flex h-full bg-parchment-100 dark:bg-ink-950">
      <ChatSidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id)
          setSidebarOpen(false)
        }}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-ink-900/8 dark:border-parchment-100/10 bg-parchment-100/80 dark:bg-ink-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-600 dark:text-parchment-300 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10"
              aria-label="Open chat history"
            >
              <PanelLeft className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="font-display font-semibold text-ink-900 dark:text-parchment-100">AI Legal Chatbot</h1>
              <p className="text-xs text-ink-400 dark:text-parchment-500">Legal topics only · {activeSession.messages.length} messages</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector compact />
            <button
              onClick={handleClearChat}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 dark:text-parchment-300 hover:bg-crimson-500/10 hover:text-crimson-600 transition-colors"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6">
          {activeSession.messages.length === 0 ? (
            <SuggestedQuestions onSelect={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {activeSession.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isGenerating && <TypingIndicator />}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-5 pt-2">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} isGenerating={isGenerating} onStop={handleStop} langCode={language} />
          </div>
        </div>
      </div>
    </div>
  )
}
