import type { Metadata } from 'next'
import Link from 'next/link'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { faq } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: faq.meta.title,
  description: faq.meta.description,
  path: '/faq',
})

/**
 * Native <details> rows: real disclosure semantics, keyboard support, any
 * number open at once, and browser find-in-page can open a closed answer.
 */
export default function FaqPage() {
  return (
    <>
      <PageIntro eyebrow={faq.eyebrow} title={faq.title} lede={faq.lede} />

      <section className="section section--flush-top" aria-label="Questions and answers">
        <div className="wrap">
          <div className="faq">
            {faq.items.map((item, i) => (
              <details key={item.q} className="faq__item" open={i === 0}>
                <summary className="faq__q">
                  <span className="faq__q-text">{item.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <div className="faq__a">
                  <p>{item.a}</p>
                  {'links' in item && item.links && (
                    <p className="faq__links">
                      {item.links.map((link) => (
                        <Link key={link.href} href={link.href} className="prose-link">
                          {link.label}
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta id="closing-title" title={faq.closing.title} cta={faq.closing.cta} />
    </>
  )
}
