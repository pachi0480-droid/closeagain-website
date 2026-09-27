'use client'

import { useId, useState } from 'react'
import { formatPrice, plans } from '@/content/pricing'
import { breakEven } from '@/lib/breakeven'

const listed = plans.filter((plan) => plan.monthly !== null)
const OTHER = 'other'

/**
 * “How many extra sales would cover the cost?” — a break-even check that
 * uses only the visitor's own numbers. It never pre-fills a profit figure or
 * a conversion rate, never shows a result it cannot compute, and says
 * plainly that customers means closed sales, not replies or appointments.
 *
 * Without JavaScript the fields still render and the formula is written out
 * beneath them, so the page explains itself either way.
 */
export function BreakEven() {
  const id = useId()
  const [planId, setPlanId] = useState<string>(listed[0].id)
  const [customPrice, setCustomPrice] = useState('')
  const [other, setOther] = useState('')
  const [profit, setProfit] = useState('')

  const plan = listed.find((candidate) => candidate.id === planId)
  const price = plan?.monthly != null ? String(plan.monthly) : customPrice
  const result = breakEven({ price, other, profit })

  const invalid = result.status === 'invalid' ? result.field : null

  return (
    <form className="breakeven" onSubmit={(event) => event.preventDefault()} aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="sr-only">
        Break-even calculator
      </h3>
      <div className="breakeven__fields">
        <div className="breakeven__field">
          <label htmlFor={`${id}-plan`}>Plan</label>
          <select id={`${id}-plan`} value={planId} onChange={(event) => setPlanId(event.target.value)}>
            {listed.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} — {formatPrice(candidate.monthly ?? 0)}/month
              </option>
            ))}
            <option value={OTHER}>Enterprise or another amount</option>
          </select>
        </div>

        {planId === OTHER && (
          <div className="breakeven__field">
            <label htmlFor={`${id}-price`}>Monthly price</label>
            <div className="breakeven__money">
              <span aria-hidden="true">$</span>
              <input
                id={`${id}-price`}
                inputMode="decimal"
                autoComplete="off"
                value={customPrice}
                onChange={(event) => setCustomPrice(event.target.value)}
                aria-invalid={invalid === 'price' || undefined}
                aria-describedby={invalid === 'price' ? `${id}-error` : undefined}
              />
            </div>
          </div>
        )}

        <div className="breakeven__field">
          <label htmlFor={`${id}-other`}>
            Other monthly costs <span className="breakeven__optional">Optional</span>
          </label>
          <div className="breakeven__money">
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-other`}
              inputMode="decimal"
              autoComplete="off"
              value={other}
              onChange={(event) => setOther(event.target.value)}
              aria-invalid={invalid === 'other' || undefined}
              aria-describedby={[`${id}-other-hint`, invalid === 'other' && `${id}-error`].filter(Boolean).join(' ')}
            />
          </div>
          <p id={`${id}-other-hint`} className="breakeven__hint">
            Anything else you’d count against it, per month.
          </p>
        </div>

        <div className="breakeven__field">
          <label htmlFor={`${id}-profit`}>Gross profit from one new customer</label>
          <div className="breakeven__money">
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-profit`}
              inputMode="decimal"
              autoComplete="off"
              value={profit}
              onChange={(event) => setProfit(event.target.value)}
              aria-invalid={invalid === 'profit' || undefined}
              aria-describedby={[`${id}-profit-hint`, invalid === 'profit' && `${id}-error`].filter(Boolean).join(' ')}
            />
          </div>
          <p id={`${id}-profit-hint`} className="breakeven__hint">
            What a typical sale brings in, minus the direct cost of delivering it — not the sale price.
          </p>
        </div>
      </div>

      <div className="breakeven__result" aria-live="polite">
        {result.status === 'ok' ? (
          <p className="breakeven__answer">
            <span className="breakeven__number">{result.customers}</span>{' '}
            {result.customers === 1 ? 'additional customer' : 'additional customers'} a month would cover{' '}
            {formatPrice(Math.round(result.totalCost))} a month.
          </p>
        ) : result.status === 'invalid' ? (
          <p id={`${id}-error`} className="breakeven__error">
            {result.field === 'profit'
              ? 'Enter a gross profit above zero, in dollars — for example 1,200.'
              : 'Enter an amount in dollars, like 1,200 or 950.50.'}
          </p>
        ) : (
          <p className="breakeven__waiting">Enter your gross profit per customer to see the break-even point.</p>
        )}
        <p className="breakeven__small">
          Customers means sales that close — not replies or appointments. Break-even = total monthly cost ÷ gross profit
          per additional customer, rounded up.
        </p>
      </div>
    </form>
  )
}
