import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { TextLink } from '@/components/ui/links'
import { contact } from '@/content/contact'
import { inquiryFields } from '@/content/forms'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: contact.meta.title,
  description: contact.meta.description,
  path: '/contact',
})

/** The inquiry: plan terms and what happens next, beside a short form. Nothing is bought here. */
export default function ContactPage() {
  const { terms, next, process, form } = contact

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
            <TextLink href={process.href} arrow className="buy-next__link">
              {process.label}
            </TextLink>
          </div>
        </div>
      }
      form={<LeadForm kind="inquiry" fields={inquiryFields} submitLabel={form.submit} guidance={form.guidance} />}
    />
  )
}
