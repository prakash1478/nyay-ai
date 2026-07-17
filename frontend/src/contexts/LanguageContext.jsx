import React, { createContext, useEffect, useState } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
]

export const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('nyaya_lang') || 'en')

  useEffect(() => {
    localStorage.setItem('nyaya_lang', language)
  }, [language])

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currentLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}
