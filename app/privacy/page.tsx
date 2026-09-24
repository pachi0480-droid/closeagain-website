import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/layout/Legal'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What the CloseAgain website collects, what happens to it, and what is not being collected. A pre-launch draft describing what this site actually does today.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const sections: LegalSection[] = [
  {
    id: 'scope',
    heading: 'What this covers',
    body: (
      <>
        <p>
          This covers the CloseAgain website only. CloseAgain is pre-launch:
          there is no product running, no customer accounts, and nothing here
          is processing anybody&rsquo;s job or call data yet.
        </p>
        <p>
          When the product does launch, it will handle information about real
          homeowners and real jobs, and that will need its own reviewed policy.
          This page is not that policy and does not pretend to be.
        </p>
      </>
    ),
  },
  {
    id: 'collected',
    heading: 'What we collect',
    body: (
      <>
        <p>
          Only what you type into the early-access form: your name, work email,
          company, and optionally a phone number, your trade, team size,
          monthly lead volume, and where you lose the most opportunities.
        </p>
        <p>
          The form is the only thing on this site that collects anything. If you
          do not submit it, we do not have your details.
        </p>
      </>
    ),
  },
  {
    id: 'not-collected',
    heading: 'What we do not collect',
    body: (
      <>
        <p>
          No analytics provider is installed on this site, so we are not
          tracking page views, sessions, scroll depth, or anything else about
          how you use it. No advertising or tracking pixels are embedded.
        </p>
        <p>
          The site sets no cookies of its own. There is no consent banner
          because there is nothing to consent to.
        </p>
        <p>
          If analytics are added later, this section gets updated before they go
          live rather than after.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    heading: 'What we do with it',
    body: (
      <>
        <p>
          We use it to contact you about early access and the pilot, and to
          understand what kind of operations are interested. That is the whole
          purpose.
        </p>
        <p>
          We do not sell it, rent it, or share it for anyone else&rsquo;s
          marketing.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    body: (
      <p>
        For as long as the early-access conversation is live, and afterwards
        only if you become a pilot participant. Ask us to delete your details
        and we will, without needing a reason.
      </p>
    ),
  },
  {
    id: 'rights',
    heading: 'Your choices',
    body: (
      <p>
        Write to <a href={`mailto:${site.email}`} className="link-rule text-graphite">{site.email}</a>{' '}
        to see what we hold about you, correct it, or have it deleted. Depending
        on where you live you may have additional rights under local law, and we
        will honour those requests the same way.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes',
    body: (
      <p>
        This page changes as the product does. Material changes will be
        reflected in the date at the top, and a reviewed policy will replace
        this draft before CloseAgain processes any customer data.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="September 2026"
      summary="Short version: the early-access form is the only thing on this site that collects anything, and there is no analytics or tracking installed."
      sections={sections}
    />
  )
}
