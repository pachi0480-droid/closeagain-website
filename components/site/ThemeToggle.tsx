'use client'

import { useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

export const themeStorageKey = 'ca:theme'

const themeColors: Record<Theme, string> = { light: '#f2efe7', dark: '#16130f' }

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

/** Applies a theme with a short colour cross-fade, and remembers the choice. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (root.dataset.theme === theme) return
  root.classList.add('theme-changing')
  root.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
  try {
    localStorage.setItem(themeStorageKey, theme)
  } catch {
    // Private modes can refuse storage; the choice then lasts for this page.
  }
  window.setTimeout(() => root.classList.remove('theme-changing'), 400)
}

/**
 * Light (the brand's cream paper) or dark (warm charcoal). The theme is set
 * before first paint by the boot script in app/layout.tsx, so nothing flashes;
 * this button only switches it. Both icons are rendered and CSS shows the
 * right one, so the server and the browser always agree.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null)
  const dark = theme === 'dark'

  // Keep the browser's own chrome (address bar tint) in step with the page.
  useEffect(() => {
    if (theme) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
  }, [theme])

  return (
    <button
      type="button"
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : dark}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => applyTheme(dark ? 'light' : 'dark')}
    >
      <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M15.6 12.9A6.6 6.6 0 0 1 7.1 4.4a6.6 6.6 0 1 0 8.5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M10 1.8v2.1M10 16.1v2.1M1.8 10h2.1M16.1 10h2.1M4.2 4.2l1.5 1.5M14.3 14.3l1.5 1.5M4.2 15.8l1.5-1.5M14.3 5.7l1.5-1.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
