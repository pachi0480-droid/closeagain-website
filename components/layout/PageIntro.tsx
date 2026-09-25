import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'

/**
 * The opening of every route that is not the homepage. Deliberately calmer
 * than the Signal Room — these pages are read by someone who has already
 * decided to look closer, so they open with the fact, not the pitch.
 */
export function PageIntro({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  lede: string
  aside?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite-deep pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40">
      <div
        aria-hidden="true"
        className="field-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(110%_80%_at_30%_0%,black,transparent_70%)]"
      />

      <div className="shell-wide">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={90} y={18}>
              <h1 className="mt-5 max-w-[20ch] text-display font-semibold uppercase text-warm-white">
                {title}
              </h1>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-auto lg:pb-2">
            <Reveal delay={190} y={14}>
              <p className="max-w-[44ch] text-lede text-muted">{lede}</p>
              {aside ? <div className="mt-6">{aside}</div> : null}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
