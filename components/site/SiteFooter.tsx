import { ButtonLink, Wordmark } from '@/components/ui/links'
import { planTerms } from '@/content/pricing'
import { footerGroups, primaryCta, site } from '@/content/site'
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
            <div className="site-footer__cta">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              <p>{planTerms.join('\u00A0· ')}</p>
            </div>
          </div>

          <nav id="footer-nav" className="site-footer__nav" aria-label="Footer">
            {footerGroups.map((group) => (
              <div key={group.title} className="site-footer__group">
                <p className="site-footer__group-title">{group.title}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <NavLink href={link.href}>{link.label}</NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__base">
          <p>
            © {year} {site.name}
          </p>
          <p>{site.category}</p>
        </div>
      </div>
    </footer>
  )
}
