import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Scrollbar from 'smooth-scrollbar'

const SmoothScrollContext = createContext(null)

export function useSmoothScrollbar() {
  return useContext(SmoothScrollContext)
}

export default function SmoothScrollContainer({ children, className = '' }) {
  const containerRef = useRef(null)
  const [scrollbarInstance, setScrollbarInstance] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (!containerRef.current) return

    // Configure smooth momentum-based physics
    const scrollbar = Scrollbar.init(containerRef.current, {
      damping: 0.08,
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
  }, [])

  // Automatically scroll to top or target hash on route changes
  useEffect(() => {
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
  }, [location.pathname, location.search, location.hash, scrollbarInstance])

  return (
    <SmoothScrollContext.Provider value={scrollbarInstance}>
      <div
        ref={containerRef}
        id="smooth-scroll-viewport"
        className={`w-full h-full overflow-hidden ${className}`.trim()}
      >
        {children}
      </div>
    </SmoothScrollContext.Provider>
  )
}
