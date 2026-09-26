'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from './ui'

/**
 * Modal dialog and side drawer on the native <dialog> element: the browser
 * provides focus containment, Escape to close, an inert page behind, and
 * focus returning to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'modal',
  size = 'md',
  eyebrow,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  variant?: 'modal' | 'drawer'
  size?: 'sm' | 'md' | 'lg'
  eyebrow?: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // No cleanup needed: removing an open <dialog> from the document ends its modal state.

  return (
    <dialog
      ref={ref}
      className={cx('ui app-dialog', `app-dialog--${variant}`, `app-dialog--${size}`)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={() => {
        if (open) onClose()
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open && (
        <div className="app-dialog__panel">
          <header className="app-dialog__head">
            <div className="app-dialog__titles">
              {eyebrow && <p className="ui-label">{eyebrow}</p>}
              <h2 id={titleId} className="app-dialog__title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="app-dialog__desc">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="ui-btn ui-btn--ghost app-iconbtn" aria-label="Close" onClick={onClose}>
              <X aria-hidden="true" size={17} strokeWidth={1.5} />
            </button>
          </header>
          <div className="app-dialog__body">{children}</div>
          {footer && <footer className="app-dialog__foot">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
