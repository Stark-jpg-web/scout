import { describe, it, expect } from 'vitest'
import {
  getImageUrl,
  FALLBACK_POSTER,
  TMDB_IMAGE_SIZES,
  formatDate,
  formatRunTime,
  formatCurrency,
  formatFullDate,
  badgeStyles,
} from '../constants.js'

describe('constants and formatting utilities', () => {
  describe('getImageUrl', () => {
    it('returns fallback poster when path is null or empty', () => {
      expect(getImageUrl(null)).toBe(FALLBACK_POSTER)
      expect(getImageUrl('')).toBe(FALLBACK_POSTER)
      expect(getImageUrl('null')).toBe(FALLBACK_POSTER)
    })

    it('returns raw URL if already an absolute URL', () => {
      const url = 'https://example.com/poster.jpg'
      expect(getImageUrl(url)).toBe(url)
    })

    it('constructs CDN image URL with given size', () => {
      const path = '/example.jpg'
      expect(getImageUrl(path, TMDB_IMAGE_SIZES.POSTER_CARD)).toContain('/w342/example.jpg')
      expect(getImageUrl(path, TMDB_IMAGE_SIZES.BACKDROP_LG)).toContain('/w1280/example.jpg')
    })
  })

  describe('formatDate', () => {
    it('extracts 4-digit year from release_date or first_air_date', () => {
      expect(formatDate({ release_date: '2024-05-15' })).toBe('2024')
      expect(formatDate({ first_air_date: '2021-11-24' })).toBe('2021')
    })

    it('returns null if date is missing or invalid', () => {
      expect(formatDate({})).toBeNull()
      expect(formatDate(null)).toBeNull()
    })
  })

  describe('formatRunTime', () => {
    const mockT = (key) => (key === 'media.hour' ? 'h' : key === 'media.minute' ? 'm' : '')

    it('formats minutes into hours and minutes correctly', () => {
      expect(formatRunTime(154, mockT)).toBe('2h 34m')
      expect(formatRunTime(120, mockT)).toBe('2h')
      expect(formatRunTime(45, mockT)).toBe('45m')
    })

    it('returns null for zero or negative values', () => {
      expect(formatRunTime(0, mockT)).toBeNull()
      expect(formatRunTime(-10, mockT)).toBeNull()
      expect(formatRunTime(null, mockT)).toBeNull()
    })
  })

  describe('formatCurrency', () => {
    it('formats numbers into USD currency string', () => {
      expect(formatCurrency(165000000)).toBe('$165,000,000')
      expect(formatCurrency(50000)).toBe('$50,000')
    })

    it('returns N/A for 0 or missing amount', () => {
      expect(formatCurrency(0)).toBe('N/A')
      expect(formatCurrency(null)).toBe('N/A')
    })
  })

  describe('formatFullDate', () => {
    it('formats ISO date into localized human-readable date', () => {
      expect(formatFullDate('2024-03-01', 'en-US')).toBe('March 1, 2024')
    })

    it('returns N/A for invalid date strings', () => {
      expect(formatFullDate('')).toBe('N/A')
      expect(formatFullDate(null)).toBe('N/A')
      expect(formatFullDate('invalid-date')).toBe('N/A')
    })
  })

  describe('badgeStyles', () => {
    it('returns configured style for known badge types', () => {
      expect(badgeStyles('trending')).toContain('bg-primary/20')
      expect(badgeStyles('popular')).toContain('bg-accent/20')
    })

    it('returns default primary badge style for unknown type', () => {
      expect(badgeStyles('unknown_variant')).toContain('bg-primary/20')
    })
  })
})
