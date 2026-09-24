'use client'

import Link from 'next/link'
import { plans } from '@/data/pricing'
import type { CalculatorResult } from '@/lib/calculator'
import { formatCurrency } from '@/lib/format'

/**
 * The plan price set against the operator's own estimate. This is division,
 * not a projection — and it is labelled as such.
 */
export function AgainstPlans({ result }: { result: CalculatorResult }) {
  const priced = plans.filter((plan) => plan.price !== null)

  return (
    <ul className="border-t border-rule">
      {priced.map((plan) => {
        const price = plan.price as number
        const share = result.monthlyValue > 0 ? price / result.monthlyValue : null
        const jobs = Math.ceil(price / Math.max(1, result.monthlyValue / Math.max(1, result.recoveredPerMonth)))

        return (
          <li
            key={plan.id}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4"
          >
            <span className="flex items-baseline gap-3">
              <Link
                href="/pricing"
                className="link-rule text-[1.0625rem] text-graphite"
              >
                {plan.name}
              </Link>
              <span className="tnum font-mono text-mono-sm text-graphite-3">
                {formatCurrency(price)} / mo
              </span>
            </span>

            <span className="tnum font-mono text-mono-sm text-graphite-2">
              {share === null || share >= 1
                ? 'more than the estimate'
                : `${(share * 100).toFixed(share < 0.1 ? 1 : 0)}% of the estimate · about ${jobs} recovered ${jobs === 1 ? 'job' : 'jobs'}`}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
