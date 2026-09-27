/**
 * Small pieces shared by the homepage showcase and its phone-sized snippets.
 * Plain markup on the global `.ui-*` primitives (styles/product.css) and
 * styles/showcase.css — never the demo's own stylesheet.
 */

import { CalendarDays, ChartLine, LayoutDashboard, MessagesSquare, Plug, Settings, Users, Workflow, type LucideIcon } from 'lucide-react'
import type { ShowcaseArea, ShowcaseData, ShowcaseTone } from '@/content/demo/types'

export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

/** The client dashboard's navigation, in the demo's order. */
export const NAV: ReadonlyArray<{ id: ShowcaseArea | 'integrations' | 'settings'; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'conversations', label: 'Conversations', icon: MessagesSquare },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'analytics', label: 'Analytics', icon: ChartLine },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export const AREA_LABEL: Record<ShowcaseArea, string> = {
  overview: 'Overview',
  conversations: 'Conversations',
  leads: 'Leads',
  automations: 'Automations',
  appointments: 'Appointments',
  analytics: 'Analytics',
}

const toneClass: Record<ShowcaseTone, string | false> = {
  default: false,
  ink: 'ui-badge--ink',
  outline: 'showcase-badge--outline',
  positive: 'ui-badge--positive',
  cold: 'ui-badge--cold',
  red: 'ui-badge--red',
}

export function Tone({ tone, children }: { tone: ShowcaseTone; children: string }) {
  return <span className={cx('ui-badge', toneClass[tone])}>{children}</span>
}

/** Daily new and recovered leads as stacked columns, drawn once as SVG. */
export function TrendBars({ trend, height, labels = true }: { trend: ShowcaseData['trend']; height: number; labels?: boolean }) {
  const count = trend.newLeads.length
  const width = 600
  const slot = width / count
  const bar = Math.min(12, slot * 0.58)
  const y = (value: number) => (value / trend.top) * (height - 4)
  const ticks = [0, trend.top / 2, trend.top]
  const axis = [0, Math.round(count / 3), Math.round((2 * count) / 3), count - 1]
  return (
    <div className="showcase-trend">
      <svg className="showcase-trend__svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ height }} aria-hidden="true" focusable="false">
        {ticks.map((tick) => (
          <line key={tick} x1="0" x2={width} y1={height - y(tick)} y2={height - y(tick)} className={tick === 0 ? 'showcase-trend__base' : 'showcase-trend__grid'} vectorEffect="non-scaling-stroke" />
        ))}
        {trend.newLeads.map((value, index) => {
          const recovered = trend.recovered[index]
          const x = index * slot + (slot - bar) / 2
          return (
            <g key={index}>
              {value > 0 && <rect className="showcase-trend__new" x={x} width={bar} y={height - y(value)} height={y(value)} />}
              {recovered > 0 && <rect className="showcase-trend__recovered" x={x} width={bar} y={height - y(value + recovered)} height={y(recovered)} />}
            </g>
          )
        })}
      </svg>
      {labels && (
        <div className="showcase-trend__axis" aria-hidden="true">
          {axis.map((index) => (
            <span key={index} style={{ left: `${((index + 0.5) / count) * 100}%` }}>
              {trend.labels[index]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
