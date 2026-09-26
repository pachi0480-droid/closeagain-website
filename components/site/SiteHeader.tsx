import { Arrow, Wordmark } from '@/components/ui/links'
import { demoCta, headerNav, menuNav } from '@/content/site'
import Link from 'next/link'
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
          <Link href={demoCta.href} className="btn site-header__cta">
            <span>{demoCta.label}</span>
            <Arrow />
          </Link>
        </nav>

        <MobileMenu links={menuNav} cta={demoCta} />
      </div>
    </header>
  )
}
