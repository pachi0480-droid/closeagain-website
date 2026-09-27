/**
 * Form UI state as a reducer, so every transition is explicit and testable.
 *
 * idle → submitting → success | invalid | failed | unavailable | busy
 *
 * `success` is reachable only from a confirmed server outcome. A second submit
 * while one is in flight is ignored.
 */

import { formMessages } from '../../content/forms.ts'
import type { FieldErrors } from './schema.ts'
import type { SubmitOutcome } from './transport.ts'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'invalid' | 'failed' | 'unavailable' | 'busy'

export type FormState = {
  status: FormStatus
  errors: FieldErrors
  /** Announced in the status region. */
  message: string | null
}

export type FormAction =
  | { type: 'submit' }
  | { type: 'client-invalid'; errors: FieldErrors }
  | { type: 'outcome'; outcome: SubmitOutcome }
  | { type: 'field-checked'; name: string; error: string | null }
  /** Back to a clean slate — used once the details were handed to an email draft. */
  | { type: 'reset' }

export const initialFormState: FormState = { status: 'idle', errors: {}, message: null }

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'reset':
      return initialFormState
    case 'submit':
      if (state.status === 'submitting' || state.status === 'success') return state
      return { status: 'submitting', errors: {}, message: formMessages.submitting }

    case 'client-invalid':
      if (state.status === 'submitting') return state
      return { status: 'invalid', errors: action.errors, message: formMessages.invalid }

    case 'outcome': {
      if (state.status !== 'submitting') return state
      const outcome = action.outcome
      switch (outcome.status) {
        case 'ok':
          return { status: 'success', errors: {}, message: formMessages.success }
        case 'invalid':
          return { status: 'invalid', errors: outcome.errors, message: formMessages.invalid }
        case 'unavailable':
          return { status: 'unavailable', errors: {}, message: formMessages.unavailable }
        case 'busy':
          return { status: 'busy', errors: {}, message: formMessages.busy }
        case 'failed':
          return {
            status: 'failed',
            errors: {},
            message:
              outcome.reason === 'timeout'
                ? formMessages.timeout
                : outcome.reason === 'network'
                  ? formMessages.network
                  : formMessages.failed,
          }
      }
      return state
    }

    case 'field-checked': {
      // Once a field has an error, re-check it as the visitor corrects it.
      if (!(action.name in state.errors) && action.error === null) return state
      const errors = { ...state.errors }
      if (action.error) errors[action.name] = action.error
      else delete errors[action.name]
      const stillInvalid = state.status === 'invalid' && Object.keys(errors).length > 0
      return {
        ...state,
        errors,
        status: state.status === 'invalid' && !stillInvalid ? 'idle' : state.status,
        message: state.status === 'invalid' && !stillInvalid ? null : state.message,
      }
    }
  }
}
