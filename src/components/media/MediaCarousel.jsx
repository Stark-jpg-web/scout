import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaArrowLeft,
} from 'react-icons/fa'
import MediaCard from './MediaCard.jsx'
import MediaCardSkeleton from './MediaCardSkeleton.jsx'

function MediaCarousel({
  title,
  items = [],
  isLoading = false,
  seeAllLink,
  badgeVariant,
  onCardClick,
  fetchNextPage,
  hasNextPage = false,
  isFetchingNextPage = false,
}) {
  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const horizontalSentinelRef = useRef(null)
  const isRTL = document.documentElement.dir === 'rtl'

  // Smooth scroll handler with bidirectional (LTR & RTL) support
  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const scrollDistance = scrollRef.current.clientWidth * 0.6
    const scrollDelta =
      direction === 'next'
        ? isRTL
          ? -scrollDistance
          : scrollDistance
        : isRTL
          ? scrollDistance
          : -scrollDistance
    scrollRef.current.scrollBy({
      left: scrollDelta,
      behavior: 'smooth',
    })
  }

  // Horizontal Intersection Observer for progressive infinite loading
  useEffect(() => {
    if (
      !horizontalSentinelRef.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      !fetchNextPage
    ) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      {
        root: scrollRef.current,
        rootMargin: '250px',
      }
    )

    observer.observe(horizontalSentinelRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <section className="relative flex flex-col space-y-3 w-full py-2">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between px-1">
        {seeAllLink ? (
          <Link
            to={seeAllLink}
            className="group inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
          >
            <span>{title}</span>
            <span className="text-sm font-semibold text-primary">
              {t('general.seeAll')}
            </span>
            {isRTL ? (
              <FaArrowLeft className="text-lg group-hover:-translate-x-1 text-primary/70 transition-transform" />
            ) : (
              <FaArrowRight className="text-lg group-hover:translate-x-1 text-primary/70 transition-transform" />
            )}
          </Link>
        ) : (
          <div className="group inline-flex items-center gap-2 font-bold text-foreground">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {title}
            </h2>
          </div>
        )}

        {/* Navigation Chevrons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="carousel-btn"
            onClick={() => handleScroll('prev')}
            aria-label="Previous items"
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
            onClick={() => handleScroll('next')}
            aria-label="Next items"
          >
            {isRTL ? (
              <FaChevronLeft className="text-lg text-primary/70" />
            ) : (
              <FaChevronRight className="text-lg text-primary/70" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Scroll Track: Zero-CLS Layout */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 px-1 scroll-smooth"
      >
        {isLoading && items.length === 0
          ? Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="w-36 sm:w-44 md:w-52 shrink-0 snap-start"
              >
                <MediaCardSkeleton />
              </div>
            ))
          : items.map((media) => (
              <div key={media.id} className="snap-start">
                <MediaCard
                  media={media}
                  onClick={() => onCardClick?.(media)}
                  badgeVariant={
                    typeof badgeVariant === 'function'
                      ? badgeVariant(media)
                      : badgeVariant
                  }
                />
              </div>
            ))}

        {/* Horizontal Sentinel & Loading Indicator */}
        {hasNextPage && fetchNextPage && (
          <div
            ref={horizontalSentinelRef}
            className="flex items-center gap-3 shrink-0 snap-start"
          >
            {isFetchingNextPage && (
              <>
                <div className="w-36 sm:w-44 md:w-52 shrink-0">
                  <MediaCardSkeleton />
                </div>
                <div className="w-36 sm:w-44 md:w-52 shrink-0">
                  <MediaCardSkeleton />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default MediaCarousel
