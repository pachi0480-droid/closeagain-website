import { plans } from '@/data/pricing'
import { formatNumber } from '@/lib/format'

/**
 * The plan surface: one slab, four plans, hairlines instead of cards, and one
 * recommended plan carrying the signal. Shared by the homepage offer and the
 * pricing route so the two can never drift apart.
 */
export function PlanGrid() {
  return (
    <div className="stage grid gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const featured = Boolean(plan.recommended)
        return (
          <div
            key={plan.id}
            className={`relative flex flex-col p-5 md:p-6 lg:p-7 ${
              featured ? 'bg-graphite-raised' : 'bg-graphite'
            }`}
          >
            {featured ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-signal"
              />
            ) : null}

            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-h3 text-warm-white">{plan.name}</h3>
              {featured ? (
                <span className="font-mono text-mono-xs uppercase text-signal">
                  Recommended
                </span>
              ) : null}
            </div>

            <p className="tnum mt-4 text-[2rem] leading-none font-semibold tracking-[-0.04em] text-warm-white">
              {plan.price === null ? (
                // Not a number, so it is not set like one.
                <span className="font-mono text-[1.5rem] font-normal tracking-normal">
                  {plan.priceLabel}
                </span>
              ) : (
                <>
                  ${formatNumber(plan.price)}
                  <span className="ml-1 font-mono text-[0.875rem] font-normal tracking-normal text-secondary">
                    /mo
                  </span>
                </>
              )}
            </p>

            <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">
              {plan.audience}
            </p>

            <ul className="mt-4 flex-1 space-y-2 border-t border-rule pt-4 md:mt-5 md:pt-5">
              {plan.includes.map((item) => (
                <li key={item} className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-px shrink-0 text-[0.6rem] text-signal"
                  >
                    ✓
                  </span>
                  <span className="text-[0.875rem] leading-snug text-warm-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
