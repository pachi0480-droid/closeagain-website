/**
 * Formatting for the demo. Hand-rolled on purpose: Intl output differs
 * between ICU versions (spaces before AM/PM, for one), and the server and the
 * browser must print exactly the same characters.
 */

import { DAY, DEMO_NOW, HOUR, MINUTE, TODAY, dayIndex, localParts } from './time.ts'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const group = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/** 1284 → “1,284”. */
export function fmtNumber(value: number, decimals = 0): string {
  const negative = value < 0
  const fixed = Math.abs(value).toFixed(decimals)
  const [whole, fraction] = fixed.split('.')
  return `${negative ? '−' : ''}${group(whole)}${fraction ? `.${fraction}` : ''}`
}

/** 11392 → “$11,392”. */
export function fmtCurrency(value: number): string {
  return `${value < 0 ? '−' : ''}$${fmtNumber(Math.abs(Math.round(value)))}`
}

/** 1240000 → “$1.2M”, 48200 → “$48.2k”. For headline figures only. */
export function fmtCurrencyCompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`
  if (abs >= 10_000) return `${sign}$${(abs / 1000).toFixed(abs >= 100_000 ? 0 : 1)}k`
  return fmtCurrency(value)
}

/** 0.4263 → “43%”. */
export function fmtPercent(ratio: number, decimals = 0): string {
  if (!Number.isFinite(ratio)) return '—'
  return `${(ratio * 100).toFixed(decimals)}%`
}

/** Change between two values as a signed percentage, e.g. “+12%” or “−8%”. */
export function fmtChange(current: number, previous: number): string {
  if (previous === 0) return current === 0 ? '0%' : 'New'
  const change = (current - previous) / previous
  const rounded = Math.round(change * 100)
  if (rounded === 0) return '0%'
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded)}%`
}

/** Change in percentage points, e.g. “+3.1 pts”. */
export function fmtPoints(current: number, previous: number): string {
  const diff = (current - previous) * 100
  if (Math.abs(diff) < 0.05) return '0 pts'
  return `${diff > 0 ? '+' : '−'}${Math.abs(diff).toFixed(1)} pts`
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${fmtNumber(count)} ${count === 1 ? one : many}`
}

/** “3:05 PM” */
export function fmtTime(ms: number): string {
  const { hour, minute } = localParts(ms)
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

/** “3 PM” or “3:30 PM” — compact, for calendars. */
export function fmtTimeShort(ms: number): string {
  const { hour, minute } = localParts(ms)
  const h = hour % 12 === 0 ? 12 : hour % 12
  const suffix = hour < 12 ? 'am' : 'pm'
  return minute === 0 ? `${h}${suffix}` : `${h}:${String(minute).padStart(2, '0')}${suffix}`
}

/** “Sep 24” */
export function fmtDate(ms: number): string {
  const { month, date } = localParts(ms)
  return `${MONTHS[month]} ${date}`
}

/** “Sep 24, 2026” */
export function fmtDateYear(ms: number): string {
  const { month, date, year } = localParts(ms)
  return `${MONTHS[month]} ${date}, ${year}`
}

/** “Thu, Sep 24” */
export function fmtWeekdayDate(ms: number): string {
  const { weekday, month, date } = localParts(ms)
  return `${WEEKDAYS[weekday]}, ${MONTHS[month]} ${date}`
}

/** “Sep 24, 3:05 PM” */
export function fmtDateTime(ms: number): string {
  return `${fmtDate(ms)}, ${fmtTime(ms)}`
}

/** “Today”, “Yesterday”, “Tomorrow”, or “Thu, Sep 24”. */
export function fmtDay(ms: number): string {
  const offset = dayIndex(ms) - TODAY
  if (offset === 0) return 'Today'
  if (offset === -1) return 'Yesterday'
  if (offset === 1) return 'Tomorrow'
  return fmtWeekdayDate(ms)
}

/** “Today, 3:05 PM” */
export function fmtDayTime(ms: number): string {
  return `${fmtDay(ms)}, ${fmtTime(ms)}`
}

/**
 * Inbox-style stamp: the time for today, “Yesterday”, the weekday within the
 * last week, then the date.
 */
export function fmtStamp(ms: number): string {
  const ago = TODAY - dayIndex(ms)
  if (ago <= 0) return fmtTime(ms)
  if (ago === 1) return 'Yesterday'
  if (ago < 7) return WEEKDAYS[localParts(ms).weekday]
  return fmtDate(ms)
}

/** “Just now”, “12m ago”, “3h ago”, “2d ago”, then the date. Future times read “in 20m”. */
export function fmtAgo(ms: number): string {
  const diff = DEMO_NOW - ms
  if (diff < 0) return fmtUntil(ms)
  if (diff < MINUTE) return 'Just now'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`
  const days = TODAY - dayIndex(ms)
  if (days < 7) return `${Math.max(1, days)}d ago`
  return fmtDate(ms)
}

/** “in 20m”, “in 3h”, “Tomorrow 9:00 AM”, “Mon 9:00 AM”, then the date. */
export function fmtUntil(ms: number): string {
  const diff = ms - DEMO_NOW
  if (diff <= 0) return fmtAgo(ms)
  if (diff < HOUR) return `in ${Math.max(1, Math.round(diff / MINUTE))}m`
  const days = dayIndex(ms) - TODAY
  if (days === 0) return `in ${Math.round(diff / HOUR)}h`
  if (days === 1) return `Tomorrow ${fmtTime(ms)}`
  if (days < 7) return `${WEEKDAYS[localParts(ms).weekday]} ${fmtTime(ms)}`
  return fmtDate(ms)
}

/** 45 → “45 min”, 90 → “1 hr 30 min”. */
export function fmtDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

/** “Maya Thompson” → “MT”. */
export function initials(name: string): string {
  const parts = name
    .replace(/[^\p{L}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}
