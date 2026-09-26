import type { Metadata } from 'next'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { purchaseFields } from '@/content/forms'
import { contact } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: contact.meta.title,
  description: contact.meta.description,
  path: '/contact',
})

/** The buying experience: terms and next steps beside a considered form. */
export default function ContactPage() {
  const { terms, next, form } = contact

  return (
    <FormPage
      id="buy"
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
            <ol className="buy-next__steps">
              {next.steps.map((step, i) => (
                <li key={step}>
                  <span className="buy-next__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      }
      form={<LeadForm kind="purchase" fields={purchaseFields} submitLabel={form.submit} guidance={form.guidance} />}
    />
  )
}
