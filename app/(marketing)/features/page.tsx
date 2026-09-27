import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Trail } from '@/components/art/Trail'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { JobsSummary } from '@/components/home/JobsSummary'
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
 * Features, organized around the four jobs a buyer needs done rather than a
 * list of equally weighted names. The overview at the top links to each job;
 * each job states the problem, what CloseAgain does, what the customer
 * controls, the limits, and which plans include it — plan availability is
 * read from the pricing data, so the two pages cannot disagree.
 */
export default function FeaturesPage() {
  const { groups, closing } = features

  return (
    <>
      <PageIntro eyebrow={features.eyebrow} title={features.title} lede={features.lede} className="intro--features">
        <nav className="feature-overview" aria-label="The four jobs">
          <JobsSummary linkLabel="Details" basePath="" titlesAsHeadings={false} />
        </nav>
      </PageIntro>

      <section className="trail-section" aria-label="Features, job by job">
        <div className="wrap">
          <Trail
            id="features"
            label="The four jobs CloseAgain does"
            items={groups.map((group) => ({
              key: group.id,
              copy: (
                <div id={group.id} className="trail__anchor feature-group">
                  <p className="trail__kicker">Job {group.number}</p>
                  <h2 className="trail__title feature-group__title">{group.title}</h2>
                  <p className="feature-group__problem">{group.problem}</p>

                  <ul className="feature-caps">
                    {group.capabilities.map((capability) => {
                      const plans = availability(capability.row)
                      return (
                        <li key={capability.name} className="feature-cap">
                          <h3 className="feature-cap__name">{capability.name}</h3>
                          <p className="feature-cap__does">{capability.does}</p>
                          <dl className="feature-cap__meta">
                            <div>
                              <dt>You control</dt>
                              <dd>{capability.control}</dd>
                            </div>
                            <div>
                              <dt>Plans</dt>
                              <dd>{plans.levels ? plans.levels.join(' · ') : plans.summary}</dd>
                            </div>
                          </dl>
                        </li>
                      )
                    })}
                  </ul>

                  <p className="feature-group__limits">
                    <span className="feature-group__limits-label">Good to know</span>
                    {group.limits}
                  </p>
                </div>
              ),
              visual: group.preview === 'reengage' ? <ReengagePreview /> : <ProductPreview kind={group.preview} />,
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
