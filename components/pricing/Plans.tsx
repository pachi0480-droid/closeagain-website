import { Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import { comparison, plans, type Plan } from '@/content/pricing'
import { CompareToggle } from './CompareToggle'

const delay = (i: number): CSSProperties => ({ '--reveal-delay': `${i * 90}ms` }) as CSSProperties

/**
 * The four plans. Scale is lifted with a vermilion edge and a small ribbon
 * bookmark; Enterprise is the one dark card. Everything else stays quiet so
 * the prices do the talking.
 */
export function PlanCards({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <ol className={['plans', `plans--${variant}`].join(' ')}>
      {plans.map((plan, i) => (
        <li
          key={plan.id}
          className={['plan', `plan--${plan.id}`, plan.highlight && 'plan--featured'].filter(Boolean).join(' ')}
          data-reveal
          style={delay(i)}
        >
          <PlanCard plan={plan} variant={variant} />
        </li>
      ))}
    </ol>
  )
}

function PlanCard({ plan, variant }: { plan: Plan; variant: 'full' | 'compact' }) {
  const headingId = `plan-${plan.id}-${variant}`
  return (
    <article className="plan__card" aria-labelledby={headingId}>
      {plan.highlight && (
        <>
          <span className="plan__bookmark" aria-hidden="true" />
          <p className="plan__flag">{plan.highlight}</p>
        </>
      )}
      <h3 id={headingId} className="plan__name">
        {plan.name}
      </h3>
      <p className="plan__price">
        <span className="plan__amount">{plan.priceLabel}</span>
        {plan.monthly !== null && <span className="plan__per">/month</span>}
      </p>
      <p className="plan__tagline">{plan.tagline}</p>
      {variant === 'full' && plan.audience && <p className="plan__audience">{plan.audience}</p>}

      <Link href={plan.cta.href} className="plan__cta">
        <span>{variant === 'compact' ? (plan.monthly === null ? 'Talk to us' : 'Choose plan') : plan.cta.label}</span>
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
                <th key={plan.id} scope="col" className={plan.highlight ? 'is-featured' : undefined}>
                  <span className="compare__plan">{plan.name}</span>
                  <span className="compare__price">
                    {plan.priceLabel}
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
                  <th scope="row">{row.label}</th>
                  {plans.map((plan) => {
                    const value = row.values[plan.id]
                    return (
                      <td key={plan.id} className={plan.highlight ? 'is-featured' : undefined}>
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
