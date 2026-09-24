'use client'

import { useState } from 'react'
import { Illustrative } from '@/components/ui/Disclaimer'
import { capabilities, zones, type ZoneId } from '@/data/capabilities'

/**
 * The recovery surface.
 *
 * One canvas of a customer's life with the business, with each capability
 * placed in the region where it actually acts — so six capabilities read as
 * one engine covering a lifecycle rather than six features in a grid.
 * Recovery Intelligence sits underneath all of it, because that is where it
 * runs.
 *
 * Selecting a capability lights its region and surfaces the line a customer
 * would really receive. Real buttons, so it works from the keyboard.
 */
export function RecoverySurface() {
  const [activeId, setActiveId] = useState(capabilities[0].id)
  const active = capabilities.find((c) => c.id === activeId) ?? capabilities[0]

  const inZone = (zone: ZoneId) => capabilities.filter((c) => c.zone === zone)
  const surfaceZones = zones.filter((z) => z.id !== 'system')
  const system = inZone('system')

  return (
    <div>
      <div className="stage-ink hairline-top relative overflow-hidden rounded-[18px] p-5 sm:p-7">
        {/* --- the regions ------------------------------------------ */}
        <div className="grid gap-3 lg:grid-cols-4">
          {surfaceZones.map((zone) => {
            const lit = active.zone === zone.id
            return (
              <div
                key={zone.id}
                className={`rounded-[12px] border p-4 transition-colors duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
                  lit
                    ? 'border-recover-bright/30 bg-recover-deep/25'
                    : 'border-rule-ink bg-chalk/[0.015]'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={`font-mono text-mono-xs uppercase transition-colors duration-500 ${
                      lit ? 'text-recover-bright' : 'text-chalk-3'
                    }`}
                  >
                    {zone.label}
                  </h3>
                  <span className="font-mono text-[0.625rem] text-chalk-3 uppercase">
                    {zone.note}
                  </span>
                </div>

                <ul className="mt-4 flex flex-col gap-2">
                  {inZone(zone.id).map((capability) => {
                    const on = capability.id === activeId
                    return (
                      <li key={capability.id}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setActiveId(capability.id)}
                          className={`flex w-full items-center gap-2.5 rounded-[9px] border px-3 py-2.5 text-left transition-all duration-400 [transition-timing-function:var(--ease-out-quiet)] ${
                            on
                              ? 'border-recover-bright/40 bg-recover-deep/50'
                              : 'border-rule-ink bg-ink-raise/50 hover:border-chalk/20 hover:bg-ink-raise'
                          }`}
                        >
                          <span
                            className={`h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-400 ${
                              on ? 'bg-recover-bright' : 'bg-chalk-3/60'
                            }`}
                          />
                          <span
                            className={`text-[0.875rem] leading-tight transition-colors duration-400 ${
                              on ? 'text-chalk' : 'text-chalk-2'
                            }`}
                          >
                            {capability.name}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {/* --- the system underneath -------------------------------- */}
        <div className="mt-3">
          {system.map((capability) => {
            const on = capability.id === activeId
            return (
              <button
                key={capability.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActiveId(capability.id)}
                className={`flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left transition-all duration-400 [transition-timing-function:var(--ease-out-quiet)] ${
                  on
                    ? 'border-recover-bright/30 bg-recover-deep/25'
                    : 'border-rule-ink bg-chalk/[0.015] hover:bg-chalk/[0.04]'
                }`}
              >
                <span
                  className={`h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-400 ${
                    on ? 'bg-recover-bright' : 'bg-chalk-3/60'
                  }`}
                />
                <span
                  className={`text-[0.875rem] transition-colors duration-400 ${
                    on ? 'text-chalk' : 'text-chalk-2'
                  }`}
                >
                  {capability.name}
                </span>
                <span className="ml-auto font-mono text-mono-xs text-chalk-3 uppercase">
                  Across all of it
                </span>
              </button>
            )
          })}
        </div>

        {/* --- what the selected part does -------------------------- */}
        <div
          aria-live="polite"
          className="mt-6 border-t border-rule-ink pt-6 lg:grid lg:grid-cols-12 lg:gap-x-10"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-mono-xs text-chalk-3 uppercase">
              Sets it off
            </p>
            <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-chalk-2">
              {active.detail.trigger}
            </p>
          </div>
          <div className="mt-6 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <p className="font-mono text-mono-xs text-chalk-3 uppercase">
              What the customer gets
            </p>
            <p className="mt-2.5 max-w-[42ch] rounded-[12px] rounded-bl-[3px] border border-recover-bright/20 bg-recover-deep/35 px-4 py-3 text-[0.9375rem] leading-snug text-chalk">
              {active.detail.example}
            </p>
          </div>
        </div>
      </div>

      <Illustrative className="mt-3.5">
        Illustrative · capability depth set with pilot operators
      </Illustrative>
    </div>
  )
}
