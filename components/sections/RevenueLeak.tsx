'use client'

import { LeakPath } from '@/components/recovery/LeakPath'
import { RecoveryDivider } from '@/components/recovery/RecoveryDivider'
import { Reveal } from '@/components/ui/Reveal'
import { StatusTag } from '@/components/ui/StatusDot'
import { Accent, Eyebrow, SectionMark } from '@/components/ui/Type'
import { leaks } from '@/data/leaks'
import { trackOnce } from '@/lib/analytics'

export function RevenueLeak() {
  return (
    <section id="leak" className="grain relative bg-paper">
      <div className="shell">
        <RecoveryDivider />
      </div>

      {/* --- the turn: from "you may be losing money" to "here is where" --- */}
      <div className="shell pt-20 pb-20 md:pt-28 md:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-8 lg:col-start-4">
            <Reveal>
              <p className="max-w-[22ch] text-h2 text-graphite">
                Revenue rarely disappears all at once.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 max-w-[22ch] text-h2 text-graphite-3">
                It leaks out in <Accent>moments</Accent>.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-8 max-w-[50ch] text-lede text-graphite-2">
                Every one of these happens after the customer has already raised
                their hand. The money is spent. The interest is real. And then
                nothing happens next.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* --- the ledger ---------------------------------------------------- */}
      <div className="shell pb-24 md:pb-32">
        <Reveal>
          <SectionMark index="01" label="Where it goes" />
          {/* the axis every row below is measured against */}
          <div className="mt-8 flex items-baseline justify-between gap-6 border-b border-graphite/20 pb-2.5">
            <Eyebrow>Interest</Eyebrow>
            <Eyebrow>Booked revenue</Eyebrow>
          </div>
        </Reveal>

        <ol>
          {leaks.map((leak) => (
            <li key={leak.id}>
              <LeakRow leak={leak} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function LeakRow({ leak }: { leak: (typeof leaks)[number] }) {
  return (
    <Reveal
      className="group border-b border-rule py-9 md:py-11"
      onEnter={() => trackOnce('leak_moment_viewed', { moment: leak.id })}
    >
      <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
        <div className="lg:col-span-1">
          <span className="tnum font-mono text-mono-sm text-graphite-3 transition-colors duration-500 group-hover:text-graphite">
            {leak.index}
          </span>
        </div>

        <div className="lg:col-span-4">
          <h3 className="max-w-[20ch] text-h3 text-graphite">{leak.title}</h3>
          <p className="tnum mt-3 font-mono text-mono-xs text-graphite-3 uppercase">
            {leak.time} · {leak.source}
          </p>
          <p className="mt-1 font-mono text-mono-xs text-graphite-3 uppercase">
            {leak.job}
          </p>
        </div>

        <div className="lg:col-span-7">
          <p className="max-w-[58ch] text-[1.0625rem] leading-relaxed text-graphite-2">
            {leak.scene[0]}{' '}
            <span className="text-graphite-3">{leak.scene[1]}</span>
          </p>
        </div>
      </div>

      {/* how far this one got before it stopped moving */}
      <div className="mt-8 md:mt-9">
        <LeakPath progress={leak.progress} />
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <StatusTag state="lost" label={leak.outcome} />
          <span className="tnum font-mono text-mono-xs text-graphite-3 uppercase">
            Stopped {Math.round(leak.progress * 100)}% along
          </span>
        </div>
      </div>
    </Reveal>
  )
}
