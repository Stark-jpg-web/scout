import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Scrollbar from 'smooth-scrollbar'
import { SmoothScrollContext } from './SmoothScrollContext.js'

export default function SmoothScrollContainer({ children, className = '' }) {
  const containerRef = useRef(null)
  const [scrollbarInstance, setScrollbarInstance] = useState(null)
  const location = useLocation()

  // Detect touch/mobile devices where native scrolling is 100x faster and has 0ms INP
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      window.innerWidth < 768)

  useEffect(() => {
    if (!containerRef.current) return

    // On touch/mobile devices, use native GPU compositor scrolling for optimal INP & LCP
    if (isTouchDevice) {
      return
    }

    // Configure smooth momentum-based physics for desktop pointers only
    const scrollbar = Scrollbar.init(containerRef.current, {
      damping: 0.05,
      thumbMinSize: 24,
      renderByPixels: true,
      alwaysShowTracks: false,
      continuousScrolling: true,
    })

    setScrollbarInstance(scrollbar)

    return () => {
      if (scrollbar) {
        scrollbar.destroy()
      }
    }
  }, [isTouchDevice])

  // Automatically scroll to top or target hash on route changes
  useEffect(() => {
    if (isTouchDevice) {
      if (location.hash && containerRef.current) {
        const targetId = location.hash.replace('#', '')
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }
      containerRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      return
    }

    if (!scrollbarInstance) return

    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        scrollbarInstance.scrollIntoView(targetElement, {
          offsetTop: 20,
          onlyScrollIfNeeded: false,
        })
        return
      }
    }

    scrollbarInstance.scrollTo(0, 0, 500)
  }, [location.pathname, location.search, location.hash, scrollbarInstance, isTouchDevice])

  return (
    <SmoothScrollContext.Provider value={scrollbarInstance}>
      <div
        ref={containerRef}
        id="smooth-scroll-viewport"
        className={`w-full h-full ${
          isTouchDevice
            ? 'overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]'
            : 'overflow-hidden'
        } ${className}`.trim()}
      >
        {children}
      </div>
    </SmoothScrollContext.Provider>
  )
}

