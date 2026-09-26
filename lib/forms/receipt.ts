/**
 * The confirmation receipt: a short-lived, HttpOnly cookie the endpoint sets
 * only after the delivery destination confirmed a submission, read by
 * /thank-you to decide between “Inquiry received” and a neutral page.
 *
 * Its value is `<kind>:<plan>` — `inquiry:growth`, `inquiry:unsure` — and
 * nothing the visitor typed. Anything that does not decode exactly is treated
 * as no receipt at all, so a tampered or stale cookie can only ever produce
 * the neutral page.
 */

import { unsurePlan } from '../../content/forms.ts'
import { planById, type PlanId } from '../../content/pricing.ts'
import { isFormKind, type FieldValues, type FormKind } from './schema.ts'

export type ReceiptPlan = PlanId | typeof unsurePlan

export type Receipt = { kind: FormKind; plan: ReceiptPlan }

const toPlan = (value: unknown): ReceiptPlan | null => {
  if (value === unsurePlan) return unsurePlan
  return typeof value === 'string' ? (planById(value)?.id ?? null) : null
}

/** The receipt for a delivered submission, from its validated values. */
export function receiptFor(kind: FormKind, values: FieldValues): Receipt {
  return { kind, plan: toPlan(values.plan) ?? unsurePlan }
}

export function encodeReceipt(receipt: Receipt): string {
  return `${receipt.kind}:${receipt.plan}`
}

/** A receipt, or null for anything missing, malformed or unknown. */
export function decodeReceipt(value: unknown): Receipt | null {
  if (typeof value !== 'string' || value.length > 64) return null
  const parts = value.split(':')
  if (parts.length !== 2) return null
  const [kind, rawPlan] = parts
  const plan = toPlan(rawPlan)
  return isFormKind(kind) && plan ? { kind, plan } : null
}
