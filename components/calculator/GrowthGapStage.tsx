'use client'

import { SliderField } from '@/components/ui/SliderField'
import { Eyebrow } from '@/components/ui/Type'
import { labels } from '@/data/site'
import { bounds, calculate, type CalculatorInputs } from '@/lib/calculator'
import { formatCurrency, formatNumber } from '@/lib/format'


/**
 * The growth-gap stage.
 *
 *   left    the assumptions, all six of them editable and typed
 *   centre  a live flow of the demand those assumptions describe
 *   right   the outcome, and the one comparison that matters
 *
 * The flow in the middle is driven by the same numbers as the panel on the
 * right, so the picture and the figure can never disagree.
 */
export function GrowthGapStage({
  inputs,
  set,
}: {
  inputs: CalculatorInputs
  set: (k: keyof CalculatorInputs) => (n: number) => void
}) {
  const result = calculate(inputs)

  return (
    <div>
      <div className="stage grid gap-px overflow-hidden lg:grid-cols-12">
        {/* ------------------------------------------- the assumptions */}
        <div className="bg-graphite p-6 lg:col-span-4 lg:p-8">
          <Eyebrow>Your assumptions</Eyebrow>
          <div className="mt-5">
            <Assumption
              label="Leads per month"
              hint="Calls, forms, chats and referrals that reach you."
              k="leadsPerMonth"
              inputs={inputs}
              set={set}
              format={formatNumber}
            />
            <Assumption
              label="Average booked job"
              hint="What a booked job is worth to you on average."
              k="jobValue"
              inputs={inputs}
              set={set}
              format={formatNumber}
              prefix="$"
              curve={2.2}
            />
            <Assumption
              label="Current booking rate"
              hint="Share of those leads that become booked work today."
              k="bookingRate"
              inputs={inputs}
              set={set}
              format={formatNumber}
              suffix="%"
            />
            <Assumption
              label="Getting consistent follow-up"
              hint="Share of leads someone reliably works more than once."
              k="followUpRate"
              inputs={inputs}
              set={set}
              format={formatNumber}
              suffix="%"
            />
            <Assumption
              label="Additional demand"
              hint="Extra leads per month you think you could generate."
              k="additionalLeads"
              inputs={inputs}
              set={set}
              format={formatNumber}
            />
            <Assumption
              label="Recovery rate"
              hint="Share of the follow-up gap you assume is winnable."
              k="recoveryRate"
              inputs={inputs}
              set={set}
              format={formatNumber}
              suffix="%"
            />
          </div>
        </div>

        {/*
          The flow. Hidden below lg: on a phone it restates what the outcome
          panel already says in words, and it is the one thing here that can
          go without costing the operator any information.
        */}
        <div className="hidden bg-graphite-deep p-6 lg:col-span-4 lg:block lg:p-8">
          <Eyebrow>Where the month goes</Eyebrow>
          <FlowDiagram
            leads={inputs.leadsPerMonth}
            booked={result.bookedJobs}
            gap={result.followUpGapJobs}
            recovered={result.conversionJobs}
            added={result.newDemandJobs}
          />
        </div>

        {/* --------------------------------------------- the outcome */}
        <div className="bg-graphite p-6 lg:col-span-4 lg:p-8">
          <Eyebrow>The gap, at your numbers</Eyebrow>

          <div className="mt-5">
            <p className="font-mono text-mono-xs uppercase text-secondary">
              Estimated follow-up gap
            </p>
            <p className="tnum mt-2 text-[clamp(2.25rem,4.4vw,3.25rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-risk">
              {formatCurrency(result.followUpGapValue)}
            </p>
            <p className="mt-2 text-[0.8125rem] text-secondary">
              per month, in unbooked demand nobody is consistently working
            </p>
          </div>

          <dl className="mt-7 space-y-3.5 border-t border-rule pt-6">
            <Line
              label="Opportunity in play"
              value={formatCurrency(result.opportunityValue)}
            />
            <Line
              label="Booked today"
              value={formatCurrency(result.bookedValue)}
              tone="booked"
            />
            <Line
              label="Not booked today"
              value={formatCurrency(result.unbookedValue)}
            />
          </dl>

          {/* the comparison the calculator exists to make */}
          <div className="mt-7 border-t border-rule pt-6">
            <p className="font-mono text-mono-xs uppercase text-secondary">
              Illustrative upside
            </p>

            <div className="mt-4 space-y-4">
              <Bar
                label="Working the demand you have"
                value={result.conversionUpside}
                max={Math.max(result.conversionUpside, result.newDemandUpside, 1)}
                winner={result.larger === 'conversion'}
                colour="var(--color-signal)"
              />
              <Bar
                label="Adding more demand"
                value={result.newDemandUpside}
                max={Math.max(result.conversionUpside, result.newDemandUpside, 1)}
                winner={result.larger === 'newDemand'}
                colour="var(--color-info)"
              />
            </div>

            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
              {result.larger === 'even' ? (
                <>
                  At these numbers the two motions are worth about the same.
                  CloseAgain runs both.
                </>
              ) : result.larger === 'conversion' ? (
                <>
                  At these numbers,{' '}
                  <span className="text-warm-white">
                    working the demand you already have
                  </span>{' '}
                  is worth{' '}
                  <span className="tnum text-signal">
                    {formatCurrency(
                      result.conversionUpside - result.newDemandUpside,
                    )}
                  </span>{' '}
                  more per month than buying more of it.
                </>
              ) : (
                <>
                  At these numbers,{' '}
                  <span className="text-warm-white">adding demand</span> is the
                  larger move — by{' '}
                  <span className="tnum text-info">
                    {formatCurrency(
                      result.newDemandUpside - result.conversionUpside,
                    )}
                  </span>{' '}
                  per month. CloseAgain runs both.
                </>
              )}
            </p>
            <dl className="mt-7 space-y-3.5 border-t border-rule pt-6">
              <Line
                label="Both motions together"
                value={formatCurrency(result.totalUpside)}
              />
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[0.9375rem] text-warm-white">
                  Booked, at these assumptions
                </dt>
                <dd className="tnum font-mono text-[1.0625rem] text-signal">
                  {formatCurrency(result.projectedValue)}
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-[0.8125rem] text-secondary">
              per month, against {formatCurrency(result.bookedValue)} today
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-[80ch] text-[0.8125rem] leading-relaxed text-secondary">
        {labels.estimate}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function Assumption({
  label,
  hint,
  k,
  inputs,
  set,
  format,
  prefix,
  suffix,
  curve,
}: {
  label: string
  hint: string
  k: keyof CalculatorInputs
  inputs: CalculatorInputs
  set: (k: keyof CalculatorInputs) => (n: number) => void
  format: (n: number) => string
  prefix?: string
  suffix?: string
  curve?: number
}) {
  return (
    <SliderField
      label={label}
      hint={hint}
      value={inputs[k]}
      min={bounds[k].min}
      max={bounds[k].max}
      step={bounds[k].step}
      prefix={prefix}
      suffix={suffix}
      curve={curve}
      format={format}
      onChange={set(k)}
    />
  )
}

function Line({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'booked'
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[0.9375rem] text-muted">{label}</dt>
      <dd
        className={`tnum font-mono text-[0.9375rem] ${
          tone === 'booked' ? 'text-booked' : 'text-warm-white'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

/** A comparison bar. The winning motion is named, not just coloured. */
function Bar({
  label,
  value,
  max,
  winner,
  colour,
}: {
  label: string
  value: number
  max: number
  winner: boolean
  colour: string
}) {
  const pct = Math.max(2, (value / max) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.8125rem] text-muted">
          {label}
          {winner ? (
            <span className="ml-2 font-mono text-mono-xs uppercase text-signal">
              Larger
            </span>
          ) : null}
        </span>
        <span className="tnum shrink-0 font-mono text-[0.9375rem] text-warm-white">
          {formatCurrency(value)}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden bg-steel/60">
        <div
          className="h-full transition-[width] duration-500 [transition-timing-function:var(--ease-out-quiet)]"
          style={{ width: `${pct}%`, backgroundColor: colour }}
        />
      </div>
    </div>
  )
}

/**
 * The month as a flow. Every bar is a real count from the model, and the
 * numbers beside them say what each band is — the picture is never the only
 * thing carrying the meaning.
 */
function FlowDiagram({
  leads,
  booked,
  gap,
  recovered,
  added,
}: {
  leads: number
  booked: number
  gap: number
  recovered: number
  added: number
}) {
  const bands = [
    {
      label: 'Leads in',
      count: leads,
      colour: 'var(--color-new)',
      note: 'everything that reaches you',
    },
    {
      label: 'Booked today',
      count: booked,
      colour: 'var(--color-booked)',
      note: 'converting now',
    },
    {
      label: 'Follow-up gap',
      count: gap,
      colour: 'var(--color-risk)',
      note: 'unbooked, not worked',
    },
    {
      label: 'Recoverable',
      count: recovered,
      colour: 'var(--color-signal)',
      note: 'at your recovery rate',
    },
    {
      label: 'Added demand',
      count: added,
      colour: 'var(--color-info)',
      note: 'booked from new leads',
    },
  ]

  const max = Math.max(...bands.map((b) => b.count), 1)

  return (
    <ul className="mt-6 space-y-7">
      {bands.map((band) => (
        <li key={band.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-mono-xs uppercase text-muted">
              {band.label}
            </span>
            <span className="tnum font-mono text-[1.0625rem] text-warm-white">
              {formatNumber(band.count)}
            </span>
          </div>

          {/* the band itself */}
          <div
            className="mt-2.5 h-10 transition-[width] duration-500 [transition-timing-function:var(--ease-out-quiet)]"
            style={{
              width: `${Math.max(3, (band.count / max) * 100)}%`,
              background: `linear-gradient(to right, ${band.colour}, color-mix(in oklab, ${band.colour} 35%, transparent))`,
            }}
          />
          <p className="mt-1.5 text-[0.8125rem] text-secondary">{band.note}</p>
        </li>
      ))}
    </ul>
  )
}
