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
 * A submission counts as delivered only when that URL answers 2xx. With no URL
 * configured, `resolveDelivery` returns null and the endpoint reports that
 * requests are unavailable — it never pretends a lead was received.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { FieldValues, FormKind } from './schema.ts'

export type DeliveryPayload = {
  type: 'demo-request' | 'contact-message'
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
      const payload: DeliveryPayload = {
        type: kind === 'demo' ? 'demo-request' : 'contact-message',
        submittedAt: new Date().toISOString(),
        fields,
      }
      try {
        const response = await fetchImpl(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(secret ? { authorization: `Bearer ${secret}` } : {}),
          },
          body: JSON.stringify(payload),
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
