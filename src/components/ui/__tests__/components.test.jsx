import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RatingBadge from '../RatingBadge.jsx'
import FavoriteBadge from '../FavoriteBadge.jsx'
import Watchlist from '../Watchlist.jsx'
import MediaTypeSwitcher from '../MediaTypeSwitcher.jsx'
import useStore from '../../../store/useStore.js'

// Helper wrapper to provide routing context
function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('UI Badges & Switchers', () => {
  beforeEach(() => {
    useStore.setState({
      theme: 'dark',
      mediaType: 'movie',
      favorites: {},
      watchlist: {},
      ratings: {},
    })
  })

  describe('RatingBadge', () => {
    it('renders formatted 1-decimal score correctly', () => {
      render(<RatingBadge rating={8.432} />)
      expect(screen.getByText('8.4')).toBeInTheDocument()
    })

    it('displays -- for undefined or null rating', () => {
      render(<RatingBadge rating={undefined} />)
      expect(screen.getByText('--')).toBeInTheDocument()
    })
  })

  describe('FavoriteBadge', () => {
    const sampleMovie = { id: 101, title: 'Inception' }

    it('toggles favorite status on click and updates store', () => {
      render(<FavoriteBadge media={sampleMovie} />)
      const btn = screen.getByRole('button')

      expect(useStore.getState().favorites[101]).toBeUndefined()

      fireEvent.click(btn)
      expect(useStore.getState().favorites[101]).toBeDefined()
      expect(useStore.getState().favorites[101].title).toBe('Inception')

      fireEvent.click(btn)
      expect(useStore.getState().favorites[101]).toBeUndefined()
    })
  })

  describe('Watchlist', () => {
    const sampleShow = { id: 202, name: 'Breaking Bad' }

    it('toggles watchlist status on click and updates store', () => {
      render(<Watchlist media={sampleShow} />)
      const btn = screen.getByRole('button')

      expect(useStore.getState().watchlist[202]).toBeUndefined()

      fireEvent.click(btn)
      expect(useStore.getState().watchlist[202]).toBeDefined()
      expect(useStore.getState().watchlist[202].title).toBe('Breaking Bad')

      fireEvent.click(btn)
      expect(useStore.getState().watchlist[202]).toBeUndefined()
    })
  })

  describe('MediaTypeSwitcher', () => {
    it('renders segmented buttons and toggles mediaType in store', () => {
      renderWithRouter(<MediaTypeSwitcher />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)

      expect(useStore.getState().mediaType).toBe('movie')

      // Click TV Shows (second button)
      fireEvent.click(buttons[1])
      expect(useStore.getState().mediaType).toBe('tv')

      // Click Movies (first button)
      fireEvent.click(buttons[0])
      expect(useStore.getState().mediaType).toBe('movie')
    })
  })
})
