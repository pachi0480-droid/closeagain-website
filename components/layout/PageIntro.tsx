import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'

/**
 * The opening of every route that is not the homepage. Deliberately calmer
 * than the hero — these pages are read by someone who has already decided to
 * look closer, so they open with the fact, not the pitch.
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
    <section className="grain-ink relative isolate overflow-hidden bg-ink-raise pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="field-grid-ink absolute inset-0 opacity-60"
          style={{
            maskImage: 'radial-gradient(110% 80% at 30% 0%, #000 0%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(110% 80% at 30% 0%, #000 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              'linear-gradient(to bottom, rgba(242,238,231,0) 0%, var(--color-paper) 100%)',
          }}
        />
      </div>

      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={90} y={18}>
              <h1 className="mt-5 max-w-[18ch] text-display text-chalk">{title}</h1>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-auto lg:pb-2">
            <Reveal delay={190} y={14}>
              <p className="max-w-[44ch] text-lede text-chalk-2">{lede}</p>
              {aside ? <div className="mt-6">{aside}</div> : null}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
