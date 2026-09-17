import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import useStore from '../store/useStore'
import { mediaKeys } from './useMovies'
import { fetchMediaDetails } from '../services/tmdb/movieApi'
import { useCurrentLanguage } from '../utils/constants'

export function useLibrary(media) {
  const id = media?.id

  // Atomic selectors: component only re-renders when this specific item's status changes
  const isFavorite = useStore((state) => Boolean(state.favorites[id]))
  const isWatchlisted = useStore((state) => Boolean(state.watchlist[id]))
  const rating = useStore((state) => state.ratings?.[id]?.score ?? 0)
  const commentData = useStore((state) => state.comments?.[id] ?? null)
  const comment = commentData?.comment ?? null
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const toggleWatchlist = useStore((state) => state.toggleWatchlist)
  const setRating = useStore((state) => state.setRating)
  const removeRating = useStore((state) => state.removeRating)
  const setComments = useStore((state) => state.setComments)
  const removeComment = useStore((state) => state.removeComment)

  return {
    isFavorite,
    isWatchlisted,
    rating,
    comment,
    commentData,
    toggleFavorite: () => toggleFavorite(media),
    toggleWatchlist: () => toggleWatchlist(media),
    setRating: (score) => setRating(media, score),
    removeRating: () => removeRating(id),
    setComments: (commentText, score) => setComments(media, commentText, score),
    removeComment: () => removeComment(id),
  }
}

/**
 * Hydrates stored library items (favorites/watchlist) with live localized TMDB data.
 * When the language is toggled, React Query automatically pulls the updated localized title,
 * overview, poster, and genre mappings in the active language.
 */
export function useHydratedLibrary(items = []) {
  const language = useCurrentLanguage()

  const queries = useQueries({
    queries: (items || []).map((item) => ({
      queryKey: mediaKeys.detail(
        item.media_type || (item.title ? 'movie' : 'tv'),
        item.id,
        language
      ),
      queryFn: () =>
        fetchMediaDetails(
          item.media_type || (item.title ? 'movie' : 'tv'),
          item.id,
          language
        ),
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      enabled: Boolean(item?.id),
    })),
  })

  return useMemo(() => {
    return (items || []).map((item, index) => {
      const liveData = queries[index]?.data
      if (!liveData) return item

      return {
        ...item,
        title:
          liveData.title ||
          liveData.name ||
          liveData.original_title ||
          liveData.original_name ||
          item.title,
        overview: liveData.overview || item.overview,
        poster_path: liveData.poster_path || item.poster_path,
        backdrop_path: liveData.backdrop_path || item.backdrop_path,
        vote_average: liveData.vote_average ?? item.vote_average,
        release_date:
          liveData.release_date || liveData.first_air_date || item.release_date,
        genre_ids:
          liveData.genres?.map((g) => g.id) ||
          liveData.genre_ids ||
          item.genre_ids ||
          [],
      }
    })
  }, [items, queries])
}

export default useLibrary
