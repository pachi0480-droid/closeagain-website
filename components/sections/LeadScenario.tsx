'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { StateBadge } from '@/components/ui/Signal'
import { ModuleLabel, SectionMark } from '@/components/ui/Type'
import { leadScenarios, type ScenarioStep } from '@/data/lead-scenarios'
import { stateMeta } from '@/data/signals'
import { chapter, labels } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { track } from '@/lib/analytics'

/**
 * Chapter two — one opportunity, all the way through.
 *
 * The product is not explained in bullets. A believable inquiry arrives and
 * the page walks it forward one step at a time, ending on the only thing that
 * matters to an operator: a booking path with a time on it.
 *
 * The sequence plays itself when it comes into view and can be replayed. With
 * motion reduced, every step is simply present — the story is carried by the
 * timeline, the labels and the states, not by the animation.
 */

/**
 * Steps up to `shown` are present. Plays once per scenario, on entry.
 *
 * With motion reduced the run is not animated at all: `shown` is derived as
 * the full length during render rather than set from an effect, so the whole
 * story is simply there.
 */
function useRun(length: number) {
  const [played, setPlayed] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()

  const shown = reduced ? length : played

  // Start when the module first comes into view.
  useEffect(() => {
    const el = ref.current
    if (!el || started) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setStarted(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || reduced || played >= length) return
    const t = window.setTimeout(
      () => setPlayed((s) => s + 1),
      played === 0 ? 220 : 780,
    )
    return () => window.clearTimeout(t)
  }, [started, played, length, reduced])

  const replay = useCallback(() => setPlayed(0), [])

  return { ref, shown, replay, reset: replay, done: shown >= length }
}

export function LeadScenario() {
  const [active, setActive] = useState(0)
  const scenario = leadScenarios[active]
  const { ref, shown, replay, reset, done } = useRun(scenario.steps.length)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const choose = (index: number) => {
    setActive(index)
    reset()
    track('scenario_selected', { scenario: leadScenarios[index].id })
  }

  /** Arrow keys move between tabs, as the tablist pattern requires. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = leadScenarios.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    choose(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section
      id={chapter.demo}
      className="relative scroll-mt-24 border-t border-rule bg-graphite-deep py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark index="02" label="Watch a lead get closed" />
              <h2 className="mt-6 max-w-[16ch] text-h2 font-semibold uppercase text-warm-white">
                One inquiry. Every next action.
              </h2>
            </div>
            <div className="md:text-right">
              <p className="max-w-[40ch] text-lede text-muted">
                Watch CloseAgain take a new opportunity from first signal to a
                clear booking path.
              </p>
              <div className="mt-4">
                <ModuleLabel>{labels.scenario}</ModuleLabel>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------- tabs */}
        <Reveal delay={100} className="mt-12">
          <div
            role="tablist"
            aria-label="Opportunity type"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2"
          >
            {leadScenarios.map((s, i) => {
              const selected = i === active
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`scenario-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`scenario-panel-${s.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className={`h-11 rounded-[8px] border px-4 text-[0.9375rem] transition-colors duration-300 ${
                    selected
                      ? 'border-signal bg-signal/10 text-signal'
                      : 'border-steel text-muted hover:border-warm-white/35 hover:text-warm-white'
                  }`}
                >
                  {s.tab}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* ---------------------------------------------------- the run */}
        <div
          ref={ref}
          role="tabpanel"
          id={`scenario-panel-${scenario.id}`}
          aria-labelledby={`scenario-tab-${scenario.id}`}
          className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12"
        >
          {/* entry conditions */}
          <div className="lg:col-span-4">
            <div className="stage p-6">
              <p className="font-mono text-mono-xs uppercase text-secondary">
                How it entered
              </p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-warm-white">
                {scenario.entry}
              </p>
              <p className="mt-4 font-mono text-mono-xs uppercase text-muted">
                {scenario.source}
              </p>

              <div className="mt-6 border-t border-rule pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-mono-xs uppercase text-secondary">
                    Progress
                  </span>
                  <span className="tnum font-mono text-mono-xs text-muted">
                    {Math.min(shown, scenario.steps.length)}/
                    {scenario.steps.length}
                  </span>
                </div>
                <div className="mt-2.5 h-1 w-full overflow-hidden bg-steel">
                  <div
                    className="h-full bg-signal transition-[width] duration-700 [transition-timing-function:var(--ease-out-quiet)]"
                    style={{
                      width: `${(Math.min(shown, scenario.steps.length) / scenario.steps.length) * 100}%`,
                    }}
                  />
                </div>

                {done ? (
                  <button
                    type="button"
                    onClick={replay}
                    className="mt-5 inline-flex h-11 items-center font-mono text-mono-xs uppercase text-muted transition-colors hover:text-signal"
                  >
                    ↺ Replay this scenario
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* the timeline */}
          <div className="lg:col-span-8">
            <ol className="relative">
              {/* the spine every step hangs from */}
              <span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[5.5rem] w-px bg-steel sm:left-[6.5rem]"
              />
              {scenario.steps.map((step, i) => (
                <Step
                  key={`${scenario.id}-${i}`}
                  step={step}
                  present={i < shown}
                />
              ))}
            </ol>

            <Resolution
              resolution={scenario.resolution}
              present={shown >= scenario.steps.length}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function Step({ step, present }: { step: ScenarioStep; present: boolean }) {
  const meta = stateMeta[step.state]

  return (
    <li
      // A step that has not played yet is hidden rather than dimmed: dimmed
      // text is text nobody can read, and it fails contrast while still being
      // announced. It keeps its space, so nothing shifts as the run advances.
      data-step={present ? 'shown' : undefined}
      aria-hidden={present ? undefined : true}
      className="relative grid grid-cols-[5.5rem_1fr] gap-x-5 pb-5 transition-[opacity,transform,visibility] duration-700 [transition-timing-function:var(--ease-out-quiet)] sm:grid-cols-[6.5rem_1fr]"
    >
      <time className="tnum pt-0.5 pr-4 text-right font-mono text-mono-sm text-secondary">
        {step.time}
      </time>

      {/* the marker on the spine */}
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-[5.5rem] h-2 w-2 -translate-x-1/2 rounded-full border transition-colors duration-500 sm:left-[6.5rem]"
        style={{
          backgroundColor: present ? meta.colour : 'var(--color-graphite-deep)',
          borderColor: present ? meta.colour : 'var(--color-steel)',
        }}
      />

      <div className="pl-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[1.0625rem] tracking-[-0.015em] text-warm-white">
            {step.label}
          </h3>
          <StateBadge state={step.state} />
        </div>

        {step.quote ? (
          <p
            className={`mt-2.5 max-w-[52ch] border-l-2 py-1 pl-4 text-[0.9375rem] leading-relaxed ${
              step.actor === 'customer'
                ? 'border-steel text-muted italic'
                : 'border-signal/50 text-warm-white'
            }`}
          >
            {step.quote}
          </p>
        ) : null}

        {step.facts ? (
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {step.facts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`}>
                <dt className="font-mono text-mono-xs uppercase text-secondary">
                  {fact.label}
                </dt>
                <dd className="mt-0.5 text-[0.9375rem] text-warm-white">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </li>
  )
}

function Resolution({
  resolution,
  present,
}: {
  resolution: { headline: string; detail: string; when: string }
  present: boolean
}) {
  return (
    <div
      data-step={present ? 'shown' : undefined}
      aria-hidden={present ? undefined : true}
      className="stage-raised mt-2 ml-0 p-6 transition-[opacity,transform,visibility] duration-700 [transition-timing-function:var(--ease-out-quiet)] sm:ml-[6.5rem]"
      style={{ borderLeft: '2px solid var(--color-signal)' }}
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="dot text-signal"
          data-pulse={present ? 'true' : undefined}
        />
        <p className="font-mono text-mono-xs uppercase text-signal">
          {resolution.headline}
        </p>
      </div>
      <p className="mt-3 text-h3 text-warm-white">{resolution.detail}</p>
      <p className="tnum mt-1.5 font-mono text-[0.9375rem] text-muted">
        {resolution.when}
      </p>
    </div>
  )
}
