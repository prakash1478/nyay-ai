import React, { createContext, useEffect, useState } from 'react'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'sd', label: 'Sindhi', native: 'سنڌي' },
  { code: 'sa', label: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'doi', label: 'Dogri', native: 'डोगरी' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'brx', label: 'Bodo', native: 'बर' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
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
