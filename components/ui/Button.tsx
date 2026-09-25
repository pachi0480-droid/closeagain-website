'use client'

import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 rounded-[8px] ' +
  'font-medium tracking-[-0.012em] whitespace-nowrap ' +
  'transition-[background-color,border-color,color,transform] duration-300 ' +
  '[transition-timing-function:var(--ease-out-quiet)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-50'

const sizes: Record<Size, string> = {
  /** 44px minimum, so every control clears the touch-target floor. */
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-[3.25rem] px-6 text-base',
}

/**
 * Signal green is the CTA. It is the same green that means "moving" and
 * "booked" everywhere else on the page, which is the point: the button is the
 * next action.
 */
const styles: Record<Variant, string> = {
  primary: 'bg-signal text-void hover:bg-warm-white',
  secondary:
    'border border-steel text-warm-white hover:border-signal/60 hover:bg-signal/[0.07]',
  quiet: 'text-muted hover:text-warm-white',
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`h-[0.6rem] w-[0.72rem] transition-transform duration-300 [transition-timing-function:var(--ease-out-quiet)] group-hover:translate-x-[3px] ${className}`}
    >
      <path
        d="M0.75 5h9.5M7 1.5 10.5 5 7 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type CommonProps = {
  variant?: Variant
  size?: Size
  withArrow?: boolean
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className = '',
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<'button'>, 'children' | 'className'>) {
  return (
    <button
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow ? <Arrow /> : null}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className = '',
  children,
  href,
  ...rest
}: CommonProps & { href: string } & Omit<
    ComponentProps<'a'>,
    'children' | 'className' | 'href'
  >) {
  return (
    <Link
      href={href}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow ? <Arrow /> : null}
    </Link>
  )
}
