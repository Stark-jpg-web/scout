import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaBuilding, FaTv, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { getImageUrl, TMDB_IMAGE_SIZES } from '../../utils/constants.js'

function CompanyCard({ item, isNetwork = false }) {
  const logoUrl = item.logo_path
    ? getImageUrl(item.logo_path, TMDB_IMAGE_SIZES.POSTER_THUMB)
    : null

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:bg-surface-elevated/80 group text-center min-h-[120px]">
      {logoUrl ? (
        <div className="w-full h-14 flex items-center justify-center p-2 rounded-xl bg-white/90 dark:bg-white/95 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <img
            src={logoUrl}
            alt={item.name}
            loading="lazy"
            className="max-h-10 max-w-[85%] object-contain"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-surface-muted border border-border/60 flex items-center justify-center text-primary mb-1 transition-transform duration-300 group-hover:scale-110">
          {isNetwork ? (
            <FaTv className="text-xl" />
          ) : (
            <FaBuilding className="text-xl" />
          )}
        </div>
      )}

      <div className="mt-3 space-y-0.5 w-full">
        <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {item.name}
        </h4>
        {item.origin_country && (
          <span className="inline-block px-1.5 py-0.2 rounded bg-surface-muted text-[10px] font-mono font-semibold uppercase text-muted border border-border/40">
            {item.origin_country}
          </span>
        )}
      </div>
    </div>
  )
}

function ProductionCompaniesSection({ companies = [], networks = [] }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)

  if (
    (!companies || companies.length === 0) &&
    (!networks || networks.length === 0)
  ) {
    return null
  }

  const totalCount = (companies?.length || 0) + (networks?.length || 0)

  return (
    <div className="space-y-4 pt-4 border-t border-border/40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-start cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30 group-hover:scale-105 transition-transform">
            <FaBuilding className="text-base" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <span>{t('details.productionCompanies', 'Production Companies')}</span>
              <span className="text-muted text-sm transition-transform duration-200">
                {isOpen ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </span>
            </h2>
            <p className="text-xs text-muted">
              {totalCount} {t('details.studios', { defaultValue: 'studios & networks' })}
            </p>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 animate-fade-in">
          {/* Render TV Networks */}
          {networks?.map((network) => (
            <CompanyCard
              key={`network-${network.id}`}
              item={network}
              isNetwork={true}
            />
          ))}

          {/* Render Production Companies */}
          {companies?.map((company) => (
            <CompanyCard
              key={`company-${company.id}`}
              item={company}
              isNetwork={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductionCompaniesSection
