import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'
import { site } from '@/data/site'

export type LegalSection = { id: string; heading: string; body: ReactNode }

/**
 * Shared shell for the legal pages.
 *
 * These are honest pre-launch drafts, and the page says so at the top rather
 * than presenting unreviewed text as a settled policy.
 */
export function LegalPage({
  title,
  updated,
  summary,
  sections,
}: {
  title: string
  updated: string
  summary: string
  sections: LegalSection[]
}) {
  return (
    <>
      <section className="grain relative bg-graphite pt-32 pb-14 md:pt-36 md:pb-16">
        <div className="shell">
          <Reveal y={12}>
            <Eyebrow>Legal</Eyebrow>
          </Reveal>
          <Reveal delay={80} y={16}>
            <h1 className="mt-5 max-w-[20ch] text-h2 text-warm-white">{title}</h1>
          </Reveal>
          <Reveal delay={160} y={12}>
            <p className="mt-6 font-mono text-mono-xs text-secondary uppercase">
              Last updated {updated}
            </p>
            <p className="mt-6 max-w-[58ch] text-lede text-muted">{summary}</p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 flex max-w-[58ch] gap-3 border-l-2 border-engaged/50 pl-4">
              <p className="text-[0.9375rem] leading-relaxed text-muted">
                <span className="font-mono text-mono-xs text-risk uppercase">
                  Pre-launch draft.
                </span>{' '}
                CloseAgain has not launched, and this document has not been
                through legal review. It describes what this website does today
                and will be replaced with a reviewed version before the product
                handles anyone&rsquo;s customer data.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grain relative bg-void pb-24 md:pb-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* contents */}
            <nav aria-label="On this page" className="lg:col-span-3">
              <h2 className="font-mono text-mono-xs text-secondary uppercase">
                Contents
              </h2>
              <ol className="mt-4 flex flex-col gap-2 lg:sticky lg:top-24">
                {sections.map((section, i) => (
                  <li key={section.id} className="flex gap-3">
                    <span className="tnum font-mono text-mono-xs text-secondary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`#${section.id}`}
                      className="text-[0.9375rem] text-muted transition-colors duration-300 hover:text-warm-white"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 lg:col-span-8 lg:col-start-5 lg:mt-0">
              {sections.map((section, i) => (
                <Reveal
                  key={section.id}
                  id={section.id}
                  as="section"
                  className="scroll-mt-24 border-t border-rule pt-8 pb-10 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="tnum font-mono text-mono-sm text-secondary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-h3 text-warm-white">{section.heading}</h2>
                  </div>
                  <div className="mt-5 max-w-[64ch] space-y-4 pl-9 text-[1.0625rem] leading-relaxed text-muted">
                    {section.body}
                  </div>
                </Reveal>
              ))}

              <div className="mt-4 border-t border-rule pt-8">
                <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
                  Questions about any of this go to{' '}
                  <a href={`mailto:${site.email}`} className="underline decoration-steel underline-offset-4 hover:decoration-signal text-warm-white">
                    {site.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
