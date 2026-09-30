'use client'

import { Check } from 'lucide-react'
import { useEffect, useId, useState, type CSSProperties } from 'react'

/**
 * Cards that sit side by side share their rows (pricing.css subgrid), so
 * opening one card's list opens its neighbours' too: the lists line up for
 * comparison instead of leaving empty space beside the open one. Stacked on
 * a phone, each card opens on its own, so nothing above the tap moves.
 */
const sideBySide = '(min-width: 880px)'
const together = new Set<(open: boolean) => void>()

/**
 * A compact plan card's feature list: the first `shown` features stay in
 * view, the rest open smoothly in place (grid-template-rows 0fr → 1fr, as the
 * FAQ) and arrive one after another. A real button with aria-expanded; the
 * closed part is hidden from keyboard and screen readers once it has closed
 * (visibility, pricing.css).
 * Without JavaScript the whole list is simply shown.
 */
export function PlanFeatures({
  plan,
  label,
  features,
  shown = 0,
  additive = false,
  linked = false,
}: {
  /** The plan's name, for the button's accessible name. */
  plan: string
  /** “Includes”, “Everything in Core, plus”. */
  label: string
  features: readonly string[]
  /** How many stay visible while closed. */
  shown?: number
  /** The list adds to the plan below (“Everything in Core, plus”). */
  additive?: boolean
  /** Opens and closes with the other side-by-side cards on wide screens. */
  linked?: boolean
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!linked) return
    together.add(setOpen)
    return () => {
      together.delete(setOpen)
    }
  }, [linked])

  const toggle = () => {
    const next = !open
    if (linked && window.matchMedia(sideBySide).matches) together.forEach((set) => set(next))
    else setOpen(next)
  }
  const panelId = useId()
  const visible = features.slice(0, shown)
  const rest = features.slice(shown)

  const item = (feature: string, i: number) => (
    <li key={feature} style={{ '--i': i } as CSSProperties}>
      <Check className="plan__tick" size={15} strokeWidth={2} aria-hidden="true" />
      <span>{feature}</span>
    </li>
  )

  return (
    <div className="plan__includes plan-more" data-open={open}>
      <noscript>
        <style>{`.plan-more__panel{grid-template-rows:1fr!important}.plan-more__inner{visibility:visible!important}.plan-more__toggle{display:none!important}`}</style>
      </noscript>
      <p className="plan__includes-label">{label}</p>
      {visible.length > 0 && <ul className="plan__features">{visible.map(item)}</ul>}
      {rest.length > 0 && (
        <>
          <div id={panelId} className="plan-more__panel">
            <div className="plan-more__inner">
              <ul className="plan__features">{rest.map(item)}</ul>
            </div>
          </div>
          <button
            type="button"
            className="plan-more__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <span>
              {open
                ? 'Show less'
                : shown > 0
                  ? `See all ${features.length}`
                  : additive
                    ? `See ${features.length} more features`
                    : `See all ${features.length} features`}
              <span className="sr-only"> in {plan}</span>
            </span>
            <span className="plan-more__icon" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )
}
