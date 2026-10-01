import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { OrderSummary } from '@/components/forms/OrderSummary'
import { contact } from '@/content/contact'
import { formMessages, industryOptions, inquiryFields } from '@/content/forms'
import { planById } from '@/content/pricing'
import { booking } from '@/content/site'
import { resolveDelivery } from '@/lib/forms/delivery'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: contact.meta.title,
  description: contact.meta.description,
  path: '/contact',
})

/**
 * Contact to buy, laid out as a checkout: the form (choose a plan, tell us
 * about the business, send) beside a live order summary and what happens next.
 * With a delivery destination configured (email through Resend, a webhook, or
 * both), the form submits to it and only confirms after it answers. Without
 * one, the same form hands the details to the visitor's email app, addressed
 * to the business — never a dead end, and never a false “sent”. Nothing is
 * charged here.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[]; industry?: string | string[] }>
}) {
  const { form } = contact
  // Reading searchParams opts this page into request-time rendering. This
  // decision must use the server's current configuration, never a build-time
  // snapshot or a NEXT_PUBLIC_ variable exposing the delivery destination.
  const query = await searchParams
  const selectedPlan = planById(typeof query.plan === 'string' ? query.plan : undefined)
  const selectedIndustry = industryOptions.find((option) => option.value === query.industry)?.value
  const canSubmit = resolveDelivery() !== null

  return (
    <FormPage
      eyebrow={contact.eyebrow}
      title={contact.title}
      lede={contact.lede}
      className="form-page--checkout"
      aside={<OrderSummary initialPlan={selectedPlan?.id} />}
      form={
        <div className="contact-form">
          <LeadForm
            kind="inquiry"
            fields={inquiryFields}
            submitLabel={canSubmit ? form.submit : formMessages.email.submit}
            guidance={canSubmit ? form.guidance : formMessages.email.guidance}
            initialPlan={selectedPlan?.id}
            initialIndustry={selectedIndustry}
            emailTo={canSubmit ? undefined : contact.email.address}
          />
          {booking && (
            <p className="contact-form__email contact-form__booking">
              {booking.lead}{' '}
              <a href={booking.href} target="_blank" rel="noopener noreferrer">
                {booking.label}
              </a>
            </p>
          )}
          <p className="contact-form__email">
            {contact.email.formAlternative} <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
          </p>
        </div>
      }
    />
  )
}
