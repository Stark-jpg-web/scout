import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSun, FaMoon, FaGlobe, FaFilm } from 'react-icons/fa'
import SettingsDropdown from '../ui/SettingsDropdown'
import useStore from '../../store/useStore'

function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const theme = useStore((state) => state.theme)
  const toggleTheme = useStore((state) => state.toggleTheme)

  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
  const isArabic = currentLang.startsWith('ar')

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const navLinks = [
    { to: '/', label: t('navigation.discover'), end: true },
    { to: '/search', label: t('navigation.search') },
    {
      to: '/favorites',
      label: t('navigation.favorites'),
    },
    { to: '/watchlist', label: t('navigation.watchlist') },
  ]

  const getNavLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-surface-elevated text-primary font-semibold shadow-sm'
        : 'text-muted hover:text-foreground hover:bg-surface-elevated/60'
    }`

  const getMobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-surface-muted text-primary font-semibold'
        : 'text-foreground hover:bg-surface-elevated text-muted'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground transition-all hover:text-primary group"
          >
            <FaFilm className="text-primary text-xl group-hover:scale-110 transition-transform duration-300" />
            <span className="bg-gradient-to-r from-primary via-[#f3d999] to-primary bg-clip-text text-transparent font-black">
              {t('app.name')}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1.5"
            aria-label={t('navigation.mainLabel')}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={getNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Settings Dropdown & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop & Mobile Settings Popover */}
          <div className="hidden md:block">
            <SettingsDropdown />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <span className="text-xl leading-none">✕</span>
            ) : (
              <span className="text-xl leading-none">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-t border-border bg-surface/98 px-4 py-5 shadow-2xl transition-all duration-200"
        >
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={getMobileNavLinkClass}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Settings Controls */}
          <div className="mt-5 pt-4 border-t border-border space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted px-1">
              {t('settings.title', 'Preferences')}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-muted/60 border border-border text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <FaSun className="text-primary text-sm" />
                    <span>{t('settings.themeLight', 'Light')}</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-primary text-sm" />
                    <span>{t('settings.themeDark', 'Dark')}</span>
                  </>
                )}
              </button>

              {/* Language Switch */}
              <button
                type="button"
                onClick={() => i18n.changeLanguage(isArabic ? 'en' : 'ar')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-muted/60 border border-border text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
              >
                <FaGlobe className="text-primary text-sm" />
                <span>{isArabic ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
