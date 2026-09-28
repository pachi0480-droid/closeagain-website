'use client'

import { useState, type ReactNode } from 'react'
import type { PlanId } from '@/content/pricing'
import { PlanFinder } from './PlanFinder'

/**
 * The plan finder and the plan cards, connected: the answer picked above
 * marks its card below as the best match and lets the others step back. The
 * cards themselves stay server-rendered (children); only the match is state.
 */
export function TierSystem({ children }: { children: ReactNode }) {
  const [match, setMatch] = useState<PlanId | null>(null)
  return (
    <>
      <PlanFinder selected={match} onSelect={setMatch} />
      <div className="tier-stage" data-match={match ?? undefined}>
        {children}
      </div>
    </>
  )
}
