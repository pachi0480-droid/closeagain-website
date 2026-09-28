'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useReducer, useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Arrow } from '@/components/ui/links'
import { checkoutSteps, formMessages, inquiryDetails, planNote, type FieldDefinition } from '@/content/forms'
import { planById, planSummary } from '@/content/pricing'
import { inquiryEmailLink } from '@/lib/forms/email'
import { endpointFor, fallbackIds, honeypotField } from '@/lib/forms/protocol'
import { normalizeValue, validateField, validateSubmission, type FormKind } from '@/lib/forms/schema'
import { formReducer, initialFormState } from '@/lib/forms/state'
import { sendSubmission } from '@/lib/forms/transport'
import { PlanPicker } from './PlanPicker'
import { choosePlan, resetPlan, useChosenPlan } from './selectedPlan'

const subscribeNoop = () => () => {}

const inDetails = (field: FieldDefinition) => field.group === 'details'

/**
 * The inquiry form.
 *
 * Four answers are asked for up front; everything else waits inside a native
 * “Add details (optional)” disclosure, which works without JavaScript and
 * opens by itself when one of its fields needs attention or was pre-filled.
 *
 * With JavaScript: validates as the visitor goes, submits in the background,
 * and only moves on to the confirmation page after the server confirms the
 * details were delivered. Entered text is never cleared by a failure. A plan
 * or industry chosen elsewhere on the site (?plan=growth, ?industry=…) is
 * pre-selected, and a chosen plan is confirmed in words.
 *
 * Without JavaScript: the same endpoint accepts a normal form post, the
 * browser's own validation applies, and the server redirects to the
 * confirmation page or back here with an explanation.
 */
export function LeadForm({
  kind,
  fields,
  submitLabel,
  guidance,
  initialPlan,
  initialIndustry,
  emailTo,
}: {
  kind: FormKind
  fields: readonly FieldDefinition[]
  submitLabel: string
  guidance: string
  initialPlan?: string
  initialIndustry?: string
  /**
   * Set while no delivery destination is connected: a valid form opens the
   * visitor's email app with the details filled in, addressed here.
   */
  emailTo?: string
}) {
  const router = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)
  const planField = fields.find((field) => field.name === 'plan' && field.kind === 'choice')
  // The plan comes from the link that brought the visitor here (?plan=growth)
  // until they pick one; the order summary beside the form follows it.
  const plan = useChosenPlan(initialPlan ?? planField?.defaultValue ?? '')
  useLayoutEffect(() => resetPlan(), [])
  const [emailOpened, setEmailOpened] = useState(false)
  const inFlight = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  // Server markup keeps native validation for no-JS visitors; once hydrated,
  // the form's own messages take over.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const submitting = state.status === 'submitting' || state.status === 'success'
  const id = (name: string) => `${kind}-${name}`
  const mainFields = fields.filter((field) => !inDetails(field))
  const detailFields = fields.filter(inDetails)

  // Pre-select what the visitor already chose elsewhere on the site, and
  // reveal the optional details if one of them was filled in that way.
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const params = new URLSearchParams(window.location.search)
    let reveal = false
    for (const field of fields) {
      const wanted = params.get(field.name)
      if (!wanted || field.kind !== 'choice') continue
      if (!field.options?.some((option) => option.value === wanted)) continue
      const control = form.elements.namedItem(field.name)
      if (control instanceof HTMLSelectElement) {
        control.value = wanted
        if (inDetails(field)) reveal = true
      }
    }
    if (reveal && detailsRef.current) detailsRef.current.open = true
  }, [fields])

  // Called once the errors are on screen (see flushSync below), so the whole
  // field — label, control and message — can be brought into view.
  const focusFirstInvalid = (errors: Record<string, string>) => {
    const invalid = fields.filter((field) => errors[field.name])
    if (invalid.length === 0) return
    // A closed disclosure hides its fields, so open it before focusing one.
    if (invalid.some(inDetails) && detailsRef.current) detailsRef.current.open = true
    const control = formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0].name}"]`)
    if (!control) return
    control.focus({ preventScroll: true })
    // Scroll margins on .field keep it clear of the sticky header.
    const field = control.closest<HTMLElement>('.field') ?? control
    field.scrollIntoView({ block: 'nearest' })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current || submitting) return

    const data = new FormData(event.currentTarget)
    const raw: Record<string, string> = {}
    for (const field of fields) raw[field.name] = String(data.get(field.name) ?? '')

    const checked = validateSubmission(kind, raw)
    if (!checked.ok) {
      flushSync(() => dispatch({ type: 'client-invalid', errors: checked.errors }))
      focusFirstInvalid(checked.errors)
      return
    }

    if (emailTo) {
      // Hand the details to the visitor's own email app. Nothing is sent by
      // the site, and nothing is claimed: they review the draft and send it.
      window.location.href = inquiryEmailLink(emailTo, fields, checked.values)
      flushSync(() => dispatch({ type: 'reset' }))
      setEmailOpened(true)
      statusRef.current?.focus()
      return
    }

    inFlight.current = true
    dispatch({ type: 'submit' })
    const outcome = await sendSubmission(kind, checked.values, {
      honeypot: String(data.get(honeypotField) ?? ''),
    })
    inFlight.current = false
    flushSync(() => dispatch({ type: 'outcome', outcome }))

    if (outcome.status === 'ok') {
      router.push('/thank-you')
    } else if (outcome.status === 'invalid') {
      focusFirstInvalid(outcome.errors)
    } else {
      statusRef.current?.focus()
    }
  }

  // Once a field has been flagged, re-check it as the visitor corrects it.
  const recheck = (field: FieldDefinition, value: string) => {
    if (field === planField) choosePlan(value)
    if (!(field.name in state.errors)) return
    dispatch({ type: 'field-checked', name: field.name, error: validateField(field, normalizeValue(field, value)) })
  }

  const tone =
    state.status === 'success' || state.status === 'submitting'
      ? 'progress'
      : state.status === 'idle'
        ? 'idle'
        : 'problem'

  const chosen = planById(plan)

  const renderField = (field: FieldDefinition) => {
    const error = state.errors[field.name]
    const hintId = field.hint ? `${id(field.name)}-hint` : undefined
    const errorId = error ? `${id(field.name)}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
    const initialChoice = field.name === 'plan' ? initialPlan : field.name === 'industry' ? initialIndustry : undefined
    const common = {
      id: id(field.name),
      name: field.name,
      required: field.required,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
      className: 'field__control',
      onBlur: (e: { currentTarget: { value: string } }) => recheck(field, e.currentTarget.value),
      onChange: (e: { currentTarget: { value: string } }) => recheck(field, e.currentTarget.value),
    } as const

    return (
      <div
        key={field.name}
        className={['field', field.half && 'field--half', error && 'field--invalid'].filter(Boolean).join(' ')}
      >
        <label className="field__label" htmlFor={id(field.name)}>
          {field.label}
          {field.hint && (
            <span id={hintId} className="field__hint">
              {' '}
              {field.hint}
            </span>
          )}
        </label>

        {field.kind === 'multiline' ? (
          <textarea {...common} rows={4} maxLength={field.max} />
        ) : field.kind === 'choice' ? (
          <div className="field__select">
            <select {...common} defaultValue={initialChoice ?? field.defaultValue ?? ''}>
              {field.placeholderOption !== undefined && <option value="">{field.placeholderOption}</option>}
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <input
            {...common}
            type={field.kind === 'email' ? 'email' : field.kind === 'tel' ? 'tel' : 'text'}
            inputMode={field.kind === 'email' ? 'email' : field.kind === 'tel' ? 'tel' : undefined}
            autoComplete={field.autoComplete}
            autoCapitalize={field.kind === 'email' ? 'none' : undefined}
            spellCheck={field.kind === 'email' ? false : undefined}
            maxLength={field.max}
          />
        )}

        {error && (
          <p id={errorId} className="field__error">
            <span className="field__error-mark" aria-hidden="true">
              !
            </span>
            {error}
          </p>
        )}

      </div>
    )
  }

  return (
    <form
      ref={formRef}
      className="form"
      action={endpointFor(kind)}
      method="post"
      noValidate={hydrated}
      onSubmit={onSubmit}
      aria-busy={submitting}
      aria-describedby={`${kind}-guidance`}
    >
      {/* Explanations for the no-JavaScript path, shown only when the server
          redirects back here with one of these anchors. */}
      <div className="form__fallbacks">
        <p id={fallbackIds.invalid} className="form-note form-note--problem">
          {formMessages.returned.invalid}
        </p>
        <p id={fallbackIds.unavailable} className="form-note form-note--problem">
          {emailTo ? formMessages.email.returned(emailTo) : formMessages.unavailable}
        </p>
        <p id={fallbackIds.failed} className="form-note form-note--problem">
          {formMessages.returned.failed}
        </p>
        <p id={fallbackIds.busy} className="form-note form-note--problem">
          {formMessages.busy}
        </p>
      </div>

      {planField && (
        <section className="step" aria-labelledby={`${kind}-step-plan`}>
          <h2 id={`${kind}-step-plan`} className="step__title">
            <span className="step__num" aria-hidden="true">
              1
            </span>
            {checkoutSteps.plan.title}
          </h2>
          <PlanPicker
            name={planField.name}
            value={plan}
            onChange={(value) => recheck(planField, value)}
            note={
              chosen ? (
                <>
                  {planNote.lead} <strong>{planSummary(chosen)}</strong>. {planNote.follow}
                </>
              ) : plan === planField.defaultValue ? null : (
                checkoutSteps.plan.note
              )
            }
            error={state.errors[planField.name]}
            errorId={state.errors[planField.name] ? `${id(planField.name)}-error` : undefined}
          />
        </section>
      )}

      <section className="step" aria-labelledby={`${kind}-step-details`}>
        <h2 id={`${kind}-step-details`} className="step__title">
          <span className="step__num" aria-hidden="true">
            {planField ? 2 : 1}
          </span>
          {checkoutSteps.details.title}
        </h2>
        <div className="form__grid">{mainFields.filter((field) => field !== planField).map(renderField)}</div>

        {detailFields.length > 0 && (
          <details ref={detailsRef} className="form__details" open={initialIndustry ? true : undefined}>
            <summary className="form__summary">
              <span>{inquiryDetails.summary}</span>
              <span className="form__summary-icon" aria-hidden="true" />
            </summary>
            <div className="form__grid form__grid--details">{detailFields.map(renderField)}</div>
          </details>
        )}
      </section>

      {/* Honeypot: invisible to people, tempting to form-filling bots. */}
      <div className="form__trap" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={honeypotField} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <section className="step step--send" aria-labelledby={`${kind}-step-send`}>
        <h2 id={`${kind}-step-send`} className="step__title">
          <span className="step__num" aria-hidden="true">
            {planField ? 3 : 2}
          </span>
          {checkoutSteps.send.title}
        </h2>
        <div className="form__submit">
          <button type="submit" className="btn btn--lg form__button" aria-disabled={submitting || undefined}>
            <span className="form__button-labels">
              <span className={submitting ? 'is-hidden' : undefined}>{submitLabel}</span>
              <span className={submitting ? undefined : 'is-hidden'} aria-hidden={!submitting}>
                {formMessages.submitting}
              </span>
            </span>
            <Arrow />
          </button>
          <p id={`${kind}-guidance`} className="form__guidance">
            {guidance}
          </p>
        </div>
      </section>

      <div
        ref={statusRef}
        className={`form-status form-status--${tone}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {emailOpened && state.status === 'idle' && emailTo && (
          <p className="form-status__message">{formMessages.email.opened(emailTo)}</p>
        )}
        {state.message && state.status !== 'idle' && (
          <p className="form-status__message">
            {tone === 'problem' && (
              <span className="form-status__mark" aria-hidden="true">
                !
              </span>
            )}
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}
