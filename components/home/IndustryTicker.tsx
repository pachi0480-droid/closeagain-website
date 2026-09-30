import Link from 'next/link'
import { home } from '@/content/home'
import { industries } from '@/content/industries'
import { TickerEase } from './TickerEase'

/**
 * Who it is for, said in the first screen: the industries run past in the
 * display face, each linking to its own page. The list is written twice so
 * the loop is seamless; the copy is hidden from assistive technology and
 * the keyboard. Hovering or focusing eases it to a stop (TickerEase), and
 * with reduced motion it is simply a wrapped line (home.css).
 */
export function IndustryTicker() {
  const { lead, label } = home.ticker
  // “Other lead-driven businesses” is a page, not a name to run past.
  const names = industries.filter((industry) => industry.id !== 'other')

  return (
    <nav className="ticker" aria-label={label}>
      <div className="ticker__inner">
        <p className="ticker__lead eyebrow" aria-hidden="true">
          {lead}
        </p>
        <div className="ticker__viewport">
          <div className="ticker__track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="ticker__list" aria-hidden={copy === 1 || undefined}>
                {names.map((industry) => (
                  <li key={industry.id} className="ticker__item">
                    <Link href={industry.path} className="ticker__link" tabIndex={copy === 1 ? -1 : undefined}>
                      {industry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <TickerEase />
    </nav>
  )
}
