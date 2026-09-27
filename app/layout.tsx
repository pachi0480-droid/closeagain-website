import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Source_Serif_4 } from 'next/font/google'
import { MotionController } from '@/components/site/MotionController'
import { home } from '@/content/home'
import { isIndexable, site } from '@/content/site'
import './globals.css'

/**
 * Display: DM Serif Display — the closest openly licensed match found for the
 * reference headline (high contrast, bracketed serifs, large x-height). It is
 * a substitution, not the reference's exact face.
 *
 * Text: Source Serif 4 — DM Serif Display was drawn from the Source Serif
 * design, so the two sit together naturally. Two static weights (400 for
 * reading, 600 for labels) keep the download small.
 *
 * Both are self-hosted by next/font with metric-matched fallbacks, so the
 * layout does not move when the web fonts arrive.
 */
const display = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const text = Source_Serif_4({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

/**
 * Base for absolute share-image URLs. Production uses the configured origin;
 * a preview uses its own deployment host so its share card still resolves.
 * Canonical URLs are emitted only for the configured origin (see lib/seo.ts).
 */
const metadataBase = new URL(
  site.origin ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`),
)

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: home.meta.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#f2efe7',
  colorScheme: 'light',
}

/**
 * Runs before first paint:
 *  - skips the homepage entrance if it already played this session
 *  - enables scroll reveals only when the browser can run them, with a
 *    failsafe that shows everything if the app script never starts
 */
const boot = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('ca:intro'))d.setAttribute('data-intro','seen')}catch(e){}if('IntersectionObserver' in window){d.classList.add('js-reveal');setTimeout(function(){if(!window.__caMotion)d.classList.remove('js-reveal')},4000)}})();`

const structuredData = site.origin
  ? {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${site.origin}/#organization`, name: site.name, url: site.origin, email: site.email },
        {
          '@type': 'WebSite',
          '@id': `${site.origin}/#website`,
          name: site.name,
          url: site.origin,
          inLanguage: 'en-US',
          publisher: { '@id': `${site.origin}/#organization` },
        },
      ],
    }
  : null

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <MotionController />
        {structuredData && (
          <script
            type="application/ld+json"
            // Static, author-controlled object — no visitor input reaches this.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </body>
    </html>
  )
}
