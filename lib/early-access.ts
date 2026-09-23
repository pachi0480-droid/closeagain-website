/**
 * Early-access submission boundary.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * TODO(launch): no delivery destination is wired up yet.
 *
 * Set NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT to a URL that accepts a JSON POST
 * (a form service, a CRM webhook, or a route handler added to this app) and
 * this function starts working with no UI changes.
 *
 * Until that variable is set this returns `not-configured` on purpose. The
 * form must never show a success state for a submission that went nowhere.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type EarlyAccessPayload = {
  name: string
  email: string
  company: string
  phone: string
  trade: string
  teamSize: string
  leadVolume: string
  biggestLeak: string
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'network' | 'rejected' }

const endpoint = process.env.NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT

export const isSubmissionConfigured = Boolean(endpoint)

export async function submitEarlyAccess(
  payload: EarlyAccessPayload,
): Promise<SubmitResult> {
  if (!endpoint) return { ok: false, reason: 'not-configured' }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.ok ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

/* --- validation ---------------------------------------------------------- */

export type FieldErrors = Partial<Record<keyof EarlyAccessPayload, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(payload: EarlyAccessPayload): FieldErrors {
  const errors: FieldErrors = {}

  if (!payload.name.trim()) errors.name = 'Enter your name.'

  if (!payload.email.trim()) errors.email = 'Enter your work email.'
  else if (!emailPattern.test(payload.email.trim()))
    errors.email = 'That does not look like a valid email address.'

  if (!payload.company.trim()) errors.company = 'Enter your company name.'
  if (!payload.trade) errors.trade = 'Select your primary trade.'

  return errors
}
