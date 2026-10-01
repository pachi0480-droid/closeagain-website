'use client'

import { usePathname } from 'next/navigation'
import { ViewTransition } from 'react'

/**
 * Route changes: the new page dissolves in quickly (see motion.css) while the
 * header stays put. Reduced-motion visitors get a plain swap; browsers without
 * View Transitions simply navigate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
        <div className="page">{children}</div>
      </ViewTransition>
    </>
  )
}
