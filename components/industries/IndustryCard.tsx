import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import type { Industry } from '@/content/industries'

/**
 * One industry: image, name, the one-line outcome and a link to its page.
 * The whole card is the target (the link stretches over it), so there is
 * exactly one link per card and its focus ring outlines the card.
 */
export function IndustryCard({
  industry,
  label,
  headingLevel = 'h2',
  index = 0,
  sizes,
  eager = false,
}: {
  industry: Industry
  /** The link text, e.g. “See how it works”. The industry is added for screen readers. */
  label: string
  headingLevel?: 'h2' | 'h3'
  index?: number
  sizes: string
  eager?: boolean
}) {
  const Heading = headingLevel
  return (
    <li className="industry" data-reveal style={{ '--reveal-delay': `${(index % 4) * 70}ms` } as CSSProperties}>
      <span className="industry__media">
        <Image
          src={industry.image}
          alt=""
          fill
          sizes={sizes}
          className="industry__image"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager && index === 0 ? 'high' : undefined}
        />
      </span>
      <div className="industry__text">
        <Heading className="industry__name">{industry.name}</Heading>
        <p className="industry__outcome">{industry.outcome}</p>
        <Link href={industry.path} className="industry__go">
          <span>
            {label}
            <span className="sr-only"> for {industry.audience}</span>
          </span>
          <Arrow />
        </Link>
      </div>
    </li>
  )
}
