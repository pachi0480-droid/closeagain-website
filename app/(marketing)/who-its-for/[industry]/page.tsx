import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bubble } from '@/components/art/Bubble'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta, revealDelay, SectionHead } from '@/components/editorial/blocks'
import { IndustryCard } from '@/components/industries/IndustryCard'
import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { PlanCards } from '@/components/pricing/Plans'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { includedOn, industries, industryById, industryBySlug, industryPage } from '@/content/industries'
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

/**
 * One industry, one page: what CloseAgain does for this kind of business,
 * where its leads slip, sample wording, the part of the product that does
 * the work, the plans, and a way to buy with the industry already chosen.
 * Every word comes from content/industries.ts; plan facts come from
 * content/pricing.ts.
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

  return (
    <>
      <header className="ind-hero">
        <div className="ind-hero__inner wrap">
          <div className="ind-hero__copy">
            <nav className="ind-hero__crumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href={page.overview.href}>{page.overview.label}</Link>
                </li>
                <li aria-current="page">{industry.name}</li>
              </ol>
            </nav>
            <h1 id="page-title" className="ind-hero__title">
              <span className="ind-hero__lead">{page.titleLead}</span>{' '}
              <span className="ind-hero__for">for {industry.audience}</span>
            </h1>
            <p className="ind-hero__lede">{industry.lede}</p>
            <div className="ind-hero__actions">
              <ButtonLink href={industry.contactHref} size="lg">
                {page.cta}
              </ButtonLink>
              <TextLink href={page.secondary.href}>{page.secondary.label}</TextLink>
            </div>
            <p className="ind-hero__terms">
              {page.terms.map((term, i) => (
                <span key={term}>
                  {i > 0 && (
                    <span className="ind-hero__terms-sep" aria-hidden="true">
                      ·
                    </span>
                  )}
                  {term}
                </span>
              ))}
            </p>
          </div>

          <figure className="ind-hero__figure">
            <div className="ind-hero__frame">
              <div className="ind-hero__media">
                <Image
                  src={industry.image}
                  alt=""
                  fill
                  sizes="(min-width: 960px) 32rem, 92vw"
                  className="ind-hero__image"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* Decoration: the real sample wording has its own section below. */}
              <div className="ind-hero__exchange" aria-hidden="true">
                <Bubble tone="ask" className="ind-hero__bubble ind-hero__bubble--ask">
                  {industry.exchange.ask}
                </Bubble>
                <Bubble tone="reply" className="ind-hero__bubble ind-hero__bubble--reply">
                  {industry.exchange.reply}
                </Bubble>
              </div>
            </div>
            <figcaption className="ind-hero__note">{page.imageNote}</figcaption>
          </figure>
        </div>
      </header>

      <section className="section slips" aria-labelledby="leaks-title">
        <div className="wrap">
          <SectionHead id="leaks-title" eyebrow={page.leaks.eyebrow} title={industry.leaksTitle} />
          <ol className="slips__list">
            {leaks.map((leak, i) => (
              <li key={leak.title} className="slip" data-reveal style={revealDelay(i)}>
                <span className="slip__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="slip__title">{leak.title}</h3>
                <p className="slip__body">{leak.body}</p>
                <div className="slip__fix">
                  <p className="slip__fix-label">{page.leaks.fixLabel}</p>
                  <p className="slip__fix-body">{leak.fix}</p>
                  <p className="slip__plans">
                    {page.leaks.plansLabel} {includedOn(leak.row)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section samples" aria-labelledby="samples-title">
        <div className="wrap">
          <SectionHead id="samples-title" eyebrow={page.examples.eyebrow} title={page.examples.title} />
          <p className="samples__note">{page.examples.note}</p>
          <ul className="samples__list">
            {examples.map((example, i) => (
              <li key={example.moment} className="sample" data-reveal style={revealDelay(i)}>
                <p className="sample__moment">{example.moment}</p>
                <p className="sample__who">{page.examples.sent}</p>
                <Bubble tone="ask" className="sample__bubble">
                  {example.message}
                </Bubble>
                {example.reply && (
                  <>
                    <Bubble tone="reply" className="sample__bubble sample__bubble--reply">
                      {example.reply}
                    </Bubble>
                    <p className="sample__stop">{page.examples.replied}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section ind-view" aria-labelledby="view-title">
        <div className="ind-view__inner wrap">
          <div className="ind-view__copy" data-reveal>
            <p className="eyebrow">{page.preview.eyebrow}</p>
            <h2 id="view-title" className="ind-view__title">
              {preview.title}
            </h2>
            <p className="ind-view__body">{preview.body}</p>
            <p className="trail__plans">
              <span className="trail__plans-label">{page.leaks.plansLabel}</span> {includedOn(preview.row)}
            </p>
            <TextLink href={page.preview.link.href} arrow className="ind-view__link">
              {page.preview.link.label}
            </TextLink>
          </div>
          <div className="ind-view__visual" data-reveal style={revealDelay(1)}>
            {preview.kind === 'reengage' ? <ReengagePreview /> : <ProductPreview kind={preview.kind} />}
          </div>
        </div>
      </section>

      <section className="section price-band" aria-labelledby="price-band-title">
        <div className="wrap">
          <SectionHead id="price-band-title" eyebrow={page.pricing.eyebrow} title={page.pricing.title} link={page.pricing.link} />
          <p className="price-band__note">{page.pricing.body}</p>
          <PlanCards variant="compact" industry={industry.industryValue} />
        </div>
      </section>

      <section className="section related" aria-labelledby="related-title">
        <div className="wrap">
          <SectionHead id="related-title" eyebrow={page.related.eyebrow} title={page.related.title} link={page.related.link} />
          <ul className="industries__grid industries__grid--related">
            {related.map((other, i) => (
              <IndustryCard
                key={other.id}
                industry={other}
                label={page.related.go}
                headingLevel="h3"
                index={i}
                sizes="(min-width: 700px) 30vw, 8rem"
              />
            ))}
          </ul>
        </div>
      </section>

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
