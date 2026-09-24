'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Mark'
import { cta, nav } from '@/data/site'
import { track } from '@/lib/analytics'
import { useScrollOffset, useSurfaceTone } from '@/lib/hooks'

export function Header() {
  const offset = useScrollOffset()
  const tone = useSurfaceTone()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const condensed = offset > 28
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => setOpen(false), [])
  const onInk = tone === 'ink'

  /** Anchor links live on the homepage, so only real routes can be current. */
  const isCurrent = (href: string) =>
    !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`))

  // Escape closes the panel and returns focus to the control that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      close()
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  // Lock the page behind the open panel.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // A resize to desktop should not leave the mobile panel mounted.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)')
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const surface = condensed || open
    ? onInk
      ? 'border-b border-rule-ink bg-ink/85 backdrop-blur-[10px] backdrop-saturate-150'
      : 'border-b border-rule bg-paper/85 backdrop-blur-[10px] backdrop-saturate-150'
    : 'border-b border-transparent bg-transparent'

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50',
        onInk ? 'on-ink text-chalk' : 'text-graphite',
        'transition-[background-color,border-color,color,backdrop-filter] duration-500',
        '[transition-timing-function:var(--ease-out-quiet)]',
        surface,
      ].join(' ')}
    >
      <div className="shell">
        <div
          className={[
            'flex items-center justify-between gap-6',
            'transition-[height] duration-500 [transition-timing-function:var(--ease-out-quiet)]',
            condensed ? 'h-[3.75rem]' : 'h-[4.75rem]',
          ].join(' ')}
        >
          <Link
            href="/"
            aria-label="CloseAgain — home"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => {
                const current = isCurrent(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      className={`relative text-[0.9375rem] transition-colors duration-300 ${
                        current
                          ? onInk
                            ? 'text-chalk'
                            : 'text-graphite'
                          : onInk
                            ? 'text-chalk-2 hover:text-chalk'
                            : 'text-graphite-2 hover:text-graphite'
                      }`}
                    >
                      {item.label}
                      {/* a rule rather than a pill: quieter, and it matches
                          the recovery-line language used everywhere else */}
                      <span
                        aria-hidden="true"
                        className={`absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
                          onInk ? 'bg-recover-bright' : 'bg-recover'
                        } ${current ? 'scale-x-100' : 'scale-x-0'}`}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <ButtonLink
              href={cta.chromeTarget}
              tone={onInk ? 'ink' : 'light'}
              size="md"
              withArrow
              onClick={() => track('nav_cta_clicked', { location: 'header' })}
            >
              {cta.primary}
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-[7px] transition-colors duration-300 lg:hidden ${
              onInk ? 'hover:bg-chalk/10' : 'hover:bg-graphite/[0.05]'
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => {
              setOpen((v) => {
                if (!v) track('mobile_menu_opened')
                return !v
              })
            }}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 18 12" className="h-3 w-[1.125rem]" aria-hidden="true">
              <line
                x1="0"
                y1="1"
                x2="18"
                y2="1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="origin-center transition-transform duration-500 [transition-timing-function:var(--ease-out-quiet)]"
                style={open ? { transform: 'translateY(5px) rotate(45deg)' } : undefined}
              />
              <line
                x1="0"
                y1="11"
                x2="18"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="origin-center transition-transform duration-500 [transition-timing-function:var(--ease-out-quiet)]"
                style={open ? { transform: 'translateY(-5px) rotate(-45deg)' } : undefined}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel: a considered sheet, not a full-screen performance. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className={`lg:hidden ${
          onInk ? 'border-t border-rule-ink bg-ink' : 'border-t border-rule bg-paper'
        }`}
      >
        <div className="shell py-6">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`border-b last:border-b-0 ${
                  onInk ? 'border-rule-ink-soft' : 'border-rule-soft'
                }`}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={`flex items-baseline gap-4 py-4 text-[1.375rem] tracking-[-0.02em] ${
                    isCurrent(item.href)
                      ? onInk
                        ? 'text-recover-bright'
                        : 'text-recover'
                      : ''
                  }`}
                >
                  <span
                    className={`font-mono text-mono-xs ${
                      onInk ? 'text-chalk-3' : 'text-graphite-3'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={cta.chromeTarget}
            tone={onInk ? 'ink' : 'light'}
            size="lg"
            withArrow
            className="mt-6 w-full"
            onClick={() => {
              close()
              track('nav_cta_clicked', { location: 'mobile_menu' })
            }}
          >
            {cta.primary}
          </ButtonLink>
          <p
            className={`mt-4 font-mono text-mono-xs uppercase ${
              onInk ? 'text-chalk-3' : 'text-graphite-3'
            }`}
          >
            Pre-launch · accepting pilot interest
          </p>
        </div>
      </div>
    </header>
  )
}
