'use client'

import { useId, useState } from 'react'
import { Arrow } from '@/components/ui/links'
import { plans, type PlanId } from '@/content/pricing'

const priorities: Array<{ plan: PlanId; label: string; reason: string }> = [
  { plan: 'core', label: 'Consistent follow-up', reason: 'New inquiry capture, automated follow-up and older lead re-engagement are all included in Core.' },
  { plan: 'growth', label: 'Booking appointments', reason: 'Growth adds appointment workflows and custom follow-up sequences to everything in Core.' },
  { plan: 'scale', label: 'Working as a team', reason: 'Scale adds multi-user collaboration, custom workflows and pipeline customization.' },
  { plan: 'enterprise', label: 'Multiple locations', reason: 'Enterprise includes multi-location support, advanced permissions and custom integrations.' },
]

/** Native radios retain arrow-key selection and expose the active choice without custom keyboard code. */
export function PlanFinder() {
  const [selected, setSelected] = useState<PlanId>('core')
  const name = useId()
  const priority = priorities.find((item) => item.plan === selected)!
  const plan = plans.find((item) => item.id === selected)!

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
                onChange={() => setSelected(item.plan)}
              />
              <span><span className="plan-finder__dot" aria-hidden="true" />{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="plan-finder__result" aria-live="polite" aria-atomic="true">
        <div>
          <p className="plan-finder__match">Start with {plan.name}.</p>
          <p className="plan-finder__reason">{priority.reason}</p>
        </div>
        <a href={`#plan-${selected}`} className="plan-finder__link">See {plan.name}<Arrow /></a>
      </div>
    </div>
  )
}
