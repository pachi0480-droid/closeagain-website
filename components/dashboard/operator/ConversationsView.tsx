'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, type CSSProperties } from 'react'
import { clients } from '@/content/demo/clients'
import { fmtNumber } from '@/content/demo/format'
import { kits } from '@/content/demo/kits'
import { STAGES, windowFor } from '@/content/demo/metrics'
import { allLeads, clientName, clientShort } from '@/content/demo/operator'
import type { Lead, StageId } from '@/content/demo/types'
import { ConversationRow, LeadFacts, Thread } from '../conversation'
import { stageLabel } from '../labels'
import { Avatar, EmptyState, PageHeader, Panel, SearchField, Segmented, SelectField, StageBadge, cx } from '../ui'

const STEP = 60

function matches(lead: Lead, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (`${lead.name} ${lead.interest}`.toLowerCase().includes(q)) return true
  return lead.thread.some((message) => message.body.toLowerCase().includes(q))
}

export function OperatorConversations() {
  const [query, setQuery] = useState('')
  const [client, setClient] = useState('all')
  const [stage, setStage] = useState<'all' | StageId>('all')
  const [needsReply, setNeedsReply] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [limit, setLimit] = useState(STEP)
  const [reading, setReading] = useState(false)

  const recent = useMemo(() => {
    const since = windowFor(30).start
    return allLeads.filter((lead) => lead.lastContactAt >= since && lead.thread.some((message) => message.from === 'lead' && message.at >= since))
  }, [])
  const filtered = useMemo(
    () =>
      recent.filter(
        (lead) => (client === 'all' || lead.clientId === client) && (stage === 'all' || lead.stage === stage) && (!needsReply || lead.unread) && matches(lead, query),
      ),
    [recent, client, stage, needsReply, query],
  )
  const selected = filtered.find((lead) => lead.id === selectedId) ?? filtered[0] ?? null
  const unread = recent.filter((lead) => lead.unread).length
  const filtersOn = query.trim() !== '' || client !== 'all' || stage !== 'all' || needsReply
  const clear = () => {
    setQuery('')
    setClient('all')
    setStage('all')
    setNeedsReply(false)
    setLimit(STEP)
  }

  return (
    <>
      <PageHeader
        title="Conversations"
        description={`${fmtNumber(recent.length)} two-way conversations active in the last 30 days · ${unread} waiting on a client’s reply`}
      />
      <div className="app-page">
        <div className="app-filters app-rise" role="search" aria-label="Filter conversations">
          <SearchField value={query} onChange={setQuery} label="Search conversations" placeholder="Search names and messages…" />
          <SelectField label="Client" hideLabel value={client} onChange={setClient} options={[{ value: 'all', label: 'All clients' }, ...clients.map((item) => ({ value: item.id, label: item.name }))]} />
          <SelectField label="Stage" hideLabel value={stage} onChange={setStage} options={[{ value: 'all', label: 'All stages' }, ...STAGES.map((id) => ({ value: id, label: stageLabel[id] }))]} />
          <Segmented
            label="Show"
            size="sm"
            value={needsReply ? 'reply' : 'all'}
            onChange={(value) => setNeedsReply(value === 'reply')}
            options={[
              { value: 'all', label: 'All' },
              { value: 'reply', label: 'Waiting on client', count: unread },
            ]}
          />
          {filtersOn && (
            <button type="button" className="ui-btn ui-btn--ghost" onClick={clear}>
              Clear filters
            </button>
          )}
          <p className="ui-meta app-filters__count">{fmtNumber(filtered.length)} shown</p>
        </div>

        {filtered.length === 0 ? (
          <Panel index={1}>
            <EmptyState
              title="No conversations match"
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={clear}>
                  Clear filters
                </button>
              }
            />
          </Panel>
        ) : (
          <div className={cx('ui-panel app-inbox app-rise', reading && 'is-reading')} style={{ '--i': 1 } as CSSProperties}>
            <div className="app-inbox__list">
              <ul className="ui-list" aria-label="Conversations">
                {filtered.slice(0, limit).map((lead) => (
                  <ConversationRow
                    key={lead.id}
                    lead={lead}
                    client={clientShort(lead.clientId)}
                    selected={lead.id === selected?.id}
                    onSelect={() => {
                      setSelectedId(lead.id)
                      setReading(true)
                      if (window.matchMedia('(max-width: 1023.98px)').matches) {
                        requestAnimationFrame(() => document.querySelector('.app-inbox')?.scrollIntoView({ block: 'start' }))
                      }
                    }}
                  />
                ))}
              </ul>
              {filtered.length > limit && (
                <button type="button" className="app-listmore" onClick={() => setLimit(limit + STEP)}>
                  Show {Math.min(STEP, filtered.length - limit)} more of {fmtNumber(filtered.length - limit)}
                </button>
              )}
            </div>
            {selected && (
              <section className="app-threadpane" aria-label={`Conversation with ${selected.name}`}>
                <header className="app-threadpane__head">
                  <button type="button" className="ui-btn ui-btn--ghost app-threadpane__back" onClick={() => setReading(false)}>
                    <ArrowLeft aria-hidden="true" />
                    All conversations
                  </button>
                  <div className="app-threadpane__who">
                    <Avatar name={selected.name} tone={selected.recoveredAt ? 'red' : undefined} />
                    <div className="app-threadpane__titles">
                      <h2 className="app-threadpane__name">{selected.name}</h2>
                      <p className="ui-meta">
                        {clientName(selected.clientId)} · {selected.interest}
                      </p>
                    </div>
                    <StageBadge stage={selected.stage} outcome={selected.outcome} />
                  </div>
                  <Link href={`/demo/operator/clients/${selected.clientId}`} className="app-textlink">
                    Open {clientShort(selected.clientId)}
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </header>
                <div className="app-threadpane__facts">
                  <LeadFacts lead={selected} valueLabel={kits[clients.find((item) => item.id === selected.clientId)?.kit ?? 'real-estate'].valueLabel} />
                </div>
                <div className="app-threadpane__scroll" tabIndex={0} aria-label="Message history">
                  <Thread lead={selected} />
                </div>
                <p className="op-readonly">Operators see every client’s conversations read-only. Replies come from the client’s own team.</p>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  )
}
