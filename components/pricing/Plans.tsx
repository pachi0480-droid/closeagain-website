import { Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import { billingNote, commitmentNote, comparison, plans, priceLabel, type Plan } from '@/content/pricing'
import { CompareToggle } from './CompareToggle'

const delay = (i: number): CSSProperties => ({ '--reveal-delay': `${i * 70}ms` }) as CSSProperties

/**
 * The four plans, every word from content/pricing.ts. Core, Growth and Scale
 * sit side by side with prices and buttons aligned; Enterprise is the dark
 * band beneath. Each card leads with who it is for and its headline facts
 * (users, locations, the defining extra) before the full feature list.
 * Scale carries the emphasis: a vermilion edge, a lift, and the ribbon.
 */
export function PlanCards({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <ol className={['plans', `plans--${variant}`].join(' ')}>
      {plans.map((plan, i) => (
        <li
          key={plan.id}
          id={variant === 'full' ? `plan-${plan.id}` : undefined}
          className={['plan', `plan--${plan.id}`, plan.recommendation && 'plan--featured'].filter(Boolean).join(' ')}
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
  const enterprise = plan.id === 'enterprise'
  const features = variant === 'full' ? plan.features : plan.features.slice(0, 3)

  return (
    <article className="plan__card" aria-labelledby={headingId}>
      {plan.recommendation && (
        <p className="plan__flag">
          {plan.recommendation.label}
          <svg className="plan__flag-tail" viewBox="0 0 28 12" aria-hidden="true" focusable="false">
            <path d="M0 6h20M15 1.5 21 6l-6 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </p>
      )}
      <div className="plan__intro">
        <p className="plan__audience">{plan.audience}</p>
        <div className="plan__heading">
          <h3 id={headingId} className="plan__name">
            {plan.name}
          </h3>
          <span className="plan__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <p className="plan__tagline">{plan.tagline}</p>
        <p className="plan__description">{plan.bestFor}</p>
      </div>

      <div className="plan__purchase">
        <p className="plan__price">
          <span className="plan__amount">{priceLabel(plan)}</span>
          {plan.monthly !== null && <span className="plan__per">/ month</span>}
        </p>
        <p className="plan__billing">{enterprise ? 'Scope and pricing agreed together' : `${billingNote} · ${commitmentNote}`}</p>
        <ul className="plan__highlights">
          {plan.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <Link href={plan.cta.href} className="plan__cta">
          <span>{plan.cta.label}</span>
          <Arrow />
        </Link>
      </div>

      <div className="plan__includes">
        <p className="plan__includes-label">{plan.includesLabel}</p>
        <ul className="plan__features">
          {features.map((feature) => (
            <li key={feature}>
              <Check className="plan__tick" size={15} strokeWidth={2} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {variant === 'compact' && plan.features.length > features.length && (
          <p className="plan__more">+ {plan.features.length - features.length} more</p>
        )}
        {variant === 'full' && plan.recommendation && <p className="plan__reason">{plan.recommendation.basis}</p>}
      </div>
    </article>
  )
}

/** Every capability remains available in an accessible, locally scrolling table. */
export function CompareMatrix({ openLabel, closeLabel }: { openLabel: string; closeLabel: string }) {
  return (
    <CompareToggle openLabel={openLabel} closeLabel={closeLabel}>
      <p className="compare__hint">The complete picture, side by side. On smaller screens, scroll across to see every plan.</p>
      <div className="compare__scroll" tabIndex={0} role="region" aria-label="Scrollable plan comparison">
        <table className="compare__table">
          <caption className="sr-only">Features included in each CloseAgain plan</caption>
          <thead>
            <tr>
              <th scope="col"><span>What’s included</span></th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className={plan.recommendation ? 'is-featured' : undefined}>
                  <span className="compare__plan">{plan.name}</span>
                  <span className="compare__price">
                    {priceLabel(plan)}{plan.monthly !== null && '/mo'}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {comparison.map((group) => (
            <tbody key={group.group}>
              <tr className="compare__group">
                <th scope="rowgroup" colSpan={plans.length + 1}>{group.group}</th>
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
                          <><Check className="compare__yes" size={16} strokeWidth={2} aria-hidden="true" /><span className="sr-only">Included</span></>
                        ) : value === false ? (
                          <><Minus className="compare__no" size={16} strokeWidth={1.6} aria-hidden="true" /><span className="sr-only">Not included</span></>
                        ) : <span className="compare__text">{value}</span>}
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
