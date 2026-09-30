import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Bubble } from '@/components/art/Bubble'
import { Arrow } from '@/components/ui/links'
import type { Industry } from '@/content/industries'

/**
 * The industries as an editorial index: a number, the name, what CloseAgain
 * does for it, and one sample exchange from that industry's own page — the
 * follow-up and the reply that stops it. No photography: the words do the
 * work.
 *
 * Each row is one link (the name, stretched over the row), so there is one
 * tab stop per industry and its focus ring outlines the whole row.
 */
export function IndustryIndex({
  industries,
  label,
  go,
  moment,
}: {
  industries: readonly Industry[]
  /** The list's accessible name. */
  label: string
  /** The visible link cue, e.g. “See how it works”. */
  go: string
  /** The small caps label over each sample. */
  moment: string
}) {
  return (
    <ol className="ind-index" aria-label={label}>
      {industries.map((industry, i) => {
        // The first sample with a reply tells the whole story in two bubbles.
        const sample = industry.examples.find((example) => example.reply) ?? industry.examples[0]
        return (
          <li
            key={industry.id}
            className="ind-row"
            data-reveal
            style={{ '--reveal-delay': `${Math.min(i, 3) * 60}ms` } as CSSProperties}
          >
            <span className="ind-row__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="ind-row__text">
              <h2 className="ind-row__name">
                <Link href={industry.path} className="ind-row__link">
                  {industry.name}
                </Link>
              </h2>
              <p className="ind-row__outcome">{industry.outcome}</p>
            </div>

            {sample && (
              <figure className="ind-row__sample" aria-label={`${moment}: ${sample.moment}`} data-chat>
                <figcaption className="ind-row__moment">{sample.moment}</figcaption>
                <Bubble tone="ask" className="ind-row__bubble">
                  {sample.message}
                </Bubble>
                {sample.reply && (
                  <Bubble tone="reply" className="ind-row__bubble ind-row__bubble--reply" typing>
                    {sample.reply}
                  </Bubble>
                )}
              </figure>
            )}

            {/* The link's cue: words on phones, a round arrow on wide screens. */}
            <p className="ind-row__go" aria-hidden="true">
              <span>{go}</span>
              <Arrow />
            </p>
            <span className="ind-row__cue" aria-hidden="true">
              <Arrow />
            </span>
          </li>
        )
      })}
    </ol>
  )
}
