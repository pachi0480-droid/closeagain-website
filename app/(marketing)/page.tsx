import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta, SectionHead } from '@/components/editorial/blocks'
import { WordSplit } from '@/components/editorial/WordSplit'
import { Hero } from '@/components/home/Hero'
import { LeadFlow } from '@/components/home/LeadFlow'
import { Paths } from '@/components/home/Paths'
import { Payoff } from '@/components/home/Payoff'
import { Showcase } from '@/components/home/Showcase'
import { Automation, SecondChance } from '@/components/home/Stories'
import { PlanCards } from '@/components/pricing/Plans'
import { home } from '@/content/home'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: home.meta.title,
  description: home.meta.description,
  path: '/',
  absoluteTitle: true,
})

/**
 * The homepage tells one story with one ribbon: a lead arrives or returns,
 * gets followed up, replies, books, and reaches the team — then the
 * dashboard that runs it, what it costs, and the next step.
 */
export default function HomePage() {
  const { again, pricing, closing } = home

  return (
    <>
      <Hero />

      <Payoff />

      <WordSplit word={again.word} id="again" className="word-split--home">
        <p className="word-split__lines">
          {again.lines.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </p>
      </WordSplit>

      <Paths />
      <LeadFlow />
      <Automation />
      <SecondChance />
      <Showcase />

      <section className="section price-band" aria-labelledby="price-band-title">
        <div className="wrap">
          <SectionHead id="price-band-title" eyebrow={pricing.eyebrow} title={pricing.title} link={pricing.link} />
          <p className="price-band__note">{pricing.body}</p>
          <PlanCards variant="compact" />
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        body={closing.body}
        cta={closing.cta}
        secondary={closing.secondary}
        art={<ClosingRibbon id="home-closing" />}
      />
    </>
  )
}
