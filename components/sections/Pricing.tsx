'use client'

import { useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { plans } from '@/data/pricing'
import { cta } from '@/data/site'
import { track } from '@/lib/analytics'

/**
 * One dark surface, four plans, hairlines instead of cards. Monthly only —
 * there is no annual toggle and no annual discount to hunt for.
 */
export function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="pricing" className="grain relative bg-limestone/70 py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionMark index="10" label="Pricing" />
              <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                Monthly pricing. Nothing to unpick.
              </h2>
            </Reveal>
          </div>
          <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <Reveal delay={140}>
              <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-graphite-2">
                Plans differ by how much of the lead lifecycle CloseAgain is
                recovering — not by how many messages you are rationed.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={100}>
          <div
            className="on-ink mt-14 overflow-hidden rounded-[16px] bg-ink text-chalk shadow-[0_40px_90px_-56px_rgba(13,15,14,0.7)] md:mt-16"
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
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-mono-xs text-graphite-3 uppercase">
              Monthly · no annual contract · no annual pricing
            </p>
            <p className="font-mono text-mono-xs text-graphite-3 uppercase">
              Pre-launch · pilot pricing confirmed before onboarding
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
