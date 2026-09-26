import type { ReactNode } from 'react'

/**
 * A small conversation bubble. `ask` is the follow-up, `reply` the answer.
 * The text is real text; the little tail is decoration.
 */
export function Bubble({
  tone,
  children,
  className,
}: {
  tone: 'ask' | 'reply'
  children: ReactNode
  className?: string
}) {
  return (
    <p className={['bubble', `bubble--${tone}`, className].filter(Boolean).join(' ')}>
      {children}
      <svg className="bubble__tail" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d={tone === 'ask' ? 'M19 1C17 9.5 11 14 1 15' : 'M1 1c8.5 2 13 9 13 18'} />
      </svg>
    </p>
  )
}
