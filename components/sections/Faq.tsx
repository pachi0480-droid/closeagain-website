'use client'

import { useId, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { faq } from '@/data/faq'
import { site } from '@/data/site'
import { track } from '@/lib/analytics'

export function Faq() {
  const [open, setOpen] = useState<string | null>(faq[0].id)
  const baseId = useId()

  return (
    <section id="faq" className="grain relative bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="11" label="Questions" />
              <h2 className="mt-7 max-w-[14ch] text-h2 text-graphite">
                Before you ask.
              </h2>
              <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                Anything not covered here, write to{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="link-rule text-graphite"
                >
                  {site.email}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <dl className="border-t border-graphite/20">
              {faq.map((item) => {
                const expanded = open === item.id
                const buttonId = `${baseId}-${item.id}-button`
                const panelId = `${baseId}-${item.id}-panel`

                return (
                  <div key={item.id} className="border-b border-rule">
                    <dt>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        onClick={() => {
                          const next = expanded ? null : item.id
                          setOpen(next)
                          if (next) track('faq_opened', { question: item.id })
                        }}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={`max-w-[38ch] text-[1.125rem] tracking-[-0.015em] transition-colors duration-300 ${
                            expanded
                              ? 'text-graphite'
                              : 'text-graphite-2 group-hover:text-graphite'
                          }`}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className="relative mt-2 block h-3 w-3 shrink-0"
                        >
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
                          className={`max-w-[58ch] pb-7 text-[1.0625rem] leading-relaxed text-graphite-2 transition-opacity duration-500 ${
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
          </div>
        </div>
      </div>
    </section>
  )
}
