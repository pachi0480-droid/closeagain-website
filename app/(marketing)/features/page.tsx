import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Trail } from '@/components/art/Trail'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { features } from '@/content/pages'
import { availability } from '@/content/pricing'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: features.meta.title,
  description: features.meta.description,
  path: '/features',
})

/**
 * Nine capabilities, each with the part of the product that delivers it. One
 * ribbon threads them together, swapping sides with the layout; it follows
 * the reader's progress down the page. Which plans include each capability
 * is read from the pricing data, so the two pages can never disagree.
 */
export default function FeaturesPage() {
  const { items, closing } = features

  return (
    <>
      <PageIntro eyebrow={features.eyebrow} title={features.title} lede={features.lede}>
        <nav className="feature-index" aria-label="Features on this page">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <section className="trail-section" aria-label="Features">
        <div className="wrap">
          <Trail
            id="features"
            label="CloseAgain features"
            items={items.map((item) => {
              const plans = availability(item.row)
              return {
                key: item.id,
                copy: (
                  <div id={item.id} className="trail__anchor">
                    <p className="trail__kicker">{item.name}</p>
                    <h2 className="trail__title">{item.title}</h2>
                    <p className="trail__body">{item.body}</p>
                    <p className="trail__plans">
                      <span className="trail__plans-label">Included on</span>{' '}
                      {plans.summary === 'Every plan' ? 'every plan' : plans.summary}
                    </p>
                  </div>
                ),
                visual: item.preview === 'reengage' ? <ReengagePreview /> : <ProductPreview kind={item.preview} />,
              }
            })}
          />
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        body={closing.body}
        cta={closing.cta}
        secondary={closing.secondary}
        art={<ClosingRibbon id="features-closing" />}
      />
    </>
  )
}
