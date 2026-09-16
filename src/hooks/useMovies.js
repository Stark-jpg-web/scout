import { useQuery,useInfiniteQuery } from '@tanstack/react-query'

import {
  fetchTrending,
  fetchTopRated,
  fetchPopular,
  fetchNewReleases,
  fetchByGenre,
  fetchGenres,
  searchMedia,
  fetchMediaDetails,
} from '../services/tmdb/movieApi'
import { useCurrentLanguage } from '../utils/constants.js'

export const mediaKeys = {
  all: ['media'],
  type: (type) => [...mediaKeys.all, type],
  trending: (type = 'movie', language = 'en-US') => [
    ...mediaKeys.type(type),
    'trending',
    language,
  ],
  topRated: (type = 'movie', language = 'en-US') => [
    ...mediaKeys.type(type),
    'top-rated',
    language,
  ],
  popular: (type = 'movie', language = 'en-US') => [
    ...mediaKeys.type(type),
    'popular',
    language,
  ],
  newReleases: (type = 'movie', language = 'en-US') => [
    ...mediaKeys.type(type),
    'new-releases',
    language,
  ],

  genres: (type = 'movie', language = 'en-US') => [
    ...mediaKeys.type(type),
    'genres',
    language,
  ],
  byGenre: (type = 'movie', genreId = 16, language = 'en-US', page = 1) => [
    ...mediaKeys.type(type),
    'by-genre',
    genreId,
    language,
    page,
  ],
  search: (type = 'movie', query, language) => [
    ...mediaKeys.type(type),
    'search',
    query.trim(),
    language,
  ],
  detail: (type = 'movie', id, language = 'en-US') => [
    ...mediaKeys.type(type),
    'detail',
    id,
    language,
  ],
}

export function useTrending(type = 'movie') {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: mediaKeys.trending(type, language),
    queryFn: () => fetchTrending(type, 'week', language),
  })
}

export function useTopRated(type = 'movie') {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: mediaKeys.topRated(type, language),
    queryFn: () => fetchTopRated(type, 1, language),
  })
}

export function usePopular(type = 'movie') {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: mediaKeys.popular(type, language),
    queryFn: () => fetchPopular(type, 1, language),
  })
}

export function useNewReleases(type = 'movie') {
  const language = useCurrentLanguage()

  return useQuery({
    queryKey: mediaKeys.newReleases(type, language),
    queryFn: () => fetchNewReleases(type, 1, language),
  })
}
export function useGenres(type = 'movie', genreId = 16) {
  const language = useCurrentLanguage()
  return useQuery({
    queryKey: mediaKeys.genres(type, language),
    queryFn: () => fetchGenres(type, language, 1),
  })
}

export function useByGenre(type = 'movie', genreId = 16) {
  const language = useCurrentLanguage()
  return useQuery({
    queryKey: mediaKeys.byGenre(type, genreId, language, 1),
    queryFn: () => fetchByGenre(type, genreId, language, 1),
  })
}

export function useSearchMedia(query, type = 'movie', page = 1) {
  const language = useCurrentLanguage()
  const trimmed = query?.trim() || ''

  return useQuery({
    queryKey: mediaKeys.search(type, trimmed, page, language),
    queryFn: () => searchMedia(trimmed, type, page, language),
    enabled: Boolean(trimmed.length > 0),
    staleTime: 2 * 60 * 1000,
  })
}

export function useMediaDetails(type = 'movie', id) {
  const language = useCurrentLanguage()
  return useQuery({
    queryKey: mediaKeys.detail(type, id, language),
    queryFn: () => fetchMediaDetails(type, id, language),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  })
}

export function useInfiniteCategory(type = 'movie', category = 'popular', genreId = null) {
  const language = useCurrentLanguage()
  return useInfiniteQuery({
    queryKey: ['media', type, 'infinite', category, genreId, language],
    queryFn: async ({ pageParam = 1 }) => {
      if (genreId) {
        return fetchByGenre(type, genreId, language, pageParam)
      }
      switch (category) {
        case 'trending':
          return fetchTrending(type, 'week', language) // Fixed 20-item feed
        case 'top-rated':
          return fetchTopRated(type, pageParam, language)
        case 'new-releases':
          return fetchNewReleases(type, pageParam, language)
        case 'popular':
        default:
          return fetchPopular(type, pageParam, language)
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Trending feed is strictly top 20 items for the week; do not paginate
      if (category === 'trending') {
        return undefined
      }
      if (lastPage?.page && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
      return undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useTrendingMovies = () => useTrending('movie')
export const useTrendingShows = () => useTrending('tv')
export const useTopRatedMovies = () => useTopRated('movie')
export const useTopRatedShows = () => useTopRated('tv')
export const usePopularMovies = () => usePopular('movie')
export const usePopularShows = () => usePopular('tv')
export const useNewReleasesMovies = () => useNewReleases('movie')
export const useNewReleasesShows = () => useNewReleases('tv')
export const useGenresMovies = () => useGenres('movie')
export const useGenresShows = () => useGenres('tv')
export const useMediaDetailsMovie = (id) => useMediaDetails('movie', id)
export const useMediaDetailsShow = (id) => useMediaDetails('tv', id)
