'use client'

import { LEAK_STAGES, flows } from '@/data/leak-map'

const stageLabel = ['Interest', 'Contact', 'Follow-up', 'Booking']

/**
 * Mobile is a different composition, not a shrunk one: the flow runs top to
 * bottom through the same gates, and each gate shows what fell out of it.
 * Eighteen horizontal lanes would be unreadable on a phone.
 */
export function LeakMapMobile({ on }: { on: boolean }) {
  const gates = [1, 2, 3].map((stop) => {
    const at = flows.filter((f) => f.stopsAt === stop)
    return {
      stop,
      label: stageLabel[stop],
      lost: at,
      recovered: at.filter((f) => f.recoverable).length,
      reasons: [...new Set(at.map((f) => f.reason))],
    }
  })

  const booked = flows.filter((f) => f.stopsAt === null).length

  return (
    <div className="stage-ink hairline-top relative overflow-hidden rounded-[14px] px-5 py-6">
      <p className="font-mono text-mono-xs text-chalk-3 uppercase">
        {flows.length} opportunities enter
      </p>

      <ol className="relative mt-6">
        {/* the spine everything travels */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-8 left-[5px] w-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(244,242,237,0.3) 0 3px, transparent 3px 9px)',
          }}
        />

        {gates.map((gate) => (
          <li key={gate.stop} className="relative pb-8 pl-7">
            <span
              aria-hidden="true"
              className="absolute top-[7px] left-0 h-[11px] w-[11px] rounded-full border border-dormant-ink bg-ink"
            />
            <p className="font-mono text-mono-xs text-chalk-2 uppercase">{gate.label}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {gate.lost.map((f, i) => {
                const back = on && f.recoverable
                return (
                  <span
                    key={i}
                    className="h-2 w-6 rounded-full transition-colors duration-500"
                    style={{
                      backgroundColor: back
                        ? 'var(--color-recover-bright)'
                        : 'var(--color-dormant-ink)',
                      opacity: back ? 1 : 0.55,
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                )
              })}
            </div>

            <p className="mt-3 text-[0.8125rem] leading-snug text-chalk-3">
              {gate.lost.length} stop here — {gate.reasons.join(', ').toLowerCase()}
              {on ? `. ${gate.recovered} reconnected.` : '.'}
            </p>
          </li>
        ))}

        <li className="relative pl-7">
          <span
            aria-hidden="true"
            className="absolute top-[7px] left-0 h-[11px] w-[11px] rounded-full bg-recover-bright"
          />
          <p className="font-mono text-mono-xs text-recover-bright uppercase">Revenue</p>
          <p className="mt-2 text-[0.9375rem] text-chalk">
            {booked} book anyway
            {on ? `, plus ${flows.filter((f) => f.stopsAt !== null && f.recoverable).length} reconnected` : ''}
          </p>
        </li>
      </ol>

      <p className="mt-4 border-t border-rule-ink pt-4 font-mono text-mono-xs text-chalk-3 uppercase">
        {LEAK_STAGES.length} gates · illustrative flow
      </p>
    </div>
  )
}
