'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, SelectInput, TextInput } from '@/components/ui/Field'
import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { Reveal } from '@/components/ui/Reveal'
import { leadVolumes, leakSources, teamSizes, trades } from '@/data/form'
import { heroWaypoints } from '@/data/scenarios'
import { useInViewOnce } from '@/lib/hooks'
import { site } from '@/data/site'
import { track, trackOnce } from '@/lib/analytics'
import {
  type EarlyAccessPayload,
  type FieldErrors,
  isSubmissionConfigured,
  submitEarlyAccess,
  validate,
} from '@/lib/early-access'

const empty: EarlyAccessPayload = {
  name: '',
  email: '',
  company: '',
  phone: '',
  trade: '',
  teamSize: '',
  leadVolume: '',
  biggestLeak: '',
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'sent' }
  | { kind: 'undelivered'; reason: 'not-configured' | 'network' | 'rejected' }

export function EarlyAccess() {
  const [values, setValues] = useState<EarlyAccessPayload>(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const id = useId()

  const field = (key: keyof EarlyAccessPayload) => ({
    id: `${id}-${key}`,
    value: values[key],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      trackOnce('early_access_started')
      setValues((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    },
    invalid: Boolean(errors[key]),
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      const first = document.getElementById(`${id}-${Object.keys(found)[0]}`)
      first?.focus()
      return
    }

    setStatus({ kind: 'submitting' })
    const result = await submitEarlyAccess(values)

    if (result.ok) {
      track('early_access_submitted', { trade: values.trade })
      setStatus({ kind: 'sent' })
      return
    }

    track('early_access_failed', { reason: result.reason })
    setStatus({ kind: 'undelivered', reason: result.reason })
  }

  return (
    <section
      id="early-access"
      data-tone="ink"
      className="grain-ink on-ink relative bg-ink pt-24 pb-24 text-chalk md:pt-32 md:pb-28"
    >
      <div className="shell">
        {/* --- the close: the hero's line, finally continuous ------- */}
        <Reveal>
          <ClosingRail />
        </Reveal>

        <Reveal delay={160}>
          <h2 className="mt-14 max-w-[24ch] text-h2 text-chalk md:mt-16">
            You already paid to create the opportunity.
          </h2>
          <p className="mt-5 max-w-[26ch] text-h2 text-recover-bright">
            Close it before it disappears.
          </p>
        </Reveal>

        {/* --- the form ------------------------------------------------ */}
        <div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-x-12 md:mt-20">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="text-h3 text-chalk">Request early access</h3>
              <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-chalk-2">
                CloseAgain is pre-launch and taking a small number of pilot
                operators. Tell us how work comes into your business and where it
                tends to stop.
              </p>
              <p className="mt-6 font-mono text-mono-xs text-chalk-3 uppercase">
                Or write to{' '}
                <a href={`mailto:${site.email}`} className="link-rule text-chalk-2">
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <Reveal delay={120}>
              {status.kind === 'sent' ? (
                <Sent />
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
                  <Field id={`${id}-name`} label="Name" error={errors.name}>
                    <TextInput
                      {...field('name')}
                      type="text"
                      autoComplete="name"
                      placeholder="Dana Whitfield"
                    />
                  </Field>

                  <Field id={`${id}-email`} label="Work email" error={errors.email}>
                    <TextInput
                      {...field('email')}
                      type="email"
                      autoComplete="email"
                      placeholder="dana@company.com"
                    />
                  </Field>

                  <Field id={`${id}-company`} label="Company" error={errors.company}>
                    <TextInput
                      {...field('company')}
                      type="text"
                      autoComplete="organization"
                      placeholder="Whitfield Heating & Air"
                    />
                  </Field>

                  <Field id={`${id}-phone`} label="Phone" optional>
                    <TextInput
                      {...field('phone')}
                      type="tel"
                      autoComplete="tel"
                      placeholder="(352) 555-0148"
                    />
                  </Field>

                  <Field id={`${id}-trade`} label="Primary trade" error={errors.trade}>
                    <SelectInput {...field('trade')}>
                      <option value="">Select</option>
                      {trades.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field id={`${id}-teamSize`} label="Team size" optional>
                    <SelectInput {...field('teamSize')}>
                      <option value="">Select</option>
                      {teamSizes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field id={`${id}-leadVolume`} label="Monthly lead volume" optional>
                    <SelectInput {...field('leadVolume')}>
                      <option value="">Select</option>
                      {leadVolumes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field
                    id={`${id}-biggestLeak`}
                    label="Where you lose the most"
                    optional
                  >
                    <SelectInput {...field('biggestLeak')}>
                      <option value="">Select</option>
                      {leakSources.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      tone="ink"
                      size="lg"
                      withArrow
                      disabled={status.kind === 'submitting'}
                      className="w-full sm:w-auto"
                    >
                      {status.kind === 'submitting'
                        ? 'Sending…'
                        : 'Request early access'}
                    </Button>

                    {status.kind === 'undelivered' ? (
                      <Undelivered reason={status.reason} />
                    ) : null}

                    {!isSubmissionConfigured && status.kind === 'idle' ? (
                      <p className="mt-4 font-mono text-mono-xs text-chalk-3 uppercase">
                        Form delivery is not connected in this environment
                      </p>
                    ) : null}
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Sent() {
  return (
    <div
      role="status"
      className="rounded-[12px] border border-recover-bright/30 bg-recover-deep/25 px-6 py-8"
    >
      <p className="font-mono text-mono-xs text-recover-bright uppercase">
        Received
      </p>
      <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-chalk">
        Thank you. We will be in touch about the pilot, and we will ask about the
        way work actually moves through your business before we ask anything
        else.
      </p>
    </div>
  )
}

/**
 * Honest failure. Nothing here pretends a submission succeeded — when there is
 * no destination configured the form says so and offers a route that works.
 */
function Undelivered({
  reason,
}: {
  reason: 'not-configured' | 'network' | 'rejected'
}) {
  const message =
    reason === 'not-configured'
      ? 'This form has no delivery destination configured yet, so nothing was sent.'
      : reason === 'network'
        ? 'That did not reach us — the network request failed.'
        : 'That was rejected on our side and did not go through.'

  return (
    <div
      role="alert"
      className="mt-6 rounded-[12px] border border-engaged-ink/35 bg-engaged-ink/[0.08] px-5 py-5"
    >
      <p className="font-mono text-mono-xs text-engaged-ink uppercase">
        Not submitted
      </p>
      <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-chalk-2">
        {message} Send the same details to{' '}
        <a href={`mailto:${site.email}`} className="link-rule text-chalk">
          {site.email}
        </a>{' '}
        and you will be in the pilot queue.
      </p>
    </div>
  )
}

/**
 * The finale.
 *
 * The same four waypoints the hero opened on — Inbound, Missed, Engaged,
 * Booked — with the break between Missed and Engaged bridged for the last
 * time. The story the site opened with, closed.
 */
function ClosingRail() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.6 })

  return (
    <div ref={ref} aria-hidden="true">
      <div className="relative h-px">
        <div className="rail-sheen-ink absolute inset-0" />
        <div
          className="absolute inset-y-0 left-0 origin-left transition-transform duration-[1600ms] [transition-timing-function:var(--ease-out-quiet)]"
          style={{
            width: '100%',
            transform: `scaleX(${inView ? 1 : 0})`,
            backgroundImage:
              'linear-gradient(to right, var(--color-dormant-ink), var(--color-engaged-ink) 45%, var(--color-recover-bright))',
          }}
        />
        {heroWaypoints.map((point, i) => (
          <span
            key={point.label}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.at}%` }}
          >
            {i === heroWaypoints.length - 1 ? <RecoveryPulse fire={inView} /> : null}
            <span
              className={`relative block h-[7px] w-[7px] rounded-full ring-4 ring-ink transition-colors duration-[1200ms] ${
                inView
                  ? i === 3
                    ? 'bg-recover-bright'
                    : i === 2
                      ? 'bg-engaged-ink'
                      : i === 1
                        ? 'bg-dormant-ink'
                        : 'bg-chalk-3'
                  : 'bg-chalk/15'
              }`}
              style={{ transitionDelay: `${i * 260}ms` }}
            />
          </span>
        ))}
      </div>

      <div className="relative mt-5 h-4">
        {heroWaypoints.map((point, i) => (
          <span
            key={point.label}
            className="absolute font-mono text-mono-xs whitespace-nowrap text-chalk-3 uppercase transition-opacity duration-[1200ms]"
            style={{
              left: `${point.at}%`,
              transform:
                i === heroWaypoints.length - 1
                  ? 'translateX(-100%)'
                  : i === 0
                    ? 'none'
                    : 'translateX(-50%)',
              opacity: inView ? 1 : 0.25,
              transitionDelay: `${i * 260}ms`,
              color: i === 3 && inView ? 'var(--color-recover-bright)' : undefined,
            }}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}
