import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Trail } from '@/components/art/Trail'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { home } from '@/content/home'
import { features } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: features.meta.title,
  description: features.meta.description,
  path: '/features',
})

/**
 * Nine capabilities, each with the part of the product that delivers it.
 * One ribbon threads them together, swapping sides with the layout.
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
            items={items.map((item) => ({
              key: item.id,
              copy: (
                <div id={item.id} className="trail__anchor">
                  <p className="trail__kicker">{item.name}</p>
                  <h2 className="trail__title" data-scroll="rise">
                    {item.title}
                  </h2>
                  <p className="trail__body">{item.body}</p>
                </div>
              ),
              visual:
                item.preview === 'reengage' ? (
                  <ReengagePreview
                    name={home.second.lead.name}
                    lastContact={home.second.lead.lastContact}
                    steps={home.second.steps}
                  />
                ) : (
                  <ProductPreview kind={item.preview} />
                ),
            }))}
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
