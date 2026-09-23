'use client'

import type { ElementType, ReactNode } from 'react'
import { useInViewOnce } from '@/lib/hooks'

/**
 * The site's single reveal primitive. CSS does the animating; this only
 * flips an attribute when the element first enters the viewport.
 */
export function Reveal({
  as: Tag = 'div',
  children,
  delay = 0,
  y = 18,
  className = '',
  onEnter,
}: {
  as?: ElementType
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  onEnter?: () => void
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ onEnter })

  return (
    <Tag
      ref={ref}
      data-reveal={inView ? 'shown' : ''}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          '--reveal-y': `${y}px`,
        } as React.CSSProperties
      }
      className={className}
    >
      {children}
    </Tag>
  )
}
