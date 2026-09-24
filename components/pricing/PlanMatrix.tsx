import { plans, planMatrix, type MatrixCell } from '@/data/pricing'

function Cell({ value, plan }: { value: MatrixCell; plan: string }) {
  if (typeof value === 'string') {
    return (
      <span className="font-mono text-mono-xs text-graphite-2 uppercase">
        {value}
      </span>
    )
  }

  return value ? (
    <>
      {/* a mark, plus text only a screen reader reads */}
      <span
        aria-hidden="true"
        className="inline-block h-[7px] w-[7px] rounded-full bg-recover"
      />
      <span className="sr-only">Included in {plan}</span>
    </>
  ) : (
    <>
      <span
        aria-hidden="true"
        className="inline-block h-px w-3 bg-dormant/60"
      />
      <span className="sr-only">Not included in {plan}</span>
    </>
  )
}

/**
 * The full breakdown. A real table, because this is tabular data and a
 * keyboard or screen reader user should be able to navigate it as one.
 */
export function PlanMatrix() {
  return (
    <div>
      {/* The table is wider than a phone. Say so, rather than leaving the
          scroll to be discovered. */}
      <p className="mb-4 flex items-center gap-2 font-mono text-mono-xs text-graphite-3 uppercase lg:hidden">
        Scroll to compare
        <svg viewBox="0 0 12 10" fill="none" aria-hidden="true" className="h-[0.6rem] w-[0.72rem]">
          <path
            d="M0.75 5h9.5M7 1.5 10.5 5 7 8.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          What each CloseAgain plan covers, by capability.
        </caption>
        <thead>
          <tr className="border-b border-graphite/20">
            <th scope="col" className="w-[38%] py-4 font-mono text-mono-xs font-normal text-graphite-3 uppercase">
              Capability
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className="py-4 pl-6 font-normal"
              >
                <span className="block text-[1.0625rem] tracking-[-0.015em] text-graphite">
                  {plan.name}
                </span>
                <span className="tnum mt-1 block font-mono text-mono-xs text-graphite-3">
                  {plan.price === null
                    ? plan.priceLabel
                    : `$${plan.price.toLocaleString('en-US')} / mo`}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {planMatrix.map((group) => (
          <tbody key={group.group}>
            <tr>
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="border-b border-rule pt-9 pb-2.5 font-mono text-mono-xs font-normal text-graphite-3 uppercase"
              >
                {group.group}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="border-b border-rule-soft">
                <th
                  scope="row"
                  className="py-3.5 pr-6 text-[0.9375rem] font-normal text-graphite-2"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={plans[i].id} className="py-3.5 pl-6">
                    <Cell value={value} plan={plans[i].name} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
        </table>
      </div>
    </div>
  )
}
