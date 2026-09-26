import { NextResponse, type NextRequest } from 'next/server'
import { resolveDelivery } from '@/lib/forms/delivery'
import { processSubmission } from '@/lib/forms/process'
import {
  httpStatusFor,
  receiptCookie,
  receiptMaxAge,
  type ServerStatus,
} from '@/lib/forms/protocol'
import { createRateLimiter } from '@/lib/forms/rate-limit'
import { formKinds, type FormKind } from '@/lib/forms/schema'

/**
 * POST /api/forms/purchase — the “Contact to buy” inquiry
 *
 * Accepts JSON from the enhanced forms and ordinary form posts from browsers
 * without JavaScript. Validation here is the one that counts. Success is
 * reported only after the configured delivery destination confirms receipt.
 */

const allow = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 })
const maxBodyBytes = 24 * 1024

const formPage: Record<FormKind, string> = { purchase: '/contact' }

export async function POST(request: NextRequest, context: { params: Promise<{ kind: string }> }) {
  const { kind: rawKind } = await context.params
  if (!formKinds.includes(rawKind as FormKind)) {
    return NextResponse.json({ status: 'rejected' }, { status: 404 })
  }
  const kind = rawKind as FormKind

  const contentType = request.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const isFormPost = contentType.includes('application/x-www-form-urlencoded')

  const reply = (outcome: ServerStatus, delivered = false, status = httpStatusFor[outcome.status]) => {
    const response = isJson
      ? NextResponse.json(outcome, { status })
      : NextResponse.redirect(redirectTarget(request, kind, outcome), 303)
    response.headers.set('cache-control', 'no-store')
    if (delivered) {
      response.cookies.set(receiptCookie, kind, {
        httpOnly: true,
        sameSite: 'lax',
        secure: request.nextUrl.protocol === 'https:',
        path: '/thank-you',
        maxAge: receiptMaxAge,
      })
    }
    return response
  }

  // Refuse cross-site posts. Browsers send this header on every request.
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return reply({ status: 'rejected' }, false, 403)
  }
  if (!isJson && !isFormPost) return reply({ status: 'rejected' }, false, 415)

  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > maxBodyBytes) return reply({ status: 'rejected' }, false, 413)

  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
  if (!allow(`${kind}:${clientKey}`)) return reply({ status: 'busy' })

  let raw: Record<string, unknown>
  try {
    const text = await request.text()
    if (text.length > maxBodyBytes) return reply({ status: 'rejected' }, false, 413)
    raw = isJson ? JSON.parse(text) : Object.fromEntries(new URLSearchParams(text))
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('not an object')
  } catch {
    return reply({ status: 'rejected' })
  }

  const delivery = resolveDelivery()
  const { outcome, delivered } = await processSubmission(kind, raw, delivery)

  // Operational signal only — never the visitor's details.
  if (outcome.status === 'unavailable') {
    console.warn(`[forms] ${kind} submission refused: no delivery destination is configured`)
  } else if (outcome.status === 'failed') {
    console.error(`[forms] ${kind} submission could not be delivered`)
  } else if (outcome.status === 'rejected') {
    console.info(`[forms] ${kind} submission rejected by the spam trap`)
  }

  return reply(outcome, delivered)
}

/** Where a no-JavaScript post goes next. Nothing the visitor typed goes in the URL. */
function redirectTarget(request: NextRequest, kind: FormKind, outcome: ServerStatus) {
  const url = request.nextUrl.clone()
  url.search = ''
  if (outcome.status === 'ok') {
    url.pathname = '/thank-you'
    url.hash = ''
  } else {
    url.pathname = formPage[kind]
    url.hash = `form-${noScriptAnchor(outcome)}`
  }
  return url
}

function noScriptAnchor(outcome: ServerStatus) {
  switch (outcome.status) {
    case 'invalid':
    case 'rejected':
      return 'invalid'
    case 'unavailable':
      return 'unavailable'
    case 'busy':
      return 'busy'
    default:
      return 'failed'
  }
}
