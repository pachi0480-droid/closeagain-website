'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, SelectInput, TextInput } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'
import { gaps, leadVolumes, trades } from '@/data/form'
import { chapter, cta, site } from '@/data/site'
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
  company: '',
  email: '',
  phone: '',
  trade: '',
  serviceArea: '',
  leadVolume: '',
  biggestGap: '',
  context: '',
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'sent' }
  | { kind: 'undelivered'; reason: 'not-configured' | 'network' | 'rejected' }

/**
 * The Revenue Gap Audit request.
 *
 * The form sits inside the Signal Room rather than on top of it: as the
 * operator fills it in, a small map beside it resolves from unknown to known.
 * That is the only ornament — everything else is a plain, fast, accessible
 * form, because a gimmick here costs real submissions.
 */
export function AuditForm() {
  const [values, setValues] = useState<EarlyAccessPayload>(empty)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const id = useId()

  /** The props any control needs: identity, value, and how to write it back. */
  const control = (key: keyof EarlyAccessPayload) => ({
    id: `${id}-${key}`,
    value: values[key],
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      trackOnce('early_access_started')
      setValues((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    },
  })

  /** The same, plus validity — only the styled inputs understand this. */
  const field = (key: keyof EarlyAccessPayload) => ({
    ...control(key),
    invalid: Boolean(errors[key]),
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus()
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
      id={chapter.audit}
      className="relative scroll-mt-24 border-t border-rule bg-graphite-deep py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-steel" />
            <Eyebrow>Revenue gap audit</Eyebrow>
          </div>
          <h2 className="mt-6 max-w-[18ch] text-h2 font-semibold uppercase text-warm-white">
            Find where revenue is getting stuck.
          </h2>
          <p className="mt-5 max-w-[60ch] text-lede text-muted">
            We will map how opportunities enter your business, how quickly they
            receive a response, where follow-up stops, and what may already be
            recoverable.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-x-12">
          {/* ------------------------------------------- the resolving map */}
          <div className="lg:col-span-4">
            <Reveal>
              {/* The map reflects the form; on a phone the form is right
                  there, so it is the first thing to go. */}
              <div className="hidden lg:block">
                <SignalMap values={values} />
              </div>
              <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-muted lg:mt-6">
                No obligation and no pressure. If the gap turns out to be small,
                we will say so.
              </p>
              <p className="mt-5 font-mono text-mono-xs uppercase text-secondary">
                Or write to{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-muted underline decoration-steel underline-offset-4 transition-colors hover:text-warm-white hover:decoration-signal"
                >
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          {/* --------------------------------------------------- the form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={100}>
              {status.kind === 'sent' ? (
                <Sent />
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="grid gap-6 sm:grid-cols-2"
                >
                  <Field id={`${id}-name`} label="Name" error={errors.name}>
                    <TextInput
                      {...field('name')}
                      type="text"
                      autoComplete="name"
                      placeholder="Dana Whitfield"
                    />
                  </Field>

                  <Field id={`${id}-company`} label="Company" error={errors.company}>
                    <TextInput
                      {...field('company')}
                      type="text"
                      autoComplete="organization"
                      placeholder="Whitfield Air"
                    />
                  </Field>

                  <Field id={`${id}-email`} label="Work email" error={errors.email}>
                    <TextInput
                      {...field('email')}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="dana@whitfieldair.com"
                    />
                  </Field>

                  <Field id={`${id}-phone`} label="Phone" optional>
                    <TextInput
                      {...field('phone')}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(352) 555-0148"
                    />
                  </Field>

                  <Field id={`${id}-trade`} label="Primary trade" error={errors.trade}>
                    <SelectInput {...field('trade')}>
                      <option value="">Select a trade</option>
                      {trades.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field
                    id={`${id}-serviceArea`}
                    label="Service area"
                    error={errors.serviceArea}
                  >
                    <TextInput
                      {...field('serviceArea')}
                      type="text"
                      placeholder="Ocala, FL + 40 miles"
                    />
                  </Field>

                  <Field id={`${id}-leadVolume`} label="Monthly leads" optional>
                    <SelectInput {...field('leadVolume')}>
                      <option value="">Select a range</option>
                      {leadVolumes.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field id={`${id}-biggestGap`} label="Biggest current gap" optional>
                    <SelectInput {...field('biggestGap')}>
                      <option value="">Select one</option>
                      {gaps.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field id={`${id}-context`} label="Anything else" optional>
                      <textarea
                        {...control('context')}
                        rows={3}
                        placeholder="Lead sources, who answers the phone, what you have already tried."
                        className="w-full rounded-[8px] border border-steel bg-warm-white/[0.035] px-3.5 py-3 text-[0.9375rem] text-warm-white transition-[border-color,background-color] duration-300 placeholder:text-secondary hover:bg-warm-white/[0.06] focus:bg-warm-white/[0.06] focus:border-warm-white/45 focus:outline-none"
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        type="submit"
                        size="lg"
                        withArrow
                        disabled={status.kind === 'submitting'}
                      >
                        {status.kind === 'submitting' ? 'Sending…' : cta.primary}
                      </Button>

                      {!isSubmissionConfigured ? (
                        <Eyebrow tone="secondary" className="max-w-[30ch] leading-[1.5]">
                          Preview build — delivery endpoint not connected yet
                        </Eyebrow>
                      ) : null}
                    </div>

                    {status.kind === 'undelivered' ? (
                      <Undelivered reason={status.reason} />
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

/**
 * Four facts, resolving from unknown to known as the form is completed. It
 * never blocks the form and never hides a field — it simply reflects it.
 */
function SignalMap({ values }: { values: EarlyAccessPayload }) {
  const lines = [
    { label: 'Source', value: values.trade },
    { label: 'Area', value: values.serviceArea },
    { label: 'Volume', value: values.leadVolume },
    { label: 'Gap', value: values.biggestGap },
  ]
  const known = lines.filter((l) => l.value.trim()).length

  return (
    <div className="stage p-5">
      <div className="flex items-center justify-between">
        <Eyebrow>Your signal map</Eyebrow>
        <span className="font-mono text-mono-xs text-secondary tnum">
          {known}/4
        </span>
      </div>

      <dl className="mt-5 space-y-3.5">
        {lines.map((line) => {
          const filled = Boolean(line.value.trim())
          return (
            <div
              key={line.label}
              className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-3.5 last:border-b-0 last:pb-0"
            >
              <dt className="font-mono text-mono-xs uppercase text-secondary">
                {line.label}
              </dt>
              <dd
                className={`text-right text-[0.9375rem] tracking-[-0.01em] ${
                  filled ? 'text-warm-white' : 'text-quiet'
                }`}
              >
                {filled ? line.value : '—'}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="mt-5 flex items-center gap-2 border-t border-rule pt-4">
        <span
          aria-hidden="true"
          className={known === 4 ? 'dot text-signal' : 'dot text-quiet'}
        />
        <span className="font-mono text-mono-xs uppercase text-muted">
          {known === 4 ? 'Ready for review' : 'Awaiting details'}
        </span>
      </div>
    </div>
  )
}

function Sent() {
  return (
    <div className="stage p-8">
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="dot text-booked" />
        <Eyebrow tone="signal">Request received</Eyebrow>
      </div>
      <h3 className="mt-5 text-h3 text-warm-white">
        Thank you — we have your details.
      </h3>
      <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
        We will come back to you with where opportunities are most likely
        getting stuck, and what the highest-value next actions look like for a
        business your size.
      </p>
    </div>
  )
}

/**
 * Honest failure. The form never shows a success state for a submission that
 * went nowhere — including in this preview build, where no endpoint exists.
 */
function Undelivered({
  reason,
}: {
  reason: 'not-configured' | 'network' | 'rejected'
}) {
  const message =
    reason === 'not-configured'
      ? 'This preview build has no delivery endpoint connected, so nothing was sent.'
      : reason === 'network'
        ? 'That did not reach us — the network request failed.'
        : 'That did not reach us — the request was rejected.'

  return (
    <div role="alert" className="mt-6 border-l-2 border-risk bg-risk/[0.07] p-4">
      <p className="font-mono text-mono-xs uppercase text-risk">Not sent</p>
      <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">
        {message} Please send the same details to{' '}
        <a
          href={`mailto:${site.email}`}
          className="text-warm-white underline decoration-steel underline-offset-4 hover:decoration-signal"
        >
          {site.email}
        </a>{' '}
        and we will pick it up from there.
      </p>
    </div>
  )
}
