'use client'

import { Check } from 'lucide-react'
import { TextLink } from '@/components/ui/links'
import { contact } from '@/content/contact'
import { unsurePlan } from '@/content/forms'
import { planById, priceLabel } from '@/content/pricing'
import { useChosenPlan } from './selectedPlan'

/**
 * The order summary beside the buying form. It follows the plan picked in
 * step 1 (see selectedPlan.ts), then lists the terms every plan shares and
 * what happens after the form is sent. Nothing here is a charge.
 */
export function OrderSummary({ initialPlan }: { initialPlan?: string }) {
  const chosen = planById(useChosenPlan(initialPlan ?? unsurePlan))
  const { summary, terms, next, process: processLink } = contact

  return (
    <div className="summary-wrap">
      <div className="summary" aria-live="polite" aria-atomic="true">
        <p className="summary__label">{summary.label}</p>
        {/* Keyed by plan, so a new choice settles in rather than snapping. */}
        <div key={chosen?.id ?? unsurePlan} className="summary__plan">
          <div className="summary__head">
            <div>
              <p className="summary__name">{chosen?.name ?? summary.unsure.name}</p>
              <p className="summary__tagline">{chosen?.tagline ?? summary.unsure.tagline}</p>
              {!chosen && <p className="summary__from">{summary.unsure.price}</p>}
            </div>
            {chosen && (
              <p className="summary__price">
                <span className="summary__amount">{priceLabel(chosen)}</span>
                {chosen.monthly !== null && <span className="summary__per">/month</span>}
              </p>
            )}
          </div>
          {chosen && (
            <ul className="summary__facts">
              {chosen.highlights.map((fact) => (
                <li key={fact}>
                  <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="summary__terms">
          {terms.slice(1).map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
        <p className="summary__note">{summary.note}</p>
      </div>

      <div className="buy-next">
        <h2 className="buy-next__title">{next.title}</h2>
        {/* role="list" keeps list semantics in Safari once markers are removed. */}
        <ol className="buy-next__steps" role="list">
          {next.steps.map((step, i) => (
            <li key={step}>
              <span className="buy-next__num" aria-hidden="true">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <TextLink href={processLink.href} arrow className="buy-next__link">
          {processLink.label}
        </TextLink>
      </div>
    </div>
  )
}
