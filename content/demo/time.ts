/**
 * The demo's clock. Every relative time in the sample workspace is measured
 * from DEMO_NOW, never from the visitor's clock, so the server render and the
 * browser render always agree.
 *
 * Times display in the sample workspace's timezone, US Eastern. The sample
 * period sits inside daylight time, so a fixed UTC−4 offset is exact and keeps
 * formatting independent of the runtime's timezone data.
 */

export const DEMO_NOW_ISO = '2026-09-24T15:00:00Z'
export const DEMO_NOW = Date.parse(DEMO_NOW_ISO)

export const MINUTE = 60_000
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export const TZ_OFFSET = -4 * HOUR
export const TZ_LABEL = 'ET'

/** Days since the epoch, counted in workspace-local calendar days. */
export const dayIndex = (ms: number) => Math.floor((ms + TZ_OFFSET) / DAY)

/** Epoch ms of local midnight for a day index. */
export const dayStart = (index: number) => index * DAY - TZ_OFFSET

export const TODAY = dayIndex(DEMO_NOW)

export type LocalParts = {
  year: number
  month: number
  date: number
  weekday: number
  hour: number
  minute: number
}

export function localParts(ms: number): LocalParts {
  const d = new Date(ms + TZ_OFFSET)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  }
}

/** Epoch ms for a wall-clock time in the workspace timezone. */
export const atLocal = (year: number, month: number, date: number, hour = 0, minute = 0) =>
  Date.UTC(year, month, date, hour, minute) - TZ_OFFSET

/** Epoch ms for a wall-clock time on a given day index. */
export const atDay = (index: number, hour = 0, minute = 0) => dayStart(index) + hour * HOUR + minute * MINUTE

/** Days between the demo's “now” and a timestamp, in whole local days (past is positive). */
export const daysAgo = (ms: number) => TODAY - dayIndex(ms)
