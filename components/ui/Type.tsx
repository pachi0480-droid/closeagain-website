import type { ReactNode } from 'react'

/** Small technical label. Section markers, statuses, metadata. */
export function Eyebrow({
  children,
  tone = 'muted',
  className = '',
}: {
  children: ReactNode
  tone?: 'muted' | 'signal' | 'secondary'
  className?: string
}) {
  const colour =
    tone === 'signal'
      ? 'text-signal'
      : tone === 'secondary'
        ? 'text-secondary'
        : 'text-muted'

  return (
    <span className={`font-mono text-mono-xs uppercase ${colour} ${className}`}>
      {children}
    </span>
  )
}

/** Numbered chapter marker: a rule, an index, a label. */
export function SectionMark({
  index,
  label,
  className = '',
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-steel" />
      <Eyebrow>
        {index} — {label}
      </Eyebrow>
    </div>
  )
}

/**
 * The one honesty label a conceptual module carries. Rendered once per
 * module, at the section header — never repeated inside the cards.
 */
export function ModuleLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-steel px-3 py-1 font-mono text-mono-xs uppercase text-secondary">
      <span aria-hidden="true" className="dot text-secondary" />
      {children}
    </span>
  )
}
