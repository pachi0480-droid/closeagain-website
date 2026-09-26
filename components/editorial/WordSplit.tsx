import type { ReactNode } from 'react'

/**
 * The oversized vermilion word, a fine vertical rule, and a short passage —
 * the “Again.” composition from the reference, reused for “Clarity.” and the
 * About statement.
 *
 * The big word is presentational emphasis; `heading` (when given) is the real
 * section heading so the outline stays meaningful.
 */
export function WordSplit({
  word,
  heading,
  children,
  id,
  className,
  headingLevel = 'h2',
}: {
  word: string
  heading?: string
  children: ReactNode
  id?: string
  className?: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  return (
    <section
      className={['word-split', className].filter(Boolean).join(' ')}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="word-split__inner wrap">
        {heading ? (
          <p className="word-split__word" aria-hidden="true" data-reveal>
            {word}
          </p>
        ) : (
          <Heading id={id ? `${id}-title` : undefined} className="word-split__word" data-reveal>
            {word}
          </Heading>
        )}
        <span className="word-split__rule" aria-hidden="true" />
        <div className="word-split__body">
          {heading && (
            <Heading id={id ? `${id}-title` : undefined} className="word-split__heading">
              {heading}
            </Heading>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
