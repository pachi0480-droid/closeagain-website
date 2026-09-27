'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { clients } from '@/content/demo/clients'
import { fmtAgo, fmtDateYear, fmtNumber, fmtUntil } from '@/content/demo/format'
import { kits } from '@/content/demo/kits'
import { STAGES, windowFor } from '@/content/demo/metrics'
import { allLeads, clientShort } from '@/content/demo/operator'
import type { Lead, SourceId, StageId } from '@/content/demo/types'
import { LeadFacts, LeadTags, Thread } from '../conversation'
import { Dialog } from '../Dialog'
import { sourceLabel, stageLabel } from '../labels'
import { Avatar, EmptyState, PageHeader, Pager, Panel, Score, SearchField, SelectField, SortHeader, StageBadge, type SortState } from '../ui'

type SortKey = 'name' | 'score' | 'last' | 'created'
type Created = 'all' | '7' | '30' | '90'
const PAGE = 25

export function leadMatches(lead: Lead, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return `${lead.name} ${lead.interest} ${lead.tags.join(' ')} ${lead.email}`.toLowerCase().includes(q)
}

export function OperatorLeads() {
  const [query, setQuery] = useState('')
  const [client, setClient] = useState('all')
  const [source, setSource] = useState<'all' | SourceId>('all')
  const [stage, setStage] = useState<'all' | StageId>('all')
  const [created, setCreated] = useState<Created>('30')
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'last', dir: 'desc' })
  const [page, setPage] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const since = created === 'all' ? -Infinity : windowFor(Number(created)).start
    const list = allLeads.filter(
      (lead) =>
        (client === 'all' || lead.clientId === client) &&
        (source === 'all' || lead.source === source) &&
        (stage === 'all' || lead.stage === stage) &&
        lead.createdAt >= since &&
        leadMatches(lead, query),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      if (sort.key === 'name') return a.name.localeCompare(b.name) * dir
      if (sort.key === 'score') return (a.score - b.score) * dir
      if (sort.key === 'created') return (a.createdAt - b.createdAt) * dir
      return (a.lastContactAt - b.lastContactAt) * dir
    })
  }, [query, client, source, stage, created, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const current = Math.min(page, pages - 1)
  const rows = filtered.slice(current * PAGE, (current + 1) * PAGE)
  const reset =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value)
      setPage(0)
    }
  const filtersOn = query.trim() !== '' || client !== 'all' || source !== 'all' || stage !== 'all' || created !== '30'
  const clear = () => {
    setQuery('')
    setClient('all')
    setSource('all')
    setStage('all')
    setCreated('30')
    setPage(0)
  }
  const open = allLeads.find((lead) => lead.id === openId) ?? null
  const thirty = allLeads.filter((lead) => lead.createdAt >= windowFor(30).start).length

  return (
    <>
      <PageHeader title="Leads" description={`${fmtNumber(thirty)} new leads in the last 30 days across ${clients.length} clients`} />
      <div className="app-page">
        <div className="app-filters app-rise" role="search" aria-label="Filter leads">
          <SearchField value={query} onChange={reset(setQuery)} label="Search leads" placeholder="Search name, interest, tag…" />
          <SelectField label="Client" hideLabel value={client} onChange={reset(setClient)} options={[{ value: 'all', label: 'All clients' }, ...clients.map((item) => ({ value: item.id, label: item.name }))]} />
          <SelectField
            label="Source"
            hideLabel
            value={source}
            onChange={reset(setSource)}
            options={[{ value: 'all', label: 'All sources' }, ...(Object.keys(sourceLabel) as SourceId[]).map((id) => ({ value: id, label: sourceLabel[id] }))]}
          />
          <SelectField label="Status" hideLabel value={stage} onChange={reset(setStage)} options={[{ value: 'all', label: 'All statuses' }, ...STAGES.map((id) => ({ value: id, label: stageLabel[id] }))]} />
          <SelectField
            label="Created"
            hideLabel
            value={created}
            onChange={reset(setCreated)}
            options={[
              { value: '7', label: 'Created · 7 days' },
              { value: '30', label: 'Created · 30 days' },
              { value: '90', label: 'Created · 90 days' },
              { value: 'all', label: 'Any time' },
            ]}
          />
          {filtersOn && (
            <button type="button" className="ui-btn ui-btn--ghost" onClick={clear}>
              Reset filters
            </button>
          )}
        </div>

        <Panel index={1} flush>
          {filtered.length === 0 ? (
            <EmptyState
              title="No leads match"
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={clear}>
                  Reset filters
                </button>
              }
            >
              Nothing fits every filter at once.
            </EmptyState>
          ) : (
            <>
              <div className="app-table-wrap">
                <table className="ui-table app-table op-table app-table--stack">
                  <caption className="app-sr">Leads across clients</caption>
                  <thead>
                    <tr>
                      <SortHeader label="Lead" sortKey="name" sort={sort} onSort={setSort} />
                      <th scope="col">Client</th>
                      <th scope="col">Source</th>
                      <SortHeader label="Score" sortKey="score" sort={sort} onSort={setSort} />
                      <th scope="col">Status</th>
                      <SortHeader label="Created" sortKey="created" sort={sort} onSort={setSort} className="app-col--roomy" />
                      <SortHeader label="Last contact" sortKey="last" sort={sort} onSort={setSort} />
                      <th scope="col">Next action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((lead) => (
                      <tr key={lead.id} className="is-clickable" onClick={() => setOpenId(lead.id)}>
                        <th scope="row">
                          <span className="app-leadcell">
                            <Avatar name={lead.name} size="sm" tone={lead.recoveredAt ? 'red' : undefined} />
                            <span className="app-leadcell__text">
                              <button
                                type="button"
                                className="app-rowlink"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  setOpenId(lead.id)
                                }}
                              >
                                <span className="app-cell-title">{lead.name}</span>
                              </button>
                              <span className="app-cell-sub op-trunc">{lead.interest}</span>
                            </span>
                          </span>
                        </th>
                        <td data-label="Client">{clientShort(lead.clientId)}</td>
                        <td data-label="Source">{sourceLabel[lead.source]}</td>
                        <td data-label="Score">
                          <Score value={lead.score} />
                        </td>
                        <td data-label="Status">
                          <StageBadge stage={lead.stage} outcome={lead.outcome} short />
                        </td>
                        <td data-label="Created" className="app-col--roomy">{fmtAgo(lead.createdAt)}</td>
                        <td data-label="Last contact">{fmtAgo(lead.lastContactAt)}</td>
                        <td data-label="Next action" className="app-wrap app-nextcell">
                          <span className="app-cell-title app-cell-title--plain">{lead.nextAction}</span>
                          {lead.nextAt && <span className="app-cell-sub">{fmtUntil(lead.nextAt)}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={current} pageSize={PAGE} total={filtered.length} onPage={setPage} noun="leads" />
            </>
          )}
        </Panel>
      </div>

      <Dialog
        open={open !== null}
        onClose={() => setOpenId(null)}
        variant="drawer"
        eyebrow={open ? `Lead · ${clientShort(open.clientId)}` : 'Lead'}
        title={open?.name ?? ''}
        description={open?.interest}
        footer={
          open && (
            <>
              <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setOpenId(null)}>
                Close
              </button>
              <Link href={`/demo/operator/clients/${open.clientId}`} className="ui-btn">
                Open {clientShort(open.clientId)}
                <ArrowRight aria-hidden="true" />
              </Link>
            </>
          )
        }
      >
        {open && (
          <div className="app-drawer">
            <div className="app-drawer__status">
              <StageBadge stage={open.stage} outcome={open.outcome} />
            </div>
            <section className="app-drawer__section" aria-label="Details">
              <LeadFacts lead={open} valueLabel={kits[clients.find((item) => item.id === open.clientId)?.kit ?? 'real-estate'].valueLabel} />
            </section>
            <section className="app-drawer__section">
              <h3 className="ui-label">Contact · sample details</h3>
              <dl className="app-facts">
                <div>
                  <dt>Email</dt>
                  <dd>{open.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{open.phone}</dd>
                </div>
                <div>
                  <dt>First inquiry</dt>
                  <dd>{fmtDateYear(open.createdAt)}</dd>
                </div>
              </dl>
              <LeadTags tags={open.tags} />
            </section>
            <section className="app-drawer__section">
              <h3 className="ui-label">Conversation · {open.thread.length} messages</h3>
              <Thread lead={open} compact />
            </section>
          </div>
        )}
      </Dialog>
    </>
  )
}
