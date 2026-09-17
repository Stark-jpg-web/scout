import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce.js'

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 400))
    expect(result.current).toBe('initial')
  })

  it('delays updating value until specified time has elapsed', () => {
    let value = 'first'
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: value },
    })

    expect(result.current).toBe('first')

    // Change input value
    value = 'second'
    rerender({ val: value })

    // Value should still be 'first' before 400ms
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('first')

    // Value updates after delay
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('second')
  })

  it('cancels previous timer if value changes rapidly', () => {
    let value = 'a'
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: value },
    })

    // Rapidly change
    value = 'ab'
    rerender({ val: value })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    value = 'abc'
    rerender({ val: value })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('a')

    // Advance remaining time for 'abc'
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('abc')
  })
})
