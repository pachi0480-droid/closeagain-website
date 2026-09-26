/**
 * The server-side decision for one submission, independent of Next.js so it
 * can be tested directly. The route handler only adapts HTTP to and from it.
 */

import type { Delivery } from './delivery.ts'
import { honeypotField, type ServerStatus } from './protocol.ts'
import { validateSubmission, type FormKind } from './schema.ts'

export type ProcessResult = {
  outcome: ServerStatus
  /** True only when the delivery destination confirmed receipt. */
  delivered: boolean
}

export async function processSubmission(
  kind: FormKind,
  raw: Record<string, unknown>,
  delivery: Delivery | null,
): Promise<ProcessResult> {
  // A filled honeypot is a bot. Say no plainly; never fake success.
  const trap = raw[honeypotField]
  if (typeof trap === 'string' && trap.trim() !== '') {
    return { outcome: { status: 'rejected' }, delivered: false }
  }

  const result = validateSubmission(kind, raw)
  if (!result.ok) return { outcome: { status: 'invalid', errors: result.errors }, delivered: false }

  if (!delivery) return { outcome: { status: 'unavailable' }, delivered: false }

  const sent = await delivery.deliver(kind, result.values)
  if (!sent.ok) return { outcome: { status: 'failed' }, delivered: false }

  return { outcome: { status: 'ok' }, delivered: true }
}
