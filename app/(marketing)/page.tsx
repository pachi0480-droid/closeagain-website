import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta, SectionHead } from '@/components/editorial/blocks'
import { Accordion } from '@/components/editorial/Accordion'
import { WordSplit } from '@/components/editorial/WordSplit'
import { Hero } from '@/components/home/Hero'
import { Control } from '@/components/home/Control'
import { Paths } from '@/components/home/Paths'
import { ConversationDemo } from '@/components/home/ConversationDemo'
import { PlanCards } from '@/components/pricing/Plans'
import { TextLink } from '@/components/ui/links'
import { home } from '@/content/home'
import { faqByIds } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: home.meta.title,
  description: home.meta.description,
  path: '/',
  absoluteTitle: true,
})

/**
 * The homepage answers a buyer's questions in order: what CloseAgain is (the
 * hero), why it matters (Again.), the two jobs it does, one worked example of
 * how, what each feature is for, what it costs, the questions people ask
 * before buying, and the next step. One ribbon runs through the story.
 */
export default function HomePage() {
  const { again, pricing, questions, closing } = home

  return (
    <>
      <Hero />

      <hr className="rule" />

      <WordSplit word={again.word} id="again" className="word-split--home">
        <p className="word-split__lines">
          {again.lines.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </p>
      </WordSplit>

      <Paths />
      <ConversationDemo />

      <Control />

      <section className="section price-band" aria-labelledby="price-band-title">
        <div className="wrap">
          <SectionHead id="price-band-title" eyebrow={pricing.eyebrow} title={pricing.title} link={pricing.link} />
          <p className="price-band__note">{pricing.body}</p>
          <PlanCards variant="compact" />
        </div>
      </section>

      <section className="section home-questions" aria-labelledby="questions-title">
        <div className="wrap home-questions__inner">
          <div className="home-questions__head">
            <p className="eyebrow">{questions.eyebrow}</p>
            <h2 id="questions-title" className="section__title">
              {questions.title}
            </h2>
            <TextLink href={questions.link.href} arrow>
              {questions.link.label}
            </TextLink>
          </div>
          <Accordion items={faqByIds(questions.ids)} headingLevel="h3" />
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
