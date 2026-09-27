/**
 * The inquiry and confirmation copy: prices only from content/pricing.ts,
 * and a confirmation page that claims nothing it cannot know.
 * Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { contact, thankYou } from '../content/contact.ts'
import { formMessages } from '../content/forms.ts'
import { planById, planSummary, planTerms, startingPriceText } from '../content/pricing.ts'
import { primaryCta, site } from '../content/site.ts'

/** Every file this part of the site owns that could carry visitor-facing words. */
const ownedFiles = [
  'content/contact.ts',
  'content/forms.ts',
  'components/forms/FormPage.tsx',
  'components/forms/LeadForm.tsx',
  'app/(marketing)/contact/page.tsx',
  'app/(marketing)/thank-you/page.tsx',
  'app/api/forms/[kind]/route.ts',
  'lib/forms/body.ts',
  'lib/forms/delivery.ts',
  'lib/forms/process.ts',
  'lib/forms/protocol.ts',
  'lib/forms/rate-limit.ts',
  'lib/forms/receipt.ts',
  'lib/forms/schema.ts',
  'lib/forms/state.ts',
  'lib/forms/transport.ts',
]

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

/** Every string in a nested copy object. */
const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : value && typeof value === 'object'
      ? Object.values(value).flatMap(strings)
      : []

describe('prices', () => {
  it('are never typed outside content/pricing.ts', () => {
    for (const path of ownedFiles) assert.doesNotMatch(read(path), /\$\s?\d/, path)
  })

  it('reach the contact page from the pricing module', () => {
    assert.deepEqual(contact.terms, planTerms)
    assert.ok(contact.meta.description.includes(startingPriceText))
  })
})

describe('contact page copy', () => {
  it('reads as buying, and says plainly that nothing is charged here', () => {
    assert.equal(contact.meta.title, 'Contact to buy')
    assert.equal(contact.eyebrow, 'Contact to buy')
    assert.equal(contact.title, 'Ready to close more conversations?')
    assert.deepEqual(contact.next.steps, [
      'Send your information',
      'We confirm the setup',
      'Connect your tools',
      'Launch CloseAgain',
    ])
    assert.deepEqual(contact.process, { label: 'What happens after you buy', href: '/after-you-buy' })
    assert.equal(contact.form.submit, 'Send my details')
    assert.match(contact.form.guidance, /No payment is taken here/)
    assert.equal(contact.email.address, site.email)
  })

  it('hands details to an email draft without claiming anything was sent', () => {
    assert.match(formMessages.email.guidance, /you press send/)
    assert.match(formMessages.email.guidance, /No payment is taken here/)
    for (const text of [formMessages.email.opened(site.email), formMessages.email.returned(site.email)]) {
      assert.ok(text.includes(site.email), text)
      assert.doesNotMatch(text, /\b(we (have )?(sent|received)|we’ve (sent|received)|thank you|thanks)\b/i, text)
    }
  })
})

describe('confirmation copy', () => {
  // A booked meeting, a payment, a sent email or a response time would all be
  // claims the site cannot back up at this point.
  const unbacked =
    /\b(booked|scheduled|appointment|charged|paid|invoice|receipt|we(’|')?ve (sent|emailed)|we (sent|emailed)|check your (inbox|email)|within|hours?|minutes?|business days?|today|tomorrow|shortly|soon|asap)\b/i

  it('claims only what the receipt proves', () => {
    const received = thankYou.received
    assert.equal(received.eyebrow, 'Inquiry received')
    assert.equal(received.title, 'Thanks — we have your details.')
    assert.equal(received.body, 'Your inquiry reached the CloseAgain team.')
    assert.equal(received.payment, 'No payment has been taken.')
    assert.equal(received.next.steps.length, 3)
    for (const text of [...strings(received), received.plan('Core')]) assert.doesNotMatch(text, unbacked, text)
  })

  it('names the plan only through the pricing module', () => {
    const growth = planById('growth')!
    assert.equal(thankYou.received.plan(planSummary(growth)), `You asked about ${planSummary(growth)}.`)
  })

  it('stays neutral without a receipt', () => {
    const neutral = thankYou.neutral
    assert.equal(neutral.title, 'Ready to close more conversations?')
    assert.equal(neutral.body, 'Choose a plan and tell us about your business. We’ll confirm the right setup.')
    assert.deepEqual(neutral.actions.primary, primaryCta)
    assert.deepEqual(neutral.actions.secondary, { label: 'See pricing', href: '/pricing' })
    for (const text of strings(neutral)) {
      assert.doesNotMatch(text, unbacked, text)
      assert.doesNotMatch(text, /\b(thanks|thank you|received|reached)\b/i, text)
    }
  })
})
