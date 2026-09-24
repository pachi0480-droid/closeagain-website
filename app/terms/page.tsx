import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/layout/Legal'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'Terms for using the CloseAgain website while the product is pre-launch, including what the pricing and product views on this site do and do not represent.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

const sections: LegalSection[] = [
  {
    id: 'status',
    heading: 'Status of this site',
    body: (
      <>
        <p>
          CloseAgain is pre-launch. This website describes a product that is
          being built. Nothing on it is an offer of a live service, and
          submitting the early-access form does not create an agreement between
          us or reserve anything.
        </p>
        <p>
          Any actual engagement — a pilot, an implementation, a subscription —
          would be set out in a separate written agreement.
        </p>
      </>
    ),
  },
  {
    id: 'product-views',
    heading: 'Product views are illustrative',
    body: (
      <>
        <p>
          Every interface shown on this site is a designed illustration of how
          CloseAgain is intended to work. They are labelled as such where they
          appear. None of them are screenshots of a running system, and none of
          them show real customers, real calls, or real jobs.
        </p>
        <p>
          The timestamps, messages and appointment details in those views are
          written examples.
        </p>
      </>
    ),
  },
  {
    id: 'pricing',
    heading: 'Pricing',
    body: (
      <>
        <p>
          The monthly prices shown are our current intended pricing. They are
          not a quote, and they may change before launch. Pilot terms are agreed
          directly and confirmed in writing before anything is set up.
        </p>
        <p>
          No payment is taken through this website.
        </p>
      </>
    ),
  },
  {
    id: 'calculator',
    heading: 'The calculator',
    body: (
      <p>
        The revenue recovery calculator multiplies four numbers that you supply.
        It is an illustration of your own assumptions, not a forecast, a
        benchmark, or a representation of results you will achieve. The page
        itself lists what the model ignores. Do not treat its output as a
        projection.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Using this site',
    body: (
      <p>
        Use it normally. Do not attempt to disrupt it, scrape it at volume, or
        submit the form with someone else&rsquo;s details.
      </p>
    ),
  },
  {
    id: 'liability',
    heading: 'No warranty',
    body: (
      <p>
        This site is provided as it is, without warranties of any kind. We are
        not liable for decisions made on the basis of information published
        here while the product is pre-launch — including, specifically, anything
        the calculator outputs.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about these terms go to{' '}
        <a href={`mailto:${site.email}`} className="link-rule text-graphite">
          {site.email}
        </a>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="September 2026"
      summary="Short version: CloseAgain has not launched, the product views here are illustrations rather than screenshots, and the prices are intended pricing rather than a quote."
      sections={sections}
    />
  )
}
