import { ButtonLink, Wordmark } from '@/components/ui/links'
import { demoCta, footerNav, site } from '@/content/site'
import { NavLink } from './NavLink'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Wordmark />
            <p className="site-footer__tagline">{site.tagline}</p>
          </div>

          <nav id="footer-nav" className="site-footer__nav" aria-label="Footer">
            <ul>
              {footerNav.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__cta">
            <p>Ready when you are.</p>
            <ButtonLink href={demoCta.href}>{demoCta.label}</ButtonLink>
          </div>
        </div>

        <div className="site-footer__base">
          <p>
            © {year} {site.name}
          </p>
          <p>Follow up with missed inquiries and older leads.</p>
        </div>
      </div>
    </footer>
  )
}
