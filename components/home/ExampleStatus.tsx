'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const subscribeNoop = () => () => {}

/**
 * The lead's current status at the top of the worked example. It follows
 * whichever step is at the reading line in the middle of the viewport, in
 * both directions, so it always matches what the visitor is looking at.
 *
 * It only restates what each step already says in words, so it is hidden
 * from assistive technology and never announces anything. Before JavaScript
 * runs (or without it) the chip is simply not shown.
 */
export function ExampleStatus({ boardId, statuses }: { boardId: string; statuses: readonly string[] }) {
  const [current, setCurrent] = useState(0)
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  )

  useEffect(() => {
    const board = document.getElementById(boardId)
    if (!board) return
    const steps = Array.from(board.querySelectorAll<HTMLElement>('[data-step]'))
    if (steps.length === 0) return

    // A thin band just above the middle of the viewport is the reading line.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )
    steps.forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [boardId])

  return (
    <span className="example__chip" aria-hidden="true" data-ready={hydrated || undefined}>
      <span key={current} className="example__chip-text" data-final={current === statuses.length - 1 || undefined}>
        {statuses[current]}
      </span>
    </span>
  )
}
