import Link from 'next/link'
import { Wordmark } from '@/components/ui/Mark'
import { footerLinks, site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      data-tone="ink"
      className="on-ink border-t border-rule-ink bg-ink text-chalk"
    >
      <div className="shell py-14 md:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark className="text-[1.25rem] text-chalk" />
            <p className="mt-3 text-[0.9375rem] text-chalk-2">{site.category}</p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="font-mono text-mono-xs text-chalk-3 uppercase">Site</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-chalk-2 transition-colors duration-300 hover:text-chalk"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-mono text-mono-xs text-chalk-3 uppercase">Contact</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-rule text-[0.9375rem] text-chalk-2 transition-colors duration-300 hover:text-chalk"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="text-[0.9375rem] text-chalk-3">
                  United States
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-rule-ink" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-mono-xs text-chalk-3 uppercase">
            © {year} {site.name}
          </p>
          <p className="max-w-lg font-mono text-mono-xs text-chalk-3 uppercase sm:text-right">
            Pre-launch · product views on this site are illustrative
          </p>
        </div>
      </div>
    </footer>
  )
}
