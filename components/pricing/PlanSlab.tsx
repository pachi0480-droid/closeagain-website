'use client'

import { useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { plans } from '@/data/pricing'
import { cta } from '@/data/site'
import { track } from '@/lib/analytics'

/**
 * The plan surface: one dark slab, four plans, hairlines instead of cards.
 * Shared by the homepage pricing section and the /pricing page so the two can
 * never drift apart.
 */
export function PlanSlab() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="on-ink overflow-hidden rounded-[16px] bg-ink text-chalk shadow-[0_40px_90px_-56px_rgba(13,15,14,0.7)]"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-chalk/12 to-transparent" />

      <div className="grid lg:grid-cols-4">
        {plans.map((plan, i) => {
          const dimmed = hovered !== null && hovered !== plan.id
          return (
            <div
              key={plan.id}
              onMouseEnter={() => {
                setHovered(plan.id)
                track('pricing_plan_focused', { plan: plan.id })
              }}
              className={[
                'relative flex flex-col px-6 py-9 transition-colors duration-500',
                '[transition-timing-function:var(--ease-out-quiet)]',
                'border-b border-rule-ink last:border-b-0 lg:border-b-0',
                i > 0 ? 'lg:border-l lg:border-rule-ink' : '',
                plan.recommended ? 'bg-chalk/[0.05]' : '',
                hovered === plan.id ? 'bg-chalk/[0.075]' : '',
                'md:px-7',
              ].join(' ')}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[1.25rem] tracking-[-0.02em] text-chalk">
                  {plan.name}
                </h3>
                {plan.recommended ? (
                  <span className="font-mono text-mono-xs text-recover-bright uppercase">
                    Recommended
                  </span>
                ) : null}
              </div>

              <p className="tnum mt-6 flex items-baseline gap-1.5">
                {plan.price === null ? (
                  // Not a number, so it should not be set like one.
                  <span className="font-mono text-[1.5rem] leading-none text-chalk">
                    {plan.priceLabel}
                  </span>
                ) : (
                  <>
                    <span className="font-mono text-[2rem] leading-none text-chalk">
                      ${plan.price.toLocaleString('en-US')}
                    </span>
                    <span className="font-mono text-mono-sm text-chalk-3">
                      / month
                    </span>
                  </>
                )}
              </p>

              <p
                className={`mt-5 text-[0.9375rem] lg:min-h-[4.5rem] leading-relaxed transition-colors duration-500 ${
                  dimmed ? 'text-chalk-3' : 'text-chalk-2'
                }`}
              >
                {plan.audience}
              </p>

              <ul className="mt-6 border-t border-rule-ink-soft pt-5">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 py-1.5 text-[0.875rem] leading-snug text-chalk-2"
                  >
                    <span className="mt-[0.5rem] h-px w-3 shrink-0 bg-recover-bright/60" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grow" />

              <ButtonLink
                href={cta.target}
                tone="ink"
                variant={plan.recommended ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() =>
                  track('pricing_cta_clicked', { plan: plan.id })
                }
              >
                {plan.price === null ? 'Talk to us' : cta.pricing}
              </ButtonLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
