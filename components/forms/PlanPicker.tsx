'use client'

import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { checkoutSteps, unsureChoice, unsurePlan } from '@/content/forms'
import { plans, priceLabel } from '@/content/pricing'

/**
 * Step 1 of the buying form: the plans as cards to choose from, plus “Not sure
 * yet”. They are native radio buttons underneath, so arrow keys, screen
 * readers and posting without JavaScript all work as they do for any radio
 * group. The tier meter shows where each plan sits: one bar for Core, four
 * for Enterprise.
 */
export function PlanPicker({
  name,
  value,
  onChange,
  note,
  error,
  errorId,
}: {
  name: string
  value: string
  onChange: (plan: string) => void
  /** Confirms the choice in words (“You selected Growth — …/month.”). */
  note: ReactNode
  error?: string
  errorId?: string
}) {
  const noteId = `${name}-picker-note`
  return (
    <fieldset
      className="tiers"
      aria-describedby={[noteId, errorId].filter(Boolean).join(' ')}
      aria-invalid={error ? true : undefined}
    >
      <legend className="sr-only">{checkoutSteps.plan.title}</legend>
      <div className="tiers__grid">
        {plans.map((plan, i) => (
          <label
            key={plan.id}
            className={['tier', `tier--${plan.id}`, plan.recommendation && 'tier--featured'].filter(Boolean).join(' ')}
          >
            <input
              type="radio"
              className="tier__input"
              name={name}
              value={plan.id}
              checked={value === plan.id}
              onChange={() => onChange(plan.id)}
            />
            <span className="tier__card">
              {plan.recommendation && <span className="tier__flag">{plan.recommendation.label}</span>}
              <span className="tier__top">
                <span className="tier__meter" aria-hidden="true">
                  {[0, 1, 2, 3].map((bar) => (
                    <i key={bar} data-on={bar <= i || undefined} />
                  ))}
                </span>
                <span className="tier__check" aria-hidden="true">
                  <Check size={14} strokeWidth={2.6} />
                </span>
              </span>
              <span className="tier__name">{plan.name}</span>
              <span className="tier__price">
                <span className="tier__amount">{priceLabel(plan)}</span>
                {plan.monthly !== null && <span className="tier__per">/mo</span>}
              </span>
              <span className="tier__tagline">{plan.tagline}</span>
              <span className="tier__facts">
                {plan.highlights.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </span>
            </span>
          </label>
        ))}
        <label className="tier tier--unsure">
          <input
            type="radio"
            className="tier__input"
            name={name}
            value={unsurePlan}
            checked={value === unsurePlan}
            onChange={() => onChange(unsurePlan)}
          />
          <span className="tier__card">
            <span className="tier__check" aria-hidden="true">
              <Check size={14} strokeWidth={2.6} />
            </span>
            <span className="tier__name">{unsureChoice.title}</span>
            <span className="tier__tagline">{unsureChoice.body}</span>
          </span>
        </label>
      </div>
      <p id={noteId} className="tiers__note field__note" aria-live="polite">
        {note}
      </p>
      {error && (
        <p id={errorId} className="field__error">
          <span className="field__error-mark" aria-hidden="true">
            !
          </span>
          {error}
        </p>
      )}
    </fieldset>
  )
}
