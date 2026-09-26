import { Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import { comparison, plans, priceLabel, type Plan } from '@/content/pricing'
import { CompareToggle } from './CompareToggle'

const delay = (i: number): CSSProperties => ({ '--reveal-delay': `${i * 70}ms` }) as CSSProperties

/**
 * The four plans. Each card leads with the facts that decide between them —
 * who it is best for and what it adds over the plan before — and only then
 * lists features, without repeating anything the lower plan already has.
 *
 * Scale is lifted with a vermilion edge and a small ribbon bookmark because
 * it is recommended for teams, and the card says why. Enterprise is the one
 * dark card.
 */
export function PlanCards({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <ol className={['plans', `plans--${variant}`].join(' ')}>
      {plans.map((plan, i) => (
        <li
          key={plan.id}
          className={['plan', `plan--${plan.id}`, plan.recommendation && 'plan--featured'].filter(Boolean).join(' ')}
          data-reveal
          style={delay(i)}
        >
          <PlanCard plan={plan} variant={variant} first={i === 0} />
        </li>
      ))}
    </ol>
  )
}

function PlanCard({ plan, variant, first }: { plan: Plan; variant: 'full' | 'compact'; first: boolean }) {
  const headingId = `plan-${plan.id}-${variant}`
  return (
    <article className="plan__card" aria-labelledby={headingId}>
      {plan.recommendation && (
        <>
          <span className="plan__bookmark" aria-hidden="true" />
          <p className="plan__flag">{plan.recommendation.label}</p>
        </>
      )}
      <h3 id={headingId} className="plan__name">
        {plan.name}
      </h3>
      <p className="plan__price">
        <span className="plan__amount">{priceLabel(plan)}</span>
        {plan.monthly !== null && <span className="plan__per">/month</span>}
      </p>
      <p className="plan__tagline">{plan.tagline}</p>

      <dl className="plan__facts">
        <div className="plan__fact">
          <dt>Best for</dt>
          <dd>{plan.bestFor}</dd>
        </div>
        {variant === 'full' && (
          <div className="plan__fact">
            <dt>{first ? 'What you get' : 'What it adds'}</dt>
            <dd>{plan.step}</dd>
          </div>
        )}
        {variant === 'full' && plan.recommendation && (
          <div className="plan__fact plan__fact--why">
            <dt>Why we recommend it</dt>
            <dd>{plan.recommendation.basis}</dd>
          </div>
        )}
      </dl>

      <Link href={plan.cta.href} className="plan__cta">
        <span>{plan.cta.label}</span>
        <Arrow />
      </Link>

      {variant === 'full' && (
        <div className="plan__includes">
          <p className="plan__includes-label">{plan.includesLabel}</p>
          <ul className="plan__features">
            {plan.features.map((feature) => (
              <li key={feature}>
                <Check className="plan__tick" size={15} strokeWidth={2} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

/** Every capability, plan by plan — collapsed until asked for. */
export function CompareMatrix({ openLabel, closeLabel }: { openLabel: string; closeLabel: string }) {
  return (
    <CompareToggle openLabel={openLabel} closeLabel={closeLabel}>
      <div className="compare__scroll">
        <table className="compare__table">
          <caption className="sr-only">Features included in each CloseAgain plan</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Feature</span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className={plan.recommendation ? 'is-featured' : undefined}>
                  <span className="compare__plan">{plan.name}</span>
                  <span className="compare__price">
                    {priceLabel(plan)}
                    {plan.monthly !== null && '/mo'}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {comparison.map((group) => (
            <tbody key={group.group}>
              <tr className="compare__group">
                <th scope="colgroup" colSpan={plans.length + 1}>
                  {group.group}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    {row.label}
                    {row.note && <span className="compare__note">{row.note}</span>}
                  </th>
                  {plans.map((plan) => {
                    const value = row.values[plan.id]
                    return (
                      <td key={plan.id} className={plan.recommendation ? 'is-featured' : undefined}>
                        {value === true ? (
                          <>
                            <Check className="compare__yes" size={16} strokeWidth={2} aria-hidden="true" />
                            <span className="sr-only">Included</span>
                          </>
                        ) : value === false ? (
                          <>
                            <Minus className="compare__no" size={16} strokeWidth={1.6} aria-hidden="true" />
                            <span className="sr-only">Not included</span>
                          </>
                        ) : (
                          <span className="compare__text">{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </CompareToggle>
  )
}
