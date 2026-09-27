'use client'

/**
 * Linkable filters for the demo views (“Conversations filtered to needs
 * reply”). The pages stay statically prerendered: the query string is read
 * after hydration inside a Suspense boundary, applied as view state, and
 * written back with history.replaceState, which Next.js keeps in step with
 * useSearchParams.
 */

import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useEffectEvent } from 'react'

function Reader({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  const params = useSearchParams()
  const key = params.toString()
  const apply = useEffectEvent((query: string) => onChange(new URLSearchParams(query)))
  useEffect(() => {
    apply(key)
  }, [key])
  return null
}

/** Calls `onChange` with the page's query string after load and whenever it changes. Renders nothing. */
export function QueryParams({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  return (
    <Suspense fallback={null}>
      <Reader onChange={onChange} />
    </Suspense>
  )
}

/** Sets or removes query parameters in place: no navigation, no scroll, no new history entry. */
export function useReplaceQuery() {
  return useCallback((next: Record<string, string | null | undefined>) => {
    const url = new URL(window.location.href)
    for (const [name, value] of Object.entries(next)) {
      if (value === null || value === undefined || value === '') url.searchParams.delete(name)
      else url.searchParams.set(name, value)
    }
    const target = `${url.pathname}${url.search}${url.hash}`
    if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, '', target)
  }, [])
}
