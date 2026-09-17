import { useTranslation } from 'react-i18next'
import { FaFilm, FaTv } from 'react-icons/fa'
import useStore from '../../store/useStore'

function MediaTypeSwitcher({ className = '', size = 'normal' }) {
  const { t } = useTranslation()
  const mediaType = useStore((state) => state.mediaType)
  const toggleMediaType = useStore((state) => state.toggleMediaType)

  const isSmall = size === 'sm'

  return (
    <div
      role="group"
      aria-label={t('media.all', 'Media Type')}
      className={`inline-flex items-center p-1 rounded-2xl bg-surface/80 border border-border/70 backdrop-blur-md shadow-sm ${className}`}
    >
      {/* Movies Button */}
      <button
        type="button"
        onClick={() => mediaType !== 'movie' && toggleMediaType()}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
          isSmall ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
        } ${
          mediaType === 'movie'
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm scale-[1.02]'
            : 'text-muted hover:text-foreground hover:bg-surface-elevated/50'
        }`}
      >
        <FaFilm className={isSmall ? 'text-xs' : 'text-sm'} />
        <span>{t('media.movies')}</span>
      </button>

      {/* TV Shows Button */}
      <button
        type="button"
        onClick={() => mediaType !== 'tv' && toggleMediaType()}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
          isSmall ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
        } ${
          mediaType === 'tv'
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm scale-[1.02]'
            : 'text-muted hover:text-foreground hover:bg-surface-elevated/50'
        }`}
      >
        <FaTv className={isSmall ? 'text-xs' : 'text-sm'} />
        <span>{t('media.shows')}</span>
      </button>
    </div>
  )
}

export default MediaTypeSwitcher
