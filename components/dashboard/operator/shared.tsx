'use client'

/** Small pieces shared by the operator views. */

import { planById } from '@/content/pricing'
import type { ClientStatus } from '@/content/demo/types'
import type { Health } from '@/content/demo/operator'
import { clientStatusLabel } from '../labels'
import { Badge, type BadgeTone } from '../ui'

export const clientStatusTone: Record<ClientStatus, BadgeTone> = {
  active: 'positive',
  onboarding: 'default',
  paused: 'red',
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <Badge tone={clientStatusTone[status]}>{clientStatusLabel[status]}</Badge>
}

export function PlanBadge({ plan }: { plan: string }) {
  const name = planById(plan)?.name ?? plan
  return <Badge tone={plan === 'enterprise' ? 'ink' : 'plain'}>{name}</Badge>
}

const bandLabel: Record<Health['band'], string> = { healthy: 'Healthy', watch: 'Watch', risk: 'At risk' }

export function HealthMeter({ health, compact = false, hideScore = false }: { health: Health; compact?: boolean; hideScore?: boolean }) {
  return (
    <span className={`op-health op-health--${health.band}`}>
      {!hideScore && <span className="op-health__score">{health.score}</span>}
      <span className="ui-track op-health__track" aria-hidden="true">
        <span style={{ width: `${health.score}%` }} />
      </span>
      {!compact && <span className="op-health__band">{bandLabel[health.band]}</span>}
      {compact && <span className="app-sr">{bandLabel[health.band]}</span>}
    </span>
  )
}

export { bandLabel }
