import type { Metadata } from 'next'
import { ClosingCta, NumberedRows, SectionHead, Trio, revealDelay } from '@/components/editorial/blocks'
import { WordSplit } from '@/components/editorial/WordSplit'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Hero } from '@/components/home/Hero'
import { home } from '@/content/home'
import { faq } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'
import { TextLink } from '@/components/ui/links'

export const metadata: Metadata = pageMetadata({
  title: home.meta.title,
  description: home.meta.description,
  path: '/',
  absoluteTitle: true,
})

export default function HomePage() {
  const { again, revisit, approach, questions, closing } = home
  const answers = questions.pick
    .map((q) => faq.items.find((item) => item.q === q))
    .filter((item) => item !== undefined)

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

      <section className="section" aria-labelledby="revisit-title">
        <div className="wrap">
          <SectionHead id="revisit-title" eyebrow={revisit.eyebrow} title={revisit.title} link={revisit.link} />
          <Trio items={revisit.items} />
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="wrap">
          <SectionHead id="approach-title" eyebrow={approach.eyebrow} title={approach.title} link={approach.link} />
          <NumberedRows items={approach.steps} className="rows--compact" />
        </div>
      </section>

      <section className="section" aria-labelledby="questions-title">
        <div className="wrap">
          <SectionHead id="questions-title" eyebrow={questions.eyebrow} title={questions.title} />
          <dl className="qa">
            {answers.map((item, i) => (
              <div key={item.q} className="qa__row" data-reveal style={revealDelay(i)}>
                <dt className="qa__q">{item.q}</dt>
                <dd className="qa__a">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="section__foot">
            <TextLink href={questions.link.href} arrow>
              {questions.link.label}
            </TextLink>
          </div>
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        cta={closing.cta}
        secondary={closing.secondary}
        art={<ClosingRibbon id="home-closing" />}
      />
    </>
  )
}
