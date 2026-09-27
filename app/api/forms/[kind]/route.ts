import { NextResponse, type NextRequest } from 'next/server'
import { readTextWithin } from '@/lib/forms/body'
import { resolveDelivery } from '@/lib/forms/delivery'
import { processSubmission } from '@/lib/forms/process'
import {
  httpStatusFor,
  receiptCookie,
  receiptMaxAge,
  redirectPathFor,
  type ServerStatus,
} from '@/lib/forms/protocol'
import { createRateLimiter } from '@/lib/forms/rate-limit'
import { encodeReceipt, type Receipt } from '@/lib/forms/receipt'
import { isFormKind } from '@/lib/forms/schema'

/**
 * POST /api/forms/inquiry — the “Find the right plan” inquiry
 *
 * Accepts JSON from the enhanced form and ordinary form posts from browsers
 * without JavaScript. Validation here is the one that counts. Success is
 * reported only after the configured delivery destination confirms receipt.
 */

const allow = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 })
const maxBodyBytes = 24 * 1024

export async function POST(request: NextRequest, context: { params: Promise<{ kind: string }> }) {
  const { kind } = await context.params
  if (!isFormKind(kind)) {
    return NextResponse.json({ status: 'rejected' }, { status: 404 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const isFormPost = contentType.includes('application/x-www-form-urlencoded')

  const reply = (outcome: ServerStatus, receipt: Receipt | null = null, status = httpStatusFor[outcome.status]) => {
    // A no-JavaScript post is redirected to a same-host path; see redirectPathFor.
    const response = isJson
      ? NextResponse.json(outcome, { status })
      : new NextResponse(null, { status: 303, headers: { location: redirectPathFor(kind, outcome.status) } })
    response.headers.set('cache-control', 'no-store')
    if (receipt) {
      response.cookies.set(receiptCookie, encodeReceipt(receipt), {
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
    return reply({ status: 'rejected' }, null, 403)
  }
  if (!isJson && !isFormPost) return reply({ status: 'rejected' }, null, 415)

  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > maxBodyBytes) return reply({ status: 'rejected' }, null, 413)

  const clientKey =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
  if (!allow(`${kind}:${clientKey}`)) return reply({ status: 'busy' })

  let raw: Record<string, unknown>
  try {
    // The declared length can be absent or wrong, so the cap also applies to what arrives.
    const text = await readTextWithin(request.body, maxBodyBytes)
    if (text === null) return reply({ status: 'rejected' }, null, 413)
    raw = isJson ? JSON.parse(text) : Object.fromEntries(new URLSearchParams(text))
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('not an object')
  } catch {
    return reply({ status: 'rejected' })
  }

  const delivery = resolveDelivery()
  const { outcome, receipt } = await processSubmission(kind, raw, delivery)

  // Operational signal only — never the visitor's details.
  if (outcome.status === 'unavailable') {
    console.warn(`[forms] ${kind} submission refused: no delivery destination is configured`)
  } else if (outcome.status === 'failed') {
    console.error(`[forms] ${kind} submission could not be delivered`)
  } else if (outcome.status === 'rejected') {
    console.info(`[forms] ${kind} submission rejected by the spam trap`)
  }

  return reply(outcome, receipt)
}
