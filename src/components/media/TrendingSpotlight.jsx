import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

import {
  FaFire,
  FaInfoCircle,
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
} from 'react-icons/fa'
import {
  getImageUrl,
  TMDB_IMAGE_SIZES,
  formatDate,
} from '../../utils/constants.js'
import RatingBadge from '../ui/RatingBadge.jsx'
import FavoriteBadge from '../ui/FavoriteBadge.jsx'
import Watchlist from '../ui/Watchlist.jsx'
import useLibrary from '../../hooks/useLibrary.js'

function SpotlightSlide({ media, rank, onCardClick }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useLibrary(media)

  if (!media) return null

  const title =
    media.title ||
    media.name ||
    media.original_title ||
    media.original_name ||
    t('media.untitled')
  const date = formatDate(media)
  const mediaType = media.title !== undefined ? 'movie' : 'tv'
  const detailUrl = `/${mediaType}/${media.id}`
  const backdropUrl = media.backdrop_path
    ? getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LG)
    : media.poster_path
      ? getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_DETAIL)
      : null

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-2xl overflow-hidden bg-surface flex flex-col justify-end p-6 sm:p-8 md:p-10 border border-border/40 shadow-xl group">
      {/* 1. Backdrop Image with Subtle Zoom Animation */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-103 group-[.swiper-slide-active]:scale-102"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-muted" />
      )}

      {/* 2. Cinematic Multi-Layer Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent sm:bg-gradient-to-r sm:rtl:bg-gradient-to-l sm:from-background sm:via-background/80 sm:to-transparent" />

      {/* Top Floating Actions: Rank Tag & Quick Controls */}
      <div className="absolute top-4 start-4 end-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
            <FaFire className="text-accent text-xs animate-pulse" />
            <span>
              #{rank} {t('media.trending')}
            </span>
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 scale-110 origin-top-right rtl:origin-top-left">
          <FavoriteBadge media={media} />
          <Watchlist media={media} />
        </div>
      </div>

      {/* 3. Foreground Content */}
      <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4 text-start">
        {/* Rating, Date & Category */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {media.vote_average !== undefined && (
            <RatingBadge rating={media.vote_average} size="md" />
          )}
          {date && (
            <span className="px-2.5 py-1 rounded-lg bg-surface/80 backdrop-blur-sm border border-border/50 text-xs font-mono text-muted">
              {date}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-surface/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted uppercase">
            {mediaType === 'tv' ? t('media.shows') : t('media.movies')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground line-clamp-2 drop-shadow-md">
          {title}
        </h3>

        {/* Overview Snippet */}
        {media.overview && (
          <p className="text-sm sm:text-base text-muted/90 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {media.overview}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onCardClick ? (
            <button
              type="button"
              onClick={() => onCardClick(media)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md text-sm cursor-pointer"
            >
              <FaInfoCircle className="text-base" />
              <span>{t('media.viewDetails')}</span>
            </button>
          ) : (
            <Link
              to={detailUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-md text-sm cursor-pointer"
            >
              <FaInfoCircle className="text-base" />
              <span>{t('media.viewDetails')}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 shadow-sm text-sm cursor-pointer ${
              isFavorite
                ? 'bg-surface-elevated border-accent/60 text-accent font-semibold'
                : 'bg-surface/80 backdrop-blur-sm hover:bg-surface border-border text-foreground'
            }`}
          >
            <FaHeart
              className={isFavorite ? 'text-accent' : 'text-accent/80'}
            />
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

function TrendingSpotlight({ items = [], isLoading = false, onCardClick }) {
  const { t } = useTranslation()
  const swiperRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const isRTL = document.documentElement.dir === 'rtl'

  // If loading, show matching skeleton
  if (isLoading) {
    return (
      <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl bg-surface animate-pulse mb-8 border border-border/40" />
    )
  }

  if (!items || items.length === 0) return null

  const handlePrev = () => {
    if (!swiperRef.current) return
    swiperRef.current.slidePrev()
  }

  const handleNext = () => {
    if (!swiperRef.current) return
    swiperRef.current.slideNext()
  }

  const toggleAutoplay = () => {
    if (!swiperRef.current) return
    if (isPlaying) {
      swiperRef.current.autoplay?.stop()
      setIsPlaying(false)
    } else {
      swiperRef.current.autoplay?.start()
      setIsPlaying(true)
    }
  }

  const currentRank = activeIndex + 2 // Starts from 2nd trending movie (#2, #3, ...)

  return (
    <section className="relative flex flex-col space-y-3 w-full py-2 mb-4">
      {/* 1. Header Bar with Title, Subtitle, Slide Counter & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <FaFire className="text-base" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {t('media.trendingSpotlight', 'Trending Spotlight')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            {t(
              'media.trendingSpotlightSubtitle',
              'Top trending titles buzzing right now'
            )}
          </p>
        </div>

        {/* Controls: Counter, Play/Pause Toggle & Navigation Chevrons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Active Rank & Slide Counter */}
          <div className="px-3 py-1 rounded-lg bg-surface border border-border/50 text-xs font-mono text-muted flex items-center gap-1.5 shadow-sm">
            <span className="text-primary font-bold">#{currentRank}</span>
            <span className="text-border">/</span>
            <span>#{items.length + 1}</span>
          </div>

          {/* Autoplay Play/Pause Toggle */}
          <button
            type="button"
            onClick={toggleAutoplay}
            aria-label={
              isPlaying
                ? t('media.pauseAutoplay', 'Pause autoplay')
                : t('media.resumeAutoplay', 'Resume autoplay')
            }
            className="carousel-btn flex items-center justify-center min-w-8 min-h-8 text-xs cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <FaPause className="text-primary/70 text-xs" />
            ) : (
              <FaPlay className="text-primary text-xs ms-0.5" />
            )}
          </button>

          {/* Navigation Chevrons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="carousel-btn"
              onClick={handlePrev}
              aria-label="Previous trending spotlight"
            >
              {isRTL ? (
                <FaChevronRight className="text-lg text-primary/70" />
              ) : (
                <FaChevronLeft className="text-lg text-primary/70" />
              )}
            </button>
            <button
              type="button"
              className="carousel-btn"
              onClick={handleNext}
              aria-label="Next trending spotlight"
            >
              {isRTL ? (
                <FaChevronLeft className="text-lg text-primary/70" />
              ) : (
                <FaChevronRight className="text-lg text-primary/70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Spotlight Carousel with Autoplay Progress Bar */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-xl bg-surface">
        {/* Continuous Autoplay Progress Bar at Top */}
        <div className="absolute top-0 inset-x-0 z-30 h-1 bg-border/20 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-primary/80 via-primary to-accent transition-none shadow-[0_0_8px_rgba(215,168,71,0.7)]"
            style={{ width: '0%' }}
          />
        </div>

        {/* Swiper Container */}
        <Swiper
          key={isRTL ? 'spotlight-rtl' : 'spotlight-ltr'}
          dir={isRTL ? 'rtl' : 'ltr'}
          modules={[Autoplay, EffectFade, Navigation, A11y]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={700}
          loop={items.length > 2}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
            if (progressRef.current) {
              progressRef.current.style.width = '0%'
            }
          }}
          onAutoplayTimeLeft={(_swiper, _timeLeft, percentage) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${((1 - percentage) * 100).toFixed(1)}%`
            }
          }}
          className="w-full h-full"
        >
          {items.map((media, index) => (
            <SwiperSlide key={media.id || index}>
              <SpotlightSlide
                media={media}
                rank={index + 2} // Starting from 2nd trending movie
                onCardClick={onCardClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 3. Interactive Quick-Jump Mini Thumbnails Bar */}
        <div className="hidden sm:flex items-center gap-2 p-2 bg-background/70 backdrop-blur-md border-t border-border/40 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider px-2 shrink-0">
            {t('media.trending')}:
          </span>
          {items.slice(0, 10).map((media, idx) => {
            const isSlideActive = activeIndex === idx
            const thumbTitle =
              media.title || media.name || media.original_title || ''
            return (
              <button
                key={media.id || idx}
                type="button"
                onClick={() => swiperRef.current?.slideToLoop(idx)}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-200 cursor-pointer shrink-0 ${
                  isSlideActive
                    ? 'bg-primary/15 border-primary text-primary font-semibold shadow-sm'
                    : 'bg-surface/60 hover:bg-surface border-border/40 text-muted hover:text-foreground'
                }`}
                title={thumbTitle}
              >
                <span
                  className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isSlideActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-elevated text-muted'
                  }`}
                >
                  #{idx + 2}
                </span>
                <span className="max-w-[100px] truncate">{thumbTitle}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrendingSpotlight
