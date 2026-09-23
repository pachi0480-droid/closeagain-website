'use client'

import { useInViewOnce } from '@/lib/hooks'

/**
 * The recurring brand device: a fine line that breaks, and is bridged again.
 * Used at a few section boundaries only — it is a motif, not a decoration.
 */
export function RecoveryDivider({
  tone = 'light',
  className = '',
}: {
  tone?: 'light' | 'ink'
  className?: string
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.9 })
  const rule = tone === 'ink' ? 'bg-rule-ink' : 'bg-rule'

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`flex w-full items-center ${className}`}
    >
      <span className={`h-px flex-1 ${rule}`} />
      {/* the break */}
      <span className="relative flex h-px w-24 items-center justify-center sm:w-36">
        <span
          className={`absolute inset-0 origin-center bg-recover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-quiet)] ${
            inView ? 'scale-x-100' : 'scale-x-0'
          }`}
          style={{ opacity: tone === 'ink' ? 0.85 : 0.6 }}
        />
        <span
          className={`absolute h-[5px] w-[5px] rounded-full transition-all duration-[900ms] [transition-timing-function:var(--ease-out-quiet)] ${
            tone === 'ink' ? 'bg-recover-bright' : 'bg-recover'
          } ${inView ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
        />
      </span>
      <span className={`h-px flex-1 ${rule}`} />
    </div>
  )
}
