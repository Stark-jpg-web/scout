import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useStore from '../store/useStore.js'
import { useInfiniteCategory } from '../hooks/useMovies.js'
import { CURATED_GENRES } from '../utils/constants.js'
import MediaGrid from '../components/media/MediaGrid.jsx'
import MediaCardSkeleton from '../components/media/MediaCardSkeleton.jsx'
import MediaTypeSwitcher from '../components/ui/MediaTypeSwitcher.jsx'
import { FaSpinner } from 'react-icons/fa'
import { useEffect, useRef } from 'react'

function CategoryPage() {
  const { category, id } = useParams()
  const { t } = useTranslation()
  const mediaType = useStore((state) => state.mediaType)

  // Automatically find if the current route matches any curated genre in our constants dictionary
  const target = id || category
  const matchedGenre = CURATED_GENRES.find(
    (g) =>
      g.key === target ||
      String(g.movieId) === String(target) ||
      String(g.tvId) === String(target)
  )

  const isGenre = Boolean(matchedGenre || id)
  const resolvedGenreId = matchedGenre
    ? mediaType === 'tv'
      ? matchedGenre.tvId
      : matchedGenre.movieId
    : id

  // Determine Title & Badge Variant based on Route
  let title = `${t('media.trending')} ${t('general.now')}`
  let badgeVariant = 'trending'

  if (matchedGenre) {
    title = t(matchedGenre.labelKey)
    badgeVariant = matchedGenre.badgeVariant
  } else if (isGenre) {
    title = t('navigation.genres')
    badgeVariant = 'genres'
  } else if (category === 'popular') {
    title = `${t('media.popular')} ${t('general.now')}`
    badgeVariant = 'popular'
  } else if (category === 'top-rated') {
    title = t('media.top_rated')
    badgeVariant = 'top_rated'
  } else if (category === 'new-releases') {
    title = t('media.new_releases')
    badgeVariant = 'new_releases'
  }

  // Single active infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteCategory(mediaType, category, resolvedGenreId)

  // Deduplicate items by ID if any API edge cases occur
  const allItems = data?.pages
    ? Array.from(
        new Map(
          data.pages.flatMap((page) => page.results || []).map((m) => [m.id, m])
        ).values()
      )
    : []

  const totalCount = data?.pages?.[0]?.total_results

  // Sentinel observer for vertical scroll
  const observerRef = useRef(null)
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: '400px' } // Pre-fetch 400px before reaching the bottom
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          <span className="rtl:rotate-180">←</span>
          <span>{t('general.backToDiscover')}</span>
        </Link>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {totalCount ? (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {totalCount.toLocaleString()} {t('general.in')}{' '}
                {mediaType === 'movie' ? t('media.movies') : t('media.shows')}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-muted">{t('app.tagline')}</p>
        </div>
        <div>
          <MediaTypeSwitcher />
        </div>
      </div>

      {/* Full-Screen Responsive Grid */}
      <MediaGrid
        items={allItems}
        isLoading={isLoading}
        skeletonCount={18}
        badgeVariant={badgeVariant}
      />

      {/* Skeletons while fetching next page */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Bottom Loading / Load More */}
      {hasNextPage && (
        <div ref={observerRef} className="flex justify-center py-6">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="min-w-[200px] px-6 py-2.5 rounded-xl bg-surface border border-border/60 hover:border-primary/50 text-foreground font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <FaSpinner className="animate-spin text-primary" />
                <span>{t('general.loadingMore')}</span>
              </>
            ) : (
              <span>{t('general.loadMore')}</span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
