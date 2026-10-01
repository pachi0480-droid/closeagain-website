import type { Metadata } from 'next'
import { Bubble } from '@/components/art/Bubble'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { notFound } from '@/content/pages'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="lost" aria-labelledby="page-title">
          <div className="lost__inner wrap">
            <div className="lost__code-wrap" aria-hidden="true">
              <p className="lost__code">{notFound.code}</p>
              <div className="lost__chat" data-chat>
                <Bubble tone="ask" className="lost__bubble">
                  Still there?
                </Bubble>
              </div>
            </div>

            <div className="lost__copy">
              <p className="eyebrow">Page not found</p>
              <h1 id="page-title" className="lost__title">
                {notFound.title}
              </h1>
              <p className="lost__body">{notFound.body}</p>
              <div className="lost__actions">
                <ButtonLink href={notFound.primary.href} size="lg">
                  {notFound.primary.label}
                </ButtonLink>
                <TextLink href={notFound.secondary.href}>{notFound.secondary.label}</TextLink>
              </div>
              <nav className="lost__links" aria-label="Other pages">
                <ul>
                  {notFound.links.map((link) => (
                    <li key={link.href}>
                      <TextLink href={link.href} arrow>
                        {link.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
