'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import {
  closeAgainRow,
  compatibility,
  difference,
  industries,
  otherIndustries,
} from '@/data/industries'
import { chapter } from '@/data/site'
import { track } from '@/lib/analytics'

/**
 * Chapter seven — who this is for, and what it is next to.
 *
 * The industries are a selector rather than a wall of cards: pick a trade and
 * the same three questions get answered for it. The comparison underneath is
 * one screen, not a feature matrix — it exists to place the category, and the
 * only honest way to do that is to say plainly what everything else does.
 */
export function IndustrySignals() {
  const [active, setActive] = useState(0)
  const industry = industries[active]

  const choose = (i: number) => {
    setActive(i)
    track('industry_selected', { industry: industries[i].id })
  }

  const scenario = [
    {
      label: 'New demand',
      value: industry.scenario.newDemand,
      colour: 'var(--color-new)',
    },
    {
      label: 'At risk',
      value: industry.scenario.atRisk,
      colour: 'var(--color-risk)',
    },
    {
      label: 'Recoverable',
      value: industry.scenario.recoverable,
      colour: 'var(--color-signal)',
    },
  ]

  return (
    <section
      id={chapter.industries}
      className="relative scroll-mt-24 border-t border-rule bg-graphite-deep py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <SectionMark index="07" label="Industries" />
          <h2 className="mt-6 max-w-[20ch] text-h2 font-semibold uppercase text-warm-white">
            Built for high-intent home services.
          </h2>
        </Reveal>

        {/* ------------------------------------------------- the selector */}
        <Reveal delay={80} className="mt-10">
          <div
            role="group"
            aria-label="Choose a trade"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {industries.map((item, i) => {
              const on = i === active
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(i)}
                  className={`h-11 shrink-0 rounded-[8px] border px-3.5 text-[0.875rem] whitespace-nowrap transition-colors duration-300 ${
                    on
                      ? 'border-signal bg-signal/10 text-signal'
                      : 'border-steel text-muted hover:border-warm-white/35 hover:text-warm-white'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* -------------------------------------------- the trade's month */}
        <Reveal delay={120} className="mt-6">
          <div aria-live="polite" className="stage grid gap-px sm:grid-cols-3">
            {scenario.map((line) => (
              <div key={line.label} className="bg-graphite p-6">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="dot"
                    style={{ color: line.colour }}
                  />
                  <p className="font-mono text-mono-xs uppercase text-secondary">
                    {line.label}
                  </p>
                </div>
                <p className="mt-3 text-[1.0625rem] leading-snug tracking-[-0.015em] text-warm-white">
                  {line.value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-[60ch] text-[0.9375rem] text-secondary">
            {otherIndustries}
          </p>
        </Reveal>

        {/* ------------------------------------------- the category, placed */}
        <Reveal delay={80} className="mt-20">
          <h3 className="max-w-[24ch] text-h3 text-warm-white">
            What CloseAgain is, next to what you already have.
          </h3>

          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {difference.map((row) => (
              <div
                key={row.category}
                className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6"
              >
                <dt className="text-[0.9375rem] text-muted sm:col-span-4">
                  {row.category}
                </dt>
                <dd className="text-[0.9375rem] text-secondary sm:col-span-8">
                  {row.does}
                </dd>
              </div>
            ))}

            <div className="grid gap-1 border-l-2 border-signal bg-signal/[0.05] py-4 pl-4 sm:grid-cols-12 sm:gap-6 sm:pl-5">
              <dt className="text-[0.9375rem] font-medium text-signal sm:col-span-4">
                {closeAgainRow.category}
              </dt>
              <dd className="text-[0.9375rem] text-warm-white sm:col-span-8">
                {closeAgainRow.does}
              </dd>
            </div>
          </dl>

          <p className="mt-6 max-w-[64ch] text-[0.9375rem] leading-relaxed text-muted">
            {compatibility}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
