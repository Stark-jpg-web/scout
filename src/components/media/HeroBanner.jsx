import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaHeart, FaInfoCircle } from 'react-icons/fa'
import { getImageUrl, TMDB_IMAGE_SIZES } from '../../utils/constants.js'
import RatingBadge from '../ui/RatingBadge.jsx'
import { formatDate } from '../../utils/constants.js'
import FavoriteBadge from '../ui/FavoriteBadge.jsx'
import Watchlist from '../ui/Watchlist.jsx'
import useLibrary from '../../hooks/useLibrary.js'

function HeroBanner({ media, isLoading = false }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useLibrary(media)

  if (isLoading) {
    return (
      <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl bg-surface animate-pulse mb-8 border border-border/40" />
    )
  }

  if (!media) return null

  const title =
    media.title ||
    media.name ||
    media.original_title ||
    media.original_name ||
    t('media.untitled')
  const date = formatDate(media)
  const mediaType = media.title ? 'movie' : 'tv'
  const detailUrl = `/${mediaType}/${media.id}`

  return (
    <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] rounded-2xl overflow-hidden bg-surface flex flex-col justify-end p-6 sm:p-8 md:p-10 mb-8 border border-border/40 shadow-xl group">
      <div className="absolute scale-125 top-4 start-4 z-10 flex gap-2">
        <FavoriteBadge media={media} />
        <Watchlist media={media} />
      </div>
      {/* 1. Backdrop Image with High-Res Sizing */}
      {media.backdrop_path && (
        <img
          src={getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LG)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
        />
      )}

      {/* 2. Cinematic Gradient Scrim (Bottom & Side Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent sm:bg-gradient-to-r sm:rtl:bg-gradient-to-l sm:from-background sm:via-background/80 sm:to-transparent" />

      {/* 3. Foreground Content */}
      <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4 text-start">
        {/* Rating & Year Badges */}
        <div className="flex items-center gap-2">
          {media.vote_average !== undefined && (
            <RatingBadge rating={media.vote_average} size="md" />
          )}
          {date && (
            <span className="px-2.5 py-1 rounded-lg bg-surface/80 border border-border/50 text-xs font-mono text-muted">
              {date}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            #1 {t('media.trending')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground line-clamp-2">
          {title}
        </h1>

        {/* Overview Excerpt */}
        {media.overview && (
          <p className="text-sm sm:text-base text-muted/90 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {media.overview}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md text-sm"
          >
            <FaInfoCircle className="text-base" />
            <span>{t('media.viewDetails')}</span>
          </Link>

          <button
            type="button"
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 shadow-sm text-sm cursor-pointer ${
              isFavorite
                ? 'bg-surface-elevated border-accent/60 text-accent font-semibold'
                : 'bg-surface/80 hover:bg-surface border-border text-foreground'
            }`}
          >
            <FaHeart className={isFavorite ? 'text-accent' : 'text-accent/80'} />
            <span>
              {isFavorite
                ? t('favorites.title', 'Favorited')
                : t('media.addToFavorites', 'Add to Favorites')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
