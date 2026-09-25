import Image from 'next/image'
import { SignalField, SignalStrip } from '@/components/signal/SignalField'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Type'
import { cta, site } from '@/data/site'

/**
 * Chapter one — the Signal Room.
 *
 * The claim on the left, the system running on the right. A visitor should
 * understand what CloseAgain is before they scroll: demand arrives as signals,
 * one node assigns each of them a next action, and some of them come back
 * booked.
 */

/** The process, stated as a chain. This is the proof: clarity, not numbers. */
const chain = [
  'Signal received',
  'Context understood',
  'Opportunity qualified',
  'Next action selected',
  'Booking reached',
]

export function SignalRoomHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-rule bg-void">
      {/*
        The room itself. A single 11KB plate of the Signal Room's atmosphere —
        a low horizon, a receding grid and a scatter of distant signals —
        masked so it only ever reads as depth beneath the content. Everything
        in the foreground is drawn in the browser.
      */}
      <Image
        src="/signal-room.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-bottom opacity-70 [mask-image:linear-gradient(to_top,black_0%,black_28%,transparent_78%)]"
      />

      {/* light pooling high and to the right, falling away below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(75% 60% at 72% 8%, rgba(244,241,233,0.055), transparent 70%),' +
            'radial-gradient(55% 55% at 18% 96%, rgba(183,255,106,0.045), transparent 72%)',
        }}
      />

      <div className="shell-wide">
        <div className="grid min-h-[100svh] items-center gap-12 pt-28 pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-20">
          {/* ---------------------------------------------------- the claim */}
          <div className="lg:col-span-6">
            <Eyebrow className="block leading-[1.6]">
              {site.category}
            </Eyebrow>

            <h1 className="mt-6 text-hero font-semibold uppercase text-warm-white">
              Turn demand
              <br />
              into booked jobs.
            </h1>

            <p className="mt-6 max-w-[46ch] text-lede text-muted">
              {site.description}
            </p>

            <p className="mt-5 flex items-center gap-2.5 text-[0.9375rem] text-warm-white">
              <span aria-hidden="true" className="dot text-signal" data-pulse="true" />
              {site.promise}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={cta.target} size="lg" withArrow>
                {cta.primary}
              </ButtonLink>
              <ButtonLink href={cta.demoTarget} variant="secondary" size="lg">
                {cta.secondary}
              </ButtonLink>
            </div>

            {/* compact trust: how an opportunity actually travels */}
            <ul className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-rule pt-6">
              {chain.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="font-mono text-mono-xs uppercase text-secondary">
                    {step}
                  </span>
                  {i < chain.length - 1 ? (
                    <span aria-hidden="true" className="text-steel">
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------------------------- the field */}
          <div className="lg:col-span-6">
            {/* Desktop: the full field, with room to read every signal. */}
            <SignalField className="hidden h-[34rem] w-full lg:block xl:h-[38rem]" />

            {/* Below that, the same language in a single readable column. */}
            <div className="lg:hidden">
              <div className="mb-3 flex items-center justify-between">
                <Eyebrow>Live signals</Eyebrow>
                <Eyebrow tone="secondary">Illustrative</Eyebrow>
              </div>
              <SignalStrip />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
