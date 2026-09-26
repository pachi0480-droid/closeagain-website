import type { Metadata } from 'next'
import { ClosingCta } from '@/components/editorial/blocks'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { contactFields } from '@/content/forms'
import { contact } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: contact.meta.title,
  description: contact.meta.description,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <FormPage
        id="contact"
        eyebrow={contact.eyebrow}
        title={contact.title}
        lede={contact.lede}
        form={
          <LeadForm
            kind="contact"
            fields={contactFields}
            submitLabel={contact.form.submit}
            guidance={contact.form.guidance}
          />
        }
      />

      <ClosingCta
        id="lower-title"
        title={contact.lower.title}
        body={contact.lower.body}
        cta={contact.lower.cta}
      />
    </>
  )
}
