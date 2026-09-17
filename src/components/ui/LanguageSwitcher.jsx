import { useTranslation } from 'react-i18next'

function LanguageBtn() {
  const { i18n, t } = useTranslation()
  const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
  return (
    <div
      className="flex justify-center gap-2"
      role="group"
      aria-label={t('language.selectorLabel')}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
        className="control-btn"
      >
        {currentLang === 'en' ? 'عربي' : 'EN'}
      </button>
    </div>
  )
}

export default LanguageBtn
