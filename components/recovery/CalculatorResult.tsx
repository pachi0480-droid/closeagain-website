'use client'

import { useEffect } from 'react'
import { useTweenedNumber } from '@/components/recovery/NumberRoll'
import { formatCurrency, splitCurrency } from '@/lib/format'

/** The calculator's headline figure. The only rolling number on the site. */
export function NumberRollDisplay({
  monthly,
  annual,
  onSettled,
}: {
  monthly: number
  annual: number
  onSettled?: () => void
}) {
  const shownMonthly = useTweenedNumber(monthly)
  const { symbol, amount } = splitCurrency(shownMonthly)

  useEffect(() => {
    const id = window.setTimeout(() => onSettled?.(), 900)
    return () => window.clearTimeout(id)
  }, [monthly, onSettled])

  return (
    <div>
      <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
        Estimated monthly revenue opportunity
      </h3>

      <p
        className="tnum mt-4 flex items-start font-mono leading-[0.92] text-recover-bright"
        aria-live="polite"
      >
        <span className="sr-only">{formatCurrency(monthly)} per month</span>
        <span aria-hidden="true" className="text-[clamp(1.5rem,2.4vw,2rem)] pt-1.5">
          {symbol}
        </span>
        <span aria-hidden="true" className="text-[clamp(2.75rem,6.2vw,4.5rem)]">
          {amount}
        </span>
      </p>

      <p className="tnum mt-6 flex items-baseline gap-3 border-t border-rule-ink pt-5">
        <span className="font-mono text-mono-xs text-chalk-3 uppercase">
          Per year
        </span>
        <span className="font-mono text-[1.375rem] text-chalk">
          {formatCurrency(annual)}
        </span>
      </p>
    </div>
  )
}
