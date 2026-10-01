import type { CSSProperties, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { Bubble } from '@/components/art/Bubble'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { closingChat } from '@/content/site'
import { Words } from './Words'

/** Stagger for a group of reveals — small, and capped so nothing waits long. */
export const revealDelay = (index: number): CSSProperties =>
  ({ '--reveal-delay': `${Math.min(index * 70, 280)}ms` }) as CSSProperties

/** Eyebrow, section title and an optional link, aligned on one baseline. */
export function SectionHead({
  id,
  eyebrow,
  title,
  link,
}: {
  id: string
  eyebrow?: string
  title: string
  link?: { label: string; href: string }
}) {
  return (
    <div className={['section__head', link && 'section__head--split'].filter(Boolean).join(' ')}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="section__title">
          {title}
        </h2>
      </div>
      {link && (
        <TextLink href={link.href} arrow>
          {link.label}
        </TextLink>
      )}
    </div>
  )
}

/** Numbered editorial rows with fine rules — the site’s list form. */
export function NumberedRows({
  items,
  headingLevel = 'h3',
  className,
}: {
  items: ReadonlyArray<{ number?: string; title: string; body: string; aside?: ReactNode }>
  headingLevel?: 'h2' | 'h3'
  className?: string
}) {
  const Heading = headingLevel
  return (
    <ol className={['rows', className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <li key={item.title} className="rows__item" data-reveal style={revealDelay(i)}>
          <span className="rows__num" aria-hidden="true">
            {item.number ?? String(i + 1).padStart(2, '0')}
          </span>
          <Heading className="rows__title">{item.title}</Heading>
          <p className="rows__body">{item.body}</p>
          {item.aside && <div className="rows__aside">{item.aside}</div>}
        </li>
      ))}
    </ol>
  )
}

/** Three short statements side by side, separated by hairlines. */
export function Trio({
  items,
  headingLevel = 'h3',
}: {
  items: ReadonlyArray<{ title: string; body: string }>
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  return (
    <ul className="trio">
      {items.map((item, i) => (
        <li key={item.title} className="trio__item" data-reveal style={revealDelay(i)}>
          <Heading className="trio__title">{item.title}</Heading>
          <p className="trio__body">{item.body}</p>
        </li>
      ))}
    </ul>
  )
}

/** Closing call to action: one line of display type and one decision. */
/**
 * The one decision, on black paper (.band-ink), with the conversation it
 * starts beside it: the follow-up goes out, the reply types, and the answer
 * is yes. The exchange is decoration (aria-hidden); the heading and the
 * button carry the meaning.
 */
export function ClosingCta({
  id,
  title,
  body,
  cta,
  secondary,
}: {
  id: string
  title: string
  body?: string
  cta: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className="closing band-ink" aria-labelledby={id}>
      <div className="closing__inner wrap">
        <div className="closing__copy" data-reveal>
          <h2 id={id} className="closing__title">
            {title}
          </h2>
          {body && <p className="closing__body">{body}</p>}
        </div>
        <div className="closing__actions" data-reveal style={revealDelay(1)}>
          <ButtonLink href={cta.href} size="lg">
            {cta.label}
          </ButtonLink>
          {secondary && <TextLink href={secondary.href}>{secondary.label}</TextLink>}
        </div>
        <figure className="closing__chat" data-chat aria-hidden="true">
          <Bubble tone="ask" className="closing__bubble">
            {closingChat.ask}
          </Bubble>
          <p className="closing__meta">
            <Check size={14} strokeWidth={2} />
            {closingChat.meta}
          </p>
          <Bubble tone="reply" typing className="closing__bubble closing__bubble--reply">
            {closingChat.reply}
          </Bubble>
        </figure>
      </div>
    </section>
  )
}

/** Eyebrow, page title and lede for supporting pages. */
export function PageIntro({
  id = 'page-title',
  eyebrow,
  title,
  lede,
  className,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  lede?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <header className={['intro', className].filter(Boolean).join(' ')}>
      <div className="intro__inner wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={id} className="intro__title">
          <Words text={title} />
        </h1>
        {lede && <p className="intro__lede">{lede}</p>}
        {children}
      </div>
    </header>
  )
}
