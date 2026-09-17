import MediaCard from './MediaCard.jsx'
import MediaCardSkeleton from './MediaCardSkeleton.jsx'

function MediaGrid({
  items = [],
  isLoading = false,
  skeletonCount = 12,
  badgeVariant,
  className = '',
}) {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 ${className}`}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MediaCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-6 ${className}`}
    >
      {items.map((item) => (
        <MediaCard key={item.id} media={item} badgeVariant={badgeVariant} />
      ))}
    </div>
  )
}

export default MediaGrid
