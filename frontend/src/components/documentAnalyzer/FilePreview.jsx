import React from 'react'
import { FileText, Image as ImageIcon, X, FileType } from 'lucide-react'
import { formatBytes } from '../../utils/helpers.js'

function iconFor(fileName) {
  const ext = fileName.split('.').pop().toLowerCase()
  if (['png', 'jpg', 'jpeg'].includes(ext)) return ImageIcon
  if (ext === 'docx') return FileType
  return FileText
}

export default function FilePreview({ file, progress, isAnalyzing, onDelete }) {
  const Icon = iconFor(file.name)

  return (
    <div className="card p-5 flex items-center gap-4">
      <span className="w-12 h-12 rounded-xl bg-brass-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-5.5 h-5.5 text-brass-600 dark:text-brass-400" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100 truncate">{file.name}</p>
        <p className="text-xs text-ink-400 dark:text-parchment-500 mb-2">{formatBytes(file.size)}</p>
        {isAnalyzing && (
          <div className="w-full h-1.5 rounded-full bg-ink-900/8 dark:bg-parchment-100/10 overflow-hidden">
            <div
              className="h-full bg-gold-fade transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {isAnalyzing ? (
        <span className="text-xs font-semibold text-brass-600 dark:text-brass-400 shrink-0">{progress}%</span>
      ) : (
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-crimson-600 hover:bg-crimson-500/10 transition-colors shrink-0"
          aria-label="Delete file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
