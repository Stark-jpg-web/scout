import { GiCompass } from 'react-icons/gi'
import LinkButton from '../ui/LinkButton'

function EmptyState({
  icon = <GiCompass />,
  title,
  description,
  descreption,
  actionLabel,
  actionTo = '/',
}) {
  const resolvedDescription = description || descreption

  return (
    <div className="external-border rounded-xl border-2 border-border p-2 relative">
      <div
        className="absolute top-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_10px_rgba(215,168,71,0.35)]"
        aria-hidden="true"
      />
      <div className="internal-border shadow-inner rounded-xl border-2 border-dashed border-border bg-surface/50 p-12 text-center">
        <div className="icon flex justify-center items-center text-primary text-6xl animate-pulse bg-gradient-to-b from-primary bg-clip-text">
          {icon}
        </div>
        <div className="text-group my-4">
          <h2 className="text-primary text-2xl sm:text-3xl font-bold">{title}</h2>
          {resolvedDescription && (
            <p className="text-muted text-base mt-2 max-w-md mx-auto">{resolvedDescription}</p>
          )}
        </div>
        {actionLabel && (
          <div className="action-button mt-4">
            <LinkButton
              icon={<GiCompass />}
              actionTo={actionTo}
              text={actionLabel}
              className=""
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState
