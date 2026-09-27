/**
 * The contract between the form and the submission endpoint.
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

/** The page each form lives on, where a no-JavaScript post is sent back to. */
export const formPageFor: Record<FormKind, string> = { inquiry: '/contact' }

/**
 * Explanations for a no-JavaScript post that did not succeed. The endpoint
 * redirects to `<form page>#<id>` and the form shows the matching note.
 */
export const fallbackIds = {
  invalid: 'form-invalid',
  unavailable: 'form-unavailable',
  failed: 'form-failed',
  busy: 'form-busy',
} as const

export type Fallback = keyof typeof fallbackIds

/** Which explanation a returned no-JavaScript post needs; none after success. */
export function fallbackFor(status: ServerStatus['status']): Fallback | null {
  switch (status) {
    case 'ok':
      return null
    case 'invalid':
    case 'rejected':
      return 'invalid'
    case 'unavailable':
      return 'unavailable'
    case 'busy':
      return 'busy'
    case 'failed':
      return 'failed'
  }
}

/**
 * Where a no-JavaScript post is sent next (303). A path, not a full URL: the
 * browser resolves it against the host it posted to, so it stays on that host
 * and the receipt cookie set for it arrives with the confirmation request. The
 * server's own idea of its hostname can differ (a proxy, 127.0.0.1 versus
 * localhost), which silently lost the receipt. Nothing the visitor typed is
 * ever part of it.
 */
export function redirectPathFor(kind: FormKind, status: ServerStatus['status']): string {
  const fallback = fallbackFor(status)
  return fallback === null ? '/thank-you' : `${formPageFor[kind]}#${fallbackIds[fallback]}`
}

/** The honeypot. Real visitors never see or fill it. */
export const honeypotField = 'ca_hp'

/** Set only after a confirmed delivery; read by /thank-you. See receipt.ts. */
export const receiptCookie = 'ca_receipt'
export const receiptMaxAge = 60 * 30
