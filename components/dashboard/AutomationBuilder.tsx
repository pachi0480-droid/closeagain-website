'use client'

/**
 * The automation builder: a vertical flow of steps that can be added,
 * reordered (buttons, not drag), edited and removed. Edits stay in a draft
 * until saved, so a visitor can discard them.
 */

import {
  ArrowDown,
  ArrowUp,
  Clock,
  GitBranch,
  LoaderCircle,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  Send,
  Trash2,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ActionKind, ConditionCheck, Step, StepKind, TriggerEvent } from '@/content/demo/types'
import { actionLabel, conditionLabel, describeStep, stepKindLabel, triggerLabel } from './labels'
import { cx, SelectField, Switch } from './ui'

const kindIcon: Record<StepKind, LucideIcon> = {
  trigger: Zap,
  wait: Clock,
  message: MessageSquare,
  condition: GitBranch,
  action: Send,
}

let created = 0
const newId = () => `new-${Date.now().toString(36)}-${++created}`

function defaultStep(kind: Exclude<StepKind, 'trigger'>): Step {
  switch (kind) {
    case 'wait':
      return { id: newId(), kind, amount: 1, unit: 'days' }
    case 'message':
      return { id: newId(), kind, channel: 'text', body: '' }
    case 'condition':
      return { id: newId(), kind, check: 'replied' }
    case 'action':
      return { id: newId(), kind, action: 'notify-team' }
  }
}

/** When each message goes out, counting waits from the trigger. */
function timings(steps: Step[]): Record<string, string> {
  let minutes = 0
  let before = false
  const out: Record<string, string> = {}
  for (const step of steps) {
    if (step.kind === 'wait') {
      const size = step.unit === 'minutes' ? 1 : step.unit === 'hours' ? 60 : 1440
      if (step.before) {
        before = true
        minutes = step.amount * size
      } else {
        minutes += step.amount * size
      }
    }
    if (step.kind === 'message') {
      if (before) out[step.id] = minutes >= 1440 ? `${Math.round(minutes / 1440)}d before` : `${Math.round(minutes / 60)}h before`
      else if (minutes === 0) out[step.id] = 'Right away'
      else if (minutes < 60) out[step.id] = `+${minutes} min`
      else if (minutes < 1440) out[step.id] = `+${Math.round(minutes / 60)} hr`
      else out[step.id] = `Day ${Math.round((minutes / 1440) * 10) / 10}`
    }
  }
  return out
}

export function flowProblems(steps: Step[]): string[] {
  const problems: string[] = []
  steps.forEach((step, index) => {
    if (step.kind === 'message' && step.body.trim() === '') problems.push(`Step ${index + 1} is a message with no text yet.`)
    if (step.kind === 'wait' && (!Number.isFinite(step.amount) || step.amount < 1)) problems.push(`Step ${index + 1} needs a wait of at least 1.`)
  })
  if (!steps.some((step) => step.kind === 'message')) problems.push('Add at least one message.')
  return problems
}

export function AutomationBuilder({
  title,
  subtitle,
  steps,
  enabled,
  onToggle,
  onSave,
  onTest,
  saving,
  testing,
  disabledReason,
}: {
  title: string
  subtitle?: string
  steps: Step[]
  enabled?: boolean
  onToggle?: (next: boolean) => void
  onSave: (steps: Step[]) => void
  onTest?: () => void
  saving?: boolean
  testing?: boolean
  /** Why editing is unavailable (shown instead of the save controls). */
  disabledReason?: string
}) {
  const [draft, setDraft] = useState<Step[]>(steps)
  const [editing, setEditing] = useState<string | null>(null)
  const [announce, setAnnounce] = useState('')
  const focusNext = useRef<string | null>(null)
  const headingId = useId()

  const dirty = JSON.stringify(draft) !== JSON.stringify(steps)
  const problems = flowProblems(draft)
  const when = timings(draft)

  // After a reorder, put focus back on the control that was used.
  useEffect(() => {
    if (!focusNext.current) return
    document.getElementById(focusNext.current)?.focus()
    focusNext.current = null
  }, [draft])

  const update = (id: string, next: Step) => setDraft((current) => current.map((step) => (step.id === id ? next : step)))

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 1 || target >= draft.length) return
    const next = [...draft]
    const [step] = next.splice(index, 1)
    next.splice(target, 0, step)
    focusNext.current = `${step.id}-${delta < 0 ? 'up' : 'down'}`
    if ((delta < 0 && target === 1) || (delta > 0 && target === draft.length - 1)) focusNext.current = `${step.id}-edit`
    setDraft(next)
    setAnnounce(`${stepKindLabel[step.kind]} step moved to position ${target + 1} of ${draft.length}.`)
  }

  const remove = (index: number) => {
    const step = draft[index]
    setDraft((current) => current.filter((_, i) => i !== index))
    if (editing === step.id) setEditing(null)
    setAnnounce(`${stepKindLabel[step.kind]} step removed.`)
  }

  const add = (kind: Exclude<StepKind, 'trigger'>) => {
    const step = defaultStep(kind)
    setDraft((current) => [...current, step])
    setEditing(step.id)
    setAnnounce(`${stepKindLabel[kind]} step added at position ${draft.length + 1}.`)
  }

  const messages = draft.filter((step) => step.kind === 'message').length

  return (
    <div className="app-builder" aria-labelledby={headingId}>
      <div className="app-builder__head">
        <div className="app-builder__titles">
          <p className="ui-label">Automation builder</p>
          <h3 id={headingId} className="app-builder__title">
            {title}
          </h3>
          {subtitle && <p className="ui-meta">{subtitle}</p>}
        </div>
        {onToggle && enabled !== undefined && (
          <div className="app-builder__toggle">
            <span className="ui-meta">{enabled ? 'On' : 'Off'}</span>
            <Switch checked={enabled} onChange={onToggle} label={`${title} is ${enabled ? 'on' : 'off'}`} />
          </div>
        )}
      </div>

      <p className="app-builder__summary ui-meta">
        {draft.length} steps · {messages} {messages === 1 ? 'message' : 'messages'}
        {dirty && <span className="app-builder__dirty"> · Unsaved changes</span>}
      </p>

      <ol className="app-flow">
        {draft.map((step, index) => {
          const Icon = step.kind === 'message' && step.channel === 'email' ? Mail : kindIcon[step.kind]
          const isTrigger = step.kind === 'trigger'
          const open = editing === step.id
          return (
            <li key={step.id} className={cx('app-step', `app-step--${step.kind}`, open && 'is-editing')}>
              <span className="app-step__rail" aria-hidden="true">
                <span className="app-step__icon">
                  <Icon size={15} />
                </span>
              </span>
              <div className="app-step__card">
                <div className="app-step__head">
                  <p className="app-step__kind">
                    <span className="ui-label">
                      {index + 1}. {stepKindLabel[step.kind]}
                    </span>
                    {when[step.id] && <span className="app-step__when">{when[step.id]}</span>}
                  </p>
                  <div className="app-step__tools">
                    {!isTrigger && (
                      <>
                        <button
                          id={`${step.id}-up`}
                          type="button"
                          className="app-tool"
                          aria-label={`Move step ${index + 1} up`}
                          disabled={index <= 1}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp size={15} aria-hidden="true" />
                        </button>
                        <button
                          id={`${step.id}-down`}
                          type="button"
                          className="app-tool"
                          aria-label={`Move step ${index + 1} down`}
                          disabled={index >= draft.length - 1}
                          onClick={() => move(index, 1)}
                        >
                          <ArrowDown size={15} aria-hidden="true" />
                        </button>
                      </>
                    )}
                    <button
                      id={`${step.id}-edit`}
                      type="button"
                      className="app-tool"
                      aria-label={`${open ? 'Close editor for' : 'Edit'} step ${index + 1}`}
                      aria-expanded={open}
                      onClick={() => setEditing(open ? null : step.id)}
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    {!isTrigger && (
                      <button type="button" className="app-tool app-tool--danger" aria-label={`Remove step ${index + 1}`} onClick={() => remove(index)}>
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                <p className={cx('app-step__text', step.kind === 'message' && step.body.trim() === '' && 'is-empty')}>
                  {step.kind !== 'message' ? (
                    describeStep(step)
                  ) : step.body.trim() === '' ? (
                    'No message text yet'
                  ) : (
                    <>
                      <span className="app-step__channel">{step.channel === 'text' ? 'Text' : 'Email'}</span> <Tokenized text={step.body} />
                    </>
                  )}
                </p>
                {open && <StepEditor step={step} onChange={(next) => update(step.id, next)} onDone={() => setEditing(null)} />}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="app-flow__add" role="group" aria-label="Add a step">
        <span className="ui-label">Add step</span>
        {(['wait', 'message', 'condition', 'action'] as const).map((kind) => {
          const Icon = kindIcon[kind]
          return (
            <button key={kind} type="button" className="ui-btn ui-btn--quiet app-flow__addbtn" onClick={() => add(kind)}>
              <Plus aria-hidden="true" size={14} />
              <Icon aria-hidden="true" size={15} />
              {stepKindLabel[kind]}
            </button>
          )
        })}
      </div>

      <p className="app-sr" aria-live="polite">
        {announce}
      </p>

      {problems.length > 0 && (
        <ul className="app-builder__problems" aria-label="Before saving">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}

      <div className="app-builder__foot">
        {disabledReason ? (
          <p className="ui-meta">{disabledReason}</p>
        ) : (
          <>
            {onTest && (
              <button type="button" className="ui-btn ui-btn--quiet" onClick={onTest} disabled={testing || problems.length > 0} aria-busy={testing}>
                {testing ? <LoaderCircle className="app-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                {testing ? 'Sending test…' : 'Send test'}
              </button>
            )}
            <span className="app-builder__spacer" />
            <button
              type="button"
              className="ui-btn ui-btn--ghost"
              disabled={!dirty || saving}
              onClick={() => {
                setDraft(steps)
                setEditing(null)
                setAnnounce('Changes discarded.')
              }}
            >
              Discard
            </button>
            <button type="button" className="ui-btn" disabled={!dirty || saving || problems.length > 0} aria-busy={saving} onClick={() => onSave(draft)}>
              {saving && <LoaderCircle className="app-spin" aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const TOKEN_LABEL: Record<string, string> = {
  first: 'first name',
  agent: 'agent name',
  business: 'business',
  interest: 'interest',
  day: 'day',
  time: 'time',
}

/** Message text with its personalisation fields shown as tokens. */
export function Tokenized({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\w+\})/g).map((part, index) => {
        const field = /^\{(\w+)\}$/.exec(part)
        return field ? (
          <span key={index} className="app-token">
            {TOKEN_LABEL[field[1]] ?? field[1]}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </>
  )
}

function StepEditor({ step, onChange, onDone }: { step: Step; onChange: (step: Step) => void; onDone: () => void }) {
  const id = useId()
  return (
    <div className="app-step__editor">
      {step.kind === 'trigger' && (
        <SelectField
          label="Starts when"
          value={step.event}
          onChange={(event) => onChange({ ...step, event: event as TriggerEvent })}
          options={(Object.keys(triggerLabel) as TriggerEvent[]).map((value) => ({ value, label: triggerLabel[value] }))}
        />
      )}
      {step.kind === 'wait' && (
        <div className="app-step__row">
          <div className="app-field">
            <label htmlFor={`${id}-amount`} className="app-field__label">
              Wait
            </label>
            <input
              id={`${id}-amount`}
              type="number"
              min={1}
              max={60}
              className="ui-input app-step__number"
              value={Number.isFinite(step.amount) ? step.amount : ''}
              onChange={(event) => onChange({ ...step, amount: Math.max(0, Math.min(60, Math.round(Number(event.target.value)))) })}
            />
          </div>
          <SelectField
            label="Unit"
            value={step.unit}
            onChange={(unit) => onChange({ ...step, unit })}
            options={[
              { value: 'minutes', label: 'Minutes' },
              { value: 'hours', label: 'Hours' },
              { value: 'days', label: 'Days' },
            ]}
          />
          <SelectField
            label="Counting"
            value={step.before ? 'before' : 'after'}
            onChange={(value) => onChange({ ...step, before: value === 'before' })}
            options={[
              { value: 'after', label: 'After the previous step' },
              { value: 'before', label: 'Before the appointment' },
            ]}
          />
        </div>
      )}
      {step.kind === 'message' && (
        <>
          <SelectField
            label="Send by"
            value={step.channel}
            onChange={(channel) => onChange({ ...step, channel })}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
            ]}
          />
          <div className="app-field">
            <label htmlFor={`${id}-body`} className="app-field__label">
              Message
            </label>
            <textarea
              id={`${id}-body`}
              className="ui-input app-textarea"
              rows={3}
              value={step.body}
              aria-describedby={`${id}-hint`}
              placeholder="Hi {first}, it’s {agent}…"
              onChange={(event) => onChange({ ...step, body: event.target.value })}
            />
            <p id={`${id}-hint`} className="app-field__hint">
              Use {'{first}'}, {'{agent}'}, {'{business}'} and {'{interest}'} to personalise. {step.channel === 'text' ? `${step.body.length} characters.` : ''}
            </p>
          </div>
        </>
      )}
      {step.kind === 'condition' && (
        <SelectField
          label="Condition"
          value={step.check}
          onChange={(check) => onChange({ ...step, check: check as ConditionCheck })}
          options={(Object.keys(conditionLabel) as ConditionCheck[]).map((value) => ({ value, label: conditionLabel[value] }))}
        />
      )}
      {step.kind === 'action' && (
        <SelectField
          label="Action"
          value={step.action}
          onChange={(action) => onChange({ ...step, action: action as ActionKind })}
          options={(Object.keys(actionLabel) as ActionKind[]).map((value) => ({ value, label: actionLabel[value] }))}
        />
      )}
      <div className="app-step__done">
        <button type="button" className="ui-btn ui-btn--quiet" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}
