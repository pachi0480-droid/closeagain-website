'use client'

/** Conversation building blocks shared by the inbox, the lead drawer and the operator views. */

import { Bot, Database, FileText, Mail, MessageSquare, Phone, UserRound } from 'lucide-react'
import { fmtAgo, fmtCurrency, fmtDateYear, fmtDay, fmtStamp, fmtTime, fmtUntil } from '@/content/demo/format'
import { localParts } from '@/content/demo/time'
import type { Channel, Lead, Message, SourceId } from '@/content/demo/types'
import { channelLabel, sourceLabel } from './labels'
import { Avatar, Score, StageBadge, Tag, cx } from './ui'

const DEMO_YEAR = 2026

export function dayLabel(ms: number): string {
  return localParts(ms).year === DEMO_YEAR ? fmtDay(ms) : fmtDateYear(ms)
}

export function ChannelIcon({ channel, size = 14 }: { channel: Channel; size?: number }) {
  const Icon = channel === 'text' ? MessageSquare : channel === 'email' ? Mail : channel === 'call' ? Phone : FileText
  return <Icon aria-hidden="true" size={size} strokeWidth={1.5} />
}

/** Who said the last thing, and what — for list rows. */
export function snippet(lead: Lead): { prefix: string; text: string } {
  const last = lead.thread[lead.thread.length - 1]
  if (last.from === 'lead') return { prefix: '', text: last.body }
  if (last.from === 'closeagain') return { prefix: 'CloseAgain: ', text: last.body }
  return { prefix: `${(last.author ?? 'Team').split(' ')[0]}: `, text: last.body }
}

export function Thread({ lead, compact = false }: { lead: Lead; compact?: boolean }) {
  const groups: Array<{ key: string; label: string; messages: Message[] }> = []
  for (const message of lead.thread) {
    const label = dayLabel(message.at)
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.label === label) lastGroup.messages.push(message)
    else groups.push({ key: message.id, label, messages: [message] })
  }
  return (
    <ol className={cx('app-thread', compact && 'app-thread--compact')} aria-label={`Messages with ${lead.name}`}>
      {groups.map((group) => (
        <li key={group.key} className="app-thread__group">
          <p className="app-thread__day">
            <span>{group.label}</span>
          </p>
          <ol className="app-thread__messages">
            {group.messages.map((message) => (
              <Bubble key={message.id} message={message} lead={lead} />
            ))}
          </ol>
        </li>
      ))}
    </ol>
  )
}

function Bubble({ message, lead }: { message: Message; lead: Lead }) {
  const who = message.from === 'lead' ? lead.name : message.from === 'closeagain' ? 'CloseAgain' : (message.author ?? 'Team')
  const iso = new Date(message.at).toISOString()
  if (message.channel === 'call') {
    return (
      <li className="app-msg app-msg--note">
        <p className="app-msg__meta">
          <Phone aria-hidden="true" size={13} strokeWidth={1.5} />
          <span className="app-msg__who">{who}</span>
          <span className="app-msg__channel">Call note</span>
          <time dateTime={iso}>{fmtTime(message.at)}</time>
        </p>
        <p className="app-msg__note">{message.body.replace(/^Call note:\s*/, '')}</p>
      </li>
    )
  }
  return (
    <li className={cx('app-msg', `app-msg--${message.from}`)}>
      <div className="app-msg__bubble">
        <p>{message.body}</p>
      </div>
      <p className="app-msg__meta">
        {message.from === 'closeagain' && <Bot aria-hidden="true" size={13} strokeWidth={1.5} />}
        <span className="app-msg__who">{who}</span>
        <span className="app-msg__channel">{channelLabel[message.channel]}</span>
        <time dateTime={iso}>{fmtTime(message.at)}</time>
      </p>
    </li>
  )
}

/** When the lead last wrote — the “last reply” in lists — or undefined if they never have. */
export function lastReplyAt(lead: Lead): number | undefined {
  // The first message is the inquiry itself, not a reply to follow-up.
  for (let i = lead.thread.length - 1; i > 0; i--) if (lead.thread[i].from === 'lead') return lead.thread[i].at
  return undefined
}

export function ConversationRow({
  lead,
  selected,
  onSelect,
  client,
  handled,
}: {
  lead: Lead
  selected: boolean
  onSelect: () => void
  client?: string
  handled?: boolean
}) {
  const { prefix, text } = snippet(lead)
  const replied = lastReplyAt(lead)
  return (
    <li>
      <button type="button" className={cx('app-conv', selected && 'is-selected', lead.unread && 'is-unread')} aria-current={selected ? 'true' : undefined} onClick={onSelect}>
        <Avatar name={lead.name} tone={lead.recoveredAt ? 'red' : undefined} />
        <span className="app-conv__body">
          <span className="app-conv__top">
            <span className="app-conv__name">{lead.name}</span>
            <span className="app-conv__time">{fmtStamp(lead.lastContactAt)}</span>
          </span>
          {client && <span className="app-conv__client">{client}</span>}
          <span className="app-conv__snippet">
            {prefix && <span className="app-conv__prefix">{prefix}</span>}
            {text}
          </span>
          <span className="app-conv__tags">
            <StageBadge stage={lead.stage} outcome={lead.outcome} short />
            <span className="app-conv__channel">
              <SourceIcon source={lead.source} />
              {sourceLabel[lead.source]}
            </span>
            {handled && <span className="app-conv__handled">Handled</span>}
          </span>
          <span className="app-conv__next">
            <span className="app-conv__action">
              <span className="app-conv__label">Next</span> {lead.nextAction}
            </span>
            <span className="app-conv__replied">{replied ? `Replied ${fmtAgo(replied)}` : 'No reply yet'}</span>
          </span>
        </span>
        {lead.unread && (
          <span className="app-conv__dot">
            <span className="app-sr">Unread</span>
          </span>
        )}
      </button>
    </li>
  )
}

/** A generic icon for where a lead came from. */
export function SourceIcon({ source, size = 13 }: { source: SourceId; size?: number }) {
  const Icon = source === 'phone' ? Phone : source === 'email' ? Mail : source === 'crm' || source === 'import' ? Database : source === 'referral' ? UserRound : FileText
  return <Icon aria-hidden="true" size={size} strokeWidth={1.5} />
}

/** The key facts about a lead, as a definition list. */
export function LeadFacts({ lead, valueLabel, automationName }: { lead: Lead; valueLabel: string; automationName?: string }) {
  return (
    <dl className="app-facts">
      <div>
        <dt>Source</dt>
        <dd>{sourceLabel[lead.source]}</dd>
      </div>
      <div>
        <dt>Owner</dt>
        <dd>{lead.owner}</dd>
      </div>
      <div>
        <dt>Score</dt>
        <dd>
          <Score value={lead.score} />
        </dd>
      </div>
      <div>
        <dt>{valueLabel}</dt>
        <dd>{fmtCurrency(lead.value)}</dd>
      </div>
      {automationName && (
        <div>
          <dt>Automation</dt>
          <dd>{automationName}</dd>
        </div>
      )}
      <div>
        <dt>Next action</dt>
        <dd>
          {lead.nextAction}
          {lead.nextAt ? <span className="app-facts__when"> · {fmtUntil(lead.nextAt)}</span> : null}
        </dd>
      </div>
    </dl>
  )
}

export function LeadTags({ tags, limit }: { tags: string[]; limit?: number }) {
  const shown = limit ? tags.slice(0, limit) : tags
  const rest = limit ? tags.length - shown.length : 0
  return (
    <span className="app-tags">
      {shown.map((tag) => (
        <Tag key={tag} tone={tag === 'Recovered' ? 'red' : undefined}>
          {tag}
        </Tag>
      ))}
      {rest > 0 && <span className="app-tags__more">+{rest}</span>}
    </span>
  )
}
