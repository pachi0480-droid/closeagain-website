'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackOnce } from '@/lib/analytics'
import {
  bounds,
  defaultInputs,
  sanitise,
  type CalculatorInputs,
} from '@/lib/calculator'

const KEYS: (keyof CalculatorInputs)[] = [
  'leadsPerMonth',
  'jobValue',
  'bookingRate',
  'followUpRate',
  'additionalLeads',
  'recoveryRate',
]

/** Short query keys, so a shared link stays readable. */
const PARAM: Record<keyof CalculatorInputs, string> = {
  leadsPerMonth: 'l',
  jobValue: 'v',
  bookingRate: 'b',
  followUpRate: 'f',
  additionalLeads: 'a',
  recoveryRate: 'r',
}

function readFromLocation(): CalculatorInputs | null {
  const params = new URLSearchParams(window.location.search)
  const found: Partial<CalculatorInputs> = {}
  let any = false

  for (const key of KEYS) {
    const raw = params.get(PARAM[key])
    if (raw === null) continue
    const value = Number(raw)
    if (!Number.isFinite(value)) continue
    found[key] = value
    any = true
  }

  return any ? sanitise({ ...defaultInputs, ...found }) : null
}

/**
 * Calculator state, optionally mirrored into the URL so a set of assumptions
 * can be sent to a business partner.
 *
 * The URL is written with `history.replaceState` rather than the router: this
 * is a shareable representation of local state, not navigation, and it should
 * neither add history entries nor opt the page out of static rendering.
 */
export function useCalculatorState({ syncUrl = false } = {}) {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs)
  const [touched, setTouched] = useState(false)
  const writeTimer = useRef(0)

  // Hydrate from the URL after mount, so server and client first paint match.
  useEffect(() => {
    if (!syncUrl) return
    const frame = requestAnimationFrame(() => {
      const fromUrl = readFromLocation()
      if (fromUrl) setInputs(fromUrl)
    })
    return () => cancelAnimationFrame(frame)
  }, [syncUrl])

  // Mirror changes back out, coalesced so dragging a slider is not chatty.
  useEffect(() => {
    if (!syncUrl || !touched) return
    window.clearTimeout(writeTimer.current)
    writeTimer.current = window.setTimeout(() => {
      const params = new URLSearchParams()
      for (const key of KEYS) params.set(PARAM[key], String(inputs[key]))
      window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
    }, 250)
    return () => window.clearTimeout(writeTimer.current)
  }, [inputs, syncUrl, touched])

  const set = useCallback(
    <K extends keyof CalculatorInputs>(key: K) =>
      (value: number) => {
        trackOnce('calculator_started')
        setTouched(true)
        setInputs((prev) => ({ ...prev, [key]: value }))
      },
    [],
  )

  const reset = useCallback(() => {
    setInputs(defaultInputs)
    setTouched(true)
  }, [])

  return { inputs, set, reset, touched, bounds }
}
