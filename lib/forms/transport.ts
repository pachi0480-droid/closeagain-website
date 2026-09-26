/**
 * Browser-side submission. Turns every possible HTTP or network result into
 * one of a small set of outcomes the form knows how to explain.
 */

import { endpointFor, honeypotField } from './protocol.ts'
import { fieldsFor, type FieldErrors, type FieldValues, type FormKind } from './schema.ts'

export type SubmitOutcome =
  | { status: 'ok' }
  | { status: 'invalid'; errors: FieldErrors }
  | { status: 'unavailable' }
  | { status: 'busy' }
  | { status: 'failed'; reason: 'server' | 'network' | 'timeout' }

type Options = {
  fetchImpl?: typeof fetch
  timeoutMs?: number
  honeypot?: string
}

/** Keep only messages for fields this form actually has. */
function knownErrors(kind: FormKind, errors: unknown): FieldErrors {
  const out: FieldErrors = {}
  if (!errors || typeof errors !== 'object') return out
  for (const field of fieldsFor(kind)) {
    const message = (errors as Record<string, unknown>)[field.name]
    if (typeof message === 'string' && message.length > 0 && message.length < 240) {
      out[field.name] = message
    }
  }
  return out
}

export async function sendSubmission(
  kind: FormKind,
  values: FieldValues,
  { fetchImpl = fetch, timeoutMs = 15000, honeypot = '' }: Options = {},
): Promise<SubmitOutcome> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(endpointFor(kind), {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ ...values, [honeypotField]: honeypot }),
      credentials: 'same-origin',
      signal: controller.signal,
    })

    let body: { status?: unknown; errors?: unknown } | null = null
    try {
      body = await response.json()
    } catch {
      body = null
    }

    // Success needs both the status code and an explicit confirmation.
    if (response.status === 200 && body?.status === 'ok') return { status: 'ok' }
    if (response.status === 422 && body?.status === 'invalid') {
      const errors = knownErrors(kind, body.errors)
      if (Object.keys(errors).length > 0) return { status: 'invalid', errors }
    }
    if (response.status === 503) return { status: 'unavailable' }
    if (response.status === 429) return { status: 'busy' }
    return { status: 'failed', reason: 'server' }
  } catch {
    return { status: 'failed', reason: controller.signal.aborted ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}
