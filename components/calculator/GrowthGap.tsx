'use client'

import { GrowthGapStage } from '@/components/calculator/GrowthGapStage'
import { Ignored } from '@/components/calculator/Ignored'
import { Sensitivity } from '@/components/calculator/Sensitivity'
import { ShareLink } from '@/components/calculator/ShareLink'
import { useCalculatorState } from '@/components/calculator/useCalculatorState'

/**
 * Owns the assumptions. The homepage renders the stage alone; the dedicated
 * route adds the three things a page about the model owes an operator — a
 * shareable URL, the answer across a range of recovery rates, and a plain
 * statement of what the model leaves out.
 */
export function GrowthGap({ full = false }: { full?: boolean }) {
  const { inputs, set } = useCalculatorState({ syncUrl: full })

  return (
    <div>
      <GrowthGapStage inputs={inputs} set={set} />

      {full ? (
        <>
          <div className="mt-10">
            <ShareLink />
          </div>
          <Sensitivity inputs={inputs} />
          <Ignored />
        </>
      ) : null}
    </div>
  )
}
