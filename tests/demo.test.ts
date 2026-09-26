/**
 * The product demo's sample data: the numbers on every card must agree with
 * the records behind them, prices must come from content/pricing.ts, and the
 * data must be identical on every render. Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { plans } from '../content/pricing.ts'
import { templates } from '../content/demo/automations.ts'
import { invoicesFor, monthlyPrice, mrr, planAt, planDistribution } from '../content/demo/billing.ts'
import { clientById, clients } from '../content/demo/clients.ts'
import { fmtAgo, fmtCurrency, fmtDate, fmtNumber, fmtStamp, fmtTime, fmtWeekdayDate } from '../content/demo/format.ts'
import { generateClient } from '../content/demo/generate.ts'
import { automationStats, dailySeries, stageCounts, summarize, windowFor, within } from '../content/demo/metrics.ts'
import { allAppointments, allLeads, canDeploy, clientRows, datasets } from '../content/demo/operator.ts'
import { DEMO_NOW, HOUR, MINUTE } from '../content/demo/time.ts'
import { workspaceAppointments, workspaceAutomations, workspaceLeads } from '../content/demo/workspace.ts'

describe('demo clock and formatting', () => {
  it('formats the fixed demo time the same way everywhere', () => {
    assert.equal(fmtTime(DEMO_NOW), '11:00 AM')
    assert.equal(fmtDate(DEMO_NOW), 'Sep 24')
    assert.equal(fmtWeekdayDate(DEMO_NOW), 'Thu, Sep 24')
    assert.equal(fmtStamp(DEMO_NOW - 2 * HOUR), '9:00 AM')
    assert.equal(fmtAgo(DEMO_NOW - 12 * MINUTE), '12m ago')
  })

  it('groups numbers and money without locale data', () => {
    assert.equal(fmtNumber(1284), '1,284')
    assert.equal(fmtNumber(-3500), '−3,500')
    assert.equal(fmtCurrency(11992), '$11,992')
  })
})

describe('sample generation', () => {
  it('is deterministic', () => {
    const client = clientById('bellwether')
    assert.ok(client)
    const a = generateClient(client, { prefix: 'x' })
    const b = generateClient(client, { prefix: 'x' })
    assert.deepEqual(a, b)
  })

  it('never produces activity after the demo clock', () => {
    for (const lead of allLeads) {
      assert.ok(lead.createdAt <= DEMO_NOW, lead.id)
      for (const message of lead.thread) assert.ok(message.at <= DEMO_NOW, `${lead.id} ${message.id}`)
    }
  })

  it('keeps every lead internally consistent', () => {
    const ids = new Set<string>()
    const appointmentIds = new Set(allAppointments.map((appointment) => appointment.id))
    for (const lead of allLeads) {
      assert.equal(ids.has(lead.id), false, `duplicate ${lead.id}`)
      ids.add(lead.id)
      const times = lead.thread.map((message) => message.at)
      assert.deepEqual(times, [...times].sort((a, b) => a - b), `thread order ${lead.id}`)
      assert.equal(lead.lastContactAt, times[times.length - 1], lead.id)
      assert.equal(lead.sent, lead.thread.filter((message) => message.from === 'closeagain').length, lead.id)
      if (lead.stage === 'appointment') assert.ok(lead.appointmentId && appointmentIds.has(lead.appointmentId), lead.id)
      if (lead.stage === 'closed') assert.ok(lead.outcome, lead.id)
      if (lead.recoveredAt !== undefined) assert.ok(lead.repliedAt !== undefined, lead.id)
      assert.match(lead.email, /@example\.(com|net|org)$/, lead.id)
    }
  })
})

describe('metrics match the records behind them', () => {
  const window = windowFor(30)
  const summary = summarize(workspaceLeads, workspaceAppointments, window)

  it('counts new, recovered and booked exactly as the lists do', () => {
    assert.equal(summary.newLeads, workspaceLeads.filter((lead) => within(lead.createdAt, window)).length)
    assert.equal(summary.recovered, workspaceLeads.filter((lead) => within(lead.recoveredAt, window)).length)
    assert.equal(summary.appointments, workspaceAppointments.filter((appointment) => within(appointment.bookedAt, window)).length)
  })

  it('adds up the daily chart to the card totals', () => {
    const series = dailySeries(workspaceLeads, workspaceAppointments, 30)
    const total = (key: 'newLeads' | 'recovered' | 'appointments' | 'sent') => series.reduce((sum, point) => sum + point[key], 0)
    assert.equal(total('newLeads'), summary.newLeads)
    assert.equal(total('recovered'), summary.recovered)
    assert.equal(total('appointments'), summary.appointments)
    assert.equal(total('sent'), summary.messagesSent)
  })

  it('assigns every lead to exactly one pipeline stage', () => {
    const counts = stageCounts(workspaceLeads)
    assert.equal(Object.values(counts).reduce((sum, count) => sum + count, 0), workspaceLeads.length)
  })

  it('enrols each lead in one automation', () => {
    const wide = windowFor(90)
    const enrolling = workspaceAutomations.filter((automation) => automation.templateId !== 'tpl-reminder' && automation.templateId !== 'tpl-no-show')
    const enrolled = enrolling.reduce((sum, automation) => sum + automationStats(automation, workspaceLeads, workspaceAppointments, wide).enrolled, 0)
    assert.equal(enrolled, workspaceLeads.filter((lead) => within(lead.enrolledAt, wide)).length)
  })

  it('gives the operator the same numbers for the featured client', () => {
    const row = clientRows.find((entry) => entry.client.id === 'juniper-row')
    assert.ok(row)
    assert.deepEqual(row.current, summary)
    assert.equal(datasets['juniper-row'].leads, workspaceLeads)
  })
})

describe('billing comes from content/pricing.ts', () => {
  it('computes MRR as the sum of billing clients’ plan prices', () => {
    const expected = clients
      .filter((client) => client.status !== 'paused')
      .reduce((sum, client) => {
        const plan = plans.find((entry) => entry.id === client.plan)
        return sum + (plan?.monthly ?? client.contractMonthly ?? 0)
      }, 0)
    assert.equal(mrr(clients), expected)
    assert.equal(
      planDistribution(clients).reduce((sum, slice) => sum + slice.mrr, 0),
      expected,
    )
  })

  it('gives every Enterprise sample client an explicit contract value', () => {
    for (const client of clients.filter((entry) => entry.plan === 'enterprise')) {
      assert.ok(typeof client.contractMonthly === 'number' && client.contractMonthly > 0, client.id)
    }
  })

  it('prices each invoice from the plan the client was on that month', () => {
    for (const client of clients) {
      for (const invoice of invoicesFor(client)) {
        assert.equal(invoice.plan, planAt(client, invoice.issuedAt))
        assert.equal(invoice.amount, monthlyPrice(client, invoice.plan))
      }
    }
  })
})

describe('template deployment rules', () => {
  const paused = clients.find((client) => client.status === 'paused')
  const core = clients.find((client) => client.plan === 'core' && client.status === 'active')
  const growth = clients.find((client) => client.plan === 'growth')

  it('refuses paused accounts with a reason', () => {
    assert.ok(paused)
    const result = canDeploy('tpl-new-lead', paused)
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.reason, /paused/i)
  })

  it('follows the plan feature list', () => {
    assert.ok(core && growth)
    const needsGrowth = templates.filter((template) => template.minPlan === 'growth')
    assert.ok(needsGrowth.length > 0)
    for (const template of needsGrowth) {
      assert.equal(canDeploy(template.id, core).ok, false, template.id)
      assert.equal(canDeploy(template.id, growth).ok, true, template.id)
    }
  })
})
