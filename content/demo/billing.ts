/**
 * Billing for the operator demo, derived from content/pricing.ts and the
 * sample clients. Nothing here is typed in as a total: MRR, invoice amounts
 * and plan distribution are all computed from each client's plan.
 */

import { planById, plans, type Plan, type PlanId } from '../pricing.ts'
import { planChanges } from './clients.ts'
import { DAY, DEMO_NOW, atLocal, localParts } from './time.ts'
import type { Client, Invoice, PlanChange } from './types.ts'

/** Monthly price of a plan for a client: the list price, or the Enterprise sample contract value. */
export function monthlyPrice(client: Client, planId: PlanId = client.plan): number {
  if (planId === 'enterprise') return client.contractMonthly ?? 0
  return planById(planId)?.monthly ?? 0
}

/** Paused accounts are not billed, so they do not count toward MRR. */
export const isBilling = (client: Client) => client.status !== 'paused'

export function mrr(clients: readonly Client[]): number {
  return clients.filter(isBilling).reduce((sum, client) => sum + monthlyPrice(client), 0)
}

/** The plan a client was on at a moment, walking its plan history back from today. */
export function planAt(client: Client, at: number, changes: readonly PlanChange[] = planChanges): PlanId {
  const history = changes.filter((change) => change.clientId === client.id).sort((a, b) => b.at - a.at)
  let plan = client.plan
  for (const change of history) {
    if (change.at > at) plan = change.from
  }
  return plan
}

export type PlanSlice = { plan: Plan; clients: Client[]; count: number; mrr: number }

export function planDistribution(clients: readonly Client[]): PlanSlice[] {
  return plans.map((plan) => {
    const onPlan = clients.filter((client) => client.plan === plan.id && isBilling(client))
    return {
      plan,
      clients: onPlan,
      count: onPlan.length,
      mrr: onPlan.reduce((sum, client) => sum + monthlyPrice(client), 0),
    }
  })
}

/** Billing date in a given month, clamped to the month's length. */
const billingDate = (client: Client, year: number, month: number) => {
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return atLocal(year, month, Math.min(client.billingDay, days), 9, 0)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Payment outcomes that differ from “paid”, keyed by client and period. */
const exceptions: Record<string, { status: Invoice['status']; note: string }> = {
  'tallyhouse.2026-09': { status: 'failed', note: 'Card declined Sep 1 and again on retry Sep 8. Account paused Sep 12.' },
  'tallyhouse.2026-08': { status: 'paid', note: 'Paid on the second attempt, Aug 4.' },
}

/** Invoices for July to September 2026, plus the next open invoice for billing accounts. */
export function invoicesFor(client: Client): Invoice[] {
  const out: Invoice[] = []
  const { year: nowYear, month: nowMonth } = localParts(DEMO_NOW)
  for (let offset = -2; offset <= 1; offset++) {
    const month = (nowMonth + offset + 12) % 12
    const year = nowYear + Math.floor((nowMonth + offset) / 12)
    const issuedAt = billingDate(client, year, month)
    if (issuedAt < client.since) continue
    const upcoming = issuedAt > DEMO_NOW
    if (upcoming && !isBilling(client)) continue
    const plan = planAt(client, issuedAt)
    const period = `${year}-${String(month + 1).padStart(2, '0')}`
    const exception = exceptions[`${client.id}.${period}`]
    out.push({
      id: `INV-${period.replace('-', '')}-${client.short.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}`,
      clientId: client.id,
      period: `${MONTHS[month]} ${year}`,
      issuedAt,
      amount: monthlyPrice(client, plan),
      plan,
      status: upcoming ? 'open' : (exception?.status ?? 'paid'),
      ...(exception ? { note: exception.note } : {}),
    })
  }
  return out
}

export type Movement = PlanChange & { delta: number; kind: 'upgrade' | 'downgrade' }

/** Plan changes with their effect on MRR, newest first. */
export function planMovements(clients: readonly Client[], since = DEMO_NOW - 90 * DAY): Movement[] {
  return planChanges
    .filter((change) => change.at >= since)
    .map((change) => {
      const client = clients.find((c) => c.id === change.clientId)
      const delta = client ? monthlyPrice(client, change.to) - monthlyPrice(client, change.from) : 0
      return { ...change, delta, kind: delta >= 0 ? ('upgrade' as const) : ('downgrade' as const) }
    })
    .sort((a, b) => b.at - a.at)
}

/** The next billing date after DEMO_NOW for each billing client. */
export function nextRenewal(client: Client): number {
  const { year, month } = localParts(DEMO_NOW)
  const thisMonth = billingDate(client, year, month)
  return thisMonth > DEMO_NOW ? thisMonth : billingDate(client, month === 11 ? year + 1 : year, (month + 1) % 12)
}
