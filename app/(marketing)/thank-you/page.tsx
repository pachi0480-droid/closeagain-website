import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Bubble } from '@/components/art/Bubble'
import { Ribbon } from '@/components/art/Ribbon'
import { arrivalWide } from '@/components/art/ribbons'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { thankYou } from '@/content/pages'
import { receiptCookie } from '@/lib/forms/protocol'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: thankYou.meta.title,
  path: '/thank-you',
  index: false,
})

/**
 * Confirmation. The receipt cookie is set by the submission endpoint only
 * after the delivery destination confirmed the request, so a direct visit —
 * or an expired receipt — shows a neutral invitation instead of a false
 * “received”.
 */
export default async function ThankYouPage() {
  const receipt = (await cookies()).get(receiptCookie)?.value
  const kind = receipt === 'demo' || receipt === 'contact' ? receipt : null
  const copy = kind ? thankYou[kind] : thankYou.neutral

  return (
    <section className="arrival" aria-labelledby="page-title">
      <div className="arrival__inner wrap">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="page-title" className="arrival__title">
          {copy.title}
        </h1>
        <p className="arrival__body">{copy.body}</p>

        <div className="arrival__actions">
          {kind ? (
            <>
              <ButtonLink href={thankYou.actions.primary.href} size="lg">
                {thankYou.actions.primary.label}
              </ButtonLink>
              <TextLink href={thankYou.actions.secondary.href}>{thankYou.actions.secondary.label}</TextLink>
            </>
          ) : (
            <>
              <ButtonLink href={thankYou.neutral.actions[0].href} size="lg">
                {thankYou.neutral.actions[0].label}
              </ButtonLink>
              <TextLink href={thankYou.neutral.actions[1].href}>{thankYou.neutral.actions[1].label}</TextLink>
            </>
          )}
        </div>
      </div>

      <div className="arrival__art" aria-hidden="true">
        <Ribbon
          id="arrival"
          className="arrival__ribbon"
          viewBox={arrivalWide.viewBox}
          spec={arrivalWide.spec}
          preserveAspectRatio="xMaxYMid meet"
          draw="scroll"
        />
        <Bubble tone="reply" className="arrival__bubble">
          {thankYou.bubble}
        </Bubble>
      </div>
    </section>
  )
}
