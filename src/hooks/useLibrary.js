import useStore from '../store/useStore'

export function useLibrary(media) {
  const id = media?.id

  // Atomic selectors: component only re-renders when this specific item's status changes
  const isFavorite = useStore((state) => Boolean(state.favorites[id]))
  const isWatchlisted = useStore((state) => Boolean(state.watchlist[id]))
  const rating = useStore((state) => state.ratings?.[id]?.score ?? 0)
  const commentData = useStore((state) => state.comments?.[id] ?? null)
  const comment = commentData?.comment ?? null
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const toggleWatchlist = useStore((state) => state.toggleWatchlist)
  const setRating = useStore((state) => state.setRating)
  const removeRating = useStore((state) => state.removeRating)
  const setComments = useStore((state) => state.setComments)
  const removeComment = useStore((state) => state.removeComment)

  return {
    isFavorite,
    isWatchlisted,
    rating,
    comment,
    commentData,
    toggleFavorite: () => toggleFavorite(media),
    toggleWatchlist: () => toggleWatchlist(media),
    setRating: (score) => setRating(media, score),
    removeRating: () => removeRating(id),
    setComments: (commentText, score) => setComments(media, commentText, score),
    removeComment: () => removeComment(id),
  }
}

export default useLibrary
