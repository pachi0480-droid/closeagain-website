/**
 * Legal pages.
 *
 * Both documents describe what this website actually does — the buying form,
 * hosting logs, the theme and demo storage, the short confirmation cookie —
 * and nothing it doesn't (no advertising, tracking cookies or third-party
 * analytics). If the site changes how it handles information (for example by
 * adding analytics), update the privacy policy and its effective date too.
 *
 * The service itself is governed by the proposal or agreement a customer signs;
 * the terms below cover the website.
 *
 * `status: 'placeholder'` marks a document as unfinished: the page says so, and
 * it is kept out of search results. The layout, numbering, table of contents
 * and indexing all follow from this object.
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

const effectiveDate = 'September 27, 2026'

export const privacy: LegalDocument = {
  status: 'approved',
  title: 'Privacy',
  description: 'What the CloseAgain website collects, why, and the choices you have.',
  notice: '',
  effectiveDate,
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      body: [
        'CloseAgain (“we”, “us”) makes software that captures new leads, follows up automatically and re-engages older opportunities for businesses.',
        'This policy covers this website: what it collects, why, and what you can ask us to do. Information we handle inside a customer’s CloseAgain workspace — such as that business’s own leads and conversations — is covered by that customer’s agreement with us.',
      ],
    },
    {
      id: 'information-collected',
      heading: 'Information collected',
      body: [
        'What you send us. When you use the Contact to buy form we receive what you enter: your name, business name, work email, phone number, industry, monthly lead volume, current CRM, preferred plan, main goal and any message. If you email us, we receive your message and address.',
        'What your browser sends. Like any website, our hosting provider receives standard request details — IP address, browser type, the page requested and the time — to deliver and protect the site. We also use your IP address briefly to limit repeated form submissions.',
        'What stays in your browser. The site remembers your light or dark theme choice on your device. For the current tab only, it remembers whether the homepage opening has played and any changes you make in the sample dashboard. After you send the form, a cookie lasting 30 minutes lets the confirmation page show that your request arrived.',
        'We do not use advertising cookies, tracking pixels or third-party analytics on this website.',
      ],
    },
    {
      id: 'how-information-is-used',
      heading: 'How information is used',
      body: [
        'To answer your inquiry, recommend a plan, prepare your proposal and, if you buy, set up and support your account.',
        'To run, secure and improve this website, and to meet legal obligations.',
        'We do not sell or rent your personal information, and we do not use it for unrelated advertising.',
      ],
    },
    {
      id: 'sharing',
      heading: 'Sharing and service providers',
      body: [
        'We share information only with service providers that help us run this website and deliver your inquiry to us — for example our hosting and email providers — and only so they can provide that service.',
        'We may also disclose information when the law requires it, to protect our rights or the safety of others, or as part of a merger or sale of the business, in which case this policy continues to apply to it.',
      ],
    },
    {
      id: 'retention',
      heading: 'Retention',
      body: [
        'We keep inquiry details for as long as we need them to respond to you and for ordinary business records, then delete them. If you become a customer, your account information is kept for the life of your account and as your agreement describes.',
      ],
    },
    {
      id: 'your-choices',
      heading: 'Your choices and rights',
      body: [
        `You can ask us to show you, correct or delete the information you have given us, or to stop following up with you, by emailing ${site.email}. We answer within 30 days. Depending on where you live, you may have further rights under local law, and we will honour them.`,
        'You can clear the theme setting and the confirmation cookie at any time through your browser’s settings.',
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      body: ['This website is for businesses and is not directed to children. We do not knowingly collect information from anyone under 16.'],
    },
    {
      id: 'security',
      heading: 'Security',
      body: [
        'The site is served only over encrypted connections, and form submissions are validated and rate-limited on our server. No method of transmission or storage is perfectly secure, but we take reasonable measures to protect what you send us.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      body: ['If we change how this website handles information, we will update this page and its effective date.'],
    },
    { id: 'contact', heading: 'Contact', body: [`For questions about this policy or your information, email ${site.email}.`] },
  ],
}

export const terms: LegalDocument = {
  status: 'approved',
  title: 'Terms',
  description: 'The terms that apply to using the CloseAgain website.',
  notice: '',
  effectiveDate,
  sections: [
    {
      id: 'agreement',
      heading: 'Agreement to these terms',
      body: [
        'These terms apply to your use of the CloseAgain website. By using it, you agree to them.',
        'If you buy CloseAgain, the service is governed by the proposal or agreement you accept at that time. Where that agreement and these terms differ, the agreement applies.',
      ],
    },
    {
      id: 'use-of-the-site',
      heading: 'Use of the website',
      body: [
        'Use the website lawfully. Do not interfere with its operation, try to gain unauthorized access, submit false or automated inquiries, or use it to send anyone unsolicited messages.',
      ],
    },
    {
      id: 'services',
      heading: 'Plans, pricing and purchases',
      body: [
        'Plans and prices are shown on the pricing page. Plans are billed monthly with no annual commitment, and setup assistance is included.',
        'Sending the Contact to buy form does not create a purchase or any obligation. Before anything is charged, we confirm your plan, usage allowance, any fees and your start date in your proposal.',
        'We may change the plans, prices or features shown here. Changes do not affect an agreement you have already accepted.',
      ],
    },
    {
      id: 'sample-content',
      heading: 'Sample content',
      body: [
        'The sample dashboard and the product views on this website use fictional people, businesses and figures. They show how CloseAgain works; they are not customer results and are not a promise of any particular outcome.',
      ],
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      body: [
        'The CloseAgain name, logo, design, text and software are ours or our licensors’. You may view and share pages of this website, but not copy, modify or reuse its content or design for another product or business without our written permission.',
      ],
    },
    {
      id: 'disclaimers',
      heading: 'Disclaimers and limitations',
      body: [
        'The website is provided “as is”. We work to keep it accurate and available, but we do not guarantee that it will always be error-free or uninterrupted.',
        'To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of this website. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      body: ['We may update these terms. The effective date above shows when they last changed, and continuing to use the website means you accept the update.'],
    },
    { id: 'contact', heading: 'Contact', body: [`For questions about these terms, email ${site.email}.`] },
  ],
}
