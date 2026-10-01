import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TrendingSpotlight from '../TrendingSpotlight.jsx'
import useStore from '../../../store/useStore.js'

// Simple mock for i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
  }),
}))

const sampleItems = [
  {
    id: 102,
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen.',
    vote_average: 8.5,
    release_date: '2024-03-01',
    backdrop_path: '/backdrop102.jpg',
  },
  {
    id: 103,
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer.',
    vote_average: 8.9,
    release_date: '2023-07-21',
    backdrop_path: '/backdrop103.jpg',
  },
]

describe('TrendingSpotlight Component', () => {
  beforeEach(() => {
    useStore.setState({
      favorites: {},
      watchlist: {},
      ratings: {},
    })
  })

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(
      <BrowserRouter>
        <TrendingSpotlight items={[]} isLoading={true} />
      </BrowserRouter>
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders null when items array is empty and not loading', () => {
    const { container } = render(
      <BrowserRouter>
        <TrendingSpotlight items={[]} isLoading={false} />
      </BrowserRouter>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders spotlight with correct rank starting from #2', () => {
    render(
      <BrowserRouter>
        <TrendingSpotlight items={sampleItems} isLoading={false} />
      </BrowserRouter>
    )

    // Check title of first passed item (which is #2 overall trending)
    expect(
      screen.getByRole('heading', { name: 'Dune: Part Two' })
    ).toBeInTheDocument()
    // Rank label starting from #2
    expect(screen.getByText('#2 media.trending')).toBeInTheDocument()
    // Check overview
    expect(
      screen.getByText('Paul Atreides unites with Chani and the Fremen.')
    ).toBeInTheDocument()
  })

  it('invokes onCardClick when clicking View Details button', () => {
    const handleCardClick = vi.fn()
    render(
      <BrowserRouter>
        <TrendingSpotlight
          items={sampleItems}
          isLoading={false}
          onCardClick={handleCardClick}
        />
      </BrowserRouter>
    )

    const viewDetailsButtons = screen.getAllByText('media.viewDetails')
    fireEvent.click(viewDetailsButtons[0])
    expect(handleCardClick).toHaveBeenCalledWith(sampleItems[0])
  })
})
