'use client'

import { useRouter } from 'next/navigation'
import { useReducer, useRef, useSyncExternalStore, type FormEvent } from 'react'
import { Arrow } from '@/components/ui/links'
import type { FieldDefinition } from '@/content/forms'
import { formMessages } from '@/content/forms'
import { endpointFor, honeypotField } from '@/lib/forms/protocol'
import { normalizeValue, validateField, validateSubmission, type FormKind } from '@/lib/forms/schema'
import { formReducer, initialFormState } from '@/lib/forms/state'
import { sendSubmission } from '@/lib/forms/transport'

const subscribeNoop = () => () => {}

/**
 * The demo request and contact forms.
 *
 * With JavaScript: validates as the visitor goes, submits in the background,
 * and only moves on to the confirmation page after the server confirms that
 * the request was delivered. Entered text is never cleared by a failure.
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
}: {
  kind: FormKind
  fields: readonly FieldDefinition[]
  submitLabel: string
  guidance: string
}) {
  const router = useRouter()
  const [state, dispatch] = useReducer(formReducer, initialFormState)
  const inFlight = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  // Server markup keeps native validation for no-JS visitors; once hydrated,
  // the form's own messages take over.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const submitting = state.status === 'submitting' || state.status === 'success'
  const id = (name: string) => `${kind}-${name}`

  const focusFirstInvalid = (errors: Record<string, string>) => {
    const first = fields.find((field) => errors[field.name])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus()
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current || submitting) return

    const data = new FormData(event.currentTarget)
    const raw: Record<string, string> = {}
    for (const field of fields) raw[field.name] = String(data.get(field.name) ?? '')

    const checked = validateSubmission(kind, raw)
    if (!checked.ok) {
      dispatch({ type: 'client-invalid', errors: checked.errors })
      focusFirstInvalid(checked.errors)
      return
    }

    inFlight.current = true
    dispatch({ type: 'submit' })
    const outcome = await sendSubmission(kind, checked.values, {
      honeypot: String(data.get(honeypotField) ?? ''),
    })
    inFlight.current = false
    dispatch({ type: 'outcome', outcome })

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
    if (!(field.name in state.errors)) return
    dispatch({ type: 'field-checked', name: field.name, error: validateField(field, normalizeValue(field, value)) })
  }

  const tone =
    state.status === 'success' || state.status === 'submitting'
      ? 'progress'
      : state.status === 'idle'
        ? 'idle'
        : 'problem'

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
        <p id="form-invalid" className="form-note form-note--problem">
          {formMessages.returned.invalid}
        </p>
        <p id="form-unavailable" className="form-note form-note--problem">
          {formMessages.unavailable}
        </p>
        <p id="form-failed" className="form-note form-note--problem">
          {formMessages.returned.failed}
        </p>
        <p id="form-busy" className="form-note form-note--problem">
          {formMessages.busy}
        </p>
      </div>

      {fields.map((field) => {
        const error = state.errors[field.name]
        const hintId = field.hint ? `${id(field.name)}-hint` : undefined
        const errorId = error ? `${id(field.name)}-error` : undefined
        const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
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
          <div key={field.name} className={['field', error && 'field--invalid'].filter(Boolean).join(' ')}>
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
              <textarea {...common} rows={field.name === 'message' ? 6 : 4} maxLength={field.max} />
            ) : field.kind === 'choice' ? (
              <div className="field__select">
                <select {...common} defaultValue="">
                  <option value="">{field.placeholderOption ?? 'Choose one'}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                {...common}
                type={field.kind === 'email' ? 'email' : 'text'}
                inputMode={field.kind === 'email' ? 'email' : undefined}
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
      })}

      {/* Honeypot: invisible to people, tempting to form-filling bots. */}
      <div className="form__trap" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={honeypotField} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="form__submit">
        <button type="submit" className="btn btn--lg form__button" aria-disabled={submitting || undefined}>
          <span className="form__button-labels">
            <span className={submitting ? 'is-hidden' : undefined}>{submitLabel}</span>
            <span className={submitting ? undefined : 'is-hidden'} aria-hidden={!submitting}>
              Sending…
            </span>
          </span>
          <Arrow />
        </button>
        <p id={`${kind}-guidance`} className="form__guidance">
          {guidance}
        </p>
      </div>

      <div
        ref={statusRef}
        className={`form-status form-status--${tone}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
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
