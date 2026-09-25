import Link from 'next/link'
import { Wordmark } from '@/components/ui/Mark'
import { footerLinks, site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-rule bg-void text-warm-white"
    >
      <div className="shell-wide py-14 md:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              aria-label="CloseAgain — home"
              className="inline-block transition-opacity duration-300 hover:opacity-70"
            >
              <Wordmark className="text-[1.25rem] text-warm-white" />
            </Link>
            <p className="mt-3 text-[0.9375rem] text-muted">{site.category}</p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="font-mono text-mono-xs text-secondary uppercase">Site</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerLinks.site.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-muted transition-colors duration-300 hover:text-warm-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-mono text-mono-xs text-secondary uppercase">Contact</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-[0.9375rem] underline decoration-steel underline-offset-4 hover:decoration-signal text-muted transition-colors duration-300 hover:text-warm-white"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <Link
                    href="/#audit"
                    className="text-[0.9375rem] text-muted transition-colors duration-300 hover:text-warm-white"
                  >
                    Find my revenue gap
                  </Link>
                </li>
                <li className="text-[0.9375rem] text-secondary">United States</li>
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-mono-xs text-secondary uppercase">Legal</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerLinks.legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-muted transition-colors duration-300 hover:text-warm-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-rule" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-mono-xs text-secondary uppercase">
            © {year} {site.name}
          </p>
          <p className="max-w-lg font-mono text-mono-xs text-secondary uppercase sm:text-right">
            Pre-launch · product views on this site are illustrative
          </p>
        </div>
      </div>
    </footer>
  )
}
