import { memo } from 'react'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore.js'

function FavoriteBadge({ media }) {
  const { t } = useTranslation()
  const id = media?.id
  const isFavorite = useStore((state) => Boolean(id && state.favorites[id]))
  const toggleFavorite = useStore((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (media) toggleFavorite(media)
      }}
      aria-label={
        isFavorite
          ? t('media.removeFromFavorites', 'Remove from favorites')
          : t('media.addToFavorites', 'Add to favorites')
      }
      className="p-1.5 rounded-full bg-surface/80 backdrop-blur-sm border border-border/50 text-foreground hover:scale-115 hover:drop-shadow-[0_0_8px_rgba(215,168,71,0.7)] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary touch-manipulation"
    >
      {isFavorite ? (
        <FaHeart className="text-xs sm:text-sm text-accent drop-shadow-[0_0_6px_rgba(177,62,80,0.6)]" />
      ) : (
        <FaRegHeart className="text-xs sm:text-sm text-foreground/80 hover:text-primary transition-colors" />
      )}
    </button>
  )
}

export default memo(FavoriteBadge)

