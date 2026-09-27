'use client'

import { Check, RotateCcw } from 'lucide-react'
import { useId } from 'react'
import type { Outcome, StageId } from '@/content/demo/types'
import { stageLabel } from '../labels'
import { useToast } from '../Toasts'
import { SelectBox, cx } from '../ui'
import { useClientDemo, type LiveLead } from './state'

type StageValue = Exclude<StageId, 'closed'> | 'closed-won' | 'closed-lost'

const options: Array<{ value: StageValue; label: string }> = [
  { value: 'new', label: stageLabel.new },
  { value: 'active', label: stageLabel.active },
  { value: 'qualified', label: stageLabel.qualified },
  { value: 'appointment', label: stageLabel.appointment },
  { value: 'closed-won', label: 'Closed · won' },
  { value: 'closed-lost', label: 'Closed · lost' },
  { value: 'reengage', label: stageLabel.reengage },
]

const toValue = (stage: StageId, outcome?: Outcome): StageValue =>
  stage === 'closed' ? (outcome === 'lost' ? 'closed-lost' : 'closed-won') : stage

/** “Move to stage”: a native select, so it works the same with mouse, keyboard and touch. */
export function StageSelect({ lead, compact = false }: { lead: LiveLead; compact?: boolean }) {
  const id = useId()
  const { dispatch } = useClientDemo()
  const notify = useToast()
  return (
    <div className={cx('app-stageselect', compact && 'app-stageselect--compact')}>
      <label htmlFor={id} className={compact ? 'app-sr' : 'app-stageselect__label'}>
        {compact ? `Move ${lead.name} to stage` : 'Move to stage'}
      </label>
      <SelectBox>
        <select
          id={id}
          className="ui-input app-select"
          value={toValue(lead.stage, lead.outcome)}
          onChange={(event) => {
            const value = event.target.value as StageValue
            const stage: StageId = value.startsWith('closed') ? 'closed' : (value as StageId)
            const outcome: Outcome | undefined = value === 'closed-won' ? 'won' : value === 'closed-lost' ? 'lost' : undefined
            dispatch({ type: 'moveStage', leadId: lead.id, stage, outcome })
            notify({ title: `${lead.name} moved to ${options.find((option) => option.value === value)?.label}` })
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </SelectBox>
    </div>
  )
}

export function HandledButton({ lead }: { lead: LiveLead }) {
  const { dispatch } = useClientDemo()
  const notify = useToast()
  return (
    <button
      type="button"
      className={cx('ui-btn', lead.handled ? 'ui-btn--quiet' : 'ui-btn--quiet app-btn-handled')}
      aria-pressed={lead.handled}
      onClick={() => {
        dispatch({ type: 'setHandled', leadId: lead.id, handled: !lead.handled })
        notify({
          title: lead.handled ? `Reopened ${lead.name}` : `Marked ${lead.name} as handled`,
          tone: lead.handled ? 'info' : 'success',
        })
      }}
    >
      {lead.handled ? <RotateCcw aria-hidden="true" /> : <Check aria-hidden="true" />}
      {lead.handled ? 'Reopen' : 'Mark as handled'}
    </button>
  )
}
