const baseUrl = import.meta.env.VITE_TMDB_BASE_URL
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN

export async function apiFetch(endpoint, params = {}) {
  if (!baseUrl || !accessToken) {
    throw new Error('missing TMDB configuration.')
  }

  const url = new URL(`${baseUrl}${endpoint}`)

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const messageByStatus = {
      401: 'TMDB authorization failed. Check your API Read Access Token.',
      404: 'The requested TMDB resource was not found.',
      429: 'TMDB rate limit reached. Please try again shortly.',
    }
    const message = messageByStatus[response.status] ?? 'Unknown TMDB error.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return data
}

async function fetchWithFallBack(endpoint, params = {}) {
  const data = await apiFetch(endpoint, params)
  const language = params.language || 'en-US'
  if (!language.startsWith('ar') || !data?.results) {
    return data
  }
  const hasEmptyOverView = data.results.some(
    (item) => !item?.overview || item.overview.trim() === ''
  )
  if (hasEmptyOverView) {
    try {
      const enData = await apiFetch(endpoint, { ...params, language: 'en-US' })
      const enMap = new Map(enData.results.map((m) => [m.id, m]))
      data.results = data.results.map((item) => {
        const enItem = enMap.get(item.id)
        return {
          ...item,
          // If Arabic title is missing, use English
          title: item.title || enItem?.title || item.original_title,
          name: item.name || enItem?.name || item.original_name,
          // If Arabic overview is missing, use English overview!
          overview: item.overview?.trim()
            ? item.overview
            : enItem?.overview || '',
        }
      })
    } catch (err) {
      console.warn('English overview fallback failed:', err)
    }
  }
  return data
}

export function fetchTrending(
  mediaType = 'all',
  timeWindow = 'week',
  language = 'en-US'
) {
  return fetchWithFallBack(`/trending/${mediaType}/${timeWindow}`, { language })
}
export function fetchTopRated(mediaType = 'all', page = 1, language = 'en-US') {
  return fetchWithFallBack(`/${mediaType}/top_rated`, { page, language })
}
export function fetchPopular(mediaType = 'all', page = 1, language = 'en-US') {
  return fetchWithFallBack(`/${mediaType}/popular`, { page, language })
}
export function fetchNewReleases(
  mediaType = 'movie',
  page = 1,
  language = 'en-US'
) {
  const endpoint = mediaType === 'tv' ? '/tv/on_the_air' : '/movie/now_playing'
  return fetchWithFallBack(endpoint, {
    page,
    language,
  })
}
export function fetchByGenre(
  mediaType = 'movie',
  genreId = 16,
  language = 'en-US',
  page = 1
) {
  return fetchWithFallBack(`/discover/${mediaType}`, {
    page,
    language,
    with_genres: genreId,
    sort_by: 'popularity.desc',
  })
}
export function fetchGenres(mediaType = 'movie', language = 'en-US') {
  return fetchWithFallBack(`/genre/${mediaType}/list`, { language })
}

export function searchMedia(
  query,
  mediaType = 'movie',
  page = 1,
  language = 'en-US'
) {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return Promise.resolve({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })
  }

  return fetchWithFallBack(`/search/${mediaType}`, {
    query: query.trim(),
    page,
    language,
    include_adult: false,
  })
}
export async function fetchMediaDetails(
  type = 'movie',
  id,
  language = 'en-US'
) {
  if (!id) {
    throw new Error('Media ID is required.')
  }
  const data = await fetchWithFallBack(`/${type}/${id}`, {
    language,
    append_to_response: 'videos,credits,recommendations,similar',
    include_video_language: 'en,null,ar',
  })

  let rawVideos = Array.isArray(data.videos)
    ? data.videos
    : data.videos?.results || []

  if (
    language.startsWith('ar') &&
    (!data.overview?.trim() ||
      !data.tagline?.trim() ||
      rawVideos.length === 0)
  ) {
    try {
      const enData = await apiFetch(`/${type}/${id}`, {
        language: 'en-US',
        append_to_response: 'videos,credits,recommendations,similar',
        include_video_language: 'en,null',
      })
      if (!data.overview?.trim()) data.overview = enData.overview || ''
      if (!data.tagline?.trim()) data.tagline = enData.tagline || ''
      if (rawVideos.length === 0 && enData.videos?.results?.length) {
        rawVideos = enData.videos.results
      }
    } catch (err) {
      console.warn('English details fallback has failed:', err)
    }
  }

  data.videos = rawVideos
  return data
}
