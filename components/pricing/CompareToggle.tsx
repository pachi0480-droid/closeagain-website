'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

export function CompareToggle({ openLabel, closeLabel, children }: {
  openLabel: string
  closeLabel: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className="compare" data-open={open}>
      <noscript>
        <style>{`.compare__panel{grid-template-rows:1fr!important}.compare__inner{visibility:visible!important}.compare__toggle{display:none!important}`}</style>
      </noscript>
      <button
        id={buttonId}
        type="button"
        className="compare__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="compare__toggle-label">{open ? closeLabel : openLabel}</span>
        <span className="compare__toggle-note">Every feature. Every plan.</span>
        <ChevronDown className="compare__chevron" size={20} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <div id={panelId} className="compare__panel" role="region" aria-labelledby={buttonId}>
        <div className="compare__inner">{children}</div>
      </div>
    </div>
  )
}
