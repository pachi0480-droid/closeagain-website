/**
 * Legal pages.
 *
 * No approved policy text exists yet, so both documents are deliberately
 * unfinished: policy sections are marked placeholders, and the pages ask
 * search engines not to index them. Only the business contact is confirmed.
 *
 * To publish: set `status` to 'approved', add `effectiveDate`, and replace each
 * section's `body` with the approved paragraphs. The layout, numbering, table of
 * contents and indexing all follow from this object.
 */

import { site } from './site.ts'

export type LegalSection = {
  id: string
  heading: string
  /** Approved paragraphs. Empty while the document is a placeholder. */
  body: string[]
}

export type LegalDocument = {
  status: 'placeholder' | 'approved'
  title: string
  description: string
  notice: string
  effectiveDate: string | null
  sections: LegalSection[]
}

const placeholder = (id: string, heading: string): LegalSection => ({ id, heading, body: [] })

export const privacy: LegalDocument = {
  status: 'placeholder',
  title: 'Privacy',
  description: 'The CloseAgain privacy policy.',
  notice: 'Approved privacy policy required before publishing.',
  effectiveDate: null,
  sections: [
    placeholder('who-we-are', 'Who we are'),
    placeholder('information-collected', 'Information collected'),
    placeholder('how-information-is-used', 'How information is used'),
    placeholder('sharing', 'Sharing and service providers'),
    placeholder('retention', 'Retention'),
    placeholder('your-choices', 'Your choices and rights'),
    { id: 'contact', heading: 'Contact', body: [`For questions, email ${site.email}.`] },
  ],
}

export const terms: LegalDocument = {
  status: 'placeholder',
  title: 'Terms',
  description: 'The terms that apply to using the CloseAgain website.',
  notice: 'Approved terms required before publishing.',
  effectiveDate: null,
  sections: [
    placeholder('agreement', 'Agreement to these terms'),
    placeholder('use-of-the-site', 'Use of the website'),
    placeholder('services', 'Services'),
    placeholder('intellectual-property', 'Intellectual property'),
    placeholder('disclaimers', 'Disclaimers and limitations'),
    placeholder('changes', 'Changes to these terms'),
    { id: 'contact', heading: 'Contact', body: [`For questions, email ${site.email}.`] },
  ],
}
