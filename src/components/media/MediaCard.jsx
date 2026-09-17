import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FALLBACK_POSTER,
  getImageUrl,
  TMDB_IMAGE_SIZES,
  BADGE_CONFIGS,
  formatDate,
} from '../../utils/constants.js'
import RatingBadge from '../ui/RatingBadge.jsx'
import FavoriteBadge from '../ui/FavoriteBadge.jsx'
import Watchlist from '../ui/Watchlist.jsx'

function MediaCard({ media, onClick, badgeVariant = 'trending' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!media) return null
  const title =
    media.title ||
    media.name ||
    media.original_title ||
    media.original_name ||
    t('media.untitled')
  const releaseYear = formatDate(media)
  const badgeConfig = badgeVariant ? BADGE_CONFIGS[badgeVariant] : null
  const mediaType = media.title !== undefined ? 'movie' : 'tv'

  const handleClick = (e) => {
      navigate(`/${mediaType}/${media.id}`)
    }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="media-card w-36 sm:w-44 md:w-52 shrink-0 flex flex-col group gap-3 cursor-pointer select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary  bg-surface p-2.5"
    >
      <div className="media-card-canvas relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-muted border border-border/40 shadow-sm transition-all duration-300 group-hover:scale-103 group-hover:shadow-xl group-hover:border-primary/50">
        <img
          src={getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_CARD)}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 "
        />
        {/* Floating Rating Badge at top-end corner (RTL symmetrical) */}
        {media.vote_average !== undefined && (
          <div className="absolute  top-2 end-2 z-10 drop-shadow-md">
            <RatingBadge size="sm" rating={media.vote_average} />
          </div>
        )}

        {/* Quick Actions: Favorite & Watchlist */}
        <div className="absolute flex flex-col gap-1.5 top-2 start-2 z-10 drop-shadow-md md:flex-row">
          <Watchlist media={media} />
          <FavoriteBadge media={media} />
        </div>
      </div>
      <div className="media-card-metadata text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors space-y-2 text-center ">
        {badgeConfig && (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${badgeConfig.className}`.trim()}
          >
            {t(badgeConfig.labelKey)}
          </span>
        )}
        <h2 className="media-card-title  text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200 text-center ">
          {title}
        </h2>
        <p className="media-card-overview text-[0.6rem] text-muted truncate  line-clamp-3">
          {media.overview || t('media.noOverview')}
        </p>
        <p className="media-card-release-date flex flex-col  text-xs text-muted font-mono ">
          {t('media.release_date')}: {releaseYear}
        </p>
      </div>
    </div>
  )
}
export default MediaCard
