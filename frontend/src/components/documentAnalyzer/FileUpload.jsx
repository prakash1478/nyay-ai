import React, { useCallback, useState, useRef } from 'react'
import { UploadCloud, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { MAX_FILE_SIZE_MB } from '../../utils/constants.js'

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg']

export default function FileUpload({ onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const validateAndEmit = useCallback(
    (file) => {
      if (!file) return
      const ext = `.${file.name.split('.').pop().toLowerCase()}`
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        toast.error('Unsupported file type. Please upload PDF, DOCX, TXT, or an image.')
        return
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File exceeds the ${MAX_FILE_SIZE_MB}MB limit.`)
        return
      }
      onFileSelected(file)
    },
    [onFileSelected]
  )

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    validateAndEmit(e.dataTransfer.files?.[0])
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 sm:p-14 text-center ${
        isDragging
          ? 'border-brass-500 bg-brass-500/5'
          : 'border-ink-900/15 dark:border-parchment-100/15 hover:border-brass-400 hover:bg-brass-500/5'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
      <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-ink-fade flex items-center justify-center shadow-soft">
        <UploadCloud className="w-7 h-7 text-brass-400" />
      </div>
      <p className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100 mb-1.5">
        Drag & drop your document
      </p>
      <p className="text-sm text-ink-500 dark:text-parchment-400 mb-4">or click to browse from your device</p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['PDF', 'DOCX', 'TXT', 'Image'].map((type) => (
          <span
            key={type}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-ink-900/5 dark:bg-parchment-100/10 text-ink-500 dark:text-parchment-300"
          >
            <FileText className="w-3 h-3" /> {type}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-ink-400 dark:text-parchment-500 mt-4">Max file size {MAX_FILE_SIZE_MB}MB</p>
    </div>
  )
}
