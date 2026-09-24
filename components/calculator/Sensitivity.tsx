'use client'

import { calculate, type CalculatorInputs } from '@/lib/calculator'
import { formatCurrency } from '@/lib/format'

const RATES = [10, 20, 30, 40, 50]

/**
 * The same arithmetic at other recovery assumptions.
 *
 * Nobody knows their real recovery rate before they try, so the honest move is
 * to show the whole range rather than defend one number.
 */
export function Sensitivity({ inputs }: { inputs: CalculatorInputs }) {
  const rows = RATES.map((rate) => ({
    rate,
    ...calculate({ ...inputs, recoveryRate: rate }),
    current: rate === inputs.recoveryRate,
  }))

  const max = Math.max(...rows.map((r) => r.monthlyValue))

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Estimated monthly revenue opportunity at different recovery rates,
        using your other assumptions.
      </caption>
      <thead>
        <tr className="border-b border-rule-ink">
          <th scope="col" className="py-3 font-mono text-mono-xs font-normal text-chalk-3 uppercase">
            If you recover
          </th>
          <th scope="col" className="py-3 text-right font-mono text-mono-xs font-normal text-chalk-3 uppercase">
            Per month
          </th>
          <th scope="col" className="hidden py-3 text-right font-mono text-mono-xs font-normal text-chalk-3 uppercase sm:table-cell">
            Per year
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.rate} className="group border-b border-rule-ink-soft">
            <th scope="row" className="py-4 pr-4 font-normal">
              <span className="flex items-center gap-3">
                <span
                  className={`tnum font-mono text-[0.9375rem] ${
                    row.current ? 'text-recover-bright' : 'text-chalk-2'
                  }`}
                >
                  {row.rate}%
                </span>
                {row.current ? (
                  <span className="font-mono text-mono-xs text-recover-bright uppercase">
                    Your assumption
                  </span>
                ) : null}
              </span>
              {/* proportional bar, so the shape of the range is visible */}
              <span
                aria-hidden="true"
                className="mt-2 block h-px origin-left bg-recover/45 transition-[width] duration-500"
                style={{ width: `${(row.monthlyValue / max) * 100}%` }}
              />
            </th>
            <td
              className={`tnum py-4 text-right align-top font-mono text-[0.9375rem] ${
                row.current ? 'text-chalk' : 'text-chalk-2'
              }`}
            >
              {formatCurrency(row.monthlyValue)}
            </td>
            <td className="tnum hidden py-4 text-right align-top font-mono text-[0.9375rem] text-chalk-3 sm:table-cell">
              {formatCurrency(row.annualValue)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
