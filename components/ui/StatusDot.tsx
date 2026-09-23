import type { OpportunityState } from '@/data/scenarios'

const light: Record<OpportunityState, string> = {
  neutral: 'bg-graphite-3',
  lost: 'bg-dormant',
  engaged: 'bg-engaged',
  recovered: 'bg-recover',
}

const ink: Record<OpportunityState, string> = {
  neutral: 'bg-chalk-3',
  lost: 'bg-dormant-ink',
  engaged: 'bg-engaged-ink',
  recovered: 'bg-recover-bright',
}

export const stateText: Record<'light' | 'ink', Record<OpportunityState, string>> = {
  light: {
    neutral: 'text-graphite-2',
    lost: 'text-dormant',
    engaged: 'text-engaged',
    recovered: 'text-recover',
  },
  ink: {
    neutral: 'text-chalk-2',
    lost: 'text-dormant-ink',
    engaged: 'text-engaged-ink',
    recovered: 'text-recover-bright',
  },
}

export function StatusDot({
  state,
  tone = 'light',
  pulse = false,
  className = '',
}: {
  state: OpportunityState
  tone?: 'light' | 'ink'
  pulse?: boolean
  className?: string
}) {
  const palette = tone === 'ink' ? ink : light
  return (
    <span
      className={`status-dot ${palette[state]} ${stateText[tone][state]} ${className}`}
      data-pulse={pulse ? 'true' : 'false'}
    />
  )
}

/** Status text plus dot. Colour is never the only signal — the label carries it. */
export function StatusTag({
  state,
  label,
  tone = 'light',
  pulse = false,
}: {
  state: OpportunityState
  label: string
  tone?: 'light' | 'ink'
  pulse?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <StatusDot state={state} tone={tone} pulse={pulse} />
      <span
        className={`font-mono text-mono-xs uppercase ${stateText[tone][state]}`}
      >
        {label}
      </span>
    </span>
  )
}
