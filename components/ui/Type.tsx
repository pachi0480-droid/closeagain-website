import type { ReactNode } from 'react'

/** Small mono label. Used for section markers, statuses and metadata. */
export function Eyebrow({
  children,
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  tone?: 'light' | 'ink' | 'recover'
  className?: string
}) {
  const colour =
    tone === 'ink'
      ? 'text-chalk-3'
      : tone === 'recover'
        ? 'text-recover'
        : 'text-graphite-3'

  return (
    <span
      className={`font-mono text-mono-xs uppercase ${colour} ${className}`}
    >
      {children}
    </span>
  )
}

/** Numbered section marker: a rule, an index and a label. */
export function SectionMark({
  index,
  label,
  tone = 'light',
  className = '',
}: {
  index: string
  label: string
  tone?: 'light' | 'ink'
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`h-px w-8 ${tone === 'ink' ? 'bg-chalk/30' : 'bg-graphite/25'}`}
      />
      <Eyebrow tone={tone}>
        {index} — {label}
      </Eyebrow>
    </div>
  )
}

/** Rare editorial emphasis. Used on single words, never on a whole line. */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <em className="font-serif font-normal not-italic italic tracking-[-0.01em]">
      {children}
    </em>
  )
}
