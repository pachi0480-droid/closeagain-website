'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Arrow } from '@/components/ui/links'
import { billingNote, startingPriceText } from '@/content/pricing'
import type { NavLink } from '@/content/site'
import { ThemeToggle } from './ThemeToggle'

const subscribeNoop = () => () => {}

/**
 * The small-screen menu, built on a native modal <dialog>: the browser
 * supplies focus containment, Escape to close, an inert page behind it and
 * focus returning to the trigger.
 *
 * Before hydration (or with JavaScript off) the trigger is a plain link to the
 * footer navigation, so the menu never becomes a dead control.
 */
export function MobileMenu({
  links,
  cta,
}: {
  links: NavLink[]
  cta: { label: string; href: string }
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const close = useCallback(() => dialogRef.current?.close(), [])

  // A completed navigation always closes the menu.
  useEffect(() => {
    close()
  }, [pathname, close])

  // If the window grows past the breakpoint while open, fall back to the header.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1120px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close()
    }
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [close])

  const openMenu = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    closeRef.current?.focus()
    setOpen(true)
  }

  return (
    <>
      {hydrated ? (
        <button
          type="button"
          className="menu-toggle menu-trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={openMenu}
        >
          <span className="menu-toggle__label">Menu</span>
          <MenuIcon />
        </button>
      ) : (
        <a className="menu-toggle menu-trigger" href="#footer-nav">
          <span className="menu-toggle__label">Menu</span>
          <MenuIcon />
        </a>
      )}

      <dialog
        id="site-menu"
        ref={dialogRef}
        className="menu"
        aria-label="Site menu"
        onClose={() => setOpen(false)}
      >
        <div className="menu__inner wrap">
          <div className="menu__top">
            <Link href="/" className="wordmark" onClick={close}>
              CloseAgain
            </Link>
            <button ref={closeRef} type="button" className="menu-toggle" onClick={close}>
              Close
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Site">
            <ul className="menu__list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="menu__link"
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu__cta">
            <Link href={cta.href} className="btn btn--lg" onClick={close}>
              <span>{cta.label}</span>
              <Arrow />
            </Link>
            <p className="menu__terms">
              {startingPriceText} · {billingNote}
            </p>
          </div>

          <div className="menu__theme">
            <span>Dark theme</span>
            <ThemeToggle />
          </div>

          <p className="menu__note" aria-hidden="true">
            The conversation isn’t over.
          </p>
        </div>
      </dialog>
    </>
  )
}

function MenuIcon() {
  return (
    <svg className="menu-toggle__icon" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <path d="M2 7.5h18M2 14.5h18" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="menu-toggle__icon" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5l13 13M17.5 4.5l-13 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
