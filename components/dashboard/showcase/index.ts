/**
 * The homepage dashboard showcase.
 *
 *   ≥1024px:  <DashboardShowcase active={area} />   one composed screen, scaled to fit
 *   <1024px:  <DashboardSnippet area={area} />      one readable card per area
 *
 * Both are decorative, share the demo's sample numbers, and load only
 * styles/showcase.css, part of the site stylesheet (never the demo's
 * dashboard.css).
 */

export { DashboardShowcase } from './DashboardShowcase'
export { DashboardSnippet } from './DashboardSnippet'
export type { ShowcaseArea } from '@/content/demo/types'

/** The six areas, in the order the dashboard's navigation lists them. */
export const showcaseAreas = ['overview', 'conversations', 'leads', 'appointments', 'automations', 'analytics'] as const
