import { Eyebrow } from '@/components/ui/Type'

/**
 * What the model leaves out. A calculator that hid these would produce a
 * bigger number and a worse decision.
 */
const ignored = [
  {
    label: 'Capacity',
    detail:
      'Recovered work still needs a truck, a technician and a slot on the schedule.',
  },
  {
    label: 'Close rate on recovered leads',
    detail:
      'A reopened conversation is not a booked job. The recovery rate here is your estimate of both.',
  },
  {
    label: 'Ticket variance',
    detail:
      'One average job value flattens the difference between a service call and a replacement.',
  },
  {
    label: 'Seasonality',
    detail:
      'Demand and urgency move through the year, and so does what a follow-up is worth.',
  },
]

export function Ignored() {
  return (
    <div className="mt-14 border-t border-rule pt-8">
      <Eyebrow>What this model ignores</Eyebrow>
      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        {ignored.map((item) => (
          <div key={item.label}>
            <dt className="text-[0.9375rem] text-warm-white">{item.label}</dt>
            <dd className="mt-1.5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
