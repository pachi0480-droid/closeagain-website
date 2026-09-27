/**
 * Where confirmed submissions go.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Two destinations ship. Configure either or both, server-side only (never
 * with a NEXT_PUBLIC_ variable):
 *
 * 1. Email to the business, through Resend (resend.com):
 *
 *   RESEND_API_KEY       the account's API key
 *   FORMS_NOTIFY_EMAIL   optional; where inquiries go (default: the business
 *                        address in content/site.ts)
 *   FORMS_EMAIL_FROM     optional; the sender. The default, Resend's shared
 *                        onboarding@resend.dev, may only send to the address
 *                        the Resend account was opened with — so open it with
 *                        the notify address, or verify a domain and set this.
 *
 *    Each inquiry arrives as a plain email listing every answer; Reply goes
 *    straight to the person who asked.
 *
 * 2. A JSON POST to a webhook URL the owner controls — a CRM or form-service
 *    inbound webhook, an automation tool, or their own endpoint:
 *
 *   FORMS_WEBHOOK_URL     https URL that accepts the JSON below
 *   FORMS_WEBHOOK_SECRET  optional; sent as `Authorization: Bearer <secret>`
 *
 *    The body is always:
 *
 *   { "type": "inquiry",
 *     "submittedAt": "<ISO time>",
 *     "fields": { "name", "email", "business", "goal", "plan",
 *                 "phone", "industry", "volume", "crm", "message" } }
 *
 *    Every field is present, as a string; optional ones may be empty. `goal`
 *    is a stable slug (see content/forms.ts) and `plan` is a plan id or
 *    "unsure".
 *
 * A submission counts as delivered only when a destination answers 2xx; with
 * both configured, one acceptance is enough, so a lead is never refused just
 * because the other destination is down. With neither configured,
 * `resolveDelivery` returns null and the endpoint reports that requests are
 * unavailable — it never pretends a lead was received.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { site } from '../../content/site.ts'
import { inquiryLines, inquirySubject } from './email.ts'
import { fieldsFor, type FieldValues, type FormKind } from './schema.ts'

export type DeliveryPayload = {
  type: FormKind
  submittedAt: string
  fields: FieldValues
}

export type DeliveryResult = { ok: true } | { ok: false; reason: 'rejected' | 'timeout' | 'network' }

export type Delivery = {
  deliver(kind: FormKind, fields: FieldValues): Promise<DeliveryResult>
}

type Env = Record<string, string | undefined>

const localHosts = new Set(['localhost', '127.0.0.1', '[::1]'])

/** https anywhere; plain http only for a local test sink. */
export function parseWebhookUrl(raw: string | undefined): URL | null {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    if (url.protocol === 'https:') return url
    if (url.protocol === 'http:' && localHosts.has(url.hostname)) return url
    return null
  } catch {
    return null
  }
}

/** Exactly what the webhook receives: this form's own fields, and nothing else. */
export function buildPayload(kind: FormKind, fields: FieldValues, now: Date = new Date()): DeliveryPayload {
  const known: FieldValues = {}
  for (const field of fieldsFor(kind)) {
    const value = Object.hasOwn(fields, field.name) ? fields[field.name] : undefined
    known[field.name] = typeof value === 'string' ? value : (field.defaultValue ?? '')
  }
  return { type: kind, submittedAt: now.toISOString(), fields: known }
}

/** Resend's email endpoint. */
export const resendEndpoint = 'https://api.resend.com/emails'
const defaultSender = 'CloseAgain website <onboarding@resend.dev>'
const emailPattern = /^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/

/** The notification email for one inquiry, in Resend's request format. */
export function buildNotification(
  kind: FormKind,
  fields: FieldValues,
  { to, from, now = new Date() }: { to: string; from: string; now?: Date },
) {
  const values = buildPayload(kind, fields, now).fields
  const name = values.name || 'them'
  const replyTo = emailPattern.test(values.email ?? '') ? values.email : undefined
  const text = [
    'New inquiry from the CloseAgain website.',
    '',
    ...inquiryLines(fieldsFor(kind), values),
    '',
    replyTo ? `Reply to this email to answer ${name} directly.` : 'No reply address was given.',
    `Received ${now.toISOString().replace('T', ' ').slice(0, 16)} UTC.`,
  ].join('\n')
  return { from, to: [to], subject: inquirySubject(values), text, ...(replyTo ? { reply_to: replyTo } : {}) }
}

type Destination = (kind: FormKind, fields: FieldValues) => Promise<DeliveryResult>

/** One POST that counts as delivered only on a 2xx answer within the time limit. */
async function post(fetchImpl: typeof fetch, url: URL | string, headers: Record<string, string>, body: unknown, timeoutMs: number): Promise<DeliveryResult> {
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'error',
      cache: 'no-store',
    })
    // Drain the body so the connection can be reused; its content is ignored.
    await response.arrayBuffer().catch(() => undefined)
    return response.ok ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch (error) {
    const name = (error as { name?: string } | null)?.name
    return { ok: false, reason: name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network' }
  }
}

export function resolveDelivery(
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Delivery | null {
  const destinations: Destination[] = []

  const apiKey = env.RESEND_API_KEY?.trim()
  if (apiKey) {
    const to = env.FORMS_NOTIFY_EMAIL?.trim() || site.email
    const from = env.FORMS_EMAIL_FROM?.trim() || defaultSender
    destinations.push((kind, fields) =>
      post(fetchImpl, resendEndpoint, { authorization: `Bearer ${apiKey}` }, buildNotification(kind, fields, { to, from }), timeoutMs),
    )
  }

  const url = parseWebhookUrl(env.FORMS_WEBHOOK_URL)
  if (url) {
    const secret = env.FORMS_WEBHOOK_SECRET?.trim()
    destinations.push((kind, fields) =>
      post(fetchImpl, url, secret ? { authorization: `Bearer ${secret}` } : {}, buildPayload(kind, fields), timeoutMs),
    )
  }

  if (destinations.length === 0) return null

  return {
    async deliver(kind, fields) {
      const results = await Promise.all(destinations.map((send) => send(kind, fields)))
      return results.find((result) => result.ok) ?? results[0]
    },
  }
}
