import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'pl' as const, label: 'Polski' },
    { code: 'en' as const, label: 'English' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (code: typeof languages[0]['code']) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        title={t('navigation.language')}
        className="hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-slate-100 transition-colors ${
                  language === lang.code ? 'bg-slate-50 font-medium text-primary' : ''
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && (
                  <span className="text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
