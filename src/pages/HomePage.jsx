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
import MediaCardSkeleton from '../components/media/MediaCardSkeleton.jsx'
import MediaCarousel from '../components/media/MediaCarousel.jsx'
import HeroBanner from '../components/media/HeroBanner.jsx'
import { FaSearch } from 'react-icons/fa'

function GenreCarouselSection({ genre, mediaType }) {
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
    />
  )
}

function HomePage() {
  const { t } = useTranslation()
  const mediaType = useStore((state) => state.mediaType)

  // Primary Discovery Queries
  const trending = useTrending(mediaType)
  const topRated = useTopRated(mediaType)
  const popular = usePopular(mediaType)
  const newReleases = useNewReleases(mediaType)

  const isLoading =
    trending.isLoading ||
    topRated.isLoading ||
    popular.isLoading ||
    newReleases.isLoading

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
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      )}

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
      />
      <MediaCarousel
        title={t('media.popular') + ' ' + t('general.now')}
        items={popular.data?.results || []}
        isLoading={popular.isLoading}
        seeAllLink="/discover/popular"
        badgeVariant="popular"
      />
      <MediaCarousel
        title={t('media.top_rated')}
        items={topRated.data?.results || []}
        isLoading={topRated.isLoading}
        seeAllLink="/discover/top-rated"
        badgeVariant="top_rated"
      />
      <MediaCarousel
        title={t('media.new_releases')}
        items={newReleases.data?.results || []}
        isLoading={newReleases.isLoading}
        seeAllLink="/discover/new-releases"
        badgeVariant="new_releases"
      />

      {CURATED_GENRES.map((genre) => (
        <GenreCarouselSection
          key={genre.key}
          genre={genre}
          mediaType={mediaType}
        />
      ))}
    </div>
  )
}

export default HomePage
