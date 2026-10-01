import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useTrending,
  useTopRated,
  usePopular,
  useNewReleases,
  useByGenre,
} from '../hooks/useMovies.js'
import { CURATED_GENRES, openMediaDetail } from '../utils/constants.js'
import useStore from '../store/useStore.js'
import MediaCarousel from '../components/media/MediaCarousel.jsx'
import HeroBanner from '../components/media/HeroBanner.jsx'
import TrendingSpotlight from '../components/media/TrendingSpotlight.jsx'
import MediaTypeSwitcher from '../components/ui/MediaTypeSwitcher.jsx'
import { useNavigate } from 'react-router-dom'

function GenreCarouselSection({ genre, mediaType, onClick }) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '350px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  const genreId = mediaType === 'tv' ? genre.tvId : genre.movieId
  const { data, isLoading } = useByGenre(mediaType, genreId, {
    enabled: isVisible,
  })

  return (
    <div ref={containerRef} className="min-h-[220px]">
      <MediaCarousel
        title={t(genre.labelKey)}
        items={data?.results || []}
        isLoading={isVisible ? isLoading : true}
        seeAllLink={`/discover/${genre.key}`}
        badgeVariant={genre.badgeVariant}
        onCardClick={onClick}
      />
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const mediaType = useStore((state) => state.mediaType)

  const handleOpenMediaDetail = (media) => {
    openMediaDetail(navigate, media, mediaType)
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

      {/* Trending Spotlight Showcase (#2 onwards) */}
      <TrendingSpotlight
        items={trending.data?.results?.slice(1) || []}
        isLoading={trending.isLoading}
        onCardClick={handleOpenMediaDetail}
      />

      {/* 4 Primary Discovery Carousels */}
      <MediaCarousel
        title={t('media.trending') + ' ' + t('general.now')}
        items={trending.data?.results || []}
        isLoading={trending.isLoading}
        seeAllLink="/discover/trending"
        badgeVariant="trending"
        onCardClick={handleOpenMediaDetail}
      />

      {/* Trending Spotlight Showcase (#2 onwards) */}

      <MediaCarousel
        title={t('media.popular') + ' ' + t('general.now')}
        items={popular.data?.results || []}
        isLoading={popular.isLoading}
        seeAllLink="/discover/popular"
        badgeVariant="popular"
        onCardClick={handleOpenMediaDetail}
      />
      <MediaCarousel
        title={t('media.top_rated')}
        items={topRated.data?.results || []}
        isLoading={topRated.isLoading}
        seeAllLink="/discover/top-rated"
        badgeVariant="top_rated"
        onCardClick={handleOpenMediaDetail}
      />
      <MediaCarousel
        title={t('media.new_releases')}
        items={newReleases.data?.results || []}
        isLoading={newReleases.isLoading}
        seeAllLink="/discover/new-releases"
        badgeVariant="new_releases"
        onCardClick={handleOpenMediaDetail}
      />

      {/* Curated Genre Carousels */}
      <div id="genres" className="space-y-6 scroll-mt-24">
        {CURATED_GENRES.map((genre) => (
          <GenreCarouselSection
            key={genre.key}
            genre={genre}
            mediaType={mediaType}
            onClick={handleOpenMediaDetail}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage
