import { useTranslation } from 'react-i18next'

export const TMDB_IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

export const TMDB_IMAGE_SIZES = {
  POSTER_THUMB: 'w185',
  POSTER_CARD: 'w342', // Default size for carousel and grid movie cards
  POSTER_DETAIL: 'w500', // High-res poster on details page sidebar
  BACKDROP_SM: 'w780', // Mobile / Tablet hero banner
  BACKDROP_LG: 'w1280', // Desktop widescreen cinema hero spotlight
  PROFILE: 'w185', // Cast & crew avatar photos
  ORIGINAL: 'original', // Raw uploaded file
}

export const FALLBACK_POSTER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="342" height="513" viewBox="0 0 342 513" fill="#2A2422">
      <rect width="342" height="513" fill="#2A2422"/>
      <path d="M141 226h60v60h-60z" fill="#4B3C35"/>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#B8ABA3" font-family="sans-serif" font-size="16">
        No Poster Available
      </text>
    </svg>
  `)

export function getImageUrl(path, size = TMDB_IMAGE_SIZES.POSTER_CARD) {
  if (!path || path === 'null') {
    return FALLBACK_POSTER
  }

  if (path.startsWith('http')) return path

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function useCurrentLanguage() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage || i18n.language || 'en'
  return lang === 'ar' ? 'ar-SA' : 'en-US'
}

export function formatDate(dateStr) {
  const date = dateStr?.release_date || dateStr?.first_air_date
  return date?.slice(0, 4) || null
}

export const BADGE_CONFIGS = {
  trending: {
    className: 'bg-primary/20 text-primary border border-primary/30',
    labelKey: 'media.trending',
  },
  popular: {
    className: 'bg-accent/20 text-accent border border-accent/30',
    labelKey: 'media.popular',
  },
  top_rated: {
    className:
      'bg-rating-excellent/20 text-rating-excellent border border-rating-excellent/30',
    labelKey: 'media.top_rated',
  },
  new_releases: {
    className: 'border-sky-500/30 bg-sky-500/20 text-sky-400',
    labelKey: 'media.new_releases',
  },
  animation: {
    className: 'border-purple-500/30 bg-purple-500/20 text-purple-400',
    labelKey: 'genres.animation',
  },
  action: {
    className: 'border-orange-500/30 bg-orange-500/20 text-orange-400',
    labelKey: 'genres.action',
  },
  scifi: {
    className: 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400',
    labelKey: 'genres.scifi',
  },
  comedy: {
    className: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400',
    labelKey: 'genres.comedy',
  },
  horror: {
    className: 'border-rose-500/30 bg-rose-500/20 text-rose-400',
    labelKey: 'genres.horror',
  },
  crime: {
    className: 'border-red-500/30 bg-red-500/20 text-red-400',
    labelKey: 'genres.crime',
  },
  drama: {
    className: 'border-indigo-500/30 bg-indigo-500/20 text-indigo-400',
    labelKey: 'genres.drama',
  },
  family: {
    className: 'border-teal-500/30 bg-teal-500/20 text-teal-400',
    labelKey: 'genres.family',
  },
  documentary: {
    className: 'border-amber-500/30 bg-amber-500/20 text-amber-400',
    labelKey: 'genres.documentary',
  },
}

export const CURATED_GENRES = [
  {
    key: 'animation',
    movieId: 16,
    tvId: 16,
    labelKey: 'genres.animation',
    badgeVariant: 'animation',
  },
  {
    key: 'action',
    movieId: 28,
    tvId: 10759,
    labelKey: 'genres.action',
    badgeVariant: 'action',
  },
  {
    key: 'scifi',
    movieId: 878,
    tvId: 10765,
    labelKey: 'genres.scifi',
    badgeVariant: 'scifi',
  },
  {
    key: 'comedy',
    movieId: 35,
    tvId: 35,
    labelKey: 'genres.comedy',
    badgeVariant: 'comedy',
  },
  {
    key: 'horror',
    movieId: 27,
    tvId: 9648,
    labelKey: 'genres.horror',
    badgeVariant: 'horror',
  },
  {
    key: 'crime',
    movieId: 80,
    tvId: 80,
    labelKey: 'genres.crime',
    badgeVariant: 'crime',
  },
  {
    key: 'drama',
    movieId: 18,
    tvId: 18,
    labelKey: 'genres.drama',
    badgeVariant: 'drama',
  },
  {
    key: 'family',
    movieId: 10751,
    tvId: 10751,
    labelKey: 'genres.family',
    badgeVariant: 'family',
  },
  {
    key: 'documentary',
    movieId: 99,
    tvId: 99,
    labelKey: 'genres.documentary',
    badgeVariant: 'documentary',
  },
]

export function badgeStyles(type) {
  return (
    BADGE_CONFIGS[type]?.className ||
    'bg-primary/20 text-primary border border-primary/30'
  )
}
export function formatRunTime(minutes, t) {
  if (!minutes || minutes <= 0) {
    return null
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours === 0) {
    return `${remainingMinutes}${t('media.minute')}`
  }
  if (remainingMinutes === 0) {
    return `${hours}${t('media.hour')}`
  }

  return `${hours}${t('media.hour')} ${remainingMinutes}${t('media.minute')}`
}

export function formatCurrency(amount) {
  if (!amount || amount === 0) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatFullDate(dateStr, locale = 'en-US') {
  if (!dateStr) {
    return 'N/A'
  }
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return 'N/A'
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function openMediaDetail(
  navigateOrMedia,
  mediaOrNavigate,
  defaultMediaType
) {
  let navigate, media, fallbackType
  if (typeof navigateOrMedia === 'function') {
    navigate = navigateOrMedia
    media = mediaOrNavigate
    fallbackType = defaultMediaType
  } else {
    media = navigateOrMedia
    navigate = mediaOrNavigate
    fallbackType = defaultMediaType
  }
  if (!navigate || !media || !media.id) return

  const type =
    media.media_type ||
    (media.title !== undefined ? 'movie' : 'tv') ||
    fallbackType

  navigate(`/${type}/${media.id}`)
}
