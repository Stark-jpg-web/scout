import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  FALLBACK_POSTER,
} from '../../utils/constants.js'
import RatingBadge from '../ui/RatingBadge.jsx'
import FavoriteBadge from '../ui/FavoriteBadge.jsx'
import Watchlist from '../ui/Watchlist.jsx'
import useLibrary from '../../hooks/useLibrary.js'

const AUTOPLAY_DELAY_MS = 5500

function TrendingSpotlight({
  items = [],
  isLoading = false,
  onCardClick,
}) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const isRTL = document.documentElement.dir === 'rtl'

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const thumbnailRailRef = useRef(null)
  const activeThumbRef = useRef(null)

  const totalItems = items.length

  // Advance to next slide
  const handleNext = useCallback(() => {
    if (totalItems <= 1) return
    setCurrentIndex((prev) => (prev + 1) % totalItems)
  }, [totalItems])

  // Return to previous slide
  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }, [totalItems])

  const handleSelectSlide = (idx) => {
    setCurrentIndex(idx)
  }

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev)
  }

  // Preload next slide's backdrop image in background for instant transitions
  useEffect(() => {
    if (totalItems <= 1) return
    const nextIdx = (currentIndex + 1) % totalItems
    const nextItem = items[nextIdx]
    if (nextItem?.backdrop_path) {
      const img = new Image()
      img.src = getImageUrl(
        nextItem.backdrop_path,
        window.innerWidth < 768
          ? TMDB_IMAGE_SIZES.BACKDROP_SM
          : TMDB_IMAGE_SIZES.BACKDROP_LG
      )
    }
  }, [currentIndex, items, totalItems])

  // Autoplay timer: pauses cleanly when hovered or paused by user
  useEffect(() => {
    if (!isPlaying || isHovered || totalItems <= 1) return

    const timer = setInterval(() => {
      handleNext()
    }, AUTOPLAY_DELAY_MS)

    return () => clearInterval(timer)
  }, [isPlaying, isHovered, totalItems, handleNext, currentIndex])

  // Scroll active thumbnail smoothly into view
  useEffect(() => {
    if (
      activeThumbRef.current &&
      thumbnailRailRef.current &&
      typeof activeThumbRef.current.scrollIntoView === 'function'
    ) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [currentIndex])

  // Mobile passive touch swipe gestures (zero vertical scroll lock)
  const onTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    }
    setIsHovered(true)
  }

  const onTouchEnd = (e) => {
    setIsHovered(false)
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    const elapsed = Date.now() - touchStartRef.current.time

    // Require distinct horizontal swipe within 500ms and minimal vertical movement
    if (
      elapsed < 500 &&
      Math.abs(deltaX) > 40 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.3
    ) {
      const isNext = isRTL ? deltaX > 0 : deltaX < 0
      if (isNext) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl bg-surface animate-pulse mb-6 border border-border/40" />
    )
  }

  if (!items || items.length === 0) return null

  const currentMedia = items[currentIndex] || items[0]
  const currentRank = currentIndex + 2 // Highlight starting from 2nd trending movie (#2, #3, ...)

  const title =
    currentMedia.title ||
    currentMedia.name ||
    currentMedia.original_title ||
    currentMedia.original_name ||
    t('media.untitled')

  const date = formatDate(currentMedia)
  const mediaType = currentMedia.title !== undefined ? 'movie' : 'tv'
  const detailUrl = `/${mediaType}/${currentMedia.id}`

  const backdropSm = currentMedia.backdrop_path
    ? getImageUrl(currentMedia.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_SM)
    : null
  const backdropLg = currentMedia.backdrop_path
    ? getImageUrl(currentMedia.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LG)
    : null

  return (
    <section className="relative flex flex-col space-y-3 w-full py-1 mb-4 select-none">
      {/* 1. Header Bar: Title, Subtitle, Slide Counter & Compact Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <FaFire className="text-sm sm:text-base animate-pulse" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {t('media.trendingSpotlight', 'Trending Spotlight')}
            </h2>
          </div>
          <p className="text-xs text-muted hidden sm:block">
            {t(
              'media.trendingSpotlightSubtitle',
              'Top trending titles buzzing right now'
            )}
          </p>
        </div>

        {/* Counter, Play/Pause Toggle & Navigation Chevrons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Active Rank & Slide Counter */}
          <div className="px-2.5 py-1 rounded-lg bg-surface border border-border/50 text-xs font-mono text-muted flex items-center gap-1.5 shadow-sm">
            <span className="text-primary font-bold">#{currentRank}</span>
            <span className="text-border">/</span>
            <span>#{totalItems + 1}</span>
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
            className="carousel-btn flex items-center justify-center min-w-8 min-h-8 text-xs cursor-pointer touch-manipulation"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <FaPause className="text-primary/70 text-xs" />
            ) : (
              <FaPlay className="text-primary text-xs ms-0.5" />
            )}
          </button>

          {/* Symmetrical Prev / Next Chevrons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="carousel-btn touch-manipulation"
              onClick={handlePrev}
              aria-label="Previous trending spotlight"
            >
              {isRTL ? (
                <FaChevronRight className="text-base text-primary/70" />
              ) : (
                <FaChevronLeft className="text-base text-primary/70" />
              )}
            </button>
            <button
              type="button"
              className="carousel-btn touch-manipulation"
              onClick={handleNext}
              aria-label="Next trending spotlight"
            >
              {isRTL ? (
                <FaChevronLeft className="text-base text-primary/70" />
              ) : (
                <FaChevronRight className="text-base text-primary/70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Hero-like Spotlight Card (GPU-accelerated, single active slide in DOM) */}
      <div
        className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-surface border border-border/40 shadow-xl flex flex-col justify-end p-5 sm:p-7 md:p-9 group touch-pan-y"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* GPU-Accelerated CSS Progress Bar (Compositor Only, Zero Re-renders) */}
        <div className="absolute top-0 inset-x-0 z-30 h-1 bg-border/20 overflow-hidden">
          <div
            key={`progress-${currentIndex}-${isPlaying && !isHovered}`}
            className={`h-full bg-gradient-to-r from-primary/80 via-primary to-accent shadow-[0_0_8px_rgba(215,168,71,0.7)] ${
              isRTL ? 'origin-right' : 'origin-left'
            }`}
            style={{
              animation:
                isPlaying && !isHovered
                  ? `spotlightProgress ${AUTOPLAY_DELAY_MS}ms linear forwards`
                  : 'none',
              transform: isPlaying && !isHovered ? undefined : 'scaleX(0)',
            }}
          />
        </div>

        {/* 1. Backdrop Image with Responsive Sizing (<picture>) and Fade Transition */}
        {backdropSm || backdropLg ? (
          <picture
            key={`bg-${currentMedia.id || currentIndex}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {backdropLg && (
              <source media="(min-width: 640px)" srcSet={backdropLg} />
            )}
            <img
              src={backdropSm || backdropLg}
              alt={title}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center sm:object-top animate-spotlight-fade transition-transform duration-700 ease-out group-hover:scale-102"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_POSTER
              }}
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-surface-muted" />
        )}

        {/* 2. Cinematic Gradient Scrim (RTL/LTR symmetric & theme aware) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent sm:bg-gradient-to-r sm:rtl:bg-gradient-to-l sm:from-background sm:via-background/80 sm:to-transparent pointer-events-none" />

        {/* Top Floating Badges: Rank Pill & Quick Action Controls */}
        <div className="absolute top-4 start-4 end-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
              <FaFire className="text-accent text-xs animate-pulse" />
              <span>
                #{currentRank} {t('media.trending')}
              </span>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 scale-105 origin-top-right rtl:origin-top-left">
            <FavoriteBadge media={currentMedia} />
            <Watchlist media={currentMedia} />
          </div>
        </div>

        {/* 3. Foreground Content with Smooth Fade-in */}
        <div
          key={`content-${currentMedia.id || currentIndex}`}
          className="relative z-10 max-w-2xl space-y-2.5 sm:space-y-3.5 text-start animate-spotlight-fade"
        >
          {/* Rating, Date & Category */}
          <div className="flex flex-wrap items-center gap-2">
            {currentMedia.vote_average !== undefined && (
              <RatingBadge rating={currentMedia.vote_average} size="sm" />
            )}
            {date && (
              <span className="px-2 py-0.5 rounded-md bg-surface/80 backdrop-blur-sm border border-border/50 text-xs font-mono text-muted">
                {date}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-surface/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted uppercase">
              {mediaType === 'tv' ? t('media.shows') : t('media.movies')}
            </span>
          </div>

          {/* Title (Clickable) */}
          <h3
            onClick={() =>
              onCardClick ? onCardClick(currentMedia) : undefined
            }
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground line-clamp-2 drop-shadow-sm cursor-pointer hover:text-primary transition-colors duration-200"
          >
            {title}
          </h3>

          {/* Overview Snippet */}
          {currentMedia.overview && (
            <p className="text-xs sm:text-sm text-muted/90 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
              {currentMedia.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
            {onCardClick ? (
              <button
                type="button"
                onClick={() => onCardClick(currentMedia)}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md text-xs sm:text-sm cursor-pointer touch-manipulation"
              >
                <FaInfoCircle className="text-sm sm:text-base" />
                <span>{t('media.viewDetails')}</span>
              </button>
            ) : (
              <Link
                to={detailUrl}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md text-xs sm:text-sm cursor-pointer touch-manipulation"
              >
                <FaInfoCircle className="text-sm sm:text-base" />
                <span>{t('media.viewDetails')}</span>
              </Link>
            )}

            <SlideFavoriteButton media={currentMedia} />
          </div>
        </div>
      </div>

      {/* 3. Fast Interactive Thumbnails / Quick Jump Rail */}
      <div
        ref={thumbnailRailRef}
        className="flex items-center gap-2 p-1.5 sm:p-2 bg-surface/40 backdrop-blur-sm rounded-xl border border-border/40 overflow-x-auto scrollbar-none snap-x"
      >
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider px-1.5 shrink-0 hidden xs:inline">
          {t('media.trending')}:
        </span>
        {items.map((media, idx) => {
          const isSlideActive = currentIndex === idx
          const thumbTitle =
            media.title || media.name || media.original_title || ''

          return (
            <button
              key={media.id || idx}
              ref={isSlideActive ? activeThumbRef : null}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs transition-all duration-200 cursor-pointer shrink-0 snap-center touch-manipulation ${
                isSlideActive
                  ? 'bg-primary/20 border-primary text-primary font-semibold shadow-sm scale-102 ring-1 ring-primary/40'
                  : 'bg-surface/70 hover:bg-surface border-border/40 text-muted hover:text-foreground'
              }`}
              title={thumbTitle}
            >
              <span
                className={`text-[10px] font-bold font-mono px-1 sm:px-1.5 py-0.5 rounded transition-colors ${
                  isSlideActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-elevated text-muted'
                }`}
              >
                #{idx + 2}
              </span>
              <span className="max-w-[70px] sm:max-w-[110px] truncate text-[11px] sm:text-xs">
                {thumbTitle}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

// Sub-component for individual favorite button on slide
function SlideFavoriteButton({ media }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useLibrary(media)

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-200 shadow-sm text-xs sm:text-sm cursor-pointer touch-manipulation ${
        isFavorite
          ? 'bg-surface-elevated border-accent/60 text-accent font-semibold'
          : 'bg-surface/80 backdrop-blur-sm hover:bg-surface border-border text-foreground'
      }`}
    >
      <FaHeart className={isFavorite ? 'text-accent' : 'text-accent/80'} />
      <span>
        {isFavorite
          ? t('favorites.title', 'Favorited')
          : t('media.addToFavorites', 'Add to Favorites')}
      </span>
    </button>
  )
}

export default TrendingSpotlight
