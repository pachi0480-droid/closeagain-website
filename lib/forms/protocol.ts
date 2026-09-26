/**
 * The contract between the forms and the submission endpoint.
 *
 * Success is only ever `{ status: 'ok' }` with HTTP 200, and the endpoint only
 * returns it after the delivery destination has confirmed receipt.
 */

import type { FieldErrors, FormKind } from './schema.ts'

export type ServerStatus =
  | { status: 'ok' }
  | { status: 'invalid'; errors: FieldErrors }
  | { status: 'unavailable' }
  | { status: 'busy' }
  | { status: 'failed' }
  | { status: 'rejected' }

export const httpStatusFor: Record<ServerStatus['status'], number> = {
  ok: 200,
  invalid: 422,
  unavailable: 503,
  busy: 429,
  failed: 502,
  rejected: 400,
}

export const endpointFor = (kind: FormKind) => `/api/forms/${kind}`

/** The honeypot. Real visitors never see or fill it. */
export const honeypotField = 'ca_hp'

/** Set only after a confirmed delivery; read by /thank-you. */
export const receiptCookie = 'ca_receipt'
export const receiptMaxAge = 60 * 30
