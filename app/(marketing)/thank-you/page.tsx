import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Bubble } from '@/components/art/Bubble'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { thankYou } from '@/content/contact'
import { planById, planSummary } from '@/content/pricing'
import { receiptCookie } from '@/lib/forms/protocol'
import { decodeReceipt } from '@/lib/forms/receipt'
import { pageMetadata } from '@/lib/seo'

/**
 * The receipt cookie is set by the submission endpoint only after the
 * delivery destination confirmed the inquiry. Anything else — a direct visit,
 * an expired receipt, a value that does not decode — reads as no receipt.
 */
async function readReceipt() {
  return decodeReceipt((await cookies()).get(receiptCookie)?.value)
}

export async function generateMetadata(): Promise<Metadata> {
  const receipt = await readReceipt()
  const copy = receipt ? thankYou.received : thankYou.neutral
  return pageMetadata({ title: copy.meta.title, path: '/thank-you', index: false })
}

/**
 * Confirmation. With a receipt it says what happened (the inquiry reached the
 * team) and what happens next, and nothing more: no meeting, payment, email
 * or response time is claimed. Without one it is a neutral invitation.
 */
export default async function ThankYouPage() {
  const receipt = await readReceipt()
  const plan = receipt ? planById(receipt.plan) : undefined

  return (
    <section className="arrival" aria-labelledby="page-title">
      {receipt ? <Received planLine={plan ? thankYou.received.plan(planSummary(plan)) : null} /> : <Neutral />}

      <figure className="arrival__art" data-chat aria-hidden="true">
        <Bubble tone="reply" typing className="arrival__bubble">
          {thankYou.bubble}
        </Bubble>
      </figure>
    </section>
  )
}

function Received({ planLine }: { planLine: string | null }) {
  const copy = thankYou.received
  return (
    <div className="arrival__inner wrap">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="page-title" className="arrival__title">
        {copy.title}
      </h1>
      <p className="arrival__body">
        {copy.body}
        {planLine && <> {planLine}</>}
      </p>

      <div className="arrival__next">
        <h2 className="arrival__next-title">{copy.next.title}</h2>
        {/* role="list" keeps list semantics in Safari once markers are removed. */}
        <ol className="arrival__steps" role="list">
          {copy.next.steps.map((step, i) => (
            <li key={step}>
              <span className="arrival__num" aria-hidden="true">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="arrival__note">{copy.payment}</p>

      <div className="arrival__actions">
        <ButtonLink href={copy.actions.primary.href} size="lg">
          {copy.actions.primary.label}
        </ButtonLink>
        <TextLink href={copy.actions.secondary.href}>{copy.actions.secondary.label}</TextLink>
      </div>
    </div>
  )
}

function Neutral() {
  const copy = thankYou.neutral
  return (
    <div className="arrival__inner wrap">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="page-title" className="arrival__title">
        {copy.title}
      </h1>
      <p className="arrival__body">{copy.body}</p>

      <div className="arrival__actions">
        <ButtonLink href={copy.actions.primary.href} size="lg">
          {copy.actions.primary.label}
        </ButtonLink>
        <TextLink href={copy.actions.secondary.href}>{copy.actions.secondary.label}</TextLink>
      </div>
    </div>
  )
}
