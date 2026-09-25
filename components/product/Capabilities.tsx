import { Reveal } from '@/components/ui/Reveal'
import { capabilities } from '@/data/capabilities'

/**
 * Every capability as the same four facts: what sets it off, what CloseAgain
 * does, what the operator can see afterwards, and the line a customer would
 * actually receive. Four facts each, so they can be compared rather than
 * admired.
 */
export function Capabilities() {
  return (
    <ul className="grid gap-px bg-steel/40 md:grid-cols-2">
      {capabilities.map((capability, i) => (
        <li key={capability.id} className="bg-graphite">
          <Reveal delay={(i % 2) * 80} className="h-full p-7 lg:p-8">
            <div className="flex items-baseline gap-3">
              <span className="tnum font-mono text-mono-xs text-secondary">
                {capability.index}
              </span>
              <span className="font-mono text-mono-xs uppercase text-signal">
                {capability.stage}
              </span>
            </div>

            <h3 className="mt-3 text-h3 text-warm-white">{capability.name}</h3>
            <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
              {capability.body}
            </p>

            <dl className="mt-6 space-y-4 border-t border-rule pt-5">
              <Row label="Trigger" value={capability.detail.trigger} />
              <Row label="Action" value={capability.detail.action} />
              <Row label="You can see" value={capability.detail.visible} />
            </dl>

            <p className="mt-5 border-l-2 border-steel py-1 pl-4 text-[0.9375rem] leading-relaxed text-muted italic">
              {capability.detail.example}
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="font-mono text-mono-xs uppercase text-secondary">{label}</dt>
      <dd className="text-[0.9375rem] leading-relaxed text-warm-white">{value}</dd>
    </div>
  )
}
