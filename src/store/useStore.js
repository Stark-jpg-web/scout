import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useStore = create(
  devtools(
    persist(
      (set) => ({
        // UI / App State
        theme: 'dark',

        toggleTheme: () =>
          set(
            (state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }),
            false,
            'toggleTheme'
          ),

        // Media Type State
        mediaType: 'movie',
        toggleMediaType: () =>
          set(
            (state) => ({
              mediaType: state.mediaType === 'movie' ? 'tv' : 'movie',
            }),
            false,
            'toggleMediaType'
          ),

        // Search & Filter State
        searchQuery: '',
        setSearchQuery: (query) =>
          set({ searchQuery: query }, false, 'setSearchQuery'),

        selectedFilter: 'all',
        setSelectedFilter: (filter) =>
          set({ selectedFilter: filter }, false, 'setSelectedFilter'),

        // Favorites Normalized Dictionary: { [id]: mediaSnapshot }
        favorites: {},
        toggleFavorite: (media) =>
          set(
            (state) => {
              if (!media?.id) return state
              const next = { ...state.favorites }
              if (next[media.id]) {
                delete next[media.id]
              } else {
                next[media.id] = {
                  id: media.id,
                  title:
                    media.title ||
                    media.name ||
                    media.original_title ||
                    media.original_name ||
                    '',
                  poster_path: media.poster_path || '',
                  vote_average: media.vote_average ?? null,
                  release_date:
                    media.release_date || media.first_air_date || '',
                  media_type:
                    media.media_type || (media.title ? 'movie' : 'tv'),
                  addedAt: Date.now(),
                  genre_ids: media.genre_ids || [],
                }
              }
              return { favorites: next }
            },
            false,
            'toggleFavorite'
          ),

        // Watchlist Normalized Dictionary: { [id]: mediaSnapshot }
        watchlist: {},
        toggleWatchlist: (media) =>
          set(
            (state) => {
              if (!media?.id) return state
              const next = { ...state.watchlist }
              if (next[media.id]) {
                delete next[media.id]
              } else {
                next[media.id] = {
                  id: media.id,
                  title:
                    media.title ||
                    media.name ||
                    media.original_title ||
                    media.original_name ||
                    '',
                  poster_path: media.poster_path || '',
                  vote_average: media.vote_average ?? null,
                  release_date:
                    media.release_date || media.first_air_date || '',
                  media_type:
                    media.media_type || (media.title ? 'movie' : 'tv'),
                  addedAt: Date.now(),
                  genre_ids:
                    media.genre_ids || media.genres?.map((g) => g.id) || [],
                }
              }
              return { watchlist: next }
            },
            false,
            'toggleWatchlist'
          ),
        comments: {},
        setComments: (media, comment, score) => {
          set(
            (state) => {
              if (
                !media?.id ||
                typeof comment !== 'string' ||
                comment.trim().length === 0
              ) {
                return state
              }
              const currentScore =
                typeof score === 'number' && score > 0
                  ? score
                  : (state.ratings?.[media.id]?.score ?? 0)
              const normalizedScore =
                currentScore > 0
                  ? Math.max(1, Math.min(10, Math.round(currentScore)))
                  : 0

              const next = { ...state.comments }
              next[media.id] = {
                id: media.id,
                comment: comment.trim(),
                score: normalizedScore,
                title:
                  media.title ||
                  media.name ||
                  media.original_title ||
                  media.original_name ||
                  '',
                poster_path: media.poster_path || '',
                vote_average: media.vote_average ?? null,
                release_date: media.release_date || media.first_air_date || '',
                media_type: media.media_type || (media.title ? 'movie' : 'tv'),
                genre_ids:
                  media.genre_ids || media.genres?.map((g) => g.id) || [],
                commentedAt: Date.now(),
                isCommented: true,
              }

              // Also keep rating in sync if score was provided
              let nextRatings = state.ratings
              if (normalizedScore > 0) {
                nextRatings = {
                  ...state.ratings,
                  [media.id]: {
                    id: media.id,
                    score: normalizedScore,
                    title: next[media.id].title,
                    poster_path: next[media.id].poster_path,
                    vote_average: next[media.id].vote_average,
                    release_date: next[media.id].release_date,
                    media_type: next[media.id].media_type,
                    genre_ids: next[media.id].genre_ids,
                    ratedAt: Date.now(),
                    isRated: true,
                  },
                }
              }

              return { comments: next, ratings: nextRatings }
            },
            false,
            'setComments'
          )
        },
        removeComment: (id) =>
          set(
            (state) => {
              if (!id || !state.comments[id]) return state
              const next = { ...state.comments }
              delete next[id]
              return { comments: next }
            },
            false,
            'removeComment'
          ),
        // Ratings Normalized Dictionary: { [id]: { score, ratedAt, ...mediaSnapshot } }
        ratings: {},
        setRating: (media, score) => {
          set(
            (state) => {
              if (!media?.id || typeof score !== 'number') return state
              const normalizedScore = Math.max(
                1,
                Math.min(10, Math.round(score))
              )
              const next = { ...state.ratings }
              next[media.id] = {
                id: media.id,
                score: normalizedScore,
                title:
                  media.title ||
                  media.name ||
                  media.original_title ||
                  media.original_name ||
                  '',
                poster_path: media.poster_path || '',
                vote_average: media.vote_average ?? null,
                release_date: media.release_date || media.first_air_date || '',
                media_type: media.media_type || (media.title ? 'movie' : 'tv'),
                genre_ids:
                  media.genre_ids || media.genres?.map((g) => g.id) || [],
                ratedAt: Date.now(),
                isRated: true,
              }
              return { ratings: next }
            },
            false,
            'setRating'
          )
        },
        removeRating: (id) =>
          set(
            (state) => {
              if (!id || !state.ratings[id]) return state
              const next = { ...state.ratings }
              delete next[id]
              return { ratings: next }
            },
            false,
            'removeRating'
          ),

        // Active / Selected items
        selectedItem: null,
        setSelectedItem: (item) =>
          set({ selectedItem: item }, false, 'setSelectedItem'),
        clearSelectedItem: () =>
          set({ selectedItem: null }, false, 'clearSelectedItem'),

        // Reset all store state
        resetStore: () =>
          set(
            {
              searchQuery: '',
              selectedFilter: 'all',
              selectedItem: null,
            },
            false,
            'resetStore'
          ),
      }),
      {
        name: 'frame-finder-storage', // name in localStorage
        partialize: (state) => ({
          theme: state.theme,
          selectedFilter: state.selectedFilter,
          favorites: state.favorites,
          watchlist: state.watchlist,
          ratings: state.ratings,
          comments: state.comments,
        }),
      }
    ),
    { name: 'ScoutStore' }
  )
)

export default useStore
