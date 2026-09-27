'use client'

import { ArrowLeft, Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { fmtAgo, fmtCurrencyCompact, fmtNumber, fmtStamp } from '@/content/demo/format'
import { kits } from '@/content/demo/kits'
import { STAGES, windowFor } from '@/content/demo/metrics'
import type { SourceId, StageId } from '@/content/demo/types'
import { workspaceAutomations, workspaceClient } from '@/content/demo/workspace'
import { ConversationRow, LeadFacts, SourceIcon, Thread, lastReplyAt, snippet } from '../conversation'
import { sourceLabel, stageShort } from '../labels'
import { QueryParams, useReplaceQuery } from '../query'
import { useToast } from '../Toasts'
import { Avatar, EmptyState, PageHeader, Panel, SearchField, Segmented, SelectField, StageBadge, cx } from '../ui'
import { HandledButton, StageSelect } from './StageControls'
import { useClientDemo, useLeads, type LiveLead } from './state'

type View = 'inbox' | 'board'

const BOARD_PAGE = 12
const LIST_PAGE = 40
const kit = kits[workspaceClient.kit]
const SOURCES = Object.keys(sourceLabel) as SourceId[]

export function matchesQuery(lead: LiveLead, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (`${lead.name} ${lead.interest} ${lead.tags.join(' ')} ${lead.email} ${lead.nextAction}`.toLowerCase().includes(q)) return true
  return lead.thread.some((message) => message.body.toLowerCase().includes(q))
}

export function ConversationsView() {
  const { state, dispatch } = useClientDemo()
  const leads = useLeads()
  const replaceQuery = useReplaceQuery()
  const [view, setView] = useState<View>('inbox')
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<'all' | StageId>('all')
  const [source, setSource] = useState<'all' | SourceId>('all')
  const [needsReply, setNeedsReply] = useState(false)
  const [showThread, setShowThread] = useState(false)
  const [limit, setLimit] = useState(LIST_PAGE)

  // Filters that can be linked to, e.g. from “Needs attention”: ?show=needs-reply, ?stage=reengage, ?view=board.
  const onQuery = useCallback(
    (params: URLSearchParams) => {
      const nextStage = params.get('stage') as StageId | null
      const nextSource = params.get('source') as SourceId | null
      setNeedsReply(params.get('show') === 'needs-reply')
      setStage(nextStage && STAGES.includes(nextStage) ? nextStage : 'all')
      setSource(nextSource && SOURCES.includes(nextSource) ? nextSource : 'all')
      setView(params.get('view') === 'board' ? 'board' : 'inbox')
      const lead = params.get('lead')
      if (lead) dispatch({ type: 'select', leadId: lead })
    },
    [dispatch],
  )

  const recent = useMemo(() => {
    const since = windowFor(30).start
    return leads.filter((lead) => lead.lastContactAt >= since)
  }, [leads])
  const filtered = useMemo(
    () =>
      recent.filter(
        (lead) =>
          (stage === 'all' || lead.stage === stage) &&
          (source === 'all' || lead.source === source) &&
          (!needsReply || (lead.unread && !lead.handled)) &&
          matchesQuery(lead, query),
      ),
    [recent, stage, source, needsReply, query],
  )

  const filtersOn = query.trim() !== '' || stage !== 'all' || source !== 'all' || needsReply
  const clearFilters = () => {
    setQuery('')
    setStage('all')
    setSource('all')
    setNeedsReply(false)
    setLimit(LIST_PAGE)
    replaceQuery({ show: null, stage: null, source: null, lead: null })
  }

  const selectedId = state.selected && filtered.some((lead) => lead.id === state.selected) ? state.selected : (filtered[0]?.id ?? null)
  const selected = filtered.find((lead) => lead.id === selectedId) ?? null
  const unreadCount = recent.filter((lead) => lead.unread && !lead.handled).length

  const select = (leadId: string) => {
    dispatch({ type: 'select', leadId })
    dispatch({ type: 'markRead', leadId })
    setShowThread(true)
    // On narrow screens the thread replaces the list: bring it into view.
    if (window.matchMedia('(max-width: 1023.98px)').matches) {
      requestAnimationFrame(() => document.querySelector('.app-inbox')?.scrollIntoView({ block: 'start' }))
    }
  }

  const openFromBoard = (leadId: string) => {
    select(leadId)
    setView('inbox')
    replaceQuery({ view: null })
  }

  const sources = SOURCES.filter((id) => recent.some((lead) => lead.source === id))

  return (
    <>
      <QueryParams onChange={onQuery} />
      <PageHeader
        title="Conversations"
        description={`${fmtNumber(recent.length)} conversations with activity in the last 30 days · ${unreadCount} waiting on a reply`}
      >
        <Segmented
          label="Layout"
          value={view}
          onChange={(next) => {
            setView(next)
            replaceQuery({ view: next === 'board' ? 'board' : null })
          }}
          options={[
            { value: 'inbox', label: 'Inbox' },
            { value: 'board', label: 'Pipeline' },
          ]}
        />
      </PageHeader>

      <div className="app-page">
        <div className="app-filters app-rise" role="search" aria-label="Filter conversations">
          <SearchField value={query} onChange={setQuery} label="Search conversations" placeholder="Search names, messages, tags…" />
          <SelectField
            label="Stage"
            hideLabel
            value={stage}
            onChange={(next) => {
              setStage(next)
              replaceQuery({ stage: next === 'all' ? null : next })
            }}
            options={[{ value: 'all', label: 'All stages' }, ...STAGES.map((id) => ({ value: id, label: stageShort[id] }))]}
          />
          <SelectField
            label="Source"
            hideLabel
            value={source}
            onChange={(next) => {
              setSource(next)
              replaceQuery({ source: next === 'all' ? null : next })
            }}
            options={[{ value: 'all', label: 'All sources' }, ...sources.map((id) => ({ value: id, label: sourceLabel[id] }))]}
          />
          <Segmented
            label="Show"
            size="sm"
            value={needsReply ? 'reply' : 'all'}
            onChange={(value) => {
              setNeedsReply(value === 'reply')
              replaceQuery({ show: value === 'reply' ? 'needs-reply' : null })
            }}
            options={[
              { value: 'all', label: 'All' },
              { value: 'reply', label: 'Needs reply', count: unreadCount },
            ]}
          />
          {filtersOn && (
            <button type="button" className="ui-btn ui-btn--ghost" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          <p className="ui-meta app-filters__count" aria-live="polite">
            {filtered.length === recent.length ? `${fmtNumber(recent.length)} conversations` : `${fmtNumber(filtered.length)} of ${fmtNumber(recent.length)}`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <Panel index={1}>
            <EmptyState
              title={needsReply && !query && stage === 'all' && source === 'all' ? 'Every reply is handled' : 'No conversations match'}
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={clearFilters}>
                  {needsReply ? 'Show all conversations' : 'Clear filters'}
                </button>
              }
            >
              {needsReply
                ? 'Nobody is waiting on a reply right now. New replies land here first.'
                : `Try a different name or stage, or clear the filters to see all ${fmtNumber(recent.length)} conversations.`}
            </EmptyState>
          </Panel>
        ) : view === 'inbox' ? (
          <div className={cx('ui-panel app-inbox app-rise', showThread && 'is-reading')} style={{ '--i': 1 } as CSSProperties}>
            <div className="app-inbox__list">
              <ul className="ui-list" aria-label="Conversations">
                {filtered.slice(0, Math.max(limit, filtered.findIndex((lead) => lead.id === selectedId) + 1)).map((lead) => (
                  <ConversationRow key={lead.id} lead={lead} selected={lead.id === selectedId} handled={lead.handled} onSelect={() => select(lead.id)} />
                ))}
              </ul>
              {filtered.length > limit && (
                <button type="button" className="app-listmore" onClick={() => setLimit(limit + LIST_PAGE)}>
                  Show {Math.min(LIST_PAGE, filtered.length - limit)} more of {fmtNumber(filtered.length - limit)}
                </button>
              )}
            </div>
            {selected && <ThreadPane key={selected.id} lead={selected} onBack={() => setShowThread(false)} />}
          </div>
        ) : (
          <Board leads={filtered} onOpen={openFromBoard} />
        )}
      </div>
    </>
  )
}

function ThreadPane({ lead, onBack }: { lead: LiveLead; onBack: () => void }) {
  const { dispatch } = useClientDemo()
  const notify = useToast()
  const [draft, setDraft] = useState('')
  const [channel, setChannel] = useState<'text' | 'email'>(lead.channel)
  const scrollRef = useRef<HTMLDivElement>(null)
  const automation = workspaceAutomations.find((item) => item.id === lead.automationId)

  // Keep the newest message in view when the conversation or its length changes.
  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [lead.id, lead.thread.length])

  const send = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return
    dispatch({ type: 'reply', leadId: lead.id, body, channel })
    setDraft('')
    notify({ title: `Reply added to ${lead.first}’s thread`, detail: 'In a live workspace this would send by ' + (channel === 'text' ? 'text.' : 'email.') })
  }

  return (
    <section className="app-threadpane" aria-label={`Conversation with ${lead.name}`}>
      <header className="app-threadpane__head">
        <button type="button" className="ui-btn ui-btn--ghost app-threadpane__back" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          All conversations
        </button>
        <div className="app-threadpane__who">
          <Avatar name={lead.name} tone={lead.recoveredAt ? 'red' : undefined} />
          <div className="app-threadpane__titles">
            <h2 className="app-threadpane__name">{lead.name}</h2>
            <p className="ui-meta">
              {lead.interest} · {lead.phone}
            </p>
          </div>
          <StageBadge stage={lead.stage} outcome={lead.outcome} />
        </div>
        <div className="app-threadpane__actions">
          <StageSelect lead={lead} />
          <HandledButton lead={lead} />
        </div>
      </header>
      <div className="app-threadpane__facts">
        <LeadFacts lead={lead} valueLabel={kit.valueLabel} automationName={automation?.name} />
      </div>
      <div className="app-threadpane__scroll" ref={scrollRef} tabIndex={0} aria-label="Message history">
        <Thread lead={lead} />
      </div>
      <form className="app-composer" onSubmit={send}>
        <label className="app-sr" htmlFor={`reply-${lead.id}`}>
          Reply to {lead.name}
        </label>
        <textarea
          id={`reply-${lead.id}`}
          className="ui-input app-textarea app-composer__input"
          rows={2}
          placeholder={`Reply to ${lead.first} as Dana…`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) send(event)
          }}
        />
        <div className="app-composer__bar">
          <SelectField
            label="Send as"
            hideLabel
            value={channel}
            onChange={setChannel}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
            ]}
          />
          <p className="ui-meta app-composer__note">Sample workspace · replies stay in this tab</p>
          <button type="submit" className="ui-btn" disabled={!draft.trim()}>
            <Send aria-hidden="true" />
            Send
          </button>
        </div>
      </form>
    </section>
  )
}

function Board({ leads, onOpen }: { leads: LiveLead[]; onOpen: (leadId: string) => void }) {
  const [limits, setLimits] = useState<Partial<Record<StageId, number>>>({})
  return (
    <div className="app-board app-rise" style={{ '--i': 1 } as CSSProperties}>
      {STAGES.map((stage) => {
        const cards = leads.filter((lead) => lead.stage === stage)
        const limit = limits[stage] ?? BOARD_PAGE
        const headingId = `board-${stage}`
        const value = cards.filter((lead) => lead.outcome !== 'lost').reduce((sum, lead) => sum + lead.value, 0)
        return (
          <section key={stage} className={cx('app-column', `app-column--${stage}`)} aria-labelledby={headingId}>
            <header className="app-column__head">
              <h2 id={headingId} className="app-column__title">
                {stageShort[stage]}
              </h2>
              <span className="app-column__count">{fmtNumber(cards.length)}</span>
            </header>
            {cards.length > 0 && stage !== 'closed' && stage !== 'reengage' && (
              <p className="app-column__meta">{fmtNumber(cards.filter((lead) => lead.unread).length)} unread · {fmtCurrencyCompact(value)} {kit.valueLabel.toLowerCase()}</p>
            )}
            {cards.length === 0 ? (
              <p className="app-column__empty">Nothing here right now.</p>
            ) : (
              <ul className="app-column__list">
                {cards.slice(0, limit).map((lead) => {
                  const { prefix, text } = snippet(lead)
                  const replied = lastReplyAt(lead)
                  return (
                    <li key={lead.id} className={cx('app-card', lead.unread && 'is-unread')}>
                      <button type="button" className="app-card__open" onClick={() => onOpen(lead.id)}>
                        <span className="app-card__top">
                          <span className="app-card__name">{lead.name}</span>
                          <span className="app-card__time">{fmtStamp(lead.lastContactAt)}</span>
                        </span>
                        <span className="app-card__interest">{lead.interest}</span>
                        <span className="app-card__snippet">
                          {prefix && <span className="app-conv__prefix">{prefix}</span>}
                          {text}
                        </span>
                        <span className="app-card__meta">
                          <SourceIcon source={lead.source} />
                          {sourceLabel[lead.source]}
                          <span aria-hidden="true">·</span>
                          {replied ? `replied ${fmtAgo(replied)}` : 'no reply yet'}
                        </span>
                        <span className="app-card__next">
                          <span className="app-conv__label">Next</span> {lead.nextAction}
                        </span>
                        <span className="app-sr">Open conversation</span>
                      </button>
                      <div className="app-card__foot">
                        {lead.stage === 'closed' && <StageBadge stage={lead.stage} outcome={lead.outcome} short />}
                        {lead.unread && (
                          <span className="app-conv__dot app-card__dot">
                            <span className="app-sr">Unread</span>
                          </span>
                        )}
                        <StageSelect lead={lead} compact />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            {cards.length > limit && (
              <button type="button" className="app-column__more" onClick={() => setLimits((current) => ({ ...current, [stage]: limit + BOARD_PAGE }))}>
                Show {Math.min(BOARD_PAGE, cards.length - limit)} more
              </button>
            )}
          </section>
        )
      })}
    </div>
  )
}
