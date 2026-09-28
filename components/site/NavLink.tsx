'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { prefetchFor } from '@/components/ui/links'

/** A link that marks itself as the current page. */
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname()
  const current = pathname === href
  return <Link href={href} aria-current={current ? 'page' : undefined} prefetch={prefetchFor(href)} {...props} />
}
