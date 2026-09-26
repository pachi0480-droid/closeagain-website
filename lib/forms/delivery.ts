/**
 * Where confirmed submissions go.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * One adapter ships: a JSON POST to a webhook URL the owner controls — a CRM
 * or form-service inbound webhook, an automation tool, or their own endpoint.
 * Configure it server-side (never with a NEXT_PUBLIC_ variable):
 *
 *   FORMS_WEBHOOK_URL     https URL that accepts the JSON below
 *   FORMS_WEBHOOK_SECRET  optional; sent as `Authorization: Bearer <secret>`
 *
 * The body is always:
 *
 *   { "type": "inquiry",
 *     "submittedAt": "<ISO time>",
 *     "fields": { "name", "email", "business", "goal", "plan",
 *                 "phone", "industry", "volume", "crm", "message" } }
 *
 * Every field is present, as a string; optional ones may be empty. `goal` is
 * a stable slug (see content/forms.ts) and `plan` is a plan id or "unsure".
 *
 * A submission counts as delivered only when that URL answers 2xx. With no URL
 * configured, `resolveDelivery` returns null and the endpoint reports that
 * requests are unavailable — it never pretends a lead was received.
 * ────────────────────────────────────────────────────────────────────────────
 */

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

export function resolveDelivery(
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Delivery | null {
  const url = parseWebhookUrl(env.FORMS_WEBHOOK_URL)
  if (!url) return null
  const secret = env.FORMS_WEBHOOK_SECRET?.trim()

  return {
    async deliver(kind, fields) {
      try {
        const response = await fetchImpl(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(secret ? { authorization: `Bearer ${secret}` } : {}),
          },
          body: JSON.stringify(buildPayload(kind, fields)),
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
    },
  }
}
