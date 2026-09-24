'use client'

import { SliderField } from '@/components/ui/SliderField'
import { bounds, type CalculatorInputs } from '@/lib/calculator'
import { formatNumber } from '@/lib/format'
import { track } from '@/lib/analytics'

/** The four assumptions, shared by the homepage section and /calculator. */
export function Assumptions({
  inputs,
  set,
}: {
  inputs: CalculatorInputs
  set: <K extends keyof CalculatorInputs>(key: K) => (value: number) => void
}) {
  const commit = () => track('calculator_input_changed')

  return (
    <div>
      <SliderField
        label="Inbound opportunities"
        hint="Calls, forms, chats and referrals in a typical month."
        value={inputs.opportunities}
        {...bounds.opportunities}
        curve={1.6}
        suffix=" /mo"
        format={formatNumber}
        onChange={set('opportunities')}
        onCommit={commit}
      />
      <SliderField
        label="Share that goes cold"
        hint="Unanswered, unbooked, or quietly dropped after first contact."
        value={inputs.leakageRate}
        {...bounds.leakageRate}
        suffix="%"
        format={formatNumber}
        onChange={set('leakageRate')}
        onCommit={commit}
      />
      <SliderField
        label="Assumed recovery rate"
        hint="How much of that you believe is winnable with faster, persistent follow-up."
        value={inputs.recoveryRate}
        {...bounds.recoveryRate}
        suffix="%"
        format={formatNumber}
        onChange={set('recoveryRate')}
        onCommit={commit}
      />
      <SliderField
        label="Average booked job"
        hint="Your average ticket across the work this would bring back."
        value={inputs.jobValue}
        {...bounds.jobValue}
        curve={2.2}
        prefix="$"
        format={formatNumber}
        onChange={set('jobValue')}
        onCommit={commit}
      />
    </div>
  )
}
