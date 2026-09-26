import Link from 'next/link'
import { Arrow, Wordmark } from '@/components/ui/links'
import { headerNav, menuNav, primaryCta } from '@/content/site'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner wrap">
        <Wordmark />

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {headerNav.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} className="site-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <Link href={primaryCta.href} className="btn site-header__cta">
            <span>{primaryCta.label}</span>
            <Arrow />
          </Link>
          <MobileMenu links={menuNav} cta={primaryCta} />
        </div>
      </div>
    </header>
  )
}
