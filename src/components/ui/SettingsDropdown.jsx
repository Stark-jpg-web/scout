import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCog, FaSun, FaMoon, FaGlobe, FaCheck } from 'react-icons/fa'
import useStore from '../../store/useStore'

function SettingsDropdown() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const theme = useStore((state) => state.theme)
  const toggleTheme = useStore((state) => state.toggleTheme)

  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
  const isArabic = currentLang.startsWith('ar')

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('settings.title', 'Settings & Preferences')}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-surface-elevated border-primary text-primary shadow-sm shadow-primary/20'
            : 'bg-surface border-border text-muted hover:text-foreground hover:bg-surface-elevated hover:border-border/80'
        }`}
      >
        <FaCog
          className={`text-lg transition-transform duration-300 ${
            isOpen ? 'rotate-90 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t('settings.title', 'Preferences')}
          className={`absolute end-0 mt-2.5 w-72 rounded-2xl bg-surface/95 border border-border/80 backdrop-blur-xl p-4 shadow-2xl z-50 transition-all duration-200 ${
            isArabic ? 'text-right' : 'text-left'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {t('settings.title', 'Preferences')}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-muted text-foreground/80 border border-border/40">
              {isArabic ? 'العربية' : 'EN'} • {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Theme Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted flex items-center gap-1.5">
                {theme === 'dark' ? (
                  <FaMoon className="text-primary text-xs" />
                ) : (
                  <FaSun className="text-primary text-xs" />
                )}
                <span>{t('settings.theme', 'Appearance')}</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-muted/60 border border-border/40">
                <button
                  type="button"
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <FaMoon className="text-xs" />
                  <span>{t('settings.themeDark', 'Dark')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <FaSun className="text-xs" />
                  <span>{t('settings.themeLight', 'Light')}</span>
                </button>
              </div>
            </div>

            {/* Language Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted flex items-center gap-1.5">
                <FaGlobe className="text-primary text-xs" />
                <span>{t('settings.language', 'Language')}</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-muted/60 border border-border/40">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    !isArabic
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {!isArabic && <FaCheck className="text-[10px]" />}
                  <span>{t('settings.english', 'English')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ar')}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isArabic
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {isArabic && <FaCheck className="text-[10px]" />}
                  <span>{t('settings.arabic', 'العربية')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsDropdown
