'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { fmtDate, fmtNumber, fmtPercent, fmtWeekdayDate } from '@/content/demo/format'
import { dailySeries, summarize, windowFor, type Summary } from '@/content/demo/metrics'
import { allAppointments, allLeads } from '@/content/demo/operator'
import type { Industry } from '@/content/demo/types'
import { BarList, TimeChart } from '../charts'
import { priorLabel, rangeLabel, rangeOptions, useRange, type RangeDays } from '../hooks'
import { Metric, PageHeader, Panel, Segmented, cx, deltaOf, pointsDelta } from '../ui'
import { useRangeSummaries } from './OverviewView'
import { useClientRows } from './state'

const add = (a: Summary[], key: 'newLeads' | 'recovered' | 'conversations' | 'appointments' | 'messagesSent' | 'enrolled' | 'responded' | 'converted') =>
  a.reduce((sum, item) => sum + item[key], 0)

export function OperatorAnalytics() {
  const rows = useClientRows()
  const { range, loading, change } = useRange(30)
  const { current, previous } = useRangeSummaries(rows, range)
  const series = useMemo(() => dailySeries(allLeads, allAppointments, range), [range])
  const platform = useMemo(() => summarize(allLeads, allAppointments, windowFor(range)), [range])
  const before = useMemo(() => (range === 90 ? null : summarize(allLeads, allAppointments, windowFor(range, 1))), [range])

  const vs = priorLabel(range)
  const delta = (now: number, then: number | undefined) => (then === undefined ? undefined : deltaOf(now, then, vs))

  const byIndustry = useMemo(() => {
    const groups = new Map<Industry, Summary[]>()
    for (const row of rows) {
      const s = current.get(row.client.id)
      if (!s) continue
      groups.set(row.client.industry, [...(groups.get(row.client.industry) ?? []), s])
    }
    return [...groups.entries()]
      .map(([industry, list]) => ({
        industry,
        clients: list.length,
        rate: add(list, 'enrolled') ? add(list, 'responded') / add(list, 'enrolled') : 0,
        recovered: add(list, 'recovered'),
      }))
      .sort((a, b) => b.rate - a.rate)
  }, [rows, current])

  return (
    <>
      <PageHeader title="Analytics" description={`Platform-wide follow-up performance, ${rangeLabel(range)}`}>
        <Segmented label="Date range" options={rangeOptions} value={`${range}` as `${RangeDays}`} onChange={(value) => change(Number(value) as RangeDays)} />
      </PageHeader>
      <div className="app-page" aria-busy={loading}>
        <div className="app-grid app-grid--metrics">
          <Metric index={0} label="New leads" value={fmtNumber(platform.newLeads)} delta={delta(platform.newLeads, before?.newLeads)} loading={loading} />
          <Metric index={1} label="Recovered" value={fmtNumber(platform.recovered)} delta={delta(platform.recovered, before?.recovered)} emphasis loading={loading} />
          <Metric index={2} label="Conversations" value={fmtNumber(platform.conversations)} delta={delta(platform.conversations, before?.conversations)} loading={loading} />
          <Metric index={3} label="Appointments" value={fmtNumber(platform.appointments)} delta={delta(platform.appointments, before?.appointments)} loading={loading} />
          <Metric
            index={4}
            label="Response rate"
            value={fmtPercent(platform.responseRate)}
            delta={before ? pointsDelta(platform.responseRate, before.responseRate, vs) : undefined}
            loading={loading}
          />
          <Metric index={5} label="Messages sent" value={fmtNumber(platform.messagesSent)} delta={delta(platform.messagesSent, before?.messagesSent)} loading={loading} />
        </div>

        <div className="app-grid app-grid--main">
          <Panel index={1} title="Platform activity" meta={`New and recovered leads per day, all clients, ${rangeLabel(range)}`} className={cx(loading && 'is-refreshing')}>
            <TimeChart
              summary={`${platform.newLeads} new leads and ${platform.recovered} recovered leads across all clients, ${rangeLabel(range)}.`}
              labels={series.map((point) => fmtDate(point.start))}
              longLabels={series.map((point) => fmtWeekdayDate(point.start))}
              height={250}
              series={[
                { id: 'new', label: 'New leads', values: series.map((point) => point.newLeads), tone: 'ink', area: true },
                { id: 'recovered', label: 'Recovered', values: series.map((point) => point.recovered), tone: 'accent', area: true },
              ]}
            />
          </Panel>
          <Panel index={2} title="Reply rate by industry" meta={rangeLabel(range)} className={cx(loading && 'is-refreshing')}>
            <BarList
              stacked
              label="Reply rate by industry"
              max={1}
              format={(value) => fmtPercent(value)}
              rows={byIndustry.map((row) => ({
                id: row.industry,
                label: row.industry,
                sub: `${row.clients} ${row.clients === 1 ? 'client' : 'clients'} · ${fmtNumber(row.recovered)} recovered`,
                value: row.rate,
              }))}
            />
          </Panel>
        </div>

        <Panel index={3} title="By client" meta={rangeLabel(range)} flush className={cx(loading && 'is-refreshing')}>
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table app-table--stack">
              <caption className="app-sr">Performance by client, {rangeLabel(range)}</caption>
              <thead>
                <tr>
                  <th scope="col">Client</th>
                  <th scope="col" className="ui-num">
                    New leads
                  </th>
                  <th scope="col" className="ui-num">
                    Recovered
                  </th>
                  <th scope="col" className="ui-num">
                    Reply rate
                  </th>
                  <th scope="col" className="ui-num">
                    Conversion
                  </th>
                  <th scope="col" className="ui-num">
                    Appointments
                  </th>
                  <th scope="col" className="ui-num">
                    vs prior
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const s = current.get(row.client.id)
                  const p = previous.get(row.client.id)
                  if (!s) return null
                  const change = p && p.newLeads ? Math.round(((s.newLeads - p.newLeads) / p.newLeads) * 100) : null
                  return (
                    <tr key={row.client.id}>
                      <th scope="row">
                        <Link href={`/demo/operator/clients/${row.client.id}`} className="app-rowlink">
                          <span className="app-cell-title">{row.client.name}</span>
                        </Link>
                        <span className="app-cell-sub">{row.client.industry}</span>
                      </th>
                      <td className="ui-num" data-label="New leads">
                        {fmtNumber(s.newLeads)}
                      </td>
                      <td className="ui-num" data-label="Recovered">
                        <span className={cx(s.recovered > 0 && 'app-num-red')}>{fmtNumber(s.recovered)}</span>
                      </td>
                      <td className="ui-num" data-label="Reply rate">
                        {fmtPercent(s.responseRate)}
                      </td>
                      <td className="ui-num" data-label="Conversion">
                        {fmtPercent(s.conversionRate)}
                      </td>
                      <td className="ui-num" data-label="Appointments">
                        {fmtNumber(s.appointments)}
                      </td>
                      <td className="ui-num" data-label="Leads vs prior">
                        {change === null ? '—' : <span className={cx(change >= 0 ? 'op-up' : 'op-down')}>{`${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change)}%`}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="app-panel-foot ui-meta">Totals add up across clients: {fmtNumber(add([...current.values()], 'newLeads'))} new leads and {fmtNumber(add([...current.values()], 'recovered'))} recovered in the range.</p>
        </Panel>
      </div>
    </>
  )
}
