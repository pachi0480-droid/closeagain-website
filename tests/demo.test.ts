/**
 * The product demo's sample data: the numbers on every card must agree with
 * the records behind them, prices must come from content/pricing.ts, and the
 * data must be identical on every render. Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { planById, plans } from '../content/pricing.ts'
import { leadActivity } from '../content/demo/activity.ts'
import { attentionHref, clientAttention, needsReply, todaysAppointments } from '../content/demo/attention.ts'
import { buildAutomations, initialDeployments, planAllows, templates, type Template } from '../content/demo/automations.ts'
import { integrationPlans, invoicesFor, monthlyPrice, mrr, planAt, planDistribution, seatLimit } from '../content/demo/billing.ts'
import { clientById, clients } from '../content/demo/clients.ts'
import { fmtAgo, fmtCurrency, fmtDate, fmtNumber, fmtStamp, fmtTime, fmtWeekdayDate } from '../content/demo/format.ts'
import { generateClient } from '../content/demo/generate.ts'
import { automationStats, dailySeries, recoveredOpportunities, stageCounts, summarize, windowFor, within } from '../content/demo/metrics.ts'
import { allAppointments, allLeads, canDeploy, clientRows, datasets, upsellOpportunities } from '../content/demo/operator.ts'
import { buildShowcaseData } from '../content/demo/showcase.ts'
import { showcase } from '../content/demo/showcase-data.ts'
import { DAY, DEMO_NOW, HOUR, MINUTE } from '../content/demo/time.ts'
import {
  attentionNotes,
  integrationCatalog,
  workspaceAppointments,
  workspaceAutomations,
  workspaceClient,
  workspaceLeads,
} from '../content/demo/workspace.ts'

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
  const scale = clients.find((client) => client.plan === 'scale' && client.status === 'active')

  it('offers the seven library templates, in order', () => {
    assert.deepEqual(
      templates.map((template) => template.name),
      [
        'New Lead Follow-Up',
        'Old Lead Reactivation',
        'Missed Inquiry Recovery',
        'No-Show Follow-Up',
        'Appointment Reminder',
        'Proposal Follow-Up',
        'Win-Back Campaign',
      ],
    )
  })

  it('quotes a feature of the plan each gated template needs', () => {
    for (const template of templates.filter((item) => item.minPlan !== 'core')) {
      const plan = planById(template.minPlan)
      assert.ok(plan && template.planFeature && plan.features.includes(template.planFeature), `${template.name}: ${template.planFeature}`)
    }
  })

  it('only runs templates each sample client’s plan includes', () => {
    for (const client of clients) {
      for (const id of initialDeployments[client.id] ?? []) {
        const template = templates.find((item) => item.id === id)
        assert.ok(template && planAllows(client.plan, template.minPlan), `${client.id} runs ${id} on ${client.plan}`)
      }
    }
  })

  it('checks templates made in the tab against their own plan', () => {
    assert.ok(growth && scale)
    const custom: Template = { ...templates[3], id: 'tpl-custom-8', name: 'Copy of No-Show Follow-Up' }
    assert.equal(canDeploy(custom, growth).ok, false)
    assert.equal(canDeploy(custom, scale).ok, true)
    const built = buildAutomations(scale, ['tpl-custom-8'], (id) => (id === custom.id ? custom : undefined))
    assert.equal(built[0]?.name, custom.name)
  })

  it('refuses paused accounts with a reason', () => {
    assert.ok(paused)
    const result = canDeploy('tpl-new-lead', paused)
    assert.equal(result.ok, false)
    if (!result.ok) assert.match(result.reason, /paused/i)
  })

  it('follows the plan feature list', () => {
    assert.ok(core && growth && scale)
    const needsGrowth = templates.filter((template) => template.minPlan === 'growth')
    const needsScale = templates.filter((template) => template.minPlan === 'scale')
    assert.ok(needsGrowth.length > 0 && needsScale.length > 0)
    for (const template of needsGrowth) {
      assert.equal(canDeploy(template.id, core).ok, false, template.id)
      assert.equal(canDeploy(template.id, growth).ok, true, template.id)
    }
    for (const template of needsScale) {
      assert.equal(canDeploy(template.id, growth).ok, false, template.id)
      assert.equal(canDeploy(template.id, scale).ok, true, template.id)
    }
  })
})

describe('sample accounts follow the plan facts in content/pricing.ts', () => {
  const rank = (id: string) => plans.findIndex((plan) => plan.id === id)

  it('connects CRM and webhooks only where the plan includes them', () => {
    for (const client of clients) {
      for (const [id, needs] of Object.entries(integrationPlans)) {
        const status = client.integrations[id as keyof typeof client.integrations]
        if (status !== 'available') assert.ok(rank(client.plan) >= rank(needs.plan), `${client.id} has ${id} on ${client.plan}`)
        assert.ok(planById(needs.plan)?.features.includes(needs.feature), needs.feature)
      }
    }
  })

  it('reads seat allowances from the comparison', () => {
    assert.equal(seatLimit('core'), 1)
    assert.equal(seatLimit('growth'), 5)
    assert.equal(seatLimit('scale'), null)
    for (const client of clients) {
      const limit = seatLimit(client.plan)
      if (limit !== null) assert.ok(client.team.length <= limit, `${client.id} has ${client.team.length} people on ${client.plan}`)
    }
  })

  it('bases every upsell on a feature of the plan it proposes', () => {
    for (const upsell of upsellOpportunities(clientRows)) {
      const to = plans.find((plan) => plan.name === upsell.to)
      assert.ok(to && to.features.some((feature) => upsell.reason.toLowerCase().includes(feature.toLowerCase())), upsell.reason)
    }
  })
})

describe('the homepage showcase uses the demo’s numbers', () => {
  it('matches a fresh build of the sample data (regenerate content/demo/showcase-data.ts if not)', () => {
    assert.deepEqual(showcase, buildShowcaseData())
  })

  it('shows the same figures as the demo overview', () => {
    const summary = summarize(workspaceLeads, workspaceAppointments, windowFor(30))
    const kpi = (id: string) => showcase.kpis.find((item) => item.id === id)?.value
    assert.equal(kpi('new'), summary.newLeads)
    assert.equal(kpi('recovered'), summary.recovered)
    assert.equal(kpi('appointments'), summary.appointments)
    assert.equal(kpi('pipeline'), summary.pipeline)
    assert.equal(showcase.trend.newLeads.reduce((sum, value) => sum + value, 0), summary.newLeads)
    assert.equal(showcase.trend.recovered.reduce((sum, value) => sum + value, 0), summary.recovered)
    assert.equal(showcase.unread, workspaceLeads.filter((lead) => lead.unread).length)
  })
})

describe('the client overview is derived from the records', () => {
  const integrations = integrationCatalog.map((item) => ({
    id: item.id,
    name: item.name,
    status: workspaceClient.integrations[item.id],
    note: attentionNotes[`${workspaceClient.id}.${item.id}`],
  }))
  const items = clientAttention({ leads: workspaceLeads, appointments: workspaceAppointments, automations: workspaceAutomations, integrations })
  const item = (id: string) => items.find((entry) => entry.id === id)

  it('counts “needs attention” exactly as the filtered views list them', () => {
    assert.equal(item('replies')?.count, workspaceLeads.filter(needsReply).length)
    assert.equal(item('appointments')?.count, todaysAppointments(workspaceAppointments).length)
    assert.equal(item('automations')?.count, workspaceAutomations.filter((automation) => !automation.enabled).length)
    assert.equal(item('integrations')?.count, integrations.filter((entry) => entry.status === 'attention').length)
    for (const entry of items) {
      assert.ok(entry.count > 0, entry.id)
      assert.equal(entry.href, attentionHref[entry.id])
    }
  })

  it('clears an item once the records behind it are dealt with', () => {
    const handled = workspaceLeads.map((lead) => ({ ...lead, handled: true }))
    const after = clientAttention({ leads: handled, appointments: workspaceAppointments, automations: workspaceAutomations, integrations })
    assert.equal(after.some((entry) => entry.id === 'replies'), false)
  })

  it('lists recovered opportunities that add up to the recovered count', () => {
    const window = windowFor(30)
    const recovered = recoveredOpportunities(workspaceLeads, window)
    assert.equal(recovered.leads.length, summarize(workspaceLeads, workspaceAppointments, window).recovered)
  })

  it('shows recent lead activity, newest first, from the last week', () => {
    const events = leadActivity(workspaceLeads, workspaceAppointments, 12)
    assert.ok(events.length > 0)
    for (let i = 1; i < events.length; i++) assert.ok(events[i - 1].at >= events[i].at)
    for (const event of events) assert.ok(event.at <= DEMO_NOW && event.at >= DEMO_NOW - 7 * DAY, event.id)
  })
})
