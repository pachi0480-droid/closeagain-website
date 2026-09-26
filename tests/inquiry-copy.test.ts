/**
 * The inquiry and confirmation copy: prices only from content/pricing.ts,
 * and a confirmation page that claims nothing it cannot know.
 * Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { contact, thankYou } from '../content/contact.ts'
import { planById, planSummary, planTerms, startingPriceText } from '../content/pricing.ts'
import { primaryCta } from '../content/site.ts'

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
  it('names one honest next step: an inquiry, not a checkout', () => {
    assert.equal(contact.meta.title, 'Find the right plan')
    assert.equal(contact.eyebrow, 'Find the right plan')
    assert.equal(contact.title, 'Find the right plan.')
    assert.match(contact.lede, /Nothing is charged here\.$/)
    assert.deepEqual(contact.next.steps, [
      'You send a few details',
      'We talk through fit and scope',
      'You review the plan and terms',
      'We set up CloseAgain with you',
    ])
    assert.deepEqual(contact.process, { label: 'See the full getting-started process', href: '/getting-started' })
    assert.equal(contact.form.submit, 'Send my details')
    assert.equal(contact.form.guidance, 'No payment is taken here. Please don’t include sensitive information.')
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
    assert.equal(neutral.title, 'Let’s find the right plan.')
    assert.equal(neutral.body, 'Tell us about your business and we’ll talk through fit, scope and pricing.')
    assert.deepEqual(neutral.actions.primary, primaryCta)
    assert.deepEqual(neutral.actions.secondary, { label: 'See pricing', href: '/pricing' })
    for (const text of strings(neutral)) {
      assert.doesNotMatch(text, unbacked, text)
      assert.doesNotMatch(text, /\b(thanks|thank you|received|reached)\b/i, text)
    }
  })
})
