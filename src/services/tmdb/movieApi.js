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
  const hasIncompleteData = data.results.some(
    (item) =>
      !item?.overview?.trim() ||
      (!item?.title?.trim() && !item?.name?.trim())
  )
  if (hasIncompleteData) {
    try {
      const enData = await apiFetch(endpoint, { ...params, language: 'en-US' })
      const enMap = new Map(enData.results?.map((m) => [m.id, m]) || [])
      data.results = data.results.map((item) => {
        const enItem = enMap.get(item.id)
        return {
          ...item,
          // If Arabic title is missing, use English
          title: item.title?.trim() || enItem?.title || item.original_title || '',
          name: item.name?.trim() || enItem?.name || item.original_name || '',
          // If Arabic overview is missing, use English overview
          overview: item.overview?.trim() ? item.overview : enItem?.overview || '',
        }
      })
    } catch (err) {
      console.warn('English list fallback failed:', err)
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
  const data = await apiFetch(`/${type}/${id}`, {
    language,
    append_to_response: 'videos,credits,recommendations,similar',
    include_video_language: 'en,null,ar',
  })

  let rawVideos = Array.isArray(data.videos)
    ? data.videos
    : data.videos?.results || []

  if (language.startsWith('ar')) {
    try {
      const enData = await apiFetch(`/${type}/${id}`, {
        language: 'en-US',
        append_to_response: 'videos,credits,recommendations,similar',
        include_video_language: 'en,null',
      })

      if (!data.overview?.trim()) data.overview = enData.overview || ''
      if (!data.tagline?.trim()) data.tagline = enData.tagline || ''
      if (!data.title?.trim() && enData.title) data.title = enData.title
      if (!data.name?.trim() && enData.name) data.name = enData.name

      if (rawVideos.length === 0 && enData.videos?.results?.length) {
        rawVideos = enData.videos.results
      }

      // Fallback for seasons list
      if (data.seasons && enData.seasons) {
        const enSeasonMap = new Map(enData.seasons.map((s) => [s.id, s]))
        data.seasons = data.seasons.map((s) => {
          const enS = enSeasonMap.get(s.id)
          return {
            ...s,
            name: s.name?.trim() || enS?.name || `Season ${s.season_number}`,
            overview: s.overview?.trim() ? s.overview : enS?.overview || '',
          }
        })
      }

      // Fallback for recommendations
      if (data.recommendations?.results && enData.recommendations?.results) {
        const enRecMap = new Map(
          enData.recommendations.results.map((r) => [r.id, r])
        )
        data.recommendations.results = data.recommendations.results.map((r) => {
          const enR = enRecMap.get(r.id)
          return {
            ...r,
            title: r.title?.trim() || enR?.title || r.original_title || '',
            name: r.name?.trim() || enR?.name || r.original_name || '',
            overview: r.overview?.trim() ? r.overview : enR?.overview || '',
          }
        })
      }

      // Fallback for similar media
      if (data.similar?.results && enData.similar?.results) {
        const enSimMap = new Map(enData.similar.results.map((r) => [r.id, r]))
        data.similar.results = data.similar.results.map((r) => {
          const enR = enSimMap.get(r.id)
          return {
            ...r,
            title: r.title?.trim() || enR?.title || r.original_title || '',
            name: r.name?.trim() || enR?.name || r.original_name || '',
            overview: r.overview?.trim() ? r.overview : enR?.overview || '',
          }
        })
      }
    } catch (err) {
      console.warn('English details fallback failed:', err)
    }
  }

  data.videos = rawVideos
  return data
}

export async function fetchTvSeason(
  tvId,
  seasonNumber = 1,
  language = 'en-US'
) {
  if (!tvId || seasonNumber === undefined || seasonNumber === null) {
    throw new Error('TV ID and Season Number are required.')
  }
  const data = await apiFetch(`/tv/${tvId}/season/${seasonNumber}`, {
    language,
  })

  // Comprehensive fallback for Arabic to English
  if (language.startsWith('ar')) {
    try {
      const enData = await apiFetch(`/tv/${tvId}/season/${seasonNumber}`, {
        language: 'en-US',
      })

      // Season-level fallback
      if (!data.overview?.trim()) data.overview = enData.overview || ''
      if (!data.name?.trim())
        data.name = enData.name || `Season ${seasonNumber}`

      // Episode-level fallback
      if (data?.episodes && enData?.episodes) {
        const enMap = new Map(enData.episodes.map((ep) => [ep.id, ep]))
        data.episodes = data.episodes.map((ep) => {
          const enEp = enMap.get(ep.id)
          const arName = ep.name?.trim()
          const enName = enEp?.name?.trim()

          // If Arabic title is missing, fallback to English
          const finalName = arName || enName || `Episode ${ep.episode_number}`

          return {
            ...ep,
            name: finalName,
            overview: ep.overview?.trim() ? ep.overview : enEp?.overview || '',
          }
        })
      }
    } catch (err) {
      console.warn('English season episodes fallback failed:', err)
    }
  }

  return data
}

export async function fetchEpisodeVideos(
  tvId,
  seasonNumber,
  episodeNumber,
  language = 'en-US'
) {
  if (
    !tvId ||
    seasonNumber === undefined ||
    episodeNumber === undefined
  ) {
    return { results: [] }
  }
  try {
    const data = await apiFetch(
      `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
      { language }
    )
    if (
      (!data?.results || data.results.length === 0) &&
      language !== 'en-US'
    ) {
      const enData = await apiFetch(
        `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
        { language: 'en-US' }
      )
      if (enData?.results?.length > 0) {
        return enData
      }
    }
    return data || { results: [] }
  } catch (err) {
    console.warn('Episode videos fetch error:', err)
    return { results: [] }
  }
}

