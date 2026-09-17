import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import useStore from '../../store/useStore'
import { useEffect } from 'react'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'

function AppLayout() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
