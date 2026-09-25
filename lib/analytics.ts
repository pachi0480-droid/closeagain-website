/**
 * Analytics boundary.
 *
 * No provider is installed. This exists so instrumentation is already in the
 * right places: point `track` at whatever tool gets chosen and every event on
 * the site starts reporting without touching a component.
 */

export type AnalyticsEvent =
  | 'hero_cta_clicked'
  /** Chapter two: which lead scenario the visitor chose to watch. */
  | 'scenario_selected'
  /** Chapter four: the radar. */
  | 'radar_filtered'
  | 'radar_signal_selected'
  /** Chapter six: the growth-gap model. */
  | 'calculator_started'
  | 'calculator_input_changed'
  | 'calculator_completed'
  /** Chapter seven. */
  | 'industry_selected'
  /** Chapter eight. */
  | 'pricing_cta_clicked'
  | 'faq_opened'
  | 'early_access_started'
  | 'early_access_submitted'
  | 'early_access_failed'
  | 'nav_cta_clicked'
  | 'mobile_menu_opened'

type Props = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === 'undefined') return

  // Forwarded to a tag manager if one is ever added.
  window.dataLayer?.push({ event, ...props })

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, props)
  }
}

/** Fires an event at most once per page load. Used for scroll-triggered views. */
const seen = new Set<string>()

export function trackOnce(event: AnalyticsEvent, props: Props = {}): void {
  const key = `${event}:${JSON.stringify(props)}`
  if (seen.has(key)) return
  seen.add(key)
  track(event, props)
}
