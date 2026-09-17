import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImLibrary } from 'react-icons/im'
import MediaGrid from '../components/media/MediaGrid.jsx'
import EmptyState from '../components/library/EmptyState.jsx'
import CollectionFilterToolbar from '../components/library/CollectionFilterToolbar.jsx'
import useStore from '../store/useStore.js'
import { CURATED_GENRES } from '../utils/constants.js'
import { CiCircleList } from 'react-icons/ci'
import { useHydratedLibrary } from '../hooks/useLibrary.js'

function WatchlistPage() {
  const { t } = useTranslation()

  const [mediaType, setMediaType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [sortByGenre, setSortByGenre] = useState('all')

  const watchlist = useStore((state) => state.watchlist)
  const allWatchlistItems = useMemo(() => Object.values(watchlist || {}), [watchlist])
  const hydratedWatchlist = useHydratedLibrary(allWatchlistItems)

  const filteredWatchlist = useMemo(() => {
    // 1. Convert dictionary to array
    let list = [...hydratedWatchlist]
    // 2. Filter by Media Type ('all' | 'movie' | 'tv')
    if (mediaType !== 'all') {
      list = list.filter((item) => item.media_type === mediaType)
    }
    // 3. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      list = list.filter((item) => item.title?.toLowerCase().includes(query))
    }
    // 4. Filter by Genre (via CURATED_GENRES)
    if (sortByGenre !== 'all') {
      const genreDef = CURATED_GENRES.find((g) => g.key === sortByGenre)
      if (genreDef) {
        const genreIds = new Set(
          [genreDef.movieId, genreDef.tvId].filter(Boolean)
        )
        list = list.filter((item) => {
          const itemGenres =
            item.genre_ids || item.genres?.map((g) => g.id) || []
          return itemGenres.some((id) => genreIds.has(id))
        })
      }
    }

    // 5. Sort by criteria
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return (a.addedAt || 0) - (b.addedAt || 0)
        case 'rating_desc':
          return (b.vote_average || 0) - (a.vote_average || 0)
        case 'rating_asc':
          return (a.vote_average || 0) - (b.vote_average || 0)
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '')
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '')
        case 'date_desc':
        default:
          return (b.addedAt || 0) - (a.addedAt || 0)
      }
    })
  }, [hydratedWatchlist, mediaType, searchQuery, sortBy, sortByGenre])
  const isWatchlistEmpty = allWatchlistItems.length === 0
  const isFilteredEmpty = !isWatchlistEmpty && filteredWatchlist.length === 0

  return (
    <div className="flex flex-col gap-4">
      <div className="section-header">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          {t('navigation.watchlist')}{' '}
          <CiCircleList className="text-3xl text-primary" />
        </h2>
      </div>

      <CollectionFilterToolbar
        mediaType={mediaType}
        onMediaTypeChange={setMediaType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortByGenre={sortByGenre}
        onSortByGenreChange={setSortByGenre}
      />

      {isWatchlistEmpty ? (
        <EmptyState
          title={t('watchlist.emptyWatchlistTitle')}
          description={t('watchlist.emptyWatchlistDesc')}
          icon={<ImLibrary className="text-6xl" />}
          actionLabel={t('watchlist.exploreDiscover')}
          actionTo="/"
        />
      ) : isFilteredEmpty ? (
        <EmptyState
          title={t('watchlist.emptyFilterTitle')}
          description={t('watchlist.emptyFilterDesc')}
          icon={<ImLibrary className="text-6xl" />}
          actionLabel={t('watchlist.exploreDiscover')}
          actionTo="/"
        />
      ) : (
        <MediaGrid items={filteredWatchlist} badgeVariant="" />
      )}
    </div>
  )
}

export default WatchlistPage
