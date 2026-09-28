'use client'

import { useId } from 'react'
import { Arrow } from '@/components/ui/links'
import { planFinder as priorities, plans, type PlanId } from '@/content/pricing'

/**
 * “What matters most to your business?” Picking an answer names the plan and
 * lights up its card below (see TierSystem). Native radios keep arrow-key
 * selection and announce the choice without custom keyboard code.
 */
export function PlanFinder({ selected, onSelect }: { selected: PlanId | null; onSelect: (plan: PlanId) => void }) {
  const name = useId()
  const priority = priorities.find((item) => item.plan === selected)
  const plan = plans.find((item) => item.id === selected)

  return (
    <div className="plan-finder">
      <fieldset className="plan-finder__choices">
        <legend>What matters most to your business?</legend>
        <div className="plan-finder__options">
          {priorities.map((item) => (
            <label key={item.plan} className="plan-finder__option">
              <input
                type="radio"
                name={name}
                value={item.plan}
                checked={selected === item.plan}
                onChange={() => onSelect(item.plan)}
              />
              <span>
                <span className="plan-finder__dot" aria-hidden="true" />
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="plan-finder__result" aria-live="polite" aria-atomic="true">
        {plan && priority ? (
          <>
            <div key={plan.id} className="plan-finder__answer">
              <p className="plan-finder__match">Start with {plan.name}.</p>
              <p className="plan-finder__reason">{priority.reason}</p>
            </div>
            <a href={`#plan-${plan.id}`} className="plan-finder__link">
              See {plan.name}
              <Arrow />
            </a>
          </>
        ) : (
          <p className="plan-finder__prompt">Pick one and we’ll point you to the plan that fits.</p>
        )}
      </div>
    </div>
  )
}
