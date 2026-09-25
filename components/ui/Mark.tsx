/**
 * The CloseAgain mark.
 *
 * A signal begins low and runs. It is interrupted. A bridge climbs from the
 * break to a new position, the signal resumes there, and it resolves into one
 * solid endpoint. Three strokes and a dot: it survives 16px, works in a single
 * colour, and carries no metaphor borrowed from a trade.
 *
 * On load the bridge draws itself and the endpoint lands — the disconnection
 * closing, which is the whole product in one gesture.
 */
export function Mark({
  className = 'h-[1.05em] w-auto',
  animated = true,
}: {
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 26 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* the signal, before the break */}
      <path
        d="M2 13H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the bridge across the break */}
      <path
        d="M8 13L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'mark-bridge' : undefined}
      />
      {/* the signal, restored */}
      <path
        d="M13 5H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the booked endpoint */}
      <circle
        cx="22"
        cy="5"
        r="2.4"
        fill="currentColor"
        className={animated ? 'mark-endpoint' : undefined}
      />
    </svg>
  )
}

/** Horizontal lockup. The wordmark carries the name; the mark carries the idea. */
export function Wordmark({
  className = '',
  markClassName = 'h-[0.85em] w-auto',
  animated = true,
}: {
  className?: string
  markClassName?: string
  animated?: boolean
}) {
  return (
    <span
      className={`mark-host inline-flex items-center gap-[0.52em] text-[1.0625rem] leading-none font-semibold tracking-[-0.03em] ${className}`}
    >
      <Mark className={markClassName} animated={animated} />
      CloseAgain
    </span>
  )
}
