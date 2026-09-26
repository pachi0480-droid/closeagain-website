import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import { features } from '@/content/pages'

/**
 * The four jobs, one line each, linking to the detail on the features page.
 * The homepage and the top of the features page both use it, from one source.
 */
export function JobsSummary({
  linkLabel = 'How it works',
  basePath = '/features',
}: {
  linkLabel?: string
  basePath?: string
}) {
  return (
    <ol className="jobs">
      {features.groups.map((group, i) => (
        <li
          key={group.id}
          className="jobs__item"
          data-reveal
          style={{ '--reveal-delay': `${Math.min(i, 3) * 70}ms` } as CSSProperties}
        >
          <span className="jobs__num" aria-hidden="true">
            {group.number}
          </span>
          <h3 className="jobs__title">{group.title}</h3>
          <p className="jobs__body">{group.summary}</p>
          <Link href={`${basePath}#${group.id}`} className="text-link jobs__link">
            <span>
              {linkLabel}
              <span className="sr-only">: {group.title.toLowerCase()}</span>
            </span>
            <Arrow />
          </Link>
        </li>
      ))}
    </ol>
  )
}
