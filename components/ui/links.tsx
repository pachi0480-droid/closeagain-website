import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/** The thin arrow from the reference buttons. Decorative: the label carries meaning. */
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {/* Two strokes, so on hover the shaft can stretch while the head moves on. */}
      <path className="arrow__shaft" d="M2.5 10h14" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="square" />
      <path
        className="arrow__head"
        d="M11.2 4.6 16.6 10l-5.4 5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="square"
      />
    </svg>
  )
}

/**
 * The sample demo is a separate, much heavier app (its own stylesheet and
 * data). Marketing pages open it on click and never prefetch it, so visitors
 * who don't open it never download it.
 */
export const prefetchFor = (href: ComponentProps<typeof Link>['href']) =>
  typeof href === 'string' && href.startsWith('/demo') ? false : undefined

type LinkProps = Omit<ComponentProps<typeof Link>, 'className' | 'children'> & {
  children: ReactNode
  className?: string
}

/** Black rectangular button. Arrow on by default, as in the reference. */
export function ButtonLink({
  children,
  size,
  arrow = true,
  className,
  ...props
}: LinkProps & { size?: 'lg'; arrow?: boolean }) {
  const classes = ['btn', size === 'lg' && 'btn--lg', className].filter(Boolean).join(' ')
  return (
    <Link className={classes} prefetch={prefetchFor(props.href)} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  )
}

/** Underlined text link, optionally with an arrow. */
export function TextLink({
  children,
  arrow = false,
  className,
  ...props
}: LinkProps & { arrow?: boolean }) {
  return (
    <Link className={['text-link', className].filter(Boolean).join(' ')} prefetch={prefetchFor(props.href)} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={['wordmark', className].filter(Boolean).join(' ')}>
      CloseAgain
    </Link>
  )
}
