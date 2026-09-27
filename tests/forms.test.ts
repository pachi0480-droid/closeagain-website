/**
 * Submission behaviour: the parts that must never quietly lie to a visitor.
 * Run with `npm test` (Node's built-in runner; no extra dependencies).
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formMessages, goalOptions, industryOptions, inquiryFields, planOptions, unsurePlan } from '../content/forms.ts'
import { plans } from '../content/pricing.ts'
import { site } from '../content/site.ts'
import { readTextWithin } from '../lib/forms/body.ts'
import { buildNotification, buildPayload, parseWebhookUrl, resendEndpoint, resolveDelivery, type Delivery } from '../lib/forms/delivery.ts'
import { processSubmission } from '../lib/forms/process.ts'
import { endpointFor, fallbackFor, fallbackIds, formPageFor, redirectPathFor } from '../lib/forms/protocol.ts'
import { createRateLimiter } from '../lib/forms/rate-limit.ts'
import { decodeReceipt, encodeReceipt, receiptFor } from '../lib/forms/receipt.ts'
import { fieldsFor, formKinds, isFormKind, validateSubmission } from '../lib/forms/schema.ts'
import { formReducer, initialFormState, type FormState } from '../lib/forms/state.ts'
import { sendSubmission } from '../lib/forms/transport.ts'

/** The four answers the form asks for up front — nothing else is needed. */
const minimal = {
  name: '  Sam   Rivera ',
  email: 'sam@example.com',
  business: 'Rivera & Co',
  goal: 'both',
}

const complete = {
  ...minimal,
  plan: 'growth',
  phone: '(555) 010-2030',
  industry: 'Home services',
  volume: '50–200 a month',
  crm: 'A spreadsheet',
  message: 'Mostly quote requests.\r\n\r\n\r\nSome go quiet.',
}

const fieldNames = inquiryFields.map((field) => field.name)

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const fetchReturning = (response: Response | (() => Promise<Response>)) =>
  (async () => (typeof response === 'function' ? response() : response)) as unknown as typeof fetch

/** A fetch that never answers until its signal aborts, as a stalled server would. */
const hangingFetch = ((_url: unknown, init: RequestInit) =>
  new Promise((_resolve, reject) => {
    // AbortSignal.timeout does not keep Node's event loop alive, so hold it
    // open with a real timer until the abort fires (as a live server would).
    const keepAlive = setTimeout(() => {}, 5000)
    init.signal?.addEventListener('abort', () => {
      clearTimeout(keepAlive)
      reject(init.signal?.reason)
    })
  })) as unknown as typeof fetch

describe('form definition', () => {
  it('is one form, the inquiry, posted to /api/forms/inquiry from /contact', () => {
    assert.deepEqual(formKinds, ['inquiry'])
    assert.equal(isFormKind('inquiry'), true)
    assert.equal(isFormKind('purchase'), false)
    assert.equal(isFormKind('constructor'), false)
    assert.equal(endpointFor('inquiry'), '/api/forms/inquiry')
    assert.equal(formPageFor.inquiry, '/contact')
    assert.equal(fieldsFor('inquiry'), inquiryFields)
  })

  it('shows every buying field in reading order, nothing hidden', () => {
    assert.deepEqual(
      inquiryFields.map((field) => field.name),
      ['name', 'business', 'email', 'phone', 'industry', 'volume', 'crm', 'plan', 'goal', 'message'],
    )
    for (const field of inquiryFields) assert.equal(field.group, undefined, field.name)
  })

  it('requires only name, business, email and goal, and marks the rest optional', () => {
    const required = inquiryFields.filter((field) => field.required).map((field) => field.name)
    assert.deepEqual(required, ['name', 'business', 'email', 'goal'])
    for (const field of inquiryFields) {
      if (!field.required && field.name !== 'plan') assert.equal(field.hint, 'Optional', field.name)
    }
  })

  it('never forces a plan: it defaults to “not sure yet” and offers every plan', () => {
    const plan = inquiryFields.find((field) => field.name === 'plan')!
    assert.equal(plan.required, false)
    assert.equal(plan.defaultValue, unsurePlan)
    assert.equal(plan.placeholderOption, undefined)
    assert.deepEqual(
      planOptions.map((option) => option.value),
      [unsurePlan, ...plans.map((p) => p.id)],
    )
    assert.equal(planOptions[0].label, 'Not sure yet')
  })

  it('uses stable slugs for the goal', () => {
    assert.deepEqual(
      goalOptions.map((option) => option.value),
      ['new-inquiries', 'older-leads', 'both', 'appointments', 'other'],
    )
  })

  it('keeps industry values equal to their labels, which ?industry= links rely on', () => {
    for (const option of industryOptions) assert.equal(option.value, option.label)
  })
})

describe('validation', () => {
  it('accepts the minimal set and fills in the defaults', () => {
    const result = validateSubmission('inquiry', minimal)
    assert.equal(result.ok, true)
    assert.equal(result.values.name, 'Sam Rivera')
    assert.equal(result.values.plan, unsurePlan)
    for (const name of ['phone', 'industry', 'volume', 'crm', 'message']) assert.equal(result.values[name], '', name)
  })

  it('accepts every optional field when it is filled in properly', () => {
    const result = validateSubmission('inquiry', complete)
    assert.equal(result.ok, true)
    assert.equal(result.values.message, 'Mostly quote requests.\n\nSome go quiet.')
  })

  it('treats an empty or missing plan as “not sure yet”, and accepts it explicitly', () => {
    assert.equal(validateSubmission('inquiry', { ...minimal, plan: '' }).values.plan, unsurePlan)
    assert.equal(validateSubmission('inquiry', { ...minimal, plan: '   ' }).values.plan, unsurePlan)
    const explicit = validateSubmission('inquiry', { ...minimal, plan: 'unsure' })
    assert.equal(explicit.ok, true)
    assert.equal(explicit.values.plan, unsurePlan)
    for (const plan of plans) assert.equal(validateSubmission('inquiry', { ...minimal, plan: plan.id }).ok, true, plan.id)
  })

  it('rejects a plan or goal that is not on the list', () => {
    for (const plan of ['platinum', 'Growth', 'growth-plus', '__proto__', 'constructor']) {
      const result = validateSubmission('inquiry', { ...minimal, plan })
      assert.equal(result.ok, false, plan)
      if (!result.ok) assert.ok(result.errors.plan, plan)
    }
    for (const goal of ['Both new and old leads', 'Respond to new inquiries faster', 'everything']) {
      const result = validateSubmission('inquiry', { ...minimal, goal })
      assert.equal(result.ok, false, goal)
      if (!result.ok) assert.ok(result.errors.goal, goal)
    }
    assert.equal(validateSubmission('inquiry', { ...minimal, industry: 'Mining' }).ok, false)
    assert.equal(validateSubmission('inquiry', { ...minimal, volume: 'Lots' }).ok, false)
  })

  it('reports every missing required field with its own message', () => {
    const result = validateSubmission('inquiry', { name: ' ', business: '', email: '', goal: '' })
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.deepEqual(Object.keys(result.errors).sort(), ['business', 'email', 'goal', 'name'])
    assert.equal(new Set(Object.values(result.errors)).size, 4)
  })

  it('treats values that are not text as missing', () => {
    const result = validateSubmission('inquiry', { ...minimal, name: ['Sam'], email: { a: 1 }, plan: 7 })
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.deepEqual(Object.keys(result.errors).sort(), ['email', 'name'])
    assert.equal(result.values.plan, unsurePlan)
  })

  it('accepts ordinary addresses from any provider', () => {
    for (const email of ['a@gmail.com', 'first.last+crm@mail.co.uk', 'x@sub.domain.io', 'me@outlook.com']) {
      assert.equal(validateSubmission('inquiry', { ...minimal, email }).ok, true, email)
    }
  })

  it('rejects addresses that cannot receive mail', () => {
    for (const email of ['plainaddress', 'no-tld@host', 'two@@signs.com', 'spa ce@x.com', 'dots..@x.com']) {
      assert.equal(validateSubmission('inquiry', { ...minimal, email }).ok, false, email)
    }
  })

  it('accepts ordinary phone numbers and leaves the field optional', () => {
    for (const phone of ['', '(555) 010-2030', '+44 20 7946 0958', '555.010.2030']) {
      assert.equal(validateSubmission('inquiry', { ...minimal, phone }).ok, true, phone)
    }
    for (const phone of ['12345', 'call me', '+1 555 010 2030 999 888']) {
      assert.equal(validateSubmission('inquiry', { ...minimal, phone }).ok, false, phone)
    }
  })

  it('enforces length limits on every text field', () => {
    const limits: Record<string, number> = { name: 120, email: 254, business: 160, crm: 120, message: 3000 }
    for (const [name, max] of Object.entries(limits)) {
      assert.equal(inquiryFields.find((field) => field.name === name)?.max, max, name)
    }
    const long = (length: number) => 'x'.repeat(length)
    assert.equal(validateSubmission('inquiry', { ...minimal, name: long(120) }).ok, true)
    assert.equal(validateSubmission('inquiry', { ...minimal, name: long(121) }).ok, false)
    assert.equal(validateSubmission('inquiry', { ...minimal, business: long(161) }).ok, false)
    assert.equal(validateSubmission('inquiry', { ...minimal, crm: long(121) }).ok, false)
    assert.equal(validateSubmission('inquiry', { ...minimal, message: long(3000) }).ok, true)
    const tooLong = validateSubmission('inquiry', { ...minimal, message: long(3001) })
    assert.equal(tooLong.ok, false)
    if (!tooLong.ok) assert.match(tooLong.errors.message, /3,000/)
    assert.equal(validateSubmission('inquiry', { ...minimal, email: `${long(250)}@x.io` }).ok, false)
  })

  it('ignores unknown fields', () => {
    const extra = validateSubmission('inquiry', { ...minimal, admin: true, type: 'purchase' })
    assert.equal(extra.ok, true)
    assert.deepEqual(Object.keys(extra.values).sort(), [...fieldNames].sort())
  })
})

describe('webhook payload', () => {
  const now = new Date('2026-09-26T12:00:00.000Z')

  it('is typed “inquiry” and carries exactly the form’s own fields', () => {
    const checked = validateSubmission('inquiry', complete)
    assert.equal(checked.ok, true)
    const payload = buildPayload('inquiry', checked.values, now)
    assert.deepEqual(Object.keys(payload).sort(), ['fields', 'submittedAt', 'type'])
    assert.equal(payload.type, 'inquiry')
    assert.equal(payload.submittedAt, '2026-09-26T12:00:00.000Z')
    assert.deepEqual(Object.keys(payload.fields).sort(), [...fieldNames].sort())
    assert.equal(payload.fields.goal, 'both')
    assert.equal(payload.fields.plan, 'growth')
  })

  it('drops anything that is not a form field, and never omits one', () => {
    const payload = buildPayload('inquiry', { name: 'A', ca_hp: 'x', secret: 'y', type: 'purchase' }, now)
    assert.equal(payload.type, 'inquiry')
    assert.deepEqual(Object.keys(payload.fields).sort(), [...fieldNames].sort())
    assert.equal(payload.fields.name, 'A')
    assert.equal(payload.fields.plan, unsurePlan)
    assert.equal(payload.fields.email, '')
  })

  it('is exactly what the webhook receives', async () => {
    let body: unknown = null
    const delivery = resolveDelivery(
      { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
      (async (_url: unknown, init: RequestInit) => {
        body = JSON.parse(String(init.body))
        return new Response(null, { status: 204 })
      }) as unknown as typeof fetch,
    )
    const checked = validateSubmission('inquiry', minimal)
    assert.deepEqual(await delivery!.deliver('inquiry', checked.values), { ok: true })
    const sent = body as { type: string; submittedAt: string; fields: Record<string, string> }
    assert.equal(sent.type, 'inquiry')
    assert.ok(!Number.isNaN(Date.parse(sent.submittedAt)))
    assert.deepEqual(sent.fields, checked.values)
  })
})

describe('receipt', () => {
  it('encodes the kind and the chosen plan, and nothing the visitor typed', () => {
    const receipt = receiptFor('inquiry', validateSubmission('inquiry', complete).values)
    assert.deepEqual(receipt, { kind: 'inquiry', plan: 'growth' })
    assert.equal(encodeReceipt(receipt), 'inquiry:growth')
    assert.equal(encodeReceipt(receiptFor('inquiry', validateSubmission('inquiry', minimal).values)), 'inquiry:unsure')
  })

  it('decodes every value it can encode', () => {
    for (const plan of [unsurePlan, ...plans.map((p) => p.id)] as const) {
      const receipt = { kind: 'inquiry', plan } as const
      assert.deepEqual(decodeReceipt(encodeReceipt(receipt)), receipt, plan)
    }
  })

  it('treats anything tampered, stale or malformed as no receipt', () => {
    const bad = [
      undefined,
      null,
      42,
      '',
      'purchase',
      'inquiry',
      'inquiry:',
      ':growth',
      'purchase:growth',
      'purchase:unsure',
      'inquiry:platinum',
      'inquiry:Growth',
      'INQUIRY:growth',
      ' inquiry:growth',
      'inquiry:growth ',
      'inquiry:growth:scale',
      'inquiry:__proto__',
      'constructor:growth',
      'inquiry%3Agrowth',
      `inquiry:${'x'.repeat(80)}`,
    ]
    for (const value of bad) assert.equal(decodeReceipt(value), null, String(value))
  })
})

describe('request body cap', () => {
  const stream = (...parts: string[]) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const part of parts) controller.enqueue(new TextEncoder().encode(part))
        controller.close()
      },
    })

  it('reads a body within the limit', async () => {
    assert.equal(await readTextWithin(stream('name=Sam', '&goal=both'), 64), 'name=Sam&goal=both')
    assert.equal(await readTextWithin(null, 64), '')
  })

  it('stops as soon as the body passes the limit, counting bytes rather than characters', async () => {
    assert.equal(await readTextWithin(stream('x'.repeat(40), 'x'.repeat(40)), 64), null)
    // 30 characters, 90 bytes.
    assert.equal(await readTextWithin(stream('€'.repeat(30)), 64), null)
    assert.equal(await readTextWithin(stream('€'.repeat(21)), 64), '€'.repeat(21))
  })
})

describe('browser transport', () => {
  it('posts to the inquiry endpoint', async () => {
    let url = ''
    await sendSubmission('inquiry', minimal, {
      fetchImpl: (async (input: unknown) => {
        url = String(input)
        return json(200, { status: 'ok' })
      }) as unknown as typeof fetch,
    })
    assert.equal(url, '/api/forms/inquiry')
  })

  it('reports success only for HTTP 200 with an explicit confirmation', async () => {
    const ok = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(200, { status: 'ok' })) })
    assert.deepEqual(ok, { status: 'ok' })

    const bare = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(200, {})) })
    assert.equal(bare.status, 'failed')

    const accepted = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(202, { status: 'ok' })) })
    assert.equal(accepted.status, 'failed')

    const html = await sendSubmission('inquiry', minimal, {
      fetchImpl: fetchReturning(new Response('<html>ok</html>', { status: 200 })),
    })
    assert.equal(html.status, 'failed')
  })

  it('maps server answers to explainable outcomes', async () => {
    const invalid = await sendSubmission('inquiry', minimal, {
      fetchImpl: fetchReturning(json(422, { status: 'invalid', errors: { email: 'Bad email', secret: 'x' } })),
    })
    assert.deepEqual(invalid, { status: 'invalid', errors: { email: 'Bad email' } })

    const unavailable = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(503, { status: 'unavailable' })) })
    assert.equal(unavailable.status, 'unavailable')

    const busy = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(429, { status: 'busy' })) })
    assert.equal(busy.status, 'busy')

    const broken = await sendSubmission('inquiry', minimal, { fetchImpl: fetchReturning(json(500, { stack: 'Error at…' })) })
    assert.deepEqual(broken, { status: 'failed', reason: 'server' })
  })

  it('distinguishes a network failure from a timeout', async () => {
    const offline = await sendSubmission('inquiry', minimal, {
      fetchImpl: (async () => {
        throw new TypeError('Failed to fetch')
      }) as unknown as typeof fetch,
    })
    assert.deepEqual(offline, { status: 'failed', reason: 'network' })

    const hanging: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
      })
    const slow = await sendSubmission('inquiry', minimal, { fetchImpl: hanging, timeoutMs: 20 })
    assert.deepEqual(slow, { status: 'failed', reason: 'timeout' })
  })
})

describe('form state', () => {
  const submitting = formReducer(initialFormState, { type: 'submit' })

  it('ignores a second submit while one is in flight', () => {
    assert.equal(submitting.status, 'submitting')
    assert.equal(formReducer(submitting, { type: 'submit' }), submitting)
  })

  it('reaches success only from a confirmed outcome', () => {
    assert.equal(formReducer(initialFormState, { type: 'outcome', outcome: { status: 'ok' } }).status, 'idle')
    assert.equal(formReducer(submitting, { type: 'outcome', outcome: { status: 'ok' } }).status, 'success')
  })

  it('returns to an editable state after every failure, with a message that claims no delivery', () => {
    const outcomes = [
      { status: 'unavailable' },
      { status: 'busy' },
      { status: 'failed', reason: 'network' },
      { status: 'failed', reason: 'timeout' },
      { status: 'failed', reason: 'server' },
    ] as const
    for (const outcome of outcomes) {
      const next: FormState = formReducer(submitting, { type: 'outcome', outcome })
      assert.notEqual(next.status, 'submitting')
      assert.notEqual(next.status, 'success')
      assert.ok(next.message && next.message.length > 10)
      assert.notEqual(next.message, formMessages.success)
      assert.doesNotMatch(next.message!, /^(received|thanks|sent|done)\b/i)
      // …and can be submitted again.
      assert.equal(formReducer(next, { type: 'submit' }).status, 'submitting')
    }
  })

  it('clears a field error once it is corrected', () => {
    const invalid = formReducer(initialFormState, { type: 'client-invalid', errors: { email: 'Bad' } })
    const fixed = formReducer(invalid, { type: 'field-checked', name: 'email', error: null })
    assert.deepEqual(fixed.errors, {})
    assert.equal(fixed.status, 'idle')
  })
})

describe('server decision', () => {
  const delivered: Delivery = { deliver: async () => ({ ok: true }) }

  it('is unavailable, and never a success, without a webhook URL', async () => {
    for (const env of [{}, { FORMS_WEBHOOK_URL: '' }, { FORMS_WEBHOOK_URL: 'http://example.com/hook' }]) {
      const result = await processSubmission('inquiry', minimal, resolveDelivery(env))
      assert.deepEqual(result, { outcome: { status: 'unavailable' }, delivered: false, receipt: null })
    }
  })

  it('succeeds, with a receipt, only when the webhook answers 2xx', async () => {
    for (const status of [200, 201, 202, 204]) {
      const delivery = resolveDelivery(
        { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
        fetchReturning(new Response(null, { status })),
      )
      const result = await processSubmission('inquiry', complete, delivery)
      assert.deepEqual(result, { outcome: { status: 'ok' }, delivered: true, receipt: { kind: 'inquiry', plan: 'growth' } }, String(status))
    }
    for (const status of [301, 400, 401, 404, 429, 500, 503]) {
      const delivery = resolveDelivery(
        { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
        fetchReturning(new Response(null, { status })),
      )
      const result = await processSubmission('inquiry', complete, delivery)
      assert.deepEqual(result, { outcome: { status: 'failed' }, delivered: false, receipt: null }, String(status))
    }
  })

  it('fails without a receipt when the webhook cannot be reached', async () => {
    const delivery = resolveDelivery(
      { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
      (async () => {
        throw new TypeError('fetch failed')
      }) as unknown as typeof fetch,
    )
    const result = await processSubmission('inquiry', minimal, delivery)
    assert.deepEqual(result, { outcome: { status: 'failed' }, delivered: false, receipt: null })
  })

  it('fails without a receipt when the webhook is too slow', async () => {
    const delivery = resolveDelivery({ FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' }, hangingFetch, 20)
    const result = await processSubmission('inquiry', minimal, delivery)
    assert.deepEqual(result, { outcome: { status: 'failed' }, delivered: false, receipt: null })
  })

  it('validates before delivering, and delivers normalised values', async () => {
    let received: Record<string, string> | null = null
    const spy: Delivery = {
      deliver: async (_kind, fields) => {
        received = fields
        return { ok: true }
      },
    }
    const bad = await processSubmission('inquiry', { ...minimal, email: 'nope' }, spy)
    assert.equal(bad.outcome.status, 'invalid')
    assert.equal(bad.receipt, null)
    assert.equal(received, null)

    const ok = await processSubmission('inquiry', minimal, spy)
    assert.deepEqual(ok.receipt, { kind: 'inquiry', plan: 'unsure' })
    assert.equal(received!.name, 'Sam Rivera')
    assert.equal(received!.plan, 'unsure')
  })

  it('turns away a filled honeypot, whatever its type, without pretending to accept it', async () => {
    for (const trap of ['http://spam', ' x ', 1, true, ['x'], {}]) {
      const result = await processSubmission('inquiry', { ...minimal, ca_hp: trap }, delivered)
      assert.deepEqual(result, { outcome: { status: 'rejected' }, delivered: false, receipt: null }, JSON.stringify(trap))
    }
    for (const trap of [undefined, '', '   ']) {
      const result = await processSubmission('inquiry', { ...minimal, ca_hp: trap }, delivered)
      assert.equal(result.outcome.status, 'ok', JSON.stringify(trap))
    }
  })

  it('sends a no-JavaScript post back to the form with the matching explanation', () => {
    assert.equal(fallbackFor('ok'), null)
    assert.equal(fallbackFor('invalid'), 'invalid')
    assert.equal(fallbackFor('rejected'), 'invalid')
    assert.equal(fallbackFor('unavailable'), 'unavailable')
    assert.equal(fallbackFor('busy'), 'busy')
    assert.equal(fallbackFor('failed'), 'failed')
    assert.deepEqual(Object.values(fallbackIds), ['form-invalid', 'form-unavailable', 'form-failed', 'form-busy'])
  })

  it('redirects a no-JavaScript post to a same-host path, never a full URL', () => {
    assert.equal(redirectPathFor('inquiry', 'ok'), '/thank-you')
    assert.equal(redirectPathFor('inquiry', 'invalid'), '/contact#form-invalid')
    assert.equal(redirectPathFor('inquiry', 'rejected'), '/contact#form-invalid')
    assert.equal(redirectPathFor('inquiry', 'unavailable'), '/contact#form-unavailable')
    assert.equal(redirectPathFor('inquiry', 'busy'), '/contact#form-busy')
    assert.equal(redirectPathFor('inquiry', 'failed'), '/contact#form-failed')
    for (const status of ['ok', 'invalid', 'rejected', 'unavailable', 'busy', 'failed'] as const) {
      const path = redirectPathFor('inquiry', status)
      assert.match(path, /^\/(?!\/)/, path)
      assert.doesNotMatch(path, /[?]/, path)
    }
  })
})

describe('webhook delivery', () => {
  it('is unavailable until a safe URL is configured', () => {
    assert.equal(resolveDelivery({}), null)
    assert.equal(resolveDelivery({ FORMS_WEBHOOK_URL: 'not a url' }), null)
    assert.equal(parseWebhookUrl('http://example.com/hook'), null)
    assert.equal(parseWebhookUrl('ftp://example.com/hook'), null)
    assert.ok(parseWebhookUrl('https://example.com/hook'))
    assert.ok(parseWebhookUrl('http://127.0.0.1:4455/'))
  })

  it('succeeds only on a 2xx answer and sends the secret as a bearer token', async () => {
    let auth: string | null = null
    const delivery = resolveDelivery(
      { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in', FORMS_WEBHOOK_SECRET: 's3cret' },
      (async (_url: unknown, init: RequestInit) => {
        auth = new Headers(init.headers).get('authorization')
        return new Response(null, { status: 204 })
      }) as unknown as typeof fetch,
    )
    assert.deepEqual(await delivery!.deliver('inquiry', { name: 'A' }), { ok: true })
    assert.equal(auth, 'Bearer s3cret')

    const refusing = resolveDelivery(
      { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
      fetchReturning(new Response('nope', { status: 500 })),
    )
    assert.deepEqual(await refusing!.deliver('inquiry', { name: 'A' }), { ok: false, reason: 'rejected' })
  })

  it('treats a slow destination as a failure, not a success', async () => {
    const delivery = resolveDelivery({ FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' }, hangingFetch, 20)
    assert.deepEqual(await delivery!.deliver('inquiry', {}), { ok: false, reason: 'timeout' })
  })
})

describe('rate limiting', () => {
  it('allows a burst, then refuses until the window passes', () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 })
    assert.equal(allow('ip', 0), true)
    assert.equal(allow('ip', 10), true)
    assert.equal(allow('ip', 20), false)
    assert.equal(allow('other', 20), true)
    assert.equal(allow('ip', 1500), true)
  })
})

describe('email hand-off before a destination is connected', () => {
  const values = {
    name: 'Sam Rivera',
    business: 'Rivera & Co',
    email: 'sam@example.com',
    phone: '',
    industry: 'Home services',
    volume: '',
    crm: 'None yet',
    plan: 'growth',
    goal: 'both',
    message: 'Quotes go quiet after a week.',
  }

  it('addresses the business and names the plan and business in the subject', async () => {
    const { inquiryEmailLink } = await import('../lib/forms/email.ts')
    const link = inquiryEmailLink('hello@example.com', inquiryFields, values)
    assert.ok(link.startsWith('mailto:hello@example.com?subject='))
    const params = new URLSearchParams(link.slice(link.indexOf('?') + 1))
    assert.equal(params.get('subject'), 'CloseAgain — Growth inquiry from Rivera & Co')
  })

  it('carries every answer, with readable labels and placeholders for blanks', async () => {
    const { inquiryEmailLink } = await import('../lib/forms/email.ts')
    const link = inquiryEmailLink('hello@example.com', inquiryFields, values)
    const body = new URLSearchParams(link.slice(link.indexOf('?') + 1)).get('body') ?? ''
    for (const field of inquiryFields) assert.ok(body.includes(`${field.label}:`), field.name)
    assert.ok(body.includes('Main goal: Both'))
    assert.ok(body.includes('Preferred plan: Growth — '))
    assert.ok(body.includes('Phone: —'))
    assert.ok(body.includes('Message: Quotes go quiet after a week.'))
  })
})

describe('email delivery (Resend)', () => {
  const now = new Date('2026-09-26T12:00:00.000Z')
  const values = () => {
    const checked = validateSubmission('inquiry', complete)
    assert.equal(checked.ok, true)
    return checked.values
  }

  it('turns on with an API key alone and emails the business address by default', async () => {
    let request: { url: string; auth: string | null; body: Record<string, unknown> } | null = null
    const delivery = resolveDelivery({ RESEND_API_KEY: 're_test' }, (async (url: unknown, init: RequestInit) => {
      request = { url: String(url), auth: new Headers(init.headers).get('authorization'), body: JSON.parse(String(init.body)) }
      return json(200, { id: 'email_1' })
    }) as unknown as typeof fetch)
    assert.ok(delivery)
    assert.deepEqual(await delivery.deliver('inquiry', values()), { ok: true })
    const sent = request as unknown as { url: string; auth: string | null; body: Record<string, unknown> }
    assert.equal(sent.url, resendEndpoint)
    assert.equal(sent.auth, 'Bearer re_test')
    assert.deepEqual(sent.body.to, [site.email])
    assert.equal(sent.body.reply_to, 'sam@example.com')
    assert.equal(sent.body.subject, 'CloseAgain — Growth inquiry from Rivera & Co')
  })

  it('lists every answer and says how to reply', () => {
    const mail = buildNotification('inquiry', values(), { to: 'owner@example.com', from: 'Site <a@example.com>', now })
    for (const field of inquiryFields) assert.ok(mail.text.includes(`${field.label}:`), field.name)
    assert.ok(mail.text.includes('Full name: Sam Rivera'))
    assert.ok(mail.text.includes('Reply to this email to answer Sam Rivera directly.'))
    assert.ok(mail.text.includes('Received 2026-09-26 12:00 UTC.'))
    assert.equal(mail.from, 'Site <a@example.com>')
  })

  it('honours a custom recipient and sender', async () => {
    let body: Record<string, unknown> = {}
    const delivery = resolveDelivery(
      { RESEND_API_KEY: 're_test', FORMS_NOTIFY_EMAIL: 'sales@example.com', FORMS_EMAIL_FROM: 'CloseAgain <hello@example.com>' },
      (async (_url: unknown, init: RequestInit) => {
        body = JSON.parse(String(init.body))
        return json(200, { id: 'email_2' })
      }) as unknown as typeof fetch,
    )
    await delivery!.deliver('inquiry', values())
    assert.deepEqual(body.to, ['sales@example.com'])
    assert.equal(body.from, 'CloseAgain <hello@example.com>')
  })

  it('reports a refused email as a failure, never a success', async () => {
    const delivery = resolveDelivery({ RESEND_API_KEY: 're_bad' }, fetchReturning(json(403, { message: 'invalid key' })))
    assert.deepEqual(await delivery!.deliver('inquiry', values()), { ok: false, reason: 'rejected' })
  })

  it('with email and a webhook, one acceptance is enough — and both must fail to fail', async () => {
    const env = { RESEND_API_KEY: 're_test', FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' }
    const emailOnly = resolveDelivery(env, (async (url: unknown) =>
      String(url) === resendEndpoint ? json(200, { id: 'x' }) : new Response(null, { status: 500 })) as unknown as typeof fetch)
    assert.deepEqual(await emailOnly!.deliver('inquiry', values()), { ok: true })
    const neither = resolveDelivery(env, fetchReturning(() => Promise.resolve(new Response(null, { status: 502 }))))
    assert.deepEqual(await neither!.deliver('inquiry', values()), { ok: false, reason: 'rejected' })
  })
})
