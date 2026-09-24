'use client'

import { useId, useState } from 'react'
import { pricingFaq } from '@/data/pricing'
import { track } from '@/lib/analytics'

/** Pricing-specific questions, in the same accordion pattern as the main FAQ. */
export function PricingQuestions() {
  const [open, setOpen] = useState<string | null>(pricingFaq[0].id)
  const baseId = useId()

  return (
    <dl className="border-t border-rule-ink">
      {pricingFaq.map((item) => {
        const expanded = open === item.id
        const buttonId = `${baseId}-${item.id}-button`
        const panelId = `${baseId}-${item.id}-panel`

        return (
          <div key={item.id} className="border-b border-rule-ink">
            <dt>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  const next = expanded ? null : item.id
                  setOpen(next)
                  if (next) track('faq_opened', { question: `pricing:${item.id}` })
                }}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span
                  className={`max-w-[38ch] text-[1.125rem] tracking-[-0.015em] transition-colors duration-300 ${
                    expanded ? 'text-chalk' : 'text-chalk-2 group-hover:text-chalk'
                  }`}
                >
                  {item.q}
                </span>
                <span aria-hidden="true" className="relative mt-2 block h-3 w-3 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-graphite-2" />
                  <span
                    className={`absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-graphite-2 transition-transform duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
                      expanded ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:var(--ease-out-quiet)]"
              style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-[58ch] pb-7 text-[1.0625rem] leading-relaxed text-chalk-2 transition-opacity duration-500 ${
                    expanded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
