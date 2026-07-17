import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, Scan, RotateCcw, Check, Upload } from 'lucide-react'
import ScannerOverlay from './ScannerOverlay.jsx'

export default function DocumentScanner({ onScanComplete, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [state, setState] = useState('init')
  const [error, setError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const openCamera = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setState('preview')
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access or use file upload.')
      } else {
        setError('Camera unavailable. Please use file upload instead.')
      }
      setState('error')
    }
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(dataUrl)
    stopStream()
    setState('captured')
  }, [stopStream])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    openCamera()
  }, [openCamera])

  const usePhoto = useCallback(() => {
    if (!capturedImage) return
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `scanned-document-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })
        onScanComplete(file)
      })
      .catch(() => {
        setError('Failed to process captured image.')
      })
  }, [capturedImage, onScanComplete])

  useEffect(() => {
    return () => stopStream()
  }, [stopStream])

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) {
        onScanComplete(file)
      }
    },
    [onScanComplete]
  )

  if (state === 'loading') {
    return (
      <div className="rounded-2xl border border-ink-900/10 dark:border-parchment-100/10 bg-white dark:bg-ink-800 overflow-hidden">
        <div className="aspect-[4/3] bg-ink-900/5 dark:bg-parchment-100/5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Scan className="w-8 h-8 text-brass-400 animate-pulse" />
            <p className="text-sm text-ink-500 dark:text-parchment-400">Initializing camera...</p>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="rounded-2xl border border-ink-900/10 dark:border-parchment-100/10 bg-white dark:bg-ink-800 overflow-hidden">
        <div className="aspect-[4/3] bg-ink-900/5 dark:bg-parchment-100/5 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <Camera className="w-10 h-10 text-ink-400" />
          <div>
            <p className="text-sm font-semibold text-ink-800 dark:text-parchment-100 mb-1">Camera unavailable</p>
            <p className="text-xs text-ink-500 dark:text-parchment-400 mb-4">{error}</p>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brass-500 text-white text-sm font-medium hover:bg-brass-600 transition-colors">
            <Upload className="w-4 h-4" />
            Upload a file instead
            <input type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            onClick={openCamera}
            className="text-xs text-brass-600 dark:text-brass-400 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (state === 'init') {
    return (
      <div className="rounded-2xl border border-ink-900/10 dark:border-parchment-100/10 bg-white dark:bg-ink-800 overflow-hidden">
        <div className="aspect-[4/3] bg-ink-900/5 dark:bg-parchment-100/5 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <span className="w-16 h-16 rounded-2xl bg-brass-500/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-brass-500" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100 mb-1">
              Scan with Camera
            </p>
            <p className="text-sm text-ink-500 dark:text-parchment-400 mb-1">
              Use your device camera to capture a document
            </p>
          </div>
          <button
            onClick={openCamera}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brass-500 text-white text-sm font-medium hover:bg-brass-600 transition-colors shadow-soft"
          >
            <Camera className="w-4 h-4" />
            Open Camera
          </button>
          <div className="flex items-center gap-3 w-full max-w-xs">
            <span className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
            <span className="text-xs text-ink-400 dark:text-parchment-500">or</span>
            <span className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-brass-600 dark:text-brass-400 hover:underline">
            <Upload className="w-4 h-4" />
            Upload from device
            <input type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    )
  }

  if (state === 'captured') {
    return (
      <div className="rounded-2xl border border-ink-900/10 dark:border-parchment-100/10 bg-white dark:bg-ink-800 overflow-hidden">
        <div className="relative">
          <img
            src={capturedImage}
            alt="Captured document"
            className="w-full aspect-[4/3] object-contain bg-black"
          />
        </div>
        <div className="flex items-center justify-center gap-3 p-4">
          <button
            onClick={retakePhoto}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-900/15 dark:border-parchment-100/15 text-sm font-medium text-ink-700 dark:text-parchment-300 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
          <button
            onClick={usePhoto}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brass-500 text-white text-sm font-medium hover:bg-brass-600 transition-colors"
          >
            <Check className="w-4 h-4" />
            Use Photo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink-900/10 dark:border-parchment-100/10 bg-black overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-[4/3] object-cover"
        />
        <ScannerOverlay />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex items-center justify-center p-4 bg-white dark:bg-ink-800">
        <button
          onClick={capturePhoto}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brass-500 text-white text-sm font-medium hover:bg-brass-600 transition-colors shadow-soft"
        >
          <Camera className="w-4 h-4" />
          Capture
        </button>
      </div>
    </div>
  )
}
