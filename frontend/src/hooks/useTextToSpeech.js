import { useState, useCallback, useRef } from 'react'
import { api } from '../services/api.js'

export default function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  const speak = useCallback(async (text, language = 'en') => {
    setError(null)
    setIsPlaying(true)
    try {
      const res = await api.post('/tts', { text, language })
      const url = res.data.data.audio_file_url
      setAudioUrl(url)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setIsPlaying(false)
        audioRef.current = null
      }
      audio.onerror = () => {
        setError('Failed to play audio')
        setIsPlaying(false)
      }
      await audio.play()
    } catch (err) {
      setError('Text-to-speech failed. Using browser speech fallback.')
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'en' ? 'en-IN' : `${language}-IN`
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => {
        setIsPlaying(false)
        setError('Speech synthesis unavailable')
      }
      window.speechSynthesis.speak(utterance)
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  return { speak, stop, isPlaying, audioUrl, error }
}
