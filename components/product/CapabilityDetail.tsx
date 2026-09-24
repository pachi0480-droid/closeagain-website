import { Reveal } from '@/components/ui/Reveal'
import type { Capability } from '@/data/capabilities'

/**
 * One capability, read as an operational record: what sets it off, what it
 * does, what you can see afterwards — plus the line a customer would actually
 * receive, because one believable sentence beats a paragraph of description.
 *
 * Bands alternate surface so the sequence has rhythm without six identical
 * bordered rows.
 */
export function CapabilityDetail({
  capability,
  tone,
}: {
  capability: Capability
  tone: 'paper' | 'bone'
}) {
  const rows = [
    { label: 'Triggered by', value: capability.detail.trigger },
    { label: 'What happens', value: capability.detail.action },
    { label: 'What you see', value: capability.detail.visible },
  ]

  return (
    <section
      id={capability.id}
      className={`grain-ink relative scroll-mt-24 py-16 md:py-20 ${
        tone === 'bone' ? 'bg-ink-raise' : 'bg-ink'
      }`}
    >
      <div className="shell">
        <Reveal>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <div className="flex items-baseline gap-4">
                <span className="tnum font-mono text-mono-sm text-chalk-3">
                  {capability.index}
                </span>
                <h2 className="text-h3 text-chalk">{capability.name}</h2>
              </div>
              <p className="mt-3 pl-9 font-mono text-mono-xs text-chalk-3 uppercase">
                {capability.stage}
              </p>
              <p className="mt-6 max-w-[38ch] pl-9 text-[1.0625rem] leading-relaxed text-chalk-2">
                {capability.body}
              </p>
            </div>

            <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <dl className="border-t border-rule-ink">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-x-8 gap-y-1.5 border-b border-rule-ink py-5 sm:grid-cols-[9rem_1fr]"
                  >
                    <dt className="font-mono text-mono-xs text-chalk-3 uppercase">
                      {row.label}
                    </dt>
                    <dd className="max-w-[54ch] text-[0.9375rem] leading-relaxed text-chalk-2">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* the believable sentence */}
              <div className="mt-6 flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-px w-6 shrink-0 bg-recover-bright" />
                <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-chalk">
                  {capability.detail.example}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
