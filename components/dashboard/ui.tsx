'use client'

/**
 * Small building blocks for the product demo, on top of the shared `.ui-*`
 * primitives in styles/product.css. Visual rules live in styles/dashboard.css.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useId, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { fmtNumber, initials } from '@/content/demo/format'
import type { Outcome, StageId } from '@/content/demo/types'
import { stageLabel, stageShort } from './labels'

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

// ── Surfaces ──────────────────────────────────────────────────────────────

export function Panel({
  title,
  meta,
  actions,
  children,
  className,
  bodyClassName,
  flush = false,
  index = 0,
}: {
  title?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  /** Body without padding, for lists and tables that run edge to edge. */
  flush?: boolean
  /** Position in the page, to stagger the entrance slightly. */
  index?: number
}) {
  const id = useId()
  return (
    <section
      className={cx('ui-panel app-panel app-rise', className)}
      aria-labelledby={title ? id : undefined}
      style={{ '--i': index } as CSSProperties}
    >
      {title && (
        <header className="ui-panel__head app-panel__head">
          <div className="app-panel__titles">
            <h2 id={id} className="ui-panel__title">
              {title}
            </h2>
            {meta && <p className="ui-meta app-panel__meta">{meta}</p>}
          </div>
          {actions && <div className="app-panel__actions">{actions}</div>}
        </header>
      )}
      <div className={cx(flush ? 'app-panel__flush' : 'ui-panel__body', bodyClassName)}>{children}</div>
    </section>
  )
}

export function PageHeader({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__text">
        <h1 className="app-title">{title}</h1>
        {description && <p className="app-desc">{description}</p>}
      </div>
      {children && <div className="app-topbar__actions">{children}</div>}
    </header>
  )
}

// ── Figures ───────────────────────────────────────────────────────────────

export type Delta = { text: string; tone: 'up' | 'down' | 'flat'; label?: string }

export function Metric({
  label,
  value,
  delta,
  note,
  chart,
  loading = false,
  emphasis = false,
  index = 0,
}: {
  label: string
  value: ReactNode
  delta?: Delta
  note?: ReactNode
  chart?: ReactNode
  loading?: boolean
  /** A vermilion keyline, for the one figure the page is about. */
  emphasis?: boolean
  index?: number
}) {
  return (
    <div className={cx('ui-panel app-metric app-rise', emphasis && 'app-metric--emphasis')} style={{ '--i': index } as CSSProperties}>
      <p className="ui-label app-metric__label">{label}</p>
      {loading ? (
        <div className="app-metric__loading" aria-hidden="true">
          <span className="ui-skeleton" style={{ width: '62%', height: '1.9rem' }} />
          <span className="ui-skeleton" style={{ width: '44%', height: '0.8rem' }} />
        </div>
      ) : (
        <>
          <p className="ui-metric app-metric__value">{value}</p>
          <div className="app-metric__foot">
            {delta && (
              <span className={cx('ui-delta', delta.tone === 'up' && 'ui-delta--up', delta.tone === 'down' && 'ui-delta--down')}>
                {delta.tone === 'up' ? <ArrowUp aria-hidden="true" size={13} strokeWidth={1.75} /> : null}
                {delta.tone === 'down' ? <ArrowDown aria-hidden="true" size={13} strokeWidth={1.75} /> : null}
                {delta.text}
                {delta.label && <span className="app-metric__vs">{delta.label}</span>}
              </span>
            )}
            {note && <span className="ui-meta app-metric__note">{note}</span>}
          </div>
          {chart && <div className="app-metric__chart">{chart}</div>}
        </>
      )}
    </div>
  )
}

/** Delta between two counts, with direction and whether up is good. */
export function deltaOf(current: number, previous: number, label = 'vs prior period', upIsGood = true): Delta | undefined {
  if (previous === 0) return undefined
  const change = Math.round(((current - previous) / previous) * 100)
  if (change === 0) return { text: '0%', tone: 'flat', label }
  const good = change > 0 === upIsGood
  return { text: `${change > 0 ? '+' : '−'}${Math.abs(change)}%`, tone: good ? 'up' : 'down', label }
}

export function pointsDelta(current: number, previous: number, label = 'vs prior period'): Delta {
  const diff = (current - previous) * 100
  if (Math.abs(diff) < 0.05) return { text: '0 pts', tone: 'flat', label }
  return { text: `${diff > 0 ? '+' : '−'}${Math.abs(diff).toFixed(1)} pts`, tone: diff > 0 ? 'up' : 'down', label }
}

// ── Badges and people ─────────────────────────────────────────────────────

export type BadgeTone = 'default' | 'red' | 'ink' | 'positive' | 'caution' | 'cold' | 'outline' | 'plain'

export function Badge({ tone = 'default', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'ui-badge',
        tone === 'outline' ? 'app-badge--outline' : tone !== 'default' && `ui-badge--${tone}`,
        className,
      )}
    >
      {children}
    </span>
  )
}

const stageTone: Record<StageId, BadgeTone> = {
  new: 'ink',
  active: 'default',
  qualified: 'outline',
  appointment: 'positive',
  closed: 'cold',
  reengage: 'red',
}

export function StageBadge({ stage, outcome, short = false }: { stage: StageId; outcome?: Outcome; short?: boolean }) {
  if (stage === 'closed') {
    const text = outcome === 'won' ? (short ? 'Won' : 'Closed · won') : short ? 'Lost' : 'Closed · lost'
    return <Badge tone={outcome === 'won' ? 'positive' : 'cold'}>{text}</Badge>
  }
  return <Badge tone={stageTone[stage]}>{short ? stageShort[stage] : stageLabel[stage]}</Badge>
}

export function Avatar({ name, size = 'md', tone }: { name: string; size?: 'sm' | 'md'; tone?: 'red' | 'ink' }) {
  return (
    <span
      className={cx('ui-avatar', size === 'sm' && 'ui-avatar--sm', tone === 'red' && 'ui-avatar--red', tone === 'ink' && 'app-avatar--ink')}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export function Tag({ children, tone }: { children: ReactNode; tone?: 'red' }) {
  return <span className={cx('app-tag', tone === 'red' && 'app-tag--red')}>{children}</span>
}

/** Score as a number with a short bar. */
export function Score({ value }: { value: number }) {
  return (
    <span className="app-score">
      <span className="app-score__num">{value}</span>
      <span className="ui-track app-score__track" aria-hidden="true">
        <span style={{ width: `${value}%`, background: value >= 80 ? 'var(--ink)' : value >= 50 ? 'var(--ink-3)' : 'var(--line-strong)' }} />
      </span>
    </span>
  )
}

// ── Controls ──────────────────────────────────────────────────────────────

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  describedBy,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  disabled?: boolean
  describedBy?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className="app-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="app-switch__thumb" aria-hidden="true" />
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size,
}: {
  options: ReadonlyArray<{ value: T; label: ReactNode; count?: number }>
  value: T
  onChange: (value: T) => void
  label: string
  size?: 'sm'
}) {
  return (
    <div className={cx('ui-tabs app-segmented', size === 'sm' && 'app-segmented--sm')} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="ui-tab"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className="app-segmented__count">{option.count}</span>}
        </button>
      ))}
    </div>
  )
}

/** Tabs with the full keyboard pattern: arrows, Home and End move between tabs. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  idBase,
}: {
  tabs: ReadonlyArray<{ id: T; label: string; count?: number }>
  value: T
  onChange: (value: T) => void
  label: string
  idBase: string
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    if (next < 0) return
    event.preventDefault()
    onChange(tabs[next].id)
    refs.current[next]?.focus()
  }
  return (
    <div className="app-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className="app-tab"
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
            {tab.count !== undefined && <span className="app-tab__count">{tab.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ idBase, id, children }: { idBase: string; id: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`${idBase}-panel-${id}`} aria-labelledby={`${idBase}-tab-${id}`} tabIndex={0} className="app-tabpanel">
      {children}
    </div>
  )
}

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cx('app-search', className)}>
      <Search className="app-search__icon" aria-hidden="true" size={16} strokeWidth={1.5} />
      <input
        type="search"
        className="ui-input app-search__input"
        aria-label={label}
        placeholder={placeholder ?? label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="app-search__clear" aria-label="Clear search" onClick={() => onChange('')}>
          <X aria-hidden="true" size={14} strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hideLabel = false,
  className,
  disabled,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
  hideLabel?: boolean
  className?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className={cx('app-field', hideLabel && 'app-field--inline', className)}>
      <label htmlFor={id} className={hideLabel ? 'app-sr' : 'app-field__label'}>
        {label}
      </label>
      <SelectBox>
        <select id={id} className="ui-input app-select" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as T)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </SelectBox>
    </div>
  )
}

/** A native select with a drawn chevron that follows the theme. */
export function SelectBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('app-selectbox', className)}>
      {children}
      <ChevronDown className="app-selectbox__icon" aria-hidden="true" size={14} strokeWidth={1.75} />
    </span>
  )
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  required,
  autoComplete,
  placeholder,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email'
  error?: string
  hint?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  multiline?: boolean
}) {
  const id = useId()
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('app-field', error && 'app-field--error')}>
      <label htmlFor={id} className="app-field__label">
        {label}
        {required && <span className="app-field__req"> (required)</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className="ui-input app-textarea"
          value={value}
          rows={3}
          aria-invalid={Boolean(error)}
          aria-describedby={described}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="ui-input"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={described}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="app-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="app-field__error">
          {error}
        </p>
      )}
    </div>
  )
}

// ── Lists ─────────────────────────────────────────────────────────────────

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ui-empty app-empty">
      <p className="ui-empty__title">{title}</p>
      {children && <p className="app-empty__body">{children}</p>}
      {action}
    </div>
  )
}

export function Pager({
  page,
  pageSize,
  total,
  onPage,
  noun = 'results',
}: {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
  noun?: string
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)
  return (
    <nav className="app-pager" aria-label="Pagination">
      <p className="ui-meta" aria-live="polite">
        {total === 0 ? `No ${noun}` : `${fmtNumber(from)}–${fmtNumber(to)} of ${fmtNumber(total)} ${noun}`}
      </p>
      <div className="app-pager__buttons">
        <button type="button" className="ui-btn ui-btn--quiet app-iconbtn" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
        <span className="ui-meta app-pager__page">
          {page + 1} / {pages}
        </span>
        <button type="button" className="ui-btn ui-btn--quiet app-iconbtn" disabled={page >= pages - 1} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}

export type SortState<K extends string> = { key: K; dir: 'asc' | 'desc' }

export function SortHeader<K extends string>({
  label,
  sortKey,
  sort,
  onSort,
  numeric = false,
  className,
}: {
  label: string
  sortKey: K
  sort: SortState<K>
  onSort: (next: SortState<K>) => void
  numeric?: boolean
  className?: string
}) {
  const active = sort.key === sortKey
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cx(numeric && 'ui-num', className)}>
      <button
        type="button"
        className={cx('app-sort', active && 'app-sort--active')}
        onClick={() => onSort({ key: sortKey, dir: active && sort.dir === 'desc' ? 'asc' : 'desc' })}
      >
        {label}
        <Icon aria-hidden="true" size={13} strokeWidth={1.75} />
      </button>
    </th>
  )
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="app-sr">{children}</span>
}
