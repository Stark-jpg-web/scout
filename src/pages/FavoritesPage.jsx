import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImLibrary } from 'react-icons/im'
import MediaGrid from '../components/media/MediaGrid.jsx'
import EmptyState from '../components/library/EmptyState.jsx'
import CollectionFilterToolbar from '../components/library/CollectionFilterToolbar.jsx'
import useStore from '../store/useStore.js'
import { CURATED_GENRES } from '../utils/constants.js'
import { FaHeart } from 'react-icons/fa'
import { useHydratedLibrary } from '../hooks/useLibrary.js'

function FavoritesPage() {
  const { t } = useTranslation()

  const [mediaType, setMediaType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [sortByGenre, setSortByGenre] = useState('all')

  const favorites = useStore((state) => state.favorites)
  const allFavoritesItems = useMemo(() => Object.values(favorites || {}), [favorites])
  const hydratedFavorites = useHydratedLibrary(allFavoritesItems)

  const filteredFavorites = useMemo(() => {
    // 1. Convert dictionary to array
    let list = [...hydratedFavorites]
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
        console.log(
          '[DEBUG] genreIds:',
          [...genreIds],
          'types:',
          [...genreIds].map((x) => typeof x)
        )
        list = list.filter((item) => {
          const itemGenres =
            item.genre_ids || item.genres?.map((g) => g.id) || []
          console.log(
            '[DEBUG] item',
            item.title,
            'itemGenres:',
            JSON.stringify(itemGenres),
            'types:',
            itemGenres.map((x) => typeof x)
          )
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
  }, [hydratedFavorites, mediaType, searchQuery, sortBy, sortByGenre])
  const isFavoritesEmpty = allFavoritesItems.length === 0
  const isFilteredEmpty = !isFavoritesEmpty && filteredFavorites.length === 0

  return (
    <div className="flex flex-col gap-4">
      <div className="section-header">
        <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {t('favorites.title')} <FaHeart className="text-red-500" />
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

      {isFavoritesEmpty ? (
        <EmptyState
          title={t('favorites.emptyFavoritesTitle')}
          description={t('favorites.emptyFavoritesDesc')}
          icon={<ImLibrary className="text-6xl" />}
          actionLabel={t('favorites.exploreDiscover')}
          actionTo="/"
        />
      ) : isFilteredEmpty ? (
        <EmptyState
          title={t('favorites.emptyFilterTitle')}
          description={t('favorites.emptyFilterDesc')}
          icon={<ImLibrary className="text-6xl" />}
          actionLabel={t('favorites.exploreDiscover')}
          actionTo="/"
        />
      ) : (
        <MediaGrid items={filteredFavorites} badgeVariant="" />
      )}
    </div>
  )
}

export default FavoritesPage
