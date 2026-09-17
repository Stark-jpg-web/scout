import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import BrandLogo from '../ui/BrandLogo'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const links = {
    Discover: { to: '/', label: t('navigation.discover') },
    Search: { to: '/search', label: t('navigation.search') },
    Watchlist: { to: '/watchlist', label: t('navigation.watchlist') },
    Favorites: { to: '/favorites', label: t('navigation.favorites') },
    Genres: { to: '/#genres', label: t('navigation.genres') },
  }

  const handleLinkClick = (to) => {
    if (to === '/#genres') {
      const el = document.getElementById('genres')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
      {/* Luxury Glassmorphic Card Container with Rim Glow */}
      <div className="relative rounded-3xl bg-surface/60 border border-border/50 backdrop-blur-md p-6 sm:p-10 shadow-[0_0_50px_-15px_rgba(215,168,71,0.15)] overflow-hidden">
        {/* Top Rim Golden Highlight Effect */}
        <div
          aria-hidden="true"
          className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_15px_rgba(215,168,71,0.7)] pointer-events-none"
        />

        {/* Upper Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link
              to="/"
              onClick={() => handleLinkClick('/')}
              className="inline-flex items-center gap-3.5 group"
              aria-label="Scout"
            >
              <BrandLogo size="footer" />
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                  {t('app.name')}
                </h1>
                <span className="text-xs text-muted font-medium leading-tight">
                  {t('app.tagline')}
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4 md:ps-8 lg:ps-16">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary/90">
              {t('footer.quickLinks')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {Object.values(links).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => handleLinkClick(link.to)}
                  className="text-xs sm:text-sm text-muted hover:text-primary transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Glowing Golden Divider Highlight */}
        <div
          aria-hidden="true"
          className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_10px_rgba(215,168,71,0.35)]"
        />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          {/* Copyright & Legal Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span>
              © {currentYear} Scout. {t('footer.rightsReserved')}
            </span>
            <span className="opacity-40">|</span>
            <Link
              to="/terms"
              onClick={() => handleLinkClick('/terms')}
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {t('footer.terms')}
            </Link>
            <span className="opacity-40">•</span>
            <Link
              to="/privacy"
              onClick={() => handleLinkClick('/privacy')}
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {t('footer.privacy')}
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100009122471565"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted hover:text-primary hover:scale-115 hover:drop-shadow-[0_0_8px_rgba(215,168,71,0.7)] transition-all duration-200"
            >
              <FaFacebook className="text-lg" />
            </a>
            <a
              href="https://www.instagram.com/microwavable_stark/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted hover:text-primary hover:scale-115 hover:drop-shadow-[0_0_8px_rgba(215,168,71,0.7)] transition-all duration-200"
            >
              <FaInstagram className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
