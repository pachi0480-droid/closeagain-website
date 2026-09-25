'use client'

import type { ReactNode } from 'react'

const control =
  'w-full rounded-[8px] border bg-warm-white/[0.035] px-3.5 py-3 text-[0.9375rem] text-warm-white ' +
  'transition-[border-color,background-color] duration-300 placeholder:text-secondary ' +
  'hover:bg-warm-white/[0.06] focus:bg-warm-white/[0.06] focus:outline-none'

export function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 font-mono text-mono-xs text-muted uppercase"
      >
        {label}
        {optional ? <span className="text-secondary">Optional</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] text-risk">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function TextInput({
  invalid,
  className = '',
  ...rest
}: React.ComponentProps<'input'> & { invalid?: boolean }) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${rest.id}-error` : undefined}
      className={`${control} ${
        invalid
          ? 'border-risk/70 focus:border-risk'
          : 'border-steel focus:border-warm-white/45'
      } ${className}`}
    />
  )
}

export function SelectInput({
  invalid,
  children,
  className = '',
  ...rest
}: React.ComponentProps<'select'> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        {...rest}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${rest.id}-error` : undefined}
        className={`${control} appearance-none pr-10 ${
          invalid
            ? 'border-risk/70 focus:border-risk'
            : 'border-steel focus:border-warm-white/45'
        } ${className}`}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 10 6"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 h-1.5 w-2.5 -translate-y-1/2 text-secondary"
      >
        <path
          d="M1 1l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
