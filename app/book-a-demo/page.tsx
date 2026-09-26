import type { Metadata } from 'next'
import { Bubble } from '@/components/art/Bubble'
import { Trio } from '@/components/editorial/blocks'
import { FormPage } from '@/components/forms/FormPage'
import { LeadForm } from '@/components/forms/LeadForm'
import { demoFields } from '@/content/forms'
import { bookDemo } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: bookDemo.meta.title,
  description: bookDemo.meta.description,
  path: '/book-a-demo',
})

/**
 * A request, not a booking: no scheduling integration exists, so the page
 * never shows times or claims a meeting is reserved.
 */
export default function BookDemoPage() {
  return (
    <>
      <FormPage
        id="demo"
        eyebrow={bookDemo.eyebrow}
        title={bookDemo.title}
        lede={bookDemo.lede}
        aside={
          <div className="form-page__exchange" aria-hidden="true">
            <Bubble tone="ask">Still interested?</Bubble>
            <Bubble tone="reply">Yes. Let’s talk.</Bubble>
          </div>
        }
        form={
          <LeadForm
            kind="demo"
            fields={demoFields}
            submitLabel={bookDemo.form.submit}
            guidance={bookDemo.form.guidance}
          />
        }
      />

      <section className="section section--ruled" aria-labelledby="lower-title">
        <div className="wrap">
          <h2 id="lower-title" className="section__title section__title--spaced">
            {bookDemo.lower.title}
          </h2>
          <Trio items={bookDemo.lower.columns} />
        </div>
      </section>
    </>
  )
}
