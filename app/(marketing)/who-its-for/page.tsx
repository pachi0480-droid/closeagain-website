import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { Arrow } from '@/components/ui/links'
import { whoItsFor } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: whoItsFor.meta.title,
  description: whoItsFor.meta.description,
  path: '/who-its-for',
})

/**
 * Eight kinds of lead-driven business. Each card opens the buying form with
 * that industry already chosen.
 */
export default function WhoItsForPage() {
  const { industries, closing } = whoItsFor

  return (
    <>
      <PageIntro eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} lede={whoItsFor.lede} />

      <section className="industries" aria-label="Industries">
        <div className="wrap">
          <ul className="industries__grid">
            {industries.map((industry, i) => (
              <li
                key={industry.id}
                className="industry"
                data-reveal
                style={{ '--reveal-delay': `${(i % 4) * 80}ms` } as CSSProperties}
              >
                <Link href={`/contact?industry=${encodeURIComponent(industry.formValue)}`} className="industry__link">
                  <span className="industry__media">
                    <Image
                      src={industry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1180px) 300px, (min-width: 560px) 45vw, 92vw"
                      className="industry__image"
                      loading={i < 4 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : undefined}
                    />
                  </span>
                  <span className="industry__text">
                    <span className="industry__name">{industry.name}</span>
                    <span className="industry__outcome">{industry.outcome}</span>
                    <span className="industry__go">
                      <span className="sr-only">Talk to us about {industry.name}</span>
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="industries__note">{whoItsFor.imageNote}</p>
        </div>
      </section>

      <ClosingCta id="closing-title" title={closing.title} body={closing.body} cta={closing.cta} />

      <p className="big-word big-word--end wrap" aria-hidden="true" data-reveal>
        {whoItsFor.word}
      </p>
    </>
  )
}
