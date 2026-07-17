import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext.jsx'

export default function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
