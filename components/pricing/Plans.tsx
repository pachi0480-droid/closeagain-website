import { Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/links'
import { comparison, plans, priceLabel, type Plan, type PlanId } from '@/content/pricing'
import { CompareToggle } from './CompareToggle'

const delay = (i: number): CSSProperties => ({ '--reveal-delay': `${i * 70}ms` }) as CSSProperties

const introductions: Record<PlanId, { audience: string; description: string }> = {
  core: {
    audience: 'For consistent follow-up',
    description: 'Give new inquiries and quiet leads a clear path back to a conversation.',
  },
  growth: {
    audience: 'For appointment-led businesses',
    description: 'Build follow-up around your process, with appointment workflows and custom sequences.',
  },
  scale: {
    audience: 'For teams working leads together',
    description: 'Bring your team, workflows and pipeline together as your operation grows.',
  },
  enterprise: {
    audience: 'For more complex operations',
    description: 'Multiple locations, custom integrations and permissions. A plan shaped around your business.',
  },
}

/** Prices and feature lists are deliberately sourced from the shared pricing module. */
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
  const introduction = introductions[plan.id]
  const enterprise = plan.id === 'enterprise'
  const features = variant === 'full' ? plan.features : plan.features.slice(0, 3)

  return (
    <article className="plan__card" aria-labelledby={headingId}>
      {plan.recommendation && <p className="plan__flag">{plan.recommendation.label}</p>}
      <div className="plan__intro">
        <p className="plan__audience">{introduction.audience}</p>
        <div className="plan__heading">
          <h3 id={headingId} className="plan__name">{plan.name}</h3>
          <span className="plan__mark" aria-hidden="true"><i /><i /><i /></span>
        </div>
        <p className="plan__description">{introduction.description}</p>
      </div>

      <div className="plan__purchase">
        <p className="plan__price">
          <span className="plan__amount">{priceLabel(plan)}</span>
          {plan.monthly !== null && <span className="plan__per">/ month</span>}
        </p>
        <p className="plan__billing">{enterprise ? 'Scope and pricing agreed together' : 'USD · billed monthly'}</p>
        <Link href={plan.cta.href} className="plan__cta">
          <span>{enterprise ? 'Let’s talk about your business' : `Explore ${plan.name}`}</span>
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
        {variant === 'full' && plan.recommendation && (
          <p className="plan__reason">{plan.recommendation.basis}</p>
        )}
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
