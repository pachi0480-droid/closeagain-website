'use client'

import { useMemo } from 'react'
import { AgainstPlans } from '@/components/calculator/AgainstPlans'
import { Assumptions } from '@/components/calculator/Assumptions'
import { Sensitivity } from '@/components/calculator/Sensitivity'
import { ShareLink } from '@/components/calculator/ShareLink'
import { useCalculatorState } from '@/components/calculator/useCalculatorState'
import { NumberRollDisplay } from '@/components/recovery/CalculatorResult'
import { RecoveryGrid } from '@/components/recovery/RecoveryGrid'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { cta } from '@/data/site'
import { trackOnce } from '@/lib/analytics'
import { calculate } from '@/lib/calculator'
import { formatCurrency, formatNumber } from '@/lib/format'

/**
 * The standalone calculator.
 *
 * Deliberately more honest than a lead-capture widget: the equation, the
 * sensitivity to the one assumption nobody can know in advance, the plan cost
 * set against the result, and a plain list of what the model ignores.
 */
export function CalculatorWorkbench() {
  const { inputs, set, reset, touched } = useCalculatorState({ syncUrl: true })
  const result = useMemo(() => calculate(inputs), [inputs])

  return (
    <>
      {/* --- the instrument ------------------------------------------- */}
      <section
        data-tone="ink"
        className="grain-ink on-ink relative bg-ink py-20 text-chalk md:py-24"
      >
        <div className="shell">
          <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-mono text-mono-xs text-chalk-3 uppercase">
                    Your assumptions
                  </h2>
                  {touched ? (
                    <Button
                      type="button"
                      tone="ink"
                      variant="quiet"
                      onClick={reset}
                      className="h-auto px-0 text-[0.8125rem]"
                    >
                      Reset
                    </Button>
                  ) : null}
                </div>
                <div className="mt-6">
                  <Assumptions inputs={inputs} set={set} />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={100}>
                <NumberRollDisplay
                  monthly={result.monthlyValue}
                  annual={result.annualValue}
                  onSettled={
                    touched
                      ? () =>
                          trackOnce('calculator_completed', {
                            monthly: Math.round(result.monthlyValue),
                          })
                      : undefined
                  }
                />

                <div className="mt-10 border-t border-rule-ink pt-6">
                  <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
                    How that is calculated
                  </h3>
                  <p className="mt-4 font-mono text-mono-sm text-chalk-2">
                    opportunities × goes cold × recovery rate × average job
                  </p>
                  <p className="tnum mt-2 font-mono text-mono-sm text-chalk">
                    {formatNumber(inputs.opportunities)} × {inputs.leakageRate}% ×{' '}
                    {inputs.recoveryRate}% × {formatCurrency(inputs.jobValue)}
                  </p>
                  <p className="tnum mt-4 text-[0.9375rem] text-chalk-2">
                    About {formatNumber(result.leakedPerMonth)} opportunities go
                    cold each month, and about{' '}
                    {formatNumber(result.recoveredPerMonth)} come back under
                    these assumptions.
                  </p>
                </div>

                <div className="mt-10 border-t border-rule-ink pt-8">
                  <RecoveryGrid
                    leakageRate={inputs.leakageRate}
                    recoveryRate={inputs.recoveryRate}
                  />
                  <p className="mt-6 font-mono text-mono-xs text-chalk-3 uppercase">
                    Illustrative estimate based on your inputs. Actual results vary.
                  </p>
                </div>

                <div className="mt-10">
                  <ShareLink />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- the range, because one number is a guess ----------------- */}
      <section className="grain relative bg-paper py-24 md:py-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionMark index="01" label="Sensitivity" />
                <h2 className="mt-7 max-w-[16ch] text-h2 text-graphite">
                  Nobody knows their recovery rate in advance.
                </h2>
                <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                  So here is the same arithmetic across the range, with
                  everything else you entered held still. The useful question is
                  not which row is right — it is whether the low row is still
                  worth doing something about.
                </p>
              </Reveal>
            </div>
            <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <Reveal delay={100}>
                <Sensitivity inputs={inputs} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- cost against the estimate -------------------------------- */}
      <section className="grain relative bg-bone py-24 md:py-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionMark index="02" label="Against the plans" />
                <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                  What the plans cost against that number.
                </h2>
                <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                  This is division, not a promise. It only tells you how the
                  monthly price compares to the estimate you just built, and how
                  many recovered jobs would cover it at your average ticket.
                </p>
              </Reveal>
            </div>
            <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <Reveal delay={100}>
                <AgainstPlans result={result} />
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href={cta.target} withArrow>
                    {cta.primary}
                  </ButtonLink>
                  <ButtonLink href="/pricing" variant="secondary">
                    See what each plan covers
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- what the model ignores ----------------------------------- */}
      <section className="grain relative bg-paper pb-24 md:pb-28">
        <div className="shell">
          <Reveal>
            <div className="border-t border-graphite/20 pt-10">
              <h2 className="font-mono text-mono-xs text-graphite-3 uppercase">
                What this does not account for
              </h2>
              <ul className="mt-6 grid gap-x-12 gap-y-4 sm:grid-cols-2">
                {[
                  'Whether you have the capacity to run the extra work this would book.',
                  'That a recovered lead may close at a different rate than a fresh one.',
                  'Variation in ticket size between the jobs that leak and the jobs that do not.',
                  'Seasonality — leakage and recovery both move with demand.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-4 shrink-0 bg-dormant"
                    />
                    <span className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                A calculator that hid these would give you a bigger number and a
                worse decision. Treat the output as the size of the question,
                not the size of the cheque.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
