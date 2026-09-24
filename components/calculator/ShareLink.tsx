'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

/** Copies the current URL, which carries the assumptions as query state. */
export function ShareLink() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2400)
    } catch {
      // Clipboard can be blocked; the URL is in the address bar either way.
      setCopied(false)
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Button type="button" tone="ink" variant="secondary" onClick={copy}>
        {copied ? 'Link copied' : 'Copy link to these numbers'}
      </Button>
      <p aria-live="polite" className="font-mono text-mono-xs text-chalk-3 uppercase">
        {copied
          ? 'Your assumptions travel with the link'
          : 'The link carries your assumptions'}
      </p>
    </div>
  )
}
