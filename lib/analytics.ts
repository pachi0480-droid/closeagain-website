/**
 * Analytics boundary.
 *
 * No provider is installed. This exists so instrumentation is already in the
 * right places: point `track` at whatever tool gets chosen and every event on
 * the site starts reporting without touching a component.
 */

export type AnalyticsEvent =
  | 'hero_cta_clicked'
  | 'hero_sequence_completed'
  | 'leak_moment_viewed'
  | 'recovery_loop_stage_viewed'
  | 'recovery_feed_scenario_changed'
  | 'calculator_started'
  | 'calculator_input_changed'
  | 'calculator_completed'
  | 'pricing_cta_clicked'
  | 'pricing_plan_focused'
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
