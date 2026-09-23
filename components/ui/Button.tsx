'use client'

import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'
type Tone = 'light' | 'ink'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 rounded-[7px] ' +
  'font-medium tracking-[-0.01em] whitespace-nowrap ' +
  'transition-[background-color,border-color,color,transform] duration-300 ' +
  '[transition-timing-function:var(--ease-out-quiet)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-50'

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-[3.25rem] px-6 text-base',
}

const styles: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: 'bg-graphite text-paper hover:bg-recover-deep',
    secondary:
      'border border-rule text-graphite hover:border-graphite/35 hover:bg-graphite/[0.04]',
    quiet: 'text-graphite-2 hover:text-graphite',
  },
  ink: {
    primary: 'bg-chalk text-ink hover:bg-recover-bright',
    secondary:
      'border border-rule-ink text-chalk hover:border-chalk/35 hover:bg-chalk/[0.06]',
    quiet: 'text-chalk-2 hover:text-chalk',
  },
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`caret h-[0.6rem] w-[0.72rem] ${className}`}
    >
      <path
        d="M0.75 5h9.5M7 1.5 10.5 5 7 8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type CommonProps = {
  variant?: Variant
  tone?: Tone
  size?: Size
  withArrow?: boolean
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  tone = 'light',
  size = 'md',
  withArrow = false,
  className = '',
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<'button'>, 'children' | 'className'>) {
  return (
    <button
      className={`${base} ${sizes[size]} ${styles[tone][variant]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow ? <Arrow /> : null}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  tone = 'light',
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
      className={`${base} ${sizes[size]} ${styles[tone][variant]} ${className}`}
      {...rest}
    >
      {children}
      {withArrow ? <Arrow /> : null}
    </Link>
  )
}
