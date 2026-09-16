import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaPlay,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaChartLine,
  FaGlobe,
  FaTv,
  FaFilm,
} from 'react-icons/fa'
import { useMediaDetails } from '../hooks/useMovies.js'
import {
  getImageUrl,
  TMDB_IMAGE_SIZES,
  FALLBACK_POSTER,
  formatRunTime,
  formatCurrency,
  formatFullDate,
} from '../utils/constants.js'
import RatingBadge from '../components/ui/RatingBadge.jsx'
import FavoriteBadge from '../components/ui/FavoriteBadge.jsx'
import Watchlist from '../components/ui/Watchlist.jsx'
import VideoModal from '../components/ui/VideoModal.jsx'
import CommentsSection from '../components/library/CommentsSection.jsx'
import CastCrewRow from '../components/media/CastCrewRow.jsx'
import MediaCarousel from '../components/media/MediaCarousel.jsx'

function MediaDetailsPage() {
  const { mediaType = 'movie', id } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.language === 'ar' || document.documentElement.dir === 'rtl'

  const {
    data: media,
    isLoading,
    isError,
    error,
  } = useMediaDetails(mediaType, id)

  const [isTrailerOpen, setTrailerOpen] = useState(false)

  // Scroll to top whenever media ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id, mediaType])

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Backdrop Skeleton */}
        <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl bg-surface border border-border/40" />
        {/* Content Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 -mt-24 sm:-mt-32 relative z-10 px-4">
          <div className="w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-2xl bg-surface-elevated shrink-0 border border-border/40 shadow-xl" />
          <div className="flex-1 space-y-4 pt-6">
            <div className="h-8 bg-surface-elevated rounded-lg w-3/4" />
            <div className="h-4 bg-surface-elevated rounded w-1/2" />
            <div className="h-20 bg-surface-elevated rounded-lg w-full" />
            <div className="flex gap-3 pt-2">
              <div className="h-10 bg-surface-elevated rounded-xl w-32" />
              <div className="h-10 bg-surface-elevated rounded-xl w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !media) {
    return (
      <div className="py-20 text-center space-y-4 rounded-2xl bg-surface/40 border border-border/40 p-6">
        <p className="text-lg font-semibold text-accent">
          {error?.message || t('media.untitled')}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm"
        >
          {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{t('details.back')}</span>
        </button>
      </div>
    )
  }

  const title =
    media.title ||
    media.name ||
    media.original_title ||
    media.original_name ||
    t('media.untitled')

  const releaseDateStr = media.release_date || media.first_air_date
  const formattedDate = formatFullDate(
    releaseDateStr,
    isRTL ? 'ar-SA' : 'en-US'
  )

  const runtimeText = media.runtime
    ? formatRunTime(media.runtime, t)
    : media.episode_run_time?.[0]
      ? formatRunTime(media.episode_run_time[0], t)
      : null

  const backdropUrl = media.backdrop_path
    ? getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LG)
    : null

  const posterUrl = media.poster_path
    ? getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_DETAIL)
    : FALLBACK_POSTER

  const castMembers = media.credits?.cast?.slice(0, 18) || []

  // Filter prominent crew members (Director, Writer, Screenplay, Producer)
  const prominentJobs = [
    'Director',
    'Writer',
    'Screenplay',
    'Producer',
    'Executive Producer',
    'Director of Photography',
    'Original Music Composer',
  ]
  const crewMembers =
    media.credits?.crew
      ?.filter((c) => prominentJobs.includes(c.job))
      ?.slice(0, 15) || []

  const recommendations =
    media.recommendations?.results?.length > 0
      ? media.recommendations.results
      : media.similar?.results?.length > 0
        ? media.similar.results
        : []

  const hasTrailer = media.videos?.results?.some(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Cinematic Hero Header with Backdrop */}
      <div className="relative w-full min-h-[300px] sm:min-h-[380px] md:min-h-[440px] rounded-2xl overflow-hidden bg-surface border border-border/40 shadow-xl">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 start-4 z-20">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface/80 hover:bg-surface border border-border/60 text-foreground backdrop-blur-md transition-colors text-sm shadow-md cursor-pointer"
            aria-label={t('details.back')}
          >
            {isRTL ? <FaArrowRight /> : <FaArrowLeft />}
            <span className="font-medium">{t('details.back')}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Details Content Overlay */}
      <div className="relative z-10 -mt-28 sm:-mt-40 md:-mt-48 flex flex-col md:flex-row gap-6 sm:gap-8 px-2 sm:px-4">
        {/* Left Column: Portrait Poster & Quick Library Badges */}
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="relative w-48 sm:w-60 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden bg-surface-elevated border border-border/60 shadow-2xl">
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_POSTER
              }}
            />
            {/* Quick Actions Top-Start Corner */}
            <div className="absolute top-3 start-3 z-10 flex gap-2 drop-shadow-lg">
              <FavoriteBadge media={media} />
              <Watchlist media={media} />
            </div>
            {/* Rating Badge Top-End Corner */}
            {media.vote_average !== undefined && (
              <div className="absolute top-3 end-3 z-10 drop-shadow-lg">
                <RatingBadge rating={media.vote_average} size="md" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Metadata, Overview, Action Buttons */}
        <div className="flex-1 space-y-5 text-start pt-2 md:pt-16">
          {/* Metadata Badges (Rating, Year, Runtime, MediaType) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {media.vote_average !== undefined && (
              <RatingBadge rating={media.vote_average} size="md" />
            )}
            {releaseDateStr && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface/80 border border-border/50 text-xs font-mono text-muted">
                <FaCalendarAlt className="text-primary/70" />
                <span>{releaseDateStr.slice(0, 4)}</span>
              </span>
            )}
            {runtimeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface/80 border border-border/50 text-xs font-mono text-muted">
                <FaClock className="text-primary/70" />
                <span>{runtimeText}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase">
              {mediaType === 'tv' ? <FaTv /> : <FaFilm />}
              <span>
                {mediaType === 'tv' ? t('media.shows') : t('media.movies')}
              </span>
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {media.tagline && (
              <p className="text-sm sm:text-base italic text-muted/90">
                "{media.tagline}"
              </p>
            )}
          </div>

          {/* Genre Pills */}
          {media.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {media.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border/60 text-foreground/90"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons: Watch Trailer & Library toggles */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {hasTrailer && (
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md text-sm cursor-pointer"
              >
                <FaPlay className="text-xs" />
                <span>{t('details.playTrailer')}</span>
              </button>
            )}
            <div className="scale-110 flex items-center gap-2">
              <FavoriteBadge media={media} />
              <Watchlist media={media} />
            </div>
          </div>

          {/* Interactive User Star Rating & Comments Section */}
          <div className="pt-2 max-w-xl">
            <CommentsSection media={media} />
          </div>
          {/* Overview Synopsis */}
          <div className="space-y-2 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {t('media.overview')}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted/90">
              {media.overview || t('media.noOverview')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Key Facts & Financial Stats Grid */}
      <div className="space-y-3 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          {t('details.information')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Status */}
          {media.status && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block">
                {t('details.status')}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {media.status}
              </span>
            </div>
          )}

          {/* Release Date */}
          {formattedDate !== 'N/A' && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block flex items-center gap-1">
                <FaCalendarAlt className="text-primary/70" />
                {mediaType === 'tv'
                  ? t('details.firstAirDate')
                  : t('details.releaseDate')}
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                {formattedDate}
              </span>
            </div>
          )}

          {/* TV Seasons / Episodes */}
          {mediaType === 'tv' && media.number_of_seasons && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block">
                {t('details.seasons')} / {t('details.episodes')}
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                {media.number_of_seasons} / {media.number_of_episodes || '—'}
              </span>
            </div>
          )}

          {/* Budget */}
          {media.budget > 0 && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block flex items-center gap-1">
                <FaMoneyBillWave className="text-rating-excellent/80" />
                {t('details.budget')}
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                {formatCurrency(media.budget)}
              </span>
            </div>
          )}

          {/* Revenue */}
          {media.revenue > 0 && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block flex items-center gap-1">
                <FaChartLine className="text-primary/80" />
                {t('details.revenue')}
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                {formatCurrency(media.revenue)}
              </span>
            </div>
          )}

          {/* Original Language */}
          {media.original_language && (
            <div className="p-3.5 rounded-xl bg-surface border border-border/40 space-y-1">
              <span className="text-xs text-muted block flex items-center gap-1">
                <FaGlobe className="text-primary/70" />
                {t('details.originalLanguage')}
              </span>
              <span className="text-sm font-semibold text-foreground uppercase">
                {media.original_language}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Top Cast Snap-Scrolling Row */}
      {castMembers.length > 0 && (
        <CastCrewRow title={t('details.cast')} members={castMembers} />
      )}

      {/* 5. Featured Crew Snap-Scrolling Row */}
      {crewMembers.length > 0 && (
        <CastCrewRow
          title={t('details.crew')}
          members={crewMembers}
          isCrew={true}
        />
      )}

      {/* 6. Recommendations / More Like This Carousel */}
      {recommendations.length > 0 && (
        <MediaCarousel
          title={t('details.recommendations')}
          items={recommendations}
          badgeVariant=""
        />
      )}

      {/* 7. YouTube Trailer Modal */}
      <VideoModal
        isOpen={isTrailerOpen}
        onClose={() => setTrailerOpen(false)}
        videos={media.videos?.results || []}
        title={title}
      />
    </div>
  )
}

export default MediaDetailsPage
