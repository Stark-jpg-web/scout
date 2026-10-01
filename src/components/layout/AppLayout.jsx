import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import useStore from '../../store/useStore'
import { useEffect } from 'react'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import SmoothScrollContainer from '../ui/SmoothScrollContainer'

function AppLayout() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      <ScrollToTop />
      <Navbar />
      <SmoothScrollContainer className="flex-1">
        <div className="min-h-full flex flex-col justify-between">
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </SmoothScrollContainer>
    </div>
  )
}

export default AppLayout
