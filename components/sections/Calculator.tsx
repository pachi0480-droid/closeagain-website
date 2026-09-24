'use client'

import { useMemo } from 'react'
import { Assumptions } from '@/components/calculator/Assumptions'
import { useCalculatorState } from '@/components/calculator/useCalculatorState'
import { NumberRollDisplay } from '@/components/recovery/CalculatorResult'
import { RecoveryGrid } from '@/components/recovery/RecoveryGrid'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { cta } from '@/data/site'
import { trackOnce } from '@/lib/analytics'
import { calculate } from '@/lib/calculator'
import { formatCurrency, formatNumber } from '@/lib/format'

export function Calculator() {
  const { inputs, set, touched } = useCalculatorState()
  const result = useMemo(() => calculate(inputs), [inputs])

  return (
    <section
      id="calculator"
      data-tone="ink"
      className="grain-ink on-ink relative bg-ink py-24 text-chalk md:py-32"
    >
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionMark index="07" label="Your numbers" tone="ink" />
              <h2 className="mt-7 max-w-[20ch] text-h2 text-chalk">
                What could follow-up leakage be costing you?
              </h2>
            </Reveal>
          </div>
          <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
            <Reveal delay={140}>
              <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-chalk-2">
                No industry benchmark, no borrowed average. Put in what you know
                about your own operation and the arithmetic is right there under
                the answer.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 md:mt-20 lg:grid-cols-12">
          {/* --- assumptions -------------------------------------------- */}
          <div className="lg:col-span-5">
            <Reveal>
              <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
                Your assumptions
              </h3>
              <div className="mt-6">
                <Assumptions inputs={inputs} set={set} />
              </div>
            </Reveal>
          </div>

          {/* --- the answer --------------------------------------------- */}
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

              {/* the arithmetic, in the open */}
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
                  About {formatNumber(result.leakedPerMonth)} opportunities go cold
                  each month, and about {formatNumber(result.recoveredPerMonth)}{' '}
                  come back under these assumptions.
                </p>
              </div>

              {/* the same numbers, felt */}
              <div className="mt-10 border-t border-rule-ink pt-8">
                <RecoveryGrid
                  leakageRate={inputs.leakageRate}
                  recoveryRate={inputs.recoveryRate}
                />
                <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5">
                  <Key colour="chalk" label="Books anyway" />
                  <Key colour="dormant" label="Still leaking" />
                  <Key colour="recover" label="Recovered" />
                </ul>
                <p className="mt-6 font-mono text-mono-xs text-chalk-3 uppercase">
                  Illustrative estimate based on your inputs. Actual results vary.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={cta.target} tone="ink" size="lg" withArrow>
                  {cta.primary}
                </ButtonLink>
                <ButtonLink
                  href="/calculator"
                  tone="ink"
                  variant="secondary"
                  size="lg"
                >
                  Open the full calculator
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Key({
  colour,
  label,
}: {
  colour: 'chalk' | 'dormant' | 'recover'
  label: string
}) {
  const background =
    colour === 'recover'
      ? 'var(--color-recover-bright)'
      : colour === 'dormant'
        ? 'var(--color-dormant-ink)'
        : 'color-mix(in oklab, var(--color-chalk) 34%, transparent)'

  return (
    <li className="flex items-center gap-2">
      <span
        className="block h-[6px] w-[6px] rounded-full"
        style={
          colour === 'dormant'
            ? { boxShadow: 'inset 0 0 0 1px var(--color-dormant-ink)' }
            : { backgroundColor: background }
        }
      />
      <span className="font-mono text-mono-xs text-chalk-3 uppercase">{label}</span>
    </li>
  )
}
