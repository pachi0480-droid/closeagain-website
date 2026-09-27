'use client'

import { usePathname } from 'next/navigation'
import { useState, ViewTransition } from 'react'

/**
 * Route changes: the new page dissolves in quickly (see motion.css) while a
 * thin vermilion line — the ribbon, in one stroke — runs across the top of
 * the window. The header stays put. The first page load and reduced-motion
 * visitors get neither; browsers without View Transitions simply navigate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [firstPath] = useState(pathname)
  return (
    <>
      <span key={pathname} className="route-line" data-initial={pathname === firstPath || undefined} aria-hidden="true" />
      <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
        <div className="page">{children}</div>
      </ViewTransition>
    </>
  )
}
