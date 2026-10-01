import { createContext, useContext } from 'react'

export const SmoothScrollContext = createContext(null)

export function useSmoothScrollbar() {
  return useContext(SmoothScrollContext)
}
