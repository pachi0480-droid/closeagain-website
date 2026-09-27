'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { fmtAgo, fmtCurrency, fmtDateYear, fmtNumber, fmtPercent } from '@/content/demo/format'
import type { ClientRow } from '@/content/demo/operator'
import { plans, priceLabel } from '@/content/pricing'
import type { ClientStatus, Industry } from '@/content/demo/types'
import { clientStatusLabel } from '../labels'
import { EmptyState, PageHeader, Panel, SearchField, SelectField, SortHeader, cx, type SortState } from '../ui'
import { ClientStatusBadge, HealthMeter, PlanBadge, bandLabel } from './shared'
import { useClientRows } from './state'

type SortKey = 'name' | 'mrr' | 'since' | 'leads' | 'response' | 'health'
type Band = 'all' | ClientRow['health']['band']

export function ClientsView() {
  const router = useRouter()
  const rows = useClientRows()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | ClientStatus>('all')
  const [plan, setPlan] = useState<string>('all')
  const [industry, setIndustry] = useState<'all' | Industry>('all')
  const [band, setBand] = useState<Band>('all')
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'mrr', dir: 'desc' })

  const industries = Array.from(new Set(rows.map((row) => row.client.industry)))
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = rows.filter(
      (row) =>
        (status === 'all' || row.client.status === status) &&
        (plan === 'all' || row.client.plan === plan) &&
        (industry === 'all' || row.client.industry === industry) &&
        (band === 'all' || row.health.band === band) &&
        (!q || `${row.client.name} ${row.client.location} ${row.client.industry} ${row.client.team.map((person) => person.name).join(' ')}`.toLowerCase().includes(q)),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return a.client.name.localeCompare(b.client.name) * dir
        case 'since':
          return (a.client.since - b.client.since) * dir
        case 'leads':
          return (a.current.newLeads - b.current.newLeads) * dir
        case 'response':
          return (a.current.responseRate - b.current.responseRate) * dir
        case 'health':
          return (a.health.score - b.health.score) * dir
        default:
          return (a.mrr - b.mrr) * dir
      }
    })
  }, [rows, query, status, plan, industry, band, sort])

  const filtersOn = query.trim() !== '' || status !== 'all' || plan !== 'all' || industry !== 'all' || band !== 'all'
  const clear = () => {
    setQuery('')
    setStatus('all')
    setPlan('all')
    setIndustry('all')
    setBand('all')
  }

  const segments: Array<{ label: string; count: number; active: boolean; onClick: () => void }> = [
    { label: 'Active', count: rows.filter((row) => row.client.status === 'active').length, active: status === 'active', onClick: () => setStatus(status === 'active' ? 'all' : 'active') },
    { label: 'Onboarding', count: rows.filter((row) => row.client.status === 'onboarding').length, active: status === 'onboarding', onClick: () => setStatus(status === 'onboarding' ? 'all' : 'onboarding') },
    { label: 'Paused', count: rows.filter((row) => row.client.status === 'paused').length, active: status === 'paused', onClick: () => setStatus(status === 'paused' ? 'all' : 'paused') },
    { label: 'At risk', count: rows.filter((row) => row.health.band === 'risk').length, active: band === 'risk', onClick: () => setBand(band === 'risk' ? 'all' : 'risk') },
  ]

  return (
    <>
      <PageHeader title="Clients" description={`${rows.length} client workspaces · ${fmtCurrency(rows.reduce((sum, row) => sum + row.mrr, 0))} MRR`} />
      <div className="app-page">
        <div className="op-segments app-rise" role="group" aria-label="Quick filters">
          {segments.map((segment) => (
            <button key={segment.label} type="button" className={cx('op-segment', segment.active && 'is-active')} aria-pressed={segment.active} onClick={segment.onClick}>
              <span className="op-segment__count">{segment.count}</span>
              <span className="op-segment__label">{segment.label}</span>
            </button>
          ))}
        </div>

        <div className="app-filters app-rise" role="search" aria-label="Filter clients">
          <SearchField value={query} onChange={setQuery} label="Search clients" placeholder="Search name, city, contact…" />
          <SelectField
            label="Status"
            hideLabel
            value={status}
            onChange={setStatus}
            options={[{ value: 'all', label: 'All statuses' }, ...(['active', 'onboarding', 'paused'] as const).map((value) => ({ value, label: clientStatusLabel[value] }))]}
          />
          <SelectField label="Plan" hideLabel value={plan} onChange={setPlan} options={[{ value: 'all', label: 'All plans' }, ...plans.map((item) => ({ value: item.id, label: item.name }))]} />
          <SelectField
            label="Industry"
            hideLabel
            value={industry}
            onChange={setIndustry}
            options={[{ value: 'all', label: 'All industries' }, ...industries.map((value) => ({ value, label: value }))]}
          />
          <SelectField
            label="Health"
            hideLabel
            value={band}
            onChange={setBand}
            options={[{ value: 'all', label: 'Any health' }, ...(['healthy', 'watch', 'risk'] as const).map((value) => ({ value, label: bandLabel[value] }))]}
          />
          {filtersOn && (
            <button type="button" className="ui-btn ui-btn--ghost" onClick={clear}>
              Clear filters
            </button>
          )}
        </div>

        <Panel index={1} flush>
          {filtered.length === 0 ? (
            <EmptyState
              title="No clients match"
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={clear}>
                  Clear filters
                </button>
              }
            >
              No client fits every filter at once.
            </EmptyState>
          ) : (
            <div className="app-table-wrap">
              <table className="ui-table app-table op-table app-table--stack">
                <caption className="app-sr">Client workspaces</caption>
                <thead>
                  <tr>
                    <SortHeader label="Client" sortKey="name" sort={sort} onSort={setSort} />
                    <th scope="col">Status</th>
                    <th scope="col">Plan</th>
                    <SortHeader label="MRR" sortKey="mrr" sort={sort} onSort={setSort} numeric />
                    <SortHeader label="Client since" sortKey="since" sort={sort} onSort={setSort} className="app-col--roomy" />
                    <th scope="col" className="ui-num">
                      Users
                    </th>
                    <SortHeader label="Leads · 30d" sortKey="leads" sort={sort} onSort={setSort} numeric />
                    <SortHeader label="Reply rate" sortKey="response" sort={sort} onSort={setSort} numeric />
                    <SortHeader label="Health" sortKey="health" sort={sort} onSort={setSort} />
                    <th scope="col">
                      <span className="app-sr">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.client.id} className="is-clickable" onClick={() => router.push(`/demo/operator/clients/${row.client.id}`)}>
                      <th scope="row">
                        <span className="app-cell-title">{row.client.name}</span>
                        <span className="app-cell-sub">
                          {row.client.industry} · {row.client.location}
                        </span>
                      </th>
                      <td data-label="Status">
                        <ClientStatusBadge status={row.client.status} />
                      </td>
                      <td data-label="Plan">
                        <PlanBadge plan={row.client.plan} />
                        {row.client.plan === 'enterprise' && <span className="app-cell-sub">Sample contract</span>}
                      </td>
                      <td className="ui-num" data-label="MRR">
                        {row.mrr ? fmtCurrency(row.mrr) : '—'}
                      </td>
                      <td data-label="Client since" className="app-col--roomy">{fmtDateYear(row.client.since)}</td>
                      <td className="ui-num" data-label="Users">
                        {row.client.team.length}
                      </td>
                      <td className="ui-num" data-label="Leads · 30d">
                        {fmtNumber(row.current.newLeads)}
                      </td>
                      <td className="ui-num" data-label="Reply rate">
                        {fmtPercent(row.current.responseRate)}
                      </td>
                      <td data-label="Health">
                        <HealthMeter health={row.health} />
                      </td>
                      <td className="app-autotable__edit">
                        <Link href={`/demo/operator/clients/${row.client.id}`} className="app-textlink" onClick={(event) => event.stopPropagation()}>
                          Open
                          <span className="app-sr"> {row.client.name}</span>
                          <ArrowRight aria-hidden="true" size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="app-panel-foot ui-meta">
            MRR is each plan’s list price from the pricing page ({plans
              .filter((item) => item.monthly)
              .map((item) => `${item.name} ${priceLabel(item)}`)
              .join(', ')}
            ); Enterprise uses its sample contract value. Paused accounts are not billed. Latest activity across all clients: {fmtAgo(Math.max(...rows.map((row) => row.lastActivity)))}.
          </p>
        </Panel>
      </div>
    </>
  )
}
