'use client'

/**
 * The product demo's app shell, shared by the client dashboard and the
 * operator's “Master control”: a paper sidebar with the wordmark, workspace
 * switcher and navigation, a persistent sample-data notice, and — below
 * 1024px — a top bar whose menu opens the navigation as a modal sheet.
 */

import { ArrowLeft, ArrowUpRight, Check, ChevronsUpDown, LucideProvider, Menu, RotateCcw, X, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { primaryCta } from '@/content/site'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from './ui'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  count?: number
  /** A dot for something that needs attention. */
  alert?: boolean
}

export type ShellProps = {
  variant: 'client' | 'operator'
  nav: NavItem[]
  home: string
  workspace: { name: string; meta: string; mark: string }
  user: { name: string; role: string }
  onReset: () => void
  children: ReactNode
}

const isActive = (pathname: string, href: string, home: string) =>
  href === home ? pathname === home : pathname === href || pathname.startsWith(`${href}/`)

export function AppShell({ variant, nav, home, workspace, user, onReset, children }: ShellProps) {
  const pathname = usePathname()
  const sheetRef = useRef<HTMLDialogElement>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const closeSheet = useCallback(() => sheetRef.current?.close(), [])

  // A completed navigation closes the sheet.
  useEffect(() => {
    closeSheet()
  }, [pathname, closeSheet])

  // Growing past the breakpoint hands navigation back to the sidebar.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeSheet()
    }
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [closeSheet])

  const openSheet = () => {
    const sheet = sheetRef.current
    if (!sheet || sheet.open) return
    sheet.showModal()
    setSheetOpen(true)
  }

  const sidebar = (inSheet: boolean) => (
    <SidebarContent
      variant={variant}
      nav={nav}
      home={home}
      workspace={workspace}
      user={user}
      pathname={pathname}
      onNavigate={inSheet ? closeSheet : undefined}
      idPrefix={inSheet ? 'sheet' : 'side'}
    />
  )

  return (
    <LucideProvider size={17} strokeWidth={1.5}>
      <div className={cx('ui app-shell', `app-shell--${variant}`)}>
        <aside className="app-sidebar" aria-label={variant === 'client' ? 'Client workspace' : 'Master control'}>
          {sidebar(false)}
        </aside>

        <div className="app-body">
          <div className="app-mobilebar">
            <Link href={home} className="app-wordmark">
              CloseAgain
            </Link>
            <span className={cx('app-mobilebar__ws', variant === 'operator' && 'op-badge')}>{variant === 'client' ? workspace.name : 'Master control'}</span>
            <button
              type="button"
              className="ui-btn ui-btn--quiet app-menu-button"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              aria-controls={`${variant}-nav-sheet`}
              onClick={openSheet}
            >
              <Menu aria-hidden="true" />
              Menu
            </button>
          </div>

          <div className="app-notice" role="note" aria-label="About this demo">
            <span className="ui-sample">{variant === 'client' ? 'Sample workspace' : 'Sample operator workspace'}</span>
            <span className="app-notice__text">Demo data — nothing here is sent or saved beyond this tab.</span>
            <span className="app-notice__actions">
              <button type="button" className="app-notice__reset" onClick={onReset}>
                <RotateCcw aria-hidden="true" size={14} />
                Reset demo
              </button>
              <Link href={primaryCta.href} className="app-notice__cta">
                {primaryCta.label}
                <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </span>
          </div>

          {children}
        </div>

        <dialog
          id={`${variant}-nav-sheet`}
          ref={sheetRef}
          className="ui app-sheet"
          aria-label="Navigation"
          onClose={() => setSheetOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeSheet()
          }}
        >
          <div className="app-sheet__panel">
            <div className="app-sheet__top">
              <span className="app-wordmark" aria-hidden="true">
                CloseAgain
              </span>
              <button type="button" className="ui-btn ui-btn--ghost app-iconbtn" aria-label="Close menu" onClick={closeSheet}>
                <X aria-hidden="true" />
              </button>
            </div>
            {sheetOpen && sidebar(true)}
          </div>
        </dialog>
      </div>
    </LucideProvider>
  )
}

function SidebarContent({
  variant,
  nav,
  home,
  workspace,
  user,
  pathname,
  onNavigate,
  idPrefix,
}: {
  variant: 'client' | 'operator'
  nav: NavItem[]
  home: string
  workspace: ShellProps['workspace']
  user: ShellProps['user']
  pathname: string
  onNavigate?: () => void
  idPrefix: string
}) {
  return (
    <div className="app-sidebar__inner">
      <div className="app-sidebar__brand">
        {idPrefix === 'side' && (
          <Link href={home} className="app-wordmark">
            CloseAgain
          </Link>
        )}
        <WorkspaceSwitcher variant={variant} workspace={workspace} idPrefix={idPrefix} onNavigate={onNavigate} />
      </div>

      <nav aria-label={variant === 'client' ? 'Workspace' : 'Master control'} className="app-sidebar__nav">
        <ul className="app-nav">
          {nav.map((item) => {
            const active = isActive(pathname, item.href, home)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link href={item.href} className="app-nav__link" aria-current={active ? 'page' : undefined} onClick={onNavigate}>
                  <Icon className="app-nav__icon" aria-hidden="true" />
                  <span className="app-nav__label">{item.label}</span>
                  {item.count ? (
                    <span className="app-nav__count">
                      {item.count}
                      <span className="app-sr"> need attention</span>
                    </span>
                  ) : item.alert ? (
                    <span className="app-nav__alert">
                      <span className="app-sr">Needs attention</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="app-sidebar__foot">
        {/* The public demo is the client workspace. The operator view is not
            advertised from it; it keeps a way back to the client view. */}
        {variant === 'operator' && (
          <div className="app-viewswitch" role="group" aria-label="Demo view">
            <Link href="/demo" className="app-viewswitch__link" onClick={onNavigate}>
              Client view
            </Link>
            <Link href="/demo/operator" className="app-viewswitch__link" aria-current="true" onClick={onNavigate}>
              Operator view
            </Link>
          </div>
        )}
        <Link href="/" className="app-backlink">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to the CloseAgain site
        </Link>
        <div className="app-user">
          <span className={cx('ui-avatar ui-avatar--sm', variant === 'operator' && 'app-avatar--ink')} aria-hidden="true">
            {user.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          <span className="app-user__text">
            <span className="app-user__name">{user.name}</span>
            <span className="app-user__role">{user.role}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/** The line under the wordmark: the current workspace, and a way across to the other demo view. */
function WorkspaceSwitcher({
  variant,
  workspace,
  idPrefix,
  onNavigate,
}: {
  variant: 'client' | 'operator'
  workspace: ShellProps['workspace']
  idPrefix: string
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = `${idPrefix}-workspace-menu`

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const options = [
    { href: '/demo', name: 'Juniper Row Realty', meta: 'Client workspace', current: variant === 'client', mark: 'JR', ink: false },
    { href: '/demo/operator', name: 'Master control', meta: 'Operator · all clients', current: variant === 'operator', mark: 'MC', ink: true },
  ]

  // In the public client demo the workspace is just a label: nothing points
  // visitors at the operator's internal views.
  if (variant === 'client') {
    return (
      <div className="app-workspace">
        <div className="app-workspace__button app-workspace__button--static">
          <span className="app-workspace__mark" aria-hidden="true">
            {workspace.mark}
          </span>
          <span className="app-workspace__text">
            <span className="app-workspace__name">{workspace.name}</span>
            <span className="app-workspace__meta">{workspace.meta}</span>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-workspace" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="app-workspace__button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={cx('app-workspace__mark', variant === 'operator' && 'app-workspace__mark--ink')} aria-hidden="true">
          {workspace.mark}
        </span>
        <span className="app-workspace__text">
          <span className="app-workspace__name">{workspace.name}</span>
          <span className="app-workspace__meta">{workspace.meta}</span>
        </span>
        <ChevronsUpDown className="app-workspace__chev" aria-hidden="true" size={15} />
        <span className="app-sr">Switch workspace</span>
      </button>
      {open && (
        <div id={menuId} className="app-workspace__menu">
          <p className="ui-label app-workspace__menu-label">Demo workspaces</p>
          <ul>
            {options.map((option) => (
              <li key={option.href}>
                <Link
                  href={option.href}
                  className="app-workspace__option"
                  aria-current={option.current ? 'true' : undefined}
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                >
                  <span className={cx('app-workspace__mark', option.ink && 'app-workspace__mark--ink')} aria-hidden="true">
                    {option.mark}
                  </span>
                  <span className="app-workspace__text">
                    <span className="app-workspace__name">{option.name}</span>
                    <span className="app-workspace__meta">{option.meta}</span>
                  </span>
                  {option.current && <Check aria-hidden="true" size={15} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
