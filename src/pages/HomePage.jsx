import { useTranslation } from 'react-i18next'
import {
  useTrending,
  useTopRated,
  usePopular,
  useNewReleases,
  useByGenre,
} from '../hooks/useMovies.js'
import { CURATED_GENRES } from '../utils/constants.js'
import useStore from '../store/useStore.js'
import MediaCarousel from '../components/media/MediaCarousel.jsx'
import HeroBanner from '../components/media/HeroBanner.jsx'
import MediaTypeSwitcher from '../components/ui/MediaTypeSwitcher.jsx'
import { useNavigate } from 'react-router-dom'

function GenreCarouselSection({ genre, mediaType, onClick }) {
  const { t } = useTranslation()
  const genreId = mediaType === 'tv' ? genre.tvId : genre.movieId
  const { data, isLoading } = useByGenre(mediaType, genreId)

  return (
    <MediaCarousel
      title={t(genre.labelKey)}
      items={data?.results || []}
      isLoading={isLoading}
      seeAllLink={`/discover/${genre.key}`}
      badgeVariant={genre.badgeVariant}
      onCardClick={onClick}
    />
  )
}

function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const mediaType = useStore((state) => state.mediaType)

  function openMediaDetail(media) {
    const type =
      media.media_type ||
      (media.title !== undefined ? 'movie' : 'tv') ||
      mediaType
    navigate(`/${type}/${media.id}`)
  }

  // Primary Discovery Queries
  const trending = useTrending(mediaType)
  const topRated = useTopRated(mediaType)
  const popular = usePopular(mediaType)
  const newReleases = useNewReleases(mediaType)

  const isError =
    trending.isError ||
    topRated.isError ||
    popular.isError ||
    newReleases.isError

  const error =
    trending.error || topRated.error || popular.error || newReleases.error

  const heroItem = trending.data?.results?.[0]

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t('app.name')}
          </h1>
          <p className="text-base text-muted">{t('app.tagline')}</p>
        </div>
        <div>
          <MediaTypeSwitcher />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent">
          <p className="text-sm opacity-80">{error?.message}</p>
        </div>
      )}

      {/* Live Spotlight Hero */}
      <HeroBanner media={heroItem} isLoading={trending.isLoading} />

      {/* 4 Primary Discovery Carousels */}
      <MediaCarousel
        title={t('media.trending') + ' ' + t('general.now')}
        items={trending.data?.results || []}
        isLoading={trending.isLoading}
        seeAllLink="/discover/trending"
        badgeVariant="trending"
        onCardClick={openMediaDetail}
      />
      <MediaCarousel
        title={t('media.popular') + ' ' + t('general.now')}
        items={popular.data?.results || []}
        isLoading={popular.isLoading}
        seeAllLink="/discover/popular"
        badgeVariant="popular"
        onCardClick={openMediaDetail}
      />
      <MediaCarousel
        title={t('media.top_rated')}
        items={topRated.data?.results || []}
        isLoading={topRated.isLoading}
        seeAllLink="/discover/top-rated"
        badgeVariant="top_rated"
        onCardClick={openMediaDetail}
      />
      <MediaCarousel
        title={t('media.new_releases')}
        items={newReleases.data?.results || []}
        isLoading={newReleases.isLoading}
        seeAllLink="/discover/new-releases"
        badgeVariant="new_releases"
        onCardClick={openMediaDetail}
      />

      {/* Curated Genre Carousels */}
      <div id="genres" className="space-y-6 scroll-mt-24">
        {CURATED_GENRES.map((genre) => (
          <GenreCarouselSection
            key={genre.key}
            genre={genre}
            mediaType={mediaType}
            onClick={openMediaDetail}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage
