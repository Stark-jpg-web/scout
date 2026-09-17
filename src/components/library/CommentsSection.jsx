import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaStar,
  FaRegStar,
  FaTimes,
  FaPaperPlane,
  FaEdit,
  FaTrashAlt,
  FaUser,
  FaCommentDots,
} from 'react-icons/fa'
import useLibrary from '../../hooks/useLibrary.js'

export default function CommentsSection({
  media,
  showLabel = true,
  className = '',
}) {
  const { t, i18n } = useTranslation()
  const {
    comment,
    commentData,
    rating,
    setRating,
    setComments,
    removeRating,
    removeComment,
  } = useLibrary(media)

  const [prevMediaId, setPrevMediaId] = useState(media?.id)
  const [commentText, setCommentText] = useState(comment || '')
  const [isEditing, setIsEditing] = useState(false)
  const [hoveredScore, setHoveredScore] = useState(null)

  // Reset local form state when navigating between different media items
  if (media?.id !== prevMediaId) {
    setPrevMediaId(media?.id)
    setCommentText(comment || '')
    setIsEditing(false)
  }

  const activeScore = hoveredScore !== null ? hoveredScore : rating

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!commentText.trim()) return

    setComments(commentText.trim(), rating)
    setIsEditing(false)
  }

  const handleDelete = () => {
    removeComment()
    setCommentText('')
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setCommentText(comment || '')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setCommentText(comment || '')
    setIsEditing(false)
  }

  // Format date nicely according to current language
  const formattedDate = commentData?.commentedAt
    ? new Date(commentData.commentedAt).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-EG' : 'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      )
    : null

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border/50 shadow-lg space-y-4 ${className}`}
      role="group"
      aria-label={t('comments.title', 'Discussion & Reviews')}
    >
      {/* 1. Header & Current Score Display */}
      {showLabel && (
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FaStar className="text-xs" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-none">
                {t('rating.rateTitle', 'Rate & Review')}
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                {t('comments.rateFirstNotice', 'Select a rating (1-10) with your review')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rating > 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                <span className="text-xs font-bold font-mono text-primary">
                  {rating}
                  <span className="text-[10px] text-primary/70 font-normal">/10</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeRating()}
                  aria-label={t('rating.clear', 'Clear rating')}
                  title={t('rating.clear', 'Clear rating')}
                  className="p-0.5 rounded text-primary/70 hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-muted/70 font-mono">
                {t('rating.notRated', 'Not rated yet')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. 10-Star Interactive Rating Bar */}
      <div className="space-y-1.5">
        <div
          className="flex items-center justify-between gap-1 py-1 px-1 bg-surface-elevated/40 rounded-xl border border-border/30"
          onMouseLeave={() => setHoveredScore(null)}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((starNumber) => {
            const isFilled = starNumber <= activeScore
            return (
              <button
                key={starNumber}
                type="button"
                onClick={() => setRating(starNumber)}
                onMouseEnter={() => setHoveredScore(starNumber)}
                onFocus={() => setHoveredScore(starNumber)}
                onBlur={() => setHoveredScore(null)}
                aria-label={t('rating.rateScore', { score: starNumber })}
                className={`p-1.5 rounded-lg transition-all duration-150 transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isFilled
                    ? 'text-primary drop-shadow-[0_0_8px_rgba(215,168,71,0.5)]'
                    : 'text-muted/30 hover:text-primary/60'
                }`}
              >
                {isFilled ? (
                  <FaStar className="text-base sm:text-lg" />
                ) : (
                  <FaRegStar className="text-base sm:text-lg" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Comment Input / Editor */}
      {(!comment || isEditing) && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <label
              htmlFor="user-comment-input"
              className="text-xs font-semibold text-foreground/90 flex items-center justify-between"
            >
              <span>{t('comments.yourComment', 'Your Review & Comment')}</span>
              <span className="text-[10px] font-mono text-muted">
                {commentText.length}/500
              </span>
            </label>
            <textarea
              id="user-comment-input"
              rows={3}
              maxLength={500}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t(
                'comments.writePlaceholder',
                'Share your thoughts, impressions, or review about this title...'
              )}
              className="w-full p-3 text-sm text-foreground bg-surface-elevated/70 border border-border/60 rounded-xl placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-muted hover:text-foreground bg-surface-elevated/80 border border-border/50 hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                {t('comments.cancel', 'Cancel')}
              </button>
            )}
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
            >
              <FaPaperPlane className="text-[10px]" />
              <span>
                {isEditing
                  ? t('comments.update', 'Update')
                  : t('comments.send', 'Post Comment')}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Display Area for User Comment and Rating */}
      {comment && !isEditing && (
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FaCommentDots className="text-primary text-xs" />
              {t('comments.userReview', 'Your Review')}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleStartEdit}
                title={t('comments.edit', 'Edit')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-foreground/80 hover:text-primary bg-surface-elevated/60 hover:bg-surface-elevated border border-border/40 transition-colors cursor-pointer"
              >
                <FaEdit className="text-[11px]" />
                <span className="text-[11px]">{t('comments.edit', 'Edit')}</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title={t('comments.delete', 'Delete')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-accent hover:bg-accent/10 border border-border/40 transition-colors cursor-pointer"
              >
                <FaTrashAlt className="text-[11px]" />
                <span className="text-[11px]">{t('comments.delete', 'Delete')}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border/60 hover:border-border transition-colors space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                  <FaUser className="text-[11px]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {t('comments.you', 'You')}
                  </div>
                  {formattedDate && (
                    <div className="text-[10px] text-muted font-mono">
                      {formattedDate}
                    </div>
                  )}
                </div>
              </div>

              {(commentData?.score > 0 || rating > 0) && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                  <FaStar className="text-[10px]" />
                  <span>{commentData?.score || rating}/10</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
              {comment}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
