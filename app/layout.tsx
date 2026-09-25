import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { site } from '@/data/site'
import './globals.css'

/**
 * One engineered grotesk and one technical mono. Both are variable fonts
 * served from the same origin as the page, so the whole type system costs two
 * requests and never flashes a fallback metric.
 */
const sans = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'CloseAgain — Turn Demand Into Booked Jobs',
    template: '%s — CloseAgain',
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  keywords: [
    'demand to revenue',
    'home services',
    'missed call recovery',
    'lead follow-up',
    'estimate follow-up',
    'HVAC software',
    'plumbing software',
    'roofing software',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
    title: 'CloseAgain — Turn Demand Into Booked Jobs',
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloseAgain — Turn Demand Into Booked Jobs',
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#080a09',
  colorScheme: 'dark',
}

/** Truthful structured data only: who we are and what the site is. */
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: `${site.category}. ${site.promise}`,
      email: site.email,
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        {/* Reveals are progressive enhancement: without JS the page is simply
            all visible, rather than a column of invisible sections. */}
        <noscript>
          <style>{
            `[data-reveal]{opacity:1!important;transform:none!important}` +
            `[data-step]{opacity:1!important;visibility:visible!important;transform:none!important}`
          }</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[8px] focus:bg-signal focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
