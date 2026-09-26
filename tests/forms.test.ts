/**
 * Submission behaviour: the parts that must never quietly lie to a visitor.
 * Run with `npm test` (Node's built-in runner; no extra dependencies).
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { resolveDelivery, parseWebhookUrl, type Delivery } from '../lib/forms/delivery.ts'
import { processSubmission } from '../lib/forms/process.ts'
import { createRateLimiter } from '../lib/forms/rate-limit.ts'
import { validateSubmission } from '../lib/forms/schema.ts'
import { formReducer, initialFormState, type FormState } from '../lib/forms/state.ts'
import { sendSubmission } from '../lib/forms/transport.ts'

const validDemo = {
  name: '  Sam   Rivera ',
  business: 'Rivera & Co',
  email: 'sam@example.com',
  phone: '',
  industry: 'Home services',
  volume: '50–200 a month',
  crm: '',
  plan: 'growth',
  goal: 'Both new and old leads',
  message: '',
}

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const fetchReturning = (response: Response | (() => Promise<Response>)) =>
  (async () => (typeof response === 'function' ? response() : response)) as unknown as typeof fetch

describe('validation', () => {
  it('trims and collapses whitespace before checking', () => {
    const result = validateSubmission('purchase', validDemo)
    assert.equal(result.ok, true)
    assert.equal(result.values.name, 'Sam Rivera')
  })

  it('reports every missing required field with its own message', () => {
    const result = validateSubmission('purchase', { name: ' ', business: '', email: '', plan: '', goal: '' })
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.deepEqual(Object.keys(result.errors).sort(), ['business', 'email', 'goal', 'name', 'plan'])
    assert.notEqual(result.errors.name, result.errors.email)
  })

  it('accepts ordinary addresses from any provider', () => {
    for (const email of ['a@gmail.com', 'first.last+crm@mail.co.uk', 'x@sub.domain.io', 'me@outlook.com']) {
      const result = validateSubmission('purchase', { ...validDemo, email })
      assert.equal(result.ok, true, email)
    }
  })

  it('rejects addresses that cannot receive mail', () => {
    for (const email of ['plainaddress', 'no-tld@host', 'two@@signs.com', 'spa ce@x.com', 'dots..@x.com']) {
      const result = validateSubmission('purchase', { ...validDemo, email })
      assert.equal(result.ok, false, email)
    }
  })

  it('only accepts the listed plans and options', () => {
    assert.equal(validateSubmission('purchase', { ...validDemo, plan: 'platinum' }).ok, false)
    assert.equal(validateSubmission('purchase', { ...validDemo, industry: 'Mining' }).ok, false)
    assert.equal(validateSubmission('purchase', { ...validDemo, plan: 'unsure' }).ok, true)
  })

  it('accepts ordinary phone numbers and leaves the field optional', () => {
    for (const phone of ['', '(555) 010-2030', '+44 20 7946 0958', '555.010.2030']) {
      assert.equal(validateSubmission('purchase', { ...validDemo, phone }).ok, true, phone)
    }
    for (const phone of ['12345', 'call me', '+1 555 010 2030 999 888']) {
      assert.equal(validateSubmission('purchase', { ...validDemo, phone }).ok, false, phone)
    }
  })

  it('enforces length limits and ignores unknown fields', () => {
    const long = validateSubmission('purchase', { ...validDemo, message: 'x'.repeat(3001) })
    assert.equal(long.ok, false)
    const extra = validateSubmission('purchase', { ...validDemo, admin: true })
    assert.equal(extra.ok, true)
    assert.equal('admin' in extra.values, false)
  })
})

describe('browser transport', () => {
  it('reports success only for HTTP 200 with an explicit confirmation', async () => {
    const ok = await sendSubmission('purchase', validDemo, { fetchImpl: fetchReturning(json(200, { status: 'ok' })) })
    assert.deepEqual(ok, { status: 'ok' })

    const bare = await sendSubmission('purchase', validDemo, { fetchImpl: fetchReturning(json(200, {})) })
    assert.equal(bare.status, 'failed')

    const html = await sendSubmission('purchase', validDemo, {
      fetchImpl: fetchReturning(new Response('<html>ok</html>', { status: 200 })),
    })
    assert.equal(html.status, 'failed')
  })

  it('maps server answers to explainable outcomes', async () => {
    const invalid = await sendSubmission('purchase', validDemo, {
      fetchImpl: fetchReturning(json(422, { status: 'invalid', errors: { email: 'Bad email', secret: 'x' } })),
    })
    assert.deepEqual(invalid, { status: 'invalid', errors: { email: 'Bad email' } })

    const unavailable = await sendSubmission('purchase', validDemo, { fetchImpl: fetchReturning(json(503, { status: 'unavailable' })) })
    assert.equal(unavailable.status, 'unavailable')

    const busy = await sendSubmission('purchase', validDemo, { fetchImpl: fetchReturning(json(429, { status: 'busy' })) })
    assert.equal(busy.status, 'busy')

    const broken = await sendSubmission('purchase', validDemo, { fetchImpl: fetchReturning(json(500, { stack: 'Error at…' })) })
    assert.deepEqual(broken, { status: 'failed', reason: 'server' })
  })

  it('distinguishes a network failure from a timeout', async () => {
    const offline = await sendSubmission('purchase', validDemo, {
      fetchImpl: (async () => {
        throw new TypeError('Failed to fetch')
      }) as unknown as typeof fetch,
    })
    assert.deepEqual(offline, { status: 'failed', reason: 'network' })

    const hanging: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
      })
    const slow = await sendSubmission('purchase', validDemo, { fetchImpl: hanging, timeoutMs: 20 })
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

  it('returns to an editable state after every failure', () => {
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

  it('never reports success without a delivery destination', async () => {
    const result = await processSubmission('purchase', validDemo, null)
    assert.deepEqual(result, { outcome: { status: 'unavailable' }, delivered: false })
  })

  it('reports success only when delivery confirms', async () => {
    const ok = await processSubmission('purchase', validDemo, delivered)
    assert.deepEqual(ok, { outcome: { status: 'ok' }, delivered: true })

    const refused = await processSubmission('purchase', validDemo, { deliver: async () => ({ ok: false, reason: 'rejected' }) })
    assert.deepEqual(refused, { outcome: { status: 'failed' }, delivered: false })
  })

  it('validates before delivering, and delivers normalised values', async () => {
    let received: Record<string, string> | null = null
    const spy: Delivery = {
      deliver: async (_kind, fields) => {
        received = fields
        return { ok: true }
      },
    }
    const bad = await processSubmission('purchase', { ...validDemo, email: 'nope' }, spy)
    assert.equal(bad.outcome.status, 'invalid')
    assert.equal(received, null)

    await processSubmission('purchase', validDemo, spy)
    assert.equal(received!.name, 'Sam Rivera')
  })

  it('turns away a filled honeypot without pretending to accept it', async () => {
    const result = await processSubmission('purchase', { ...validDemo, ca_hp: 'http://spam' }, delivered)
    assert.deepEqual(result, { outcome: { status: 'rejected' }, delivered: false })
  })
})

describe('webhook delivery', () => {
  it('is unavailable until a safe URL is configured', () => {
    assert.equal(resolveDelivery({}), null)
    assert.equal(resolveDelivery({ FORMS_WEBHOOK_URL: 'not a url' }), null)
    assert.equal(parseWebhookUrl('http://example.com/hook'), null)
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
    assert.deepEqual(await delivery!.deliver('purchase', { name: 'A' }), { ok: true })
    assert.equal(auth, 'Bearer s3cret')

    const refusing = resolveDelivery(
      { FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' },
      fetchReturning(new Response('nope', { status: 500 })),
    )
    assert.deepEqual(await refusing!.deliver('purchase', { name: 'A' }), { ok: false, reason: 'rejected' })
  })

  it('treats a slow destination as a failure, not a success', async () => {
    // AbortSignal.timeout does not keep Node's event loop alive, so hold it
    // open with a real timer until the abort fires (as a live server would).
    const hanging = ((_url: unknown, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        const keepAlive = setTimeout(() => {}, 5000)
        init.signal?.addEventListener('abort', () => {
          clearTimeout(keepAlive)
          reject(init.signal?.reason)
        })
      })) as unknown as typeof fetch
    const delivery = resolveDelivery({ FORMS_WEBHOOK_URL: 'https://hooks.example.com/in' }, hanging, 20)
    assert.deepEqual(await delivery!.deliver('purchase', {}), { ok: false, reason: 'timeout' })
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
