'use client'

import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { fmtAgo, fmtDateYear, fmtDayTime, fmtNumber, fmtUntil } from '@/content/demo/format'
import { kits } from '@/content/demo/kits'
import { STAGES, windowFor } from '@/content/demo/metrics'
import type { SourceId, StageId } from '@/content/demo/types'
import { workspaceAutomations, workspaceClient } from '@/content/demo/workspace'
import { LeadFacts, LeadTags, Thread } from '../conversation'
import { Dialog } from '../Dialog'
import { appointmentStatusLabel, sourceLabel, stageShort } from '../labels'
import { QueryParams, useReplaceQuery } from '../query'
import { Avatar, Badge, EmptyState, PageHeader, Pager, Panel, Score, SearchField, Segmented, SelectField, SortHeader, StageBadge, type SortState } from '../ui'
import { matchesQuery } from './ConversationsView'
import { HandledButton, StageSelect } from './StageControls'
import { useAppointments, useClientDemo, useLeads, type LiveLead } from './state'

type SortKey = 'name' | 'score' | 'last' | 'created'
type ScoreBand = 'all' | 'hot' | 'warm' | 'cold'
type Created = 'all' | '7' | '30' | '90'

const PAGE_SIZE = 20
const kit = kits[workspaceClient.kit]

export function LeadsView() {
  const leads = useLeads()
  const [query, setQuery] = useState('')
  const [source, setSource] = useState<'all' | SourceId>('all')
  const [stage, setStage] = useState<'all' | StageId>('all')
  const [score, setScore] = useState<ScoreBand>('all')
  const [created, setCreated] = useState<Created>('all')
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'last', dir: 'desc' })
  const [page, setPage] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [recoveredOnly, setRecoveredOnly] = useState(false)
  const replaceQuery = useReplaceQuery()

  // Linkable filters: ?show=recovered, ?status=appointment, ?source=phone, ?score=hot, ?lead=<id>.
  const onQuery = useCallback((params: URLSearchParams) => {
    const status = params.get('status') as StageId | null
    const from = params.get('source') as SourceId | null
    const band = params.get('score') as ScoreBand | null
    setRecoveredOnly(params.get('show') === 'recovered')
    setStage(status && STAGES.includes(status) ? status : 'all')
    setSource(from && from in sourceLabel ? from : 'all')
    setScore(band && ['hot', 'warm', 'cold'].includes(band) ? band : 'all')
    setPage(0)
    const lead = params.get('lead')
    if (lead) setOpenId(lead)
  }, [])

  const filtered = useMemo(() => {
    const since = created === 'all' ? -Infinity : windowFor(Number(created)).start
    const list = leads.filter(
      (lead) =>
        (source === 'all' || lead.source === source) &&
        (stage === 'all' || lead.stage === stage) &&
        (score === 'all' || (score === 'hot' ? lead.score >= 80 : score === 'warm' ? lead.score >= 50 && lead.score < 80 : lead.score < 50)) &&
        (!recoveredOnly || lead.recoveredAt !== undefined) &&
        lead.createdAt >= since &&
        matchesQuery(lead, query),
    )
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case 'name':
          return a.name.localeCompare(b.name) * dir
        case 'score':
          return (a.score - b.score) * dir
        case 'created':
          return (a.createdAt - b.createdAt) * dir
        default:
          return (a.lastContactAt - b.lastContactAt) * dir
      }
    })
  }, [leads, source, stage, score, created, query, sort, recoveredOnly])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)
  const filtersOn = query.trim() !== '' || source !== 'all' || stage !== 'all' || score !== 'all' || created !== 'all' || recoveredOnly
  const withReset =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value)
      setPage(0)
    }
  const clearFilters = () => {
    setQuery('')
    setSource('all')
    setStage('all')
    setScore('all')
    setCreated('all')
    setRecoveredOnly(false)
    setPage(0)
    replaceQuery({ show: null, status: null, source: null, score: null, lead: null })
  }
  const recoveredCount = leads.filter((lead) => lead.recoveredAt !== undefined).length

  const newThisMonth = leads.filter((lead) => lead.createdAt >= windowFor(30).start).length
  const open = leads.find((lead) => lead.id === openId) ?? null

  return (
    <>
      <QueryParams onChange={onQuery} />
      <PageHeader
        title="Leads"
        description={`${fmtNumber(leads.length)} leads · ${fmtNumber(newThisMonth)} new in the last 30 days · includes older leads imported for re-engagement`}
      />

      <div className="app-page">
        <div className="app-filters app-rise" role="search" aria-label="Filter leads">
          <SearchField value={query} onChange={withReset(setQuery)} label="Search leads" placeholder="Search name, interest, tag…" />
          <SelectField
            label="Source"
            hideLabel
            value={source}
            onChange={withReset(setSource)}
            options={[{ value: 'all', label: 'All sources' }, ...(Object.keys(sourceLabel) as SourceId[]).map((id) => ({ value: id, label: sourceLabel[id] }))]}
          />
          <SelectField
            label="Status"
            hideLabel
            value={stage}
            onChange={withReset(setStage)}
            options={[{ value: 'all', label: 'All statuses' }, ...STAGES.map((id) => ({ value: id, label: stageShort[id] }))]}
          />
          <SelectField
            label="Lead score"
            hideLabel
            value={score}
            onChange={withReset(setScore)}
            options={[
              { value: 'all', label: 'Any score' },
              { value: 'hot', label: 'Hot · 80+' },
              { value: 'warm', label: 'Warm · 50–79' },
              { value: 'cold', label: 'Cool · under 50' },
            ]}
          />
          <SelectField
            label="Created"
            hideLabel
            value={created}
            onChange={withReset(setCreated)}
            options={[
              { value: 'all', label: 'Created any time' },
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
            ]}
          />
          <Segmented
            label="Show"
            size="sm"
            value={recoveredOnly ? 'recovered' : 'all'}
            onChange={(value) => {
              setRecoveredOnly(value === 'recovered')
              setPage(0)
              replaceQuery({ show: value === 'recovered' ? 'recovered' : null })
            }}
            options={[
              { value: 'all', label: 'All' },
              { value: 'recovered', label: 'Recovered', count: recoveredCount },
            ]}
          />
          {filtersOn && (
            <button type="button" className="ui-btn ui-btn--ghost" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          <p className="ui-meta app-filters__count" aria-live="polite">
            {filtered.length === leads.length ? `${fmtNumber(leads.length)} leads` : `${fmtNumber(filtered.length)} of ${fmtNumber(leads.length)}`}
          </p>
        </div>

        <Panel index={1} flush>
          {filtered.length === 0 ? (
            <EmptyState
              title="No leads match these filters"
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={clearFilters}>
                  Clear filters
                </button>
              }
            >
              Nothing fits every filter at once. Clear them to see all {fmtNumber(leads.length)} leads.
            </EmptyState>
          ) : (
            <>
              <div className="app-table-wrap">
                <table className="ui-table app-table app-table--stack app-leads-table">
                  <caption className="app-sr">Leads, sorted by {sort.key === 'last' ? 'last contact' : sort.key}</caption>
                  <thead>
                    <tr>
                      <SortHeader label="Lead" sortKey="name" sort={sort} onSort={setSort} />
                      <th scope="col">Source</th>
                      <SortHeader label="Score" sortKey="score" sort={sort} onSort={setSort} />
                      <th scope="col">Status</th>
                      <SortHeader label="Last contact" sortKey="last" sort={sort} onSort={setSort} />
                      <th scope="col">Next action</th>
                      <th scope="col">Tags</th>
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
                              <span className="app-cell-sub">{lead.interest}</span>
                            </span>
                          </span>
                        </th>
                        <td data-label="Source">{sourceLabel[lead.source]}</td>
                        <td data-label="Score">
                          <Score value={lead.score} />
                        </td>
                        <td data-label="Status">
                          <StageBadge stage={lead.stage} outcome={lead.outcome} short />
                        </td>
                        <td data-label="Last contact">{fmtAgo(lead.lastContactAt)}</td>
                        <td data-label="Next action" className="app-wrap app-nextcell">
                          <span className="app-cell-title app-cell-title--plain">{lead.nextAction}</span>
                          {lead.nextAt && <span className="app-cell-sub">{fmtUntil(lead.nextAt)}</span>}
                        </td>
                        <td data-label="Tags" className="app-wrap">
                          <LeadTags tags={lead.tags} limit={2} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={current} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} noun="leads" />
            </>
          )}
        </Panel>
      </div>

      <LeadDrawer lead={open} onClose={() => setOpenId(null)} />
    </>
  )
}

export function LeadDrawer({ lead, onClose }: { lead: LiveLead | null; onClose: () => void }) {
  const { dispatch } = useClientDemo()
  const appointments = useAppointments()
  const appointment = lead?.appointmentId ? appointments.find((item) => item.id === lead.appointmentId) : undefined
  const automation = lead ? workspaceAutomations.find((item) => item.id === lead.automationId) : undefined

  return (
    <Dialog
      open={lead !== null}
      onClose={onClose}
      variant="drawer"
      eyebrow="Lead"
      title={lead?.name ?? ''}
      description={lead?.interest}
      footer={
        lead && (
          <>
            <button type="button" className="ui-btn ui-btn--quiet" onClick={onClose}>
              Close
            </button>
            <Link href="/demo/conversations" className="ui-btn" onClick={() => dispatch({ type: 'select', leadId: lead.id })}>
              Open in inbox
              <ArrowRight aria-hidden="true" />
            </Link>
          </>
        )
      }
    >
      {lead && (
        <div className="app-drawer">
          <div className="app-drawer__status">
            <StageBadge stage={lead.stage} outcome={lead.outcome} />
            {lead.recoveredAt && <Badge tone="red">Recovered {fmtAgo(lead.recoveredAt)}</Badge>}
            {lead.handled && <Badge tone="positive">Handled</Badge>}
          </div>
          <div className="app-drawer__actions">
            <StageSelect lead={lead} />
            <HandledButton lead={lead} />
          </div>

          <section className="app-drawer__section" aria-label="Details">
            <LeadFacts lead={lead} valueLabel={kit.valueLabel} automationName={automation?.name} />
          </section>

          <section className="app-drawer__section">
            <h3 className="ui-label">Contact · sample details</h3>
            <dl className="app-facts">
              <div>
                <dt>Email</dt>
                <dd>{lead.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{lead.phone}</dd>
              </div>
              <div>
                <dt>First inquiry</dt>
                <dd>{fmtDateYear(lead.createdAt)}</dd>
              </div>
            </dl>
          </section>

          {lead.tags.length > 0 && (
            <section className="app-drawer__section">
              <h3 className="ui-label">Tags</h3>
              <LeadTags tags={lead.tags} />
            </section>
          )}

          {appointment && (
            <section className="app-drawer__section">
              <h3 className="ui-label">Appointment</h3>
              <div className="app-drawer__appt">
                <CalendarDays aria-hidden="true" />
                <span>
                  <span className="app-cell-title">
                    {appointment.type} · {fmtDayTime(appointment.start)}
                  </span>
                  <span className="app-cell-sub">
                    {appointment.location} · with {appointment.host} · {appointmentStatusLabel[appointment.status]}
                  </span>
                </span>
              </div>
            </section>
          )}

          <section className="app-drawer__section">
            <h3 className="ui-label">Conversation history · {lead.thread.length} messages</h3>
            <div className="app-drawer__thread" style={{ '--i': 0 } as CSSProperties}>
              <Thread lead={lead} compact />
            </div>
          </section>
        </div>
      )}
    </Dialog>
  )
}
