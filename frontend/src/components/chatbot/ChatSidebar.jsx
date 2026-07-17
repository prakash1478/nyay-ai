import React from 'react'
import { Plus, MessageSquare, Trash2, X } from 'lucide-react'
import { classNames, truncate } from '../../utils/helpers.js'

export default function ChatSidebar({ sessions, activeId, onSelect, onNew, onDelete, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-ink-950/50 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={classNames(
          'fixed lg:static inset-y-0 left-0 z-40 w-72 shrink-0 bg-white dark:bg-ink-900 border-r border-ink-900/8 dark:border-parchment-100/10 flex flex-col transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-ink-900/8 dark:border-parchment-100/10">
          <h3 className="font-display font-semibold text-sm text-ink-900 dark:text-parchment-100">Chat History</h3>
          <button onClick={onClose} className="lg:hidden text-ink-400" aria-label="Close sidebar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={onNew}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-brass-500/50 text-brass-600 dark:text-brass-400 text-sm font-medium py-2.5 hover:bg-brass-500/5 transition-colors"
          >
            <Plus className="w-4 h-4" /> New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-ink-400 dark:text-parchment-500 text-center mt-8 px-4">
              Your conversations will appear here.
            </p>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              className={classNames(
                'group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors',
                activeId === session.id
                  ? 'bg-ink-900 text-parchment-100 dark:bg-brass-500 dark:text-ink-950'
                  : 'text-ink-600 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800'
              )}
              onClick={() => onSelect(session.id)}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 truncate">{truncate(session.title, 28)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(session.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
