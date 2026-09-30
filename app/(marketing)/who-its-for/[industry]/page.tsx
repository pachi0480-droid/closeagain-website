import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bubble } from '@/components/art/Bubble'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Trail } from '@/components/art/Trail'
import { ClosingCta, SectionHead } from '@/components/editorial/blocks'
import { Words } from '@/components/editorial/Words'
import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { PlanCards } from '@/components/pricing/Plans'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { includedOn, industries, industryById, industryBySlug, industryPage, type SampleMessage } from '@/content/industries'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ industry: string }> }

/** Every industry page is prerendered; any other slug is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = industryBySlug((await params).industry)
  if (!industry) return {}
  return pageMetadata({ title: industry.title, description: industry.description, path: industry.path })
}

/** One sample message, as it would be sent, with the reply that stops the follow-up. */
function Sample({ sample }: { sample: SampleMessage }) {
  const { examples } = industryPage
  return (
    <figure className="sample ind-sample" aria-label={`${examples.note} ${sample.moment}`} data-chat>
      <p className="sample__moment">{sample.moment}</p>
      <p className="sample__who">{examples.sent}</p>
      <Bubble tone="ask" className="sample__bubble">
        {sample.message}
      </Bubble>
      {sample.reply && (
        <>
          <Bubble tone="reply" className="sample__bubble sample__bubble--reply" typing>
            {sample.reply}
          </Bubble>
          <p className="sample__stop">{examples.replied}</p>
        </>
      )}
      <figcaption className="ind-sample__note">{examples.note}</figcaption>
    </figure>
  )
}

/**
 * One industry, one page, in the site's editorial layout (as Features and How
 * it works): the introduction and the way to buy; then one ribbon threading
 * where this industry's leads slip — each beside the message CloseAgain would
 * send — and the part of the product that does the work; the plans, with the
 * industry already chosen; other industries; the next step. Every word comes
 * from content/industries.ts; plan facts come from content/pricing.ts.
 */
export default async function IndustryPage({ params }: Props) {
  const industry = industryBySlug((await params).industry)
  if (!industry) notFound()

  const page = industryPage
  const { leaks, examples, preview } = industry
  const related = industry.related.map(industryById)

  // Breadcrumbs for search results, only where there is a real public origin.
  const breadcrumbs = site.origin
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: page.overview.label, item: `${site.origin}${page.overview.href}` },
          { '@type': 'ListItem', position: 2, name: industry.name, item: `${site.origin}${industry.path}` },
        ],
      }
    : null

  const leakItems = leaks.map((leak, i) => ({
    key: leak.title,
    copy: (
      <div className="trail__anchor">
        <p className="trail__kicker">
          {String(i + 1).padStart(2, '0')} · {page.leaks.eyebrow}
        </p>
        <h2 className="trail__title">{leak.title}</h2>
        <p className="trail__body">{leak.body}</p>
        <p className="ind-fix">
          <span className="ind-fix__label">{page.leaks.fixLabel}</span> {leak.fix}
        </p>
        <p className="trail__plans">
          <span className="trail__plans-label">{page.leaks.plansLabel}</span> {includedOn(leak.row)}
        </p>
      </div>
    ),
    visual: examples[i] ? (
      <Sample sample={examples[i]} />
    ) : preview.kind === 'reengage' ? (
      <ReengagePreview />
    ) : (
      <ProductPreview kind={preview.kind} />
    ),
  }))

  return (
    <>
      <header className="intro ind-intro">
        <div className="intro__inner wrap">
          <nav className="ind-intro__crumbs eyebrow" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href={page.overview.href}>{page.overview.label}</Link>
              </li>
              <li aria-current="page">{industry.name}</li>
            </ol>
          </nav>
          <h1 id="page-title" className="intro__title">
            <Words text={`${page.titleLead} for ${industry.audience}.`} />
          </h1>
          <p className="intro__lede">{industry.lede}</p>
          <div className="ind-intro__actions">
            <ButtonLink href={industry.contactHref} size="lg">
              {page.cta}
            </ButtonLink>
            <TextLink href={page.secondary.href}>{page.secondary.label}</TextLink>
          </div>
          <p className="ind-intro__terms">{page.terms.join(' · ')}</p>
        </div>
      </header>

      <section className="trail-section ind-trail" aria-label={industry.leaksTitle}>
        <div className="wrap">
          <Trail
            id={`industry-${industry.slug}`}
            label={industry.leaksTitle}
            items={[
              ...leakItems,
              {
                key: 'inside',
                copy: (
                  <div className="trail__anchor">
                    <p className="trail__kicker">{page.preview.eyebrow}</p>
                    <h2 className="trail__title">{preview.title}</h2>
                    <p className="trail__body">{preview.body}</p>
                    <p className="trail__plans">
                      <span className="trail__plans-label">{page.leaks.plansLabel}</span> {includedOn(preview.row)}
                    </p>
                    <TextLink href={page.preview.link.href} arrow className="ind-inside__link">
                      {page.preview.link.label}
                    </TextLink>
                  </div>
                ),
                visual: preview.kind === 'reengage' ? <ReengagePreview /> : <ProductPreview kind={preview.kind} />,
              },
            ]}
          />
        </div>
      </section>

      <section className="section price-band" aria-labelledby="price-band-title">
        <div className="wrap">
          <SectionHead id="price-band-title" eyebrow={page.pricing.eyebrow} title={page.pricing.title} link={page.pricing.link} />
          <p className="price-band__note">{page.pricing.body}</p>
          <PlanCards variant="compact" industry={industry.industryValue} />
        </div>
      </section>

      <nav className="ind-related wrap" aria-labelledby="related-title">
        <p id="related-title" className="ind-related__title">
          {page.related.lead}
        </p>
        <ul className="ind-related__list">
          {related.map((other) => (
            <li key={other.id}>
              <TextLink href={other.path} arrow>
                {other.name}
              </TextLink>
            </li>
          ))}
          <li>
            <TextLink href={page.related.link.href}>{page.related.link.label}</TextLink>
          </li>
        </ul>
      </nav>

      <ClosingCta
        id="closing-title"
        title={industry.closingTitle}
        body={page.closing.body}
        cta={{ label: page.cta, href: industry.contactHref }}
        secondary={page.closing.secondary}
        art={<ClosingRibbon id="industry-closing" />}
      />

      {breadcrumbs && (
        <script
          type="application/ld+json"
          // Static, author-controlled object — no visitor input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }}
        />
      )}
    </>
  )
}
