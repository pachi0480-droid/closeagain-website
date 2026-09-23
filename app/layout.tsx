import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { site } from '@/data/site'
import './globals.css'

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'CloseAgain — Revenue Recovery for Home Services',
    template: '%s — CloseAgain',
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  keywords: [
    'revenue recovery',
    'home services',
    'missed call recovery',
    'lead follow-up',
    'HVAC software',
    'plumbing software',
    'electrical contractor software',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
    title: 'CloseAgain — Revenue Recovery for Home Services',
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloseAgain — Revenue Recovery for Home Services',
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf9f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0f0e' },
  ],
  colorScheme: 'light',
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
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        {/* Reveals are progressive enhancement: without JS the page is simply
            all visible, rather than a column of invisible sections. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[7px] focus:bg-graphite focus:px-4 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
