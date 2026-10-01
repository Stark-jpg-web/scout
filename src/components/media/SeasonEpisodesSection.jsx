import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaPlay,
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'
import { useTvSeason } from '../../hooks/useMovies.js'
import { fetchEpisodeVideos } from '../../services/tmdb/movieApi.js'
import {
  getImageUrl,
  TMDB_IMAGE_SIZES,
  FALLBACK_POSTER,
  formatDate,
  formatFullDate,
  formatRunTime,
  useCurrentLanguage,
} from '../../utils/constants.js'
import VideoModal from '../ui/VideoModal.jsx'

function EpisodeCard({ episode, seasonPoster, onPlayEpisode }) {
  const { t, i18n } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const isArabic = i18n.language?.startsWith('ar')

  const stillUrl = episode.still_path
    ? getImageUrl(episode.still_path, TMDB_IMAGE_SIZES.BACKDROP_SM)
    : seasonPoster
      ? getImageUrl(seasonPoster, TMDB_IMAGE_SIZES.POSTER_CARD)
      : FALLBACK_POSTER

  const airDateStr = episode.air_date
    ? formatFullDate(episode.air_date, isArabic ? 'ar-SA' : 'en-US')
    : null

  const runtimeStr = episode.runtime ? formatRunTime(episode.runtime, t) : null

  const hasLongOverview = (episode.overview?.length || 0) > 160

  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-surface border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:bg-surface-elevated/70">
      {/* Episode Thumbnail / Still with Play Trigger */}
      <div
        onClick={() => onPlayEpisode(episode)}
        className="relative w-full sm:w-56 md:w-64 aspect-video shrink-0 rounded-xl overflow-hidden bg-surface-muted border border-border/40 shadow-sm cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Play ${episode.name || `Episode ${episode.episode_number}`}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onPlayEpisode(episode)
          }
        }}
      >
        <img
          src={stillUrl}
          alt={episode.name || `Episode ${episode.episode_number}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Episode Number Badge */}
        <div className="absolute top-2 start-2 z-10 px-2 py-0.5 rounded-lg bg-background/85 backdrop-blur-md border border-border/60 text-xs font-bold font-mono text-primary shadow-sm">
          {t('details.ep', 'EP')} {episode.episode_number}
        </div>

        {/* Episode Duration Badge */}
        {runtimeStr && (
          <div className="absolute bottom-2 end-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-background/85 backdrop-blur-md border border-border/60 text-[11px] font-medium font-mono text-foreground shadow-sm">
            <FaClock className="text-primary text-[10px]" />
            <span>{runtimeStr}</span>
          </div>
        )}

        {/* Play Icon Scrim on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
            <FaPlay className="text-sm ms-0.5" />
          </div>
        </div>
      </div>

      {/* Episode Metadata & Overview */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Top Line: Title and Rating */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              onClick={() => onPlayEpisode(episode)}
              className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 cursor-pointer"
            >
              <span className="text-primary me-2 font-mono">
                {String(episode.episode_number).padStart(2, '0')}.
              </span>
              {episode.name ||
                `${t('details.episode', 'Episode')} ${episode.episode_number}`}
            </h3>

            {episode.vote_average > 0 && (
              <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-muted/80 border border-border text-xs font-bold font-mono text-rating-good">
                <FaStar className="text-[10px] text-amber-400" />
                <span>{episode.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Sub-line: Air date */}
          {airDateStr && (
            <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
              <FaCalendarAlt className="text-primary/70 text-[11px]" />
              <span>{airDateStr}</span>
            </div>
          )}

          {/* Overview */}
          <p
            className={`text-xs sm:text-sm text-muted/90 leading-relaxed ${
              !isExpanded && hasLongOverview ? 'line-clamp-2' : ''
            }`}
          >
            {episode.overview ||
              t(
                'media.noOverview',
                'No overview available for this episode.'
              )}
          </p>

          {hasLongOverview && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer pt-0.5"
            >
              <span>
                {isExpanded
                  ? t('general.seeLess', 'Show less')
                  : t('general.seeMore', 'Read more')}
              </span>
              {isExpanded ? (
                <FaChevronUp className="text-[10px]" />
              ) : (
                <FaChevronDown className="text-[10px]" />
              )}
            </button>
          )}
        </div>

        {/* Guest Stars Pills */}
        {episode.guest_stars?.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-border/30">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
              {t('details.guestStars', 'Guest Stars')}:
            </span>
            {episode.guest_stars.slice(0, 4).map((star) => (
              <span
                key={star.id}
                className="px-2 py-0.5 rounded-md bg-surface-muted text-[11px] text-foreground font-medium border border-border/50"
              >
                {star.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SeasonEpisodesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-surface border border-border/40"
        >
          <div className="w-full sm:w-56 md:w-64 aspect-video rounded-xl bg-surface-muted shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 bg-surface-muted rounded-md w-2/3" />
            <div className="h-3 bg-surface-muted rounded-md w-1/4" />
            <div className="h-4 bg-surface-muted rounded-md w-full" />
            <div className="h-4 bg-surface-muted rounded-md w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SeasonEpisodesSection({ media }) {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const [isOpen, setIsOpen] = useState(true)

  // Episode Video Modal State
  const [activeVideoModal, setActiveVideoModal] = useState({
    isOpen: false,
    title: '',
    videos: [],
  })

  const seasons = useMemo(() => {
    if (!media?.seasons || !Array.isArray(media.seasons)) return []
    return media.seasons.filter(
      (s) => s.episode_count > 0 || media.seasons.length === 1
    )
  }, [media?.seasons])

  // Default to Season 1, or first available season
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(() => {
    const season1 = seasons.find((s) => s.season_number === 1)
    return season1 ? season1.season_number : seasons[0]?.season_number ?? 1
  })

  const currentSeason = useMemo(() => {
    return (
      seasons.find((s) => s.season_number === selectedSeasonNumber) ||
      seasons[0] ||
      null
    )
  }, [seasons, selectedSeasonNumber])

  // Fetch full season episodes
  const {
    data: seasonData,
    isLoading,
    isError,
  } = useTvSeason(media?.id, selectedSeasonNumber)

  if (!media || seasons.length === 0) {
    return null
  }

  const episodes = seasonData?.episodes || []

  // Handle clicking on an episode preview
  const handlePlayEpisode = async (episode) => {
    const showTitle = media.title || media.name || ''
    const epTitle = episode.name
      ? `${showTitle} — S${selectedSeasonNumber}E${episode.episode_number}: ${episode.name}`
      : `${showTitle} — S${selectedSeasonNumber}E${episode.episode_number}`

    // If episode already contains videos
    if (episode.videos?.results?.length > 0) {
      setActiveVideoModal({
        isOpen: true,
        title: epTitle,
        videos: episode.videos.results,
      })
      return
    }

    // Try fetching episode-specific videos
    try {
      const epVideoData = await fetchEpisodeVideos(
        media.id,
        selectedSeasonNumber,
        episode.episode_number,
        language
      )
      if (epVideoData.results?.length > 0) {
        setActiveVideoModal({
          isOpen: true,
          title: epTitle,
          videos: epVideoData.results,
        })
        return
      }
    } catch (e) {
      console.warn('Could not load episode videos, falling back to show videos:', e)
    }

    // Fallback to show / season videos
    const fallbackVideos = Array.isArray(media.videos)
      ? media.videos
      : media.videos?.results || []

    setActiveVideoModal({
      isOpen: true,
      title: epTitle,
      videos: fallbackVideos,
    })
  }

  return (
    <div className="space-y-6 pt-6 border-t border-border/40">
      {/* Expandable/Foldable Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto text-start cursor-pointer group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30 group-hover:scale-105 transition-transform">
              <FaLayerGroup className="text-base" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <span>{t('details.seasonsAndEpisodes', 'Seasons & Episodes')}</span>
                <span className="text-muted text-sm transition-transform duration-200">
                  {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                {t('details.episodesCount', {
                  count: media.number_of_episodes || episodes.length,
                })}
                {' • '}
                {t('details.seasons', 'Seasons')}:{' '}
                {media.number_of_seasons || seasons.length}
              </p>
            </div>
          </div>
        </button>

        {/* Season Selector Tabs (visible when open) */}
        {isOpen && seasons.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {seasons.map((season) => {
              const isSelected = season.season_number === selectedSeasonNumber
              return (
                <button
                  key={season.id || season.season_number}
                  type="button"
                  onClick={() => setSelectedSeasonNumber(season.season_number)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-102'
                      : 'bg-surface text-foreground border-border hover:bg-surface-elevated hover:border-primary/40'
                  }`}
                >
                  <span>
                    {season.name ||
                      `${t('details.season', 'Season')} ${season.season_number}`}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isSelected
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-surface-muted text-muted'
                    }`}
                  >
                    {season.episode_count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Foldable Content Body */}
      {isOpen && (
        <div className="space-y-6 animate-fade-in">
          {/* Current Season Info Card */}
          {currentSeason && (
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-2xl bg-surface/70 border border-border/50 backdrop-blur-md">
              {currentSeason.poster_path && (
                <img
                  src={getImageUrl(
                    currentSeason.poster_path,
                    TMDB_IMAGE_SIZES.POSTER_CARD
                  )}
                  alt={currentSeason.name}
                  className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-xl border border-border/40 shadow-md shrink-0"
                />
              )}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {currentSeason.name ||
                      `${t('details.season', 'Season')} ${currentSeason.season_number}`}
                  </h3>
                  {currentSeason.air_date && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-muted border border-border text-xs font-mono text-muted">
                      {formatDate(currentSeason)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-xs font-bold font-mono text-primary">
                    {t('details.episodesCount', {
                      count: currentSeason.episode_count,
                    })}
                  </span>
                </div>

                {currentSeason.overview && (
                  <p className="text-xs sm:text-sm text-muted/90 leading-relaxed">
                    {currentSeason.overview}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Episode Cards Grid */}
          <div className="space-y-4">
            {isLoading ? (
              <SeasonEpisodesSkeleton />
            ) : isError ? (
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 text-accent text-center text-sm">
                {t(
                  'details.noEpisodesFound',
                  'Could not load episodes for this season.'
                )}
              </div>
            ) : episodes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface border border-border/40 text-center text-muted text-sm">
                {t(
                  'details.noEpisodesFound',
                  'No episodes found for this season.'
                )}
              </div>
            ) : (
              <div className="space-y-3.5">
                {episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id || episode.episode_number}
                    episode={episode}
                    seasonPoster={currentSeason?.poster_path}
                    onPlayEpisode={handlePlayEpisode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Episode Video Modal */}
      <VideoModal
        isOpen={activeVideoModal.isOpen}
        onClose={() =>
          setActiveVideoModal((prev) => ({ ...prev, isOpen: false }))
        }
        videos={activeVideoModal.videos}
        title={activeVideoModal.title}
      />
    </div>
  )
}

export default SeasonEpisodesSection
