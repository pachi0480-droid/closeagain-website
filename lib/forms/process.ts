/**
 * The server-side decision for one submission, independent of Next.js so it
 * can be tested directly. The route handler only adapts HTTP to and from it.
 */

import type { Delivery } from './delivery.ts'
import { honeypotField, type ServerStatus } from './protocol.ts'
import { receiptFor, type Receipt } from './receipt.ts'
import { validateSubmission, type FormKind } from './schema.ts'

export type ProcessResult = {
  outcome: ServerStatus
  /** True only when the delivery destination confirmed receipt. */
  delivered: boolean
  /** For the confirmation page; present exactly when `delivered` is true. */
  receipt: Receipt | null
}

const refused = (outcome: ServerStatus): ProcessResult => ({ outcome, delivered: false, receipt: null })

/** Anything but an absent or blank trap means a bot filled it in. */
const trapFilled = (value: unknown) =>
  value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '')

export async function processSubmission(
  kind: FormKind,
  raw: Record<string, unknown>,
  delivery: Delivery | null,
): Promise<ProcessResult> {
  // A filled honeypot is a bot. Say no plainly; never fake success.
  if (trapFilled(raw[honeypotField])) return refused({ status: 'rejected' })

  const result = validateSubmission(kind, raw)
  if (!result.ok) return refused({ status: 'invalid', errors: result.errors })

  if (!delivery) return refused({ status: 'unavailable' })

  const sent = await delivery.deliver(kind, result.values)
  if (!sent.ok) return refused({ status: 'failed' })

  return { outcome: { status: 'ok' }, delivered: true, receipt: receiptFor(kind, result.values) }
}
