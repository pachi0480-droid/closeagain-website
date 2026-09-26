'use client'

import { ArrowRight, CircleAlert, Info, Library, TriangleAlert, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { fmtAgo, fmtCurrency, fmtNumber, fmtPercent } from '@/content/demo/format'
import { summarize, windowFor, within, type Summary } from '@/content/demo/metrics'
import { datasets, type ClientRow } from '@/content/demo/operator'
import { BarList } from '../charts'
import { priorLabel, rangeLabel, rangeOptions, useRange, type RangeDays } from '../hooks'
import { QuickFind } from '../QuickFind'
import { Metric, PageHeader, Panel, Segmented, SortHeader, cx, deltaOf, type SortState } from '../ui'
import { ClientStatusBadge, HealthMeter, PlanBadge } from './shared'
import { useAlerts, useClientRows, useOperator } from './state'

type Measure = 'leads' | 'recovered' | 'appointments' | 'response'
type SortKey = 'name' | 'mrr' | 'leads' | 'conversations' | 'appointments' | 'recovered' | 'health' | 'activity'

const sum = (list: Summary[], key: keyof Summary) => list.reduce((total, item) => total + (item[key] as number), 0)

export function useRangeSummaries(rows: ClientRow[], range: RangeDays) {
  return useMemo(() => {
    const current = new Map<string, Summary>()
    const previous = new Map<string, Summary>()
    for (const row of rows) {
      const { leads, appointments } = datasets[row.client.id]
      current.set(row.client.id, range === 30 ? row.current : summarize(leads, appointments, windowFor(range)))
      if (range !== 90) previous.set(row.client.id, range === 30 ? row.previous : summarize(leads, appointments, windowFor(range, 1)))
    }
    return { current, previous }
  }, [rows, range])
}

export function OperatorOverview() {
  const router = useRouter()
  const { dispatch } = useOperator()
  const rows = useClientRows()
  const alerts = useAlerts()
  const { range, loading, change } = useRange(30)
  const [measure, setMeasure] = useState<Measure>('leads')
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'mrr', dir: 'desc' })
  const { current, previous } = useRangeSummaries(rows, range)

  const currents = [...current.values()]
  const previousList = [...previous.values()]
  const hasPrevious = previousList.length > 0
  const vs = priorLabel(range)
  const delta = (key: keyof Summary) => (hasPrevious ? deltaOf(sum(currents, key), sum(previousList, key), vs) : undefined)

  const mrr = rows.reduce((total, row) => total + row.mrr, 0)
  const billing = rows.filter((row) => row.client.status !== 'paused')
  const period = windowFor(range)
  const newClients = rows.filter((row) => within(row.client.since, period))
  const averageHealth = Math.round(rows.reduce((total, row) => total + row.health.score, 0) / rows.length)
  const bands = { healthy: 0, watch: 0, risk: 0 }
  for (const row of rows) bands[row.health.band]++
  const atRisk = rows.filter((row) => row.health.band === 'risk')

  const value = (id: string, which: Map<string, Summary>) => {
    const s = which.get(id)
    if (!s) return undefined
    return measure === 'leads' ? s.newLeads : measure === 'recovered' ? s.recovered : measure === 'appointments' ? s.appointments : s.responseRate
  }
  const bars = rows
    .map((row) => ({ row, now: value(row.client.id, current) ?? 0, before: value(row.client.id, previous) }))
    .sort((a, b) => b.now - a.now)
  const format = (n: number) => (measure === 'response' ? fmtPercent(n) : fmtNumber(n))

  const sorted = useMemo(() => {
    const dir = sort.dir === 'asc' ? 1 : -1
    const metric = (row: ClientRow) => {
      const s = current.get(row.client.id)
      switch (sort.key) {
        case 'name':
          return row.client.name
        case 'mrr':
          return row.mrr
        case 'leads':
          return s?.newLeads ?? 0
        case 'conversations':
          return s?.conversations ?? 0
        case 'appointments':
          return s?.appointments ?? 0
        case 'recovered':
          return s?.recovered ?? 0
        case 'health':
          return row.health.score
        default:
          return row.lastActivity
      }
    }
    return [...rows].sort((a, b) => {
      const x = metric(a)
      const y = metric(b)
      return (typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y) : (x as number) - (y as number)) * dir
    })
  }, [rows, sort, current])

  return (
    <>
      <PageHeader title="Overview" description={`Every client workspace at a glance · ${rangeLabel(range)}`}>
        <QuickFind
          label="Find a client"
          placeholder="Find a client…"
          items={rows.map((row) => ({ id: row.client.id, title: row.client.name, sub: `${row.client.industry} · ${row.client.location}`, keywords: row.client.plan }))}
          onPick={(item) => router.push(`/demo/operator/clients/${item.id}`)}
        />
        <Segmented label="Date range" options={rangeOptions} value={`${range}` as `${RangeDays}`} onChange={(next) => change(Number(next) as RangeDays)} />
        <Link href="/demo/operator/templates" className="ui-btn">
          <Library aria-hidden="true" />
          Deploy a template
        </Link>
      </PageHeader>

      <div className="app-page" aria-busy={loading}>
        <div className="app-grid app-grid--metrics op-kpis">
          <Metric index={0} label="MRR" value={fmtCurrency(mrr)} note={`${billing.length} billing accounts · plan prices`} loading={loading} />
          <Metric
            index={1}
            label="Active clients"
            value={`${billing.length} of ${rows.length}`}
            note={`${rows.length - billing.length} paused · ${rows.filter((row) => row.client.status === 'onboarding').length} onboarding`}
            loading={loading}
          />
          <Metric index={2} label="New clients" value={fmtNumber(newClients.length)} note={newClients.map((row) => row.client.short).join(', ') || rangeLabel(range)} loading={loading} />
          <Metric index={3} label="Total leads" value={fmtNumber(sum(currents, 'newLeads'))} delta={delta('newLeads')} loading={loading} />
          <Metric index={4} label="Recovered leads" value={fmtNumber(sum(currents, 'recovered'))} delta={delta('recovered')} emphasis loading={loading} />
          <Metric index={5} label="Conversations" value={fmtNumber(sum(currents, 'conversations'))} delta={delta('conversations')} note="Two-way" loading={loading} />
          <Metric index={6} label="Appointments" value={fmtNumber(sum(currents, 'appointments'))} delta={delta('appointments')} note="Booked" loading={loading} />
          <Metric index={7} label="Usage" value={fmtNumber(sum(currents, 'messagesSent'))} delta={delta('messagesSent')} note="Automated messages sent" loading={loading} />
          <Metric index={8} label="Client health" value={`${averageHealth}`} note={`${bands.healthy} healthy · ${bands.watch} watch · ${bands.risk} at risk`} loading={loading} />
          <Metric index={9} label="Churn risk" value={fmtNumber(atRisk.length)} note={atRisk.map((row) => row.client.short).join(', ') || 'No accounts at risk'} loading={loading} />
        </div>

        <div className="app-grid app-grid--main">
          <Panel
            index={1}
            title="Client performance"
            meta={`${rangeLabel(range)}${hasPrevious ? ` · tick marks the prior ${range} days` : ''}`}
            className={cx(loading && 'is-refreshing')}
            actions={
              <Segmented
                label="Measure"
                size="sm"
                value={measure}
                onChange={setMeasure}
                options={[
                  { value: 'leads', label: 'Leads' },
                  { value: 'recovered', label: 'Recovered' },
                  { value: 'appointments', label: 'Appointments' },
                  { value: 'response', label: 'Reply rate' },
                ]}
              />
            }
          >
            <BarList
              label={`Client performance: ${measure}`}
              format={format}
              previousLabel={`Prior ${range} days`}
              max={measure === 'response' ? 1 : undefined}
              rows={bars.map(({ row, now, before }) => ({
                id: row.client.id,
                label: (
                  <Link href={`/demo/operator/clients/${row.client.id}`} className="op-barlink">
                    {row.client.short}
                  </Link>
                ),
                sub: row.client.industry,
                value: now,
                previous: before,
                highlight: measure === 'recovered',
              }))}
            />
          </Panel>

          <Panel index={2} title="Alerts" meta={alerts.length ? `${alerts.length} need a look` : 'All clear'} flush>
            {alerts.length === 0 ? (
              <p className="app-panel-note">No open alerts. Dismissed alerts come back when you reset the demo.</p>
            ) : (
              <ul className="ui-list op-alerts">
                {alerts.map((alert, index) => {
                  const Icon = alert.severity === 'critical' ? CircleAlert : alert.severity === 'warning' ? TriangleAlert : Info
                  return (
                    <li key={alert.id} className={cx('ui-row op-alert', `op-alert--${alert.severity}`, index === 0 && alert.severity === 'critical' && 'is-primary')}>
                      <Icon className="op-alert__icon" aria-hidden="true" size={17} />
                      <span className="op-alert__text">
                        <Link href={alert.href} className="op-alert__title">
                          {alert.title}
                        </Link>
                        <span className="app-cell-sub">{alert.detail}</span>
                      </span>
                      <button type="button" className="app-tool" aria-label={`Dismiss: ${alert.title}`} onClick={() => dispatch({ type: 'dismissAlert', id: alert.id })}>
                        <X size={15} aria-hidden="true" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <Panel
          index={3}
          title="Clients"
          meta={`${rows.length} workspaces · ${rangeLabel(range)}`}
          flush
          className={cx(loading && 'is-refreshing')}
          actions={
            <Link href="/demo/operator/clients" className="app-textlink">
              Manage clients
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          }
        >
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table app-table--stack">
              <caption className="app-sr">Clients, {rangeLabel(range)}</caption>
              <thead>
                <tr>
                  <SortHeader label="Client" sortKey="name" sort={sort} onSort={setSort} />
                  <th scope="col">Status</th>
                  <th scope="col">Plan</th>
                  <SortHeader label="MRR" sortKey="mrr" sort={sort} onSort={setSort} numeric />
                  <SortHeader label="Leads" sortKey="leads" sort={sort} onSort={setSort} numeric />
                  <SortHeader label="Conv." sortKey="conversations" sort={sort} onSort={setSort} numeric />
                  <SortHeader label="Appts." sortKey="appointments" sort={sort} onSort={setSort} numeric />
                  <SortHeader label="Recovered" sortKey="recovered" sort={sort} onSort={setSort} numeric />
                  <SortHeader label="Health" sortKey="health" sort={sort} onSort={setSort} />
                  <SortHeader label="Last activity" sortKey="activity" sort={sort} onSort={setSort} />
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => {
                  const s = current.get(row.client.id)
                  return (
                    <tr key={row.client.id} className="is-clickable" onClick={() => router.push(`/demo/operator/clients/${row.client.id}`)}>
                      <th scope="row">
                        <Link href={`/demo/operator/clients/${row.client.id}`} className="app-rowlink" onClick={(event) => event.stopPropagation()}>
                          <span className="app-cell-title">{row.client.name}</span>
                        </Link>
                        <span className="app-cell-sub">{row.client.industry}</span>
                      </th>
                      <td data-label="Status">
                        <ClientStatusBadge status={row.client.status} />
                      </td>
                      <td data-label="Plan">
                        <PlanBadge plan={row.client.plan} />
                      </td>
                      <td className="ui-num" data-label="MRR">
                        {row.mrr ? fmtCurrency(row.mrr) : '—'}
                      </td>
                      <td className="ui-num" data-label="Leads">
                        {fmtNumber(s?.newLeads ?? 0)}
                      </td>
                      <td className="ui-num" data-label="Conversations">
                        {fmtNumber(s?.conversations ?? 0)}
                      </td>
                      <td className="ui-num" data-label="Appointments">
                        {fmtNumber(s?.appointments ?? 0)}
                      </td>
                      <td className="ui-num" data-label="Recovered">
                        <span className={cx((s?.recovered ?? 0) > 0 && 'app-num-red')}>{fmtNumber(s?.recovered ?? 0)}</span>
                      </td>
                      <td data-label="Health">
                        <HealthMeter health={row.health} compact />
                      </td>
                      <td data-label="Last activity">{fmtAgo(row.lastActivity)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}
