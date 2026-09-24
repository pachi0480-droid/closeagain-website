'use client'

/**
 * The signature interaction: two rings of recovery green travelling outward
 * from an event, once, then gone.
 *
 * Fires only on the transition into a recovered state. Used everywhere an
 * opportunity is recovered, so the visitor learns the language:
 * green pulse = revenue recovered.
 */
export function RecoveryPulse({ fire }: { fire: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="pulse-ring" data-fire={fire} />
      <span className="pulse-ring" data-fire={fire} data-delay="1" />
    </span>
  )
}
