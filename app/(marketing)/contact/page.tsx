import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { DirectEmailCard } from '@/components/forms/DirectEmailCard'
import { TextLink } from '@/components/ui/links'
import { contact } from '@/content/contact'
import { industryOptions, inquiryFields } from '@/content/forms'
import { planById } from '@/content/pricing'
import { parseWebhookUrl } from '@/lib/forms/delivery'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: contact.meta.title,
  description: contact.meta.description,
  path: '/contact',
})

/** The inquiry: plan terms and what happens next, beside a short form. Nothing is bought here. */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[]; industry?: string | string[] }>
}) {
  const { terms, next, process: processLink, form } = contact
  // Reading searchParams opts this page into request-time rendering. This
  // decision must use the server's current configuration, never a build-time
  // snapshot or a NEXT_PUBLIC_ variable exposing the delivery destination.
  const query = await searchParams
  const selectedPlan = planById(typeof query.plan === 'string' ? query.plan : undefined)
  const selectedIndustry = industryOptions.find((option) => option.value === query.industry)?.value
  const canSubmit = Boolean(parseWebhookUrl(process.env.FORMS_WEBHOOK_URL))

  return (
    <FormPage
      id="inquiry"
      eyebrow={contact.eyebrow}
      title={contact.title}
      lede={contact.lede}
      aside={
        <div className="buy-aside">
          <ul className="buy-terms">
            {terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
          <div className="buy-next">
            <h2 className="buy-next__title">{next.title}</h2>
            {/* role="list" keeps list semantics in Safari once markers are removed. */}
            <ol className="buy-next__steps" role="list">
              {next.steps.map((step, i) => (
                <li key={step}>
                  <span className="buy-next__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <TextLink href={processLink.href} arrow className="buy-next__link">
              {processLink.label}
            </TextLink>
          </div>
        </div>
      }
      form={
        canSubmit ? (
          <div className="contact-form">
            <LeadForm
              kind="inquiry"
              fields={inquiryFields}
              submitLabel={form.submit}
              guidance={form.guidance}
              initialPlan={selectedPlan?.id}
              initialIndustry={selectedIndustry}
            />
            <p className="contact-form__email">
              {contact.email.formAlternative}{' '}
              <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
            </p>
          </div>
        ) : (
          <DirectEmailCard plan={selectedPlan} industry={selectedIndustry} />
        )
      }
    />
  )
}
