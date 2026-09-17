import { useTranslation } from 'react-i18next'

function BrandLogo({ size = 'default', className = '' }) {
  const { i18n } = useTranslation()

  const lang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ar')
    ? 'ar'
    : 'en'

  const logoSrc = size === 'icon' ? '/favicon.svg' : `/logo-dark.png`

  const sizeClasses = {
    icon: 'w-8 h-8 sm:w-9 sm:h-9 rounded-full',
    default: 'h-10 sm:h-11 w-auto',
    footer: 'h-11 sm:h-12 w-auto',
    xl: 'h-16 sm:h-20 w-auto',
  }

  const cls = sizeClasses[size] || sizeClasses.default

  return (
    <img
      src={logoSrc}
      alt={lang === 'ar' ? 'سكاوت' : 'Scout'}
      draggable="false"
      className={`select-none shrink-0 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-6 hover:rotate-6 ${size === 'icon' ? 'group-hover:rotate-45 drop-shadow-[0_0_10px_rgba(215,168,71,0.5)]' : ''} ${cls} ${className}`}
    />
  )
}

export default BrandLogo
