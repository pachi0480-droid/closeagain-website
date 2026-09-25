'use client'

import { Eyebrow } from '@/components/ui/Type'
import { type CalculatorInputs, sensitivity } from '@/lib/calculator'
import { formatCurrency, formatNumber } from '@/lib/format'

/**
 * The same arithmetic across a range of recovery rates.
 *
 * Nobody knows their recovery rate in advance, and defending a single number
 * would be dishonest. The operator's own rate is marked in the row it falls
 * nearest, so the table is read as a range and not a promise.
 */
export function Sensitivity({ inputs }: { inputs: CalculatorInputs }) {
  const rows = sensitivity(inputs)

  return (
    <div className="mt-14">
      <Eyebrow>If the recovery rate is different</Eyebrow>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">
            Illustrative monthly upside from working the follow-up gap, across a
            range of recovery rates.
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th
                scope="col"
                className="pb-3 font-mono text-mono-xs font-normal uppercase text-secondary"
              >
                Recovery rate
              </th>
              <th
                scope="col"
                className="pb-3 text-right font-mono text-mono-xs font-normal uppercase text-secondary"
              >
                Jobs recovered
              </th>
              <th
                scope="col"
                className="pb-3 text-right font-mono text-mono-xs font-normal uppercase text-secondary"
              >
                Monthly upside
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const current = row.recoveryRate === inputs.recoveryRate
              return (
                <tr
                  key={row.recoveryRate}
                  className={`border-b border-rule-soft last:border-b-0 ${
                    current ? 'bg-signal/[0.06]' : ''
                  }`}
                >
                  <th
                    scope="row"
                    className={`tnum py-3 font-mono text-[0.9375rem] font-normal ${
                      current ? 'text-signal' : 'text-muted'
                    }`}
                  >
                    {row.recoveryRate}%
                    {current ? (
                      <span className="ml-2 font-mono text-mono-xs uppercase">
                        Yours
                      </span>
                    ) : null}
                  </th>
                  <td className="tnum py-3 text-right font-mono text-[0.9375rem] text-muted">
                    {formatNumber(row.conversionJobs)}
                  </td>
                  <td
                    className={`tnum py-3 text-right font-mono text-[0.9375rem] ${
                      current ? 'text-warm-white' : 'text-muted'
                    }`}
                  >
                    {formatCurrency(row.conversionUpside)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
