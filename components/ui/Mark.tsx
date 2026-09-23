/**
 * Brand mark: an open loop and the piece that closes it.
 *
 * The gap sits at the upper right so the glyph reads as a ring rather than a
 * letterform. Geometric and quiet — the wordmark carries the identity.
 */
export function Mark({ className = 'h-4 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <path
        d="M16.31 8.07A6.6 6.6 0 1 1 11.93 3.69"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16.29" cy="3.71" r="1.75" fill="currentColor" />
    </svg>
  )
}

export function Wordmark({
  className = '',
  markClassName = 'h-[1.05em] w-auto',
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-[0.5em] text-[1.0625rem] leading-none font-medium tracking-[-0.035em] ${className}`}
    >
      <Mark className={markClassName} />
      CloseAgain
    </span>
  )
}
