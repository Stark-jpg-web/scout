function MediaCardSkeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`media-card-skeleton relative flex flex-col gap-3 rounded-xl overflow-hidden bg-surface border border-border/40 p-2.5 ${className}`}
    >
      {/* 1. Poster Canvas: Strict 2:3 aspect ratio matches MediaCard exactly */}
      <div className="poster-canvas relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-muted border border-border/40 animate-pulse" />

      {/* 2. Metadata Placeholder */}
      <div className="space-y-2 text-center">
        {/* Badge placeholder */}
        <div className="h-4 w-16 mx-auto rounded-full bg-surface-muted/60 animate-pulse" />

        {/* Title placeholder */}
        <div className="h-4 w-3/4 mx-auto rounded bg-surface-muted/80 animate-pulse" />

        {/* Overview lines */}
        <div className="space-y-1 py-1">
          <div className="h-2.5 w-full rounded bg-surface-muted/50 animate-pulse" />
          <div className="h-2.5 w-4/5 mx-auto rounded bg-surface-muted/50 animate-pulse" />
        </div>

        {/* Release Date row */}
        <div className="h-3 w-1/2 mx-auto rounded bg-surface-muted/40 animate-pulse" />
      </div>
    </div>
  )
}

export default MediaCardSkeleton
