#!/usr/bin/env node
/**
 * LOCAL TEST SINK — not a delivery destination.
 *
 * Stands in for the real webhook so the full submission path can be tested
 * end to end without sending anything anywhere. It keeps nothing: it prints
 * only the submission type and which fields arrived, never their values.
 *
 *   npm run forms:sink                 accepts everything (HTTP 204)
 *   SINK_MODE=reject npm run forms:sink   answers 500, like a broken destination
 *   SINK_MODE=slow npm run forms:sink     never answers, to exercise timeouts
 *
 * Then run the site with FORMS_WEBHOOK_URL=http://127.0.0.1:4455/ in
 * .env.local. A success seen this way proves the site's behaviour, not a
 * working production integration.
 */

import { createServer } from 'node:http'

const port = Number(process.env.SINK_PORT ?? 4455)
const mode = process.env.SINK_MODE ?? 'accept'

createServer((request, response) => {
  if (request.method !== 'POST') {
    response.writeHead(405).end()
    return
  }
  let body = ''
  request.on('data', (chunk) => {
    body += chunk
  })
  request.on('end', () => {
    let summary = 'unreadable body'
    try {
      const payload = JSON.parse(body)
      summary = `${payload.type} with fields: ${Object.keys(payload.fields ?? {}).join(', ')}`
    } catch {}
    console.log(`[test sink] ${new Date().toISOString()} ${mode} — ${summary}`)

    if (mode === 'slow') return // leave the request hanging
    if (mode === 'reject') {
      response.writeHead(500).end()
      return
    }
    response.writeHead(204).end()
  })
}).listen(port, '127.0.0.1', () => {
  console.log(`[test sink] listening on http://127.0.0.1:${port}/ (mode: ${mode})`)
})
