
"use client"

import * as React from "react"
import { Language, translations } from "@/lib/i18n/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: any // Simplified for this implementation
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>('en')
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    // Detect browser language or saved preference
    const saved = localStorage.getItem('app_lang') as Language
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLanguageState(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'fr') {
        setLanguageState('fr')
      } else {
        setLanguageState('en')
      }
    }
    setIsMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app_lang', lang)
  }

  const t = React.useCallback((path: string) => {
    const keys = path.split('.')
    let current: any = translations[language]
    for (const key of keys) {
      if (current[key] === undefined) return path
      current = current[key]
    }
    return current
  }, [language])

  if (!isMounted) return null

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = React.useContext(LanguageContext)
  if (!context) throw new Error("useTranslation must be used within LanguageProvider")
  return context
}
