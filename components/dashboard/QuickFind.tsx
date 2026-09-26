'use client'

import { Search } from 'lucide-react'
import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './ui'

export type FindItem = { id: string; title: string; sub: string; meta?: ReactNode; keywords?: string }

/**
 * A search box with a suggestion list (the ARIA combobox pattern): type to
 * filter, arrow keys to move, Enter to open, Escape to close.
 */
export function QuickFind({
  items,
  label,
  placeholder,
  onPick,
  limit = 7,
}: {
  items: readonly FindItem[]
  label: string
  placeholder?: string
  onPick: (item: FindItem) => void
  limit?: number
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items.filter((item) => `${item.title} ${item.sub} ${item.keywords ?? ''}`.toLowerCase().includes(q)).slice(0, limit)
  }, [items, query, limit])

  const expanded = open && query.trim().length > 0

  const pick = (item: FindItem) => {
    setOpen(false)
    setQuery('')
    onPick(item)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => (results.length ? (index + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      if (expanded && results[active]) {
        event.preventDefault()
        pick(results[active])
      }
    } else if (event.key === 'Escape') {
      if (expanded) {
        event.preventDefault()
        setOpen(false)
      } else {
        setQuery('')
      }
    }
  }

  return (
    <div className="app-find">
      <Search className="app-search__icon" aria-hidden="true" size={16} strokeWidth={1.5} />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        className="ui-input app-search__input"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={`${id}-list`}
        aria-activedescendant={expanded && results[active] ? `${id}-opt-${active}` : undefined}
        placeholder={placeholder ?? label}
        value={query}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
      />
      <ul id={`${id}-list`} role="listbox" aria-label={`${label} results`} className={cx('app-find__list', expanded && 'is-open')}>
        {expanded && results.length === 0 && (
          <li className="app-find__empty" role="presentation">
            No matches for “{query.trim()}”
          </li>
        )}
        {expanded &&
          results.map((item, index) => (
            <li
              key={item.id}
              id={`${id}-opt-${index}`}
              role="option"
              aria-selected={index === active}
              className="app-find__option"
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => pick(item)}
            >
              <span className="app-find__title">{item.title}</span>
              <span className="app-find__sub">{item.sub}</span>
              {item.meta && <span className="app-find__meta">{item.meta}</span>}
            </li>
          ))}
      </ul>
    </div>
  )
}
