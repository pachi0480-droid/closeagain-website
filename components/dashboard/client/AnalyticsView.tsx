'use client'

import { useMemo } from 'react'
import { fmtDate, fmtNumber, fmtPercent, fmtWeekdayDate } from '@/content/demo/format'
import { conversionTrend, dailySeries, reachedQualified, sourcePerformance, summarize, windowFor, within } from '@/content/demo/metrics'
import type { Appointment, Lead } from '@/content/demo/types'
import { BarList, TimeChart } from '../charts'
import { priorLabel, rangeLabel, rangeOptions, useRange, type RangeDays } from '../hooks'
import { sourceLabel } from '../labels'
import { Metric, PageHeader, Panel, Segmented, cx, deltaOf, pointsDelta } from '../ui'
import { useAppointments, useLeads } from './state'

export function funnelFor(leads: readonly Lead[], appointments: readonly Appointment[], days: RangeDays) {
  const period = windowFor(days)
  const cohort = leads.filter((lead) => within(lead.createdAt, period) || within(lead.recoveredAt, period))
  const booked = new Set(appointments.map((appointment) => appointment.leadId))
  return [
    { id: 'entered', label: 'New and recovered', value: cohort.length },
    { id: 'replied', label: 'Replied', value: cohort.filter((lead) => lead.repliedAt !== undefined).length },
    { id: 'qualified', label: 'Qualified', value: cohort.filter(reachedQualified).length },
    { id: 'booked', label: 'Booked', value: cohort.filter((lead) => booked.has(lead.id)).length },
    { id: 'won', label: 'Won', value: cohort.filter((lead) => lead.stage === 'closed' && lead.outcome === 'won').length },
  ]
}

export function AnalyticsView() {
  const leads = useLeads()
  const appointments = useAppointments()
  const { range, loading, change } = useRange(30)

  const current = useMemo(() => summarize(leads, appointments, windowFor(range)), [leads, appointments, range])
  const previous = useMemo(() => (range === 90 ? null : summarize(leads, appointments, windowFor(range, 1))), [leads, appointments, range])
  const series = useMemo(() => dailySeries(leads, appointments, range), [leads, appointments, range])
  const conversion = useMemo(() => conversionTrend(leads, appointments, range), [leads, appointments, range])
  const sources = useMemo(() => sourcePerformance(leads, appointments, windowFor(range)), [leads, appointments, range])
  const funnel = useMemo(() => funnelFor(leads, appointments, range), [leads, appointments, range])

  const vs = priorLabel(range)
  const delta = (now: number, before: number | undefined) => (before === undefined ? undefined : deltaOf(now, before, vs))
  const labels = series.map((point) => fmtDate(point.start))
  const longLabels = series.map((point) => fmtWeekdayDate(point.start))
  const avgConversion = conversion.length ? conversion.reduce((sum, value) => sum + value, 0) / conversion.length : 0
  const maxSource = Math.max(1, ...sources.map((row) => row.leads))
  const note = range === 90 ? 'Sample history starts 90 days back' : undefined

  return (
    <>
      <PageHeader title="Analytics" description={`Follow-up performance for Juniper Row Realty, ${rangeLabel(range)}`}>
        <Segmented label="Date range" options={rangeOptions} value={`${range}` as `${RangeDays}`} onChange={(value) => change(Number(value) as RangeDays)} />
      </PageHeader>

      <div className="app-page" aria-busy={loading}>
        <div className="app-grid app-grid--metrics">
          <Metric index={0} label="New leads" value={fmtNumber(current.newLeads)} delta={delta(current.newLeads, previous?.newLeads)} note={note} loading={loading} />
          <Metric index={1} label="Recovered leads" value={fmtNumber(current.recovered)} delta={delta(current.recovered, previous?.recovered)} emphasis loading={loading} note={note} />
          <Metric index={2} label="Conversations" value={fmtNumber(current.conversations)} delta={delta(current.conversations, previous?.conversations)} note="Two-way, started in range" loading={loading} />
          <Metric index={3} label="Appointments" value={fmtNumber(current.appointments)} delta={delta(current.appointments, previous?.appointments)} note="Booked in range" loading={loading} />
          <Metric
            index={4}
            label="Response rate"
            value={fmtPercent(current.responseRate)}
            delta={previous ? pointsDelta(current.responseRate, previous.responseRate, vs) : undefined}
            note={`${fmtNumber(current.responded)} of ${fmtNumber(current.enrolled)} replied`}
            loading={loading}
          />
          <Metric
            index={5}
            label="Conversion rate"
            value={fmtPercent(current.conversionRate)}
            delta={previous ? pointsDelta(current.conversionRate, previous.conversionRate, vs) : undefined}
            note="New lead → appointment"
            loading={loading}
          />
        </div>

        <div className="app-grid app-grid--main">
          <Panel index={1} title="Lead volume" meta={`New and recovered leads per day, ${rangeLabel(range)}`} className={cx(loading && 'is-refreshing')}>
            <TimeChart
              summary={`${current.newLeads} new leads and ${current.recovered} recovered leads, ${rangeLabel(range)}.`}
              labels={labels}
              longLabels={longLabels}
              height={250}
              series={[
                { id: 'new', label: 'New leads', values: series.map((point) => point.newLeads), tone: 'ink', area: true },
                { id: 'recovered', label: 'Recovered', values: series.map((point) => point.recovered), tone: 'accent', area: true },
              ]}
            />
          </Panel>
          <Panel index={2} title="Follow-up funnel" meta={`Leads that were new or recovered, ${rangeLabel(range)}`} className={cx(loading && 'is-refreshing')}>
            <BarList
              stacked
              label="Follow-up funnel"
              rows={funnel.map((step, index) => ({
                id: step.id,
                label: step.label,
                value: step.value,
                display: index === 0 ? fmtNumber(step.value) : `${fmtNumber(step.value)} · ${fmtPercent(funnel[0].value ? step.value / funnel[0].value : 0)}`,
                highlight: step.id === 'won',
              }))}
            />
            <p className="app-panel-foot ui-meta">Percentages are shares of all new and recovered leads in the range.</p>
          </Panel>
        </div>

        <div className="app-grid app-grid--halves">
          <Panel index={3} title="Conversion trend" meta="Appointments booked per new lead, trailing 7 days" className={cx(loading && 'is-refreshing')}>
            <TimeChart
              summary={`Conversion over ${rangeLabel(range)}, averaging ${fmtPercent(avgConversion)} of new leads booking an appointment.`}
              labels={labels}
              longLabels={longLabels}
              height={200}
              integer={false}
              format={(value) => fmtPercent(value)}
              reference={{ value: avgConversion, label: `Avg ${fmtPercent(avgConversion)}` }}
              series={[{ id: 'conversion', label: 'Conversion', values: conversion, tone: 'ink' }]}
              endLabels={false}
            />
          </Panel>
          <Panel index={4} title="Conversations started" meta={`Leads replying for the first time, per day`} className={cx(loading && 'is-refreshing')}>
            <TimeChart
              kind="columns"
              summary={`${current.conversations} two-way conversations started, ${rangeLabel(range)}.`}
              labels={labels}
              longLabels={longLabels}
              height={200}
              series={[{ id: 'conversations', label: 'Conversations', values: series.map((point) => point.conversations), tone: 'ink' }]}
            />
          </Panel>
        </div>

        <Panel index={5} title="Source performance" meta={`Leads that entered follow-up, ${rangeLabel(range)}`} flush className={cx(loading && 'is-refreshing')}>
          <div className="app-table-wrap">
            <table className="ui-table app-table app-table--stack">
              <caption className="app-sr">Source performance, {rangeLabel(range)}</caption>
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Leads</th>
                  <th scope="col" className="ui-num">
                    Reply rate
                  </th>
                  <th scope="col" className="ui-num">
                    Booked
                  </th>
                  <th scope="col" className="ui-num">
                    Booking rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {sources.map((row) => (
                  <tr key={row.source}>
                    <th scope="row">{sourceLabel[row.source]}</th>
                    <td data-label="Leads" className="app-srccell">
                      <span className="app-inlinebar" aria-hidden="true">
                        <span style={{ width: `${(row.leads / maxSource) * 100}%` }} />
                      </span>
                      <span className="app-srccell__num">{fmtNumber(row.leads)}</span>
                    </td>
                    <td className="ui-num" data-label="Reply rate">
                      {fmtPercent(row.replyRate)}
                    </td>
                    <td className="ui-num" data-label="Booked">
                      {fmtNumber(row.booked)}
                    </td>
                    <td className="ui-num" data-label="Booking rate">
                      {fmtPercent(row.bookRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="app-panel-foot ui-meta">
            CRM and spreadsheet rows are older leads enrolled in re-engagement during the range; their replies are recovered conversations.
          </p>
        </Panel>
      </div>
    </>
  )
}
