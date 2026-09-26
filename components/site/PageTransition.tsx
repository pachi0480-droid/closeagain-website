'use client'

import { usePathname } from 'next/navigation'
import { ViewTransition } from 'react'

/**
 * Route changes cross over with a short masked wipe (see motion.css). The
 * header stays put; only the page content transitions. Browsers without the
 * View Transitions API — and reduced-motion visitors — simply navigate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div className="page">{children}</div>
    </ViewTransition>
  )
}
