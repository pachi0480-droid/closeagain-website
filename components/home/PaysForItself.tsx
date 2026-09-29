'use client'

import { useId, useState } from 'react'
import { TextLink } from '@/components/ui/links'
import { home } from '@/content/home'
import { formatPrice, plans } from '@/content/pricing'
import { breakEven, parseAmount } from '@/lib/breakeven'

const listed = plans.filter((plan) => plan.monthly !== null)

/**
 * “Does it pay for itself?” One number from the visitor — what a new
 * customer is worth to them — and, for each plan, how many extra customers a
 * month cover its price. Nothing is pre-filled or assumed: the placeholder is
 * only an example of the format, and no result shows until they type.
 */
export function PaysForItself() {
  const id = useId()
  const copy = home.payoff.calculator
  const [value, setValue] = useState('')
  const worth = parseAmount(value)
  const invalid = value.trim() !== '' && (worth === null || worth === 0)
  const results = listed.map((plan) => {
    const result = breakEven({ price: String(plan.monthly), other: '', profit: value })
    return { plan, customers: result.status === 'ok' ? result.customers : null }
  })
  const covered = results.filter((row) => row.customers === 1).map((row) => row.plan.name)

  const summary = invalid
    ? copy.invalid
    : worth === null
      ? copy.prompt
      : covered.length > 0
        ? `At ${formatPrice(worth)} a customer, one extra sale a month covers ${list(covered)}.`
        : `At ${formatPrice(worth)} a customer, ${results[0].plan.name} pays for itself with ${results[0].customers} extra customers a month.`

  return (
    <div className="payback" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="payback__title">
        {copy.title}
      </h3>
      <label className="payback__label" htmlFor={`${id}-worth`}>
        {copy.label}
        <span className="payback__hint">{copy.hint}</span>
      </label>
      <div className="payback__money">
        <span aria-hidden="true">$</span>
        <input
          id={`${id}-worth`}
          inputMode="decimal"
          autoComplete="off"
          placeholder={copy.placeholder}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-summary`}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <ul className="payback__plans">
        {results.map(({ plan, customers }) => (
          <li key={plan.id} className={['payback__plan', plan.recommendation && 'payback__plan--featured'].filter(Boolean).join(' ')}>
            <span className="payback__plan-name">
              {plan.name}
              <span className="payback__plan-price">{formatPrice(plan.monthly ?? 0)}/mo</span>
            </span>
            <span className="payback__plan-result" data-empty={customers === null || undefined}>
              <span key={customers ?? 'none'} className="payback__count">
                {customers ?? '—'}
              </span>
              <span className="payback__unit">{customers === 1 ? 'extra customer a month' : 'extra customers a month'}</span>
            </span>
          </li>
        ))}
      </ul>

      <p id={`${id}-summary`} className="payback__summary" aria-live="polite" data-invalid={invalid || undefined}>
        {summary}
      </p>
      <p className="payback__note">{copy.note}</p>
      <TextLink href={copy.link.href} arrow className="payback__link">
        {copy.link.label}
      </TextLink>
    </div>
  )
}

/** “Core”, “Core or Growth”, “Core, Growth or Scale”. */
function list(names: string[]) {
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`
}
