'use client'

import { useSyncExternalStore } from 'react'

/**
 * The plan chosen in the buying form, shared with the order summary beside it.
 * The form and the summary are separate parts of the page, so the choice lives
 * in this small store instead of either component. `null` means "not chosen
 * yet in this visit": both fall back to the plan the page was opened with.
 */
let chosen: string | null = null
const listeners = new Set<() => void>()

export function choosePlan(plan: string) {
  chosen = plan
  listeners.forEach((listener) => listener())
}

/** Forget an earlier visit's choice, so a fresh page follows its own link. */
export function resetPlan() {
  if (chosen === null) return
  chosen = null
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The chosen plan, or `initial` until the visitor picks one. */
export function useChosenPlan(initial: string): string {
  return useSyncExternalStore(
    subscribe,
    () => chosen ?? initial,
    () => initial,
  )
}
