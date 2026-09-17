import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../useStore.js'

describe('Zustand useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      theme: 'dark',
      mediaType: 'movie',
      searchQuery: '',
      selectedFilter: 'all',
      favorites: {},
      watchlist: {},
      ratings: {},
      comments: {},
    })
  })

  describe('theme & mediaType toggles', () => {
    it('toggles theme between dark and light', () => {
      expect(useStore.getState().theme).toBe('dark')
      useStore.getState().toggleTheme()
      expect(useStore.getState().theme).toBe('light')
      useStore.getState().toggleTheme()
      expect(useStore.getState().theme).toBe('dark')
    })

    it('toggles mediaType between movie and tv', () => {
      expect(useStore.getState().mediaType).toBe('movie')
      useStore.getState().toggleMediaType()
      expect(useStore.getState().mediaType).toBe('tv')
      useStore.getState().toggleMediaType()
      expect(useStore.getState().mediaType).toBe('movie')
    })
  })

  describe('favorites collection management', () => {
    const sampleMovie = {
      id: 550,
      title: 'Fight Club',
      poster_path: '/fightclub.jpg',
      vote_average: 8.4,
      release_date: '1999-10-15',
    }

    it('adds and removes a movie from favorites dictionary', () => {
      expect(useStore.getState().favorites[550]).toBeUndefined()

      // 1. Add to favorites
      useStore.getState().toggleFavorite(sampleMovie)
      const fav = useStore.getState().favorites[550]
      expect(fav).toBeDefined()
      expect(fav.title).toBe('Fight Club')
      expect(fav.id).toBe(550)

      // 2. Remove from favorites
      useStore.getState().toggleFavorite(sampleMovie)
      expect(useStore.getState().favorites[550]).toBeUndefined()
    })
  })

  describe('watchlist collection management', () => {
    const sampleShow = {
      id: 1399,
      name: 'Game of Thrones',
      poster_path: '/got.jpg',
      vote_average: 8.4,
      first_air_date: '2011-04-17',
    }

    it('adds and removes a show from watchlist dictionary', () => {
      expect(useStore.getState().watchlist[1399]).toBeUndefined()

      // 1. Add to watchlist
      useStore.getState().toggleWatchlist(sampleShow)
      const item = useStore.getState().watchlist[1399]
      expect(item).toBeDefined()
      expect(item.title).toBe('Game of Thrones')

      // 2. Remove from watchlist
      useStore.getState().toggleWatchlist(sampleShow)
      expect(useStore.getState().watchlist[1399]).toBeUndefined()
    })
  })

  describe('ratings and comments management', () => {
    const sampleMedia = {
      id: 157336,
      title: 'Interstellar',
      poster_path: '/interstellar.jpg',
    }

    it('sets and removes personal rating for a title', () => {
      useStore.getState().setRating(sampleMedia, 9)
      expect(useStore.getState().ratings[157336]?.score).toBe(9)

      useStore.getState().removeRating(157336)
      expect(useStore.getState().ratings[157336]).toBeUndefined()
    })

    it('sets and removes review comments with score synchronization', () => {
      useStore.getState().setComments(sampleMedia, 'Masterpiece of cinema!', 10)
      const commentEntry = useStore.getState().comments[157336]

      expect(commentEntry).toBeDefined()
      expect(commentEntry.comment).toBe('Masterpiece of cinema!')
      expect(commentEntry.score).toBe(10)
      expect(useStore.getState().ratings[157336]?.score).toBe(10)

      // Remove comment
      useStore.getState().removeComment(157336)
      expect(useStore.getState().comments[157336]).toBeUndefined()
    })
  })
})
