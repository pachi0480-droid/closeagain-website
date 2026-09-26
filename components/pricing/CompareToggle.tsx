'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

/**
 * Expands the comparison matrix in place. The panel animates its real height
 * (grid-template-rows 0fr → 1fr), so nothing is clipped at a guessed size,
 * and collapsed content is hidden from keyboard and screen readers.
 *
 * Server and browser start from the same collapsed state, so nothing moves on
 * hydration. Without JavaScript the matrix is shown open and the toggle is
 * hidden.
 */
export function CompareToggle({
  openLabel,
  closeLabel,
  children,
}: {
  openLabel: string
  closeLabel: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="compare" data-open={open}>
      <noscript>
        <style>{`.compare__panel{grid-template-rows:1fr!important}.compare__inner{visibility:visible!important}.compare__toggle{display:none!important}`}</style>
      </noscript>
      <button
        type="button"
        className="compare__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? closeLabel : openLabel}</span>
        <ChevronDown className="compare__chevron" size={18} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <div id={panelId} className="compare__panel" role="region" aria-label="Feature comparison">
        <div className="compare__inner">{children}</div>
      </div>
    </div>
  )
}
