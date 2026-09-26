# CloseAgain — public website

The marketing site for CloseAgain: following up with missed inquiries and
older leads, so the right conversations get a second chance. The primary
conversion is a demo request; the secondary is a contact message.

This repository is the website only — no product, dashboard or account area.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build
npm run lint
npm run typecheck
npm test             # form submission behaviour (Node's built-in runner)
npm run forms:sink   # local stand-in form destination, for testing only
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 for the reset
only. Every marketing page is prerendered static HTML; the only dynamic pieces
are the form endpoint and the confirmation page.

## Before this goes live

These are launch blockers — the site is complete but not production-ready
without them:

1. **Form destination.** Set `FORMS_WEBHOOK_URL` (server-side) to an HTTPS
   endpoint that accepts the JSON described in `.env.example`, optionally with
   `FORMS_WEBHOOK_SECRET`. Until then both forms tell visitors that requests
   are temporarily unavailable, and nothing is recorded.
2. **Legal copy.** `/privacy` and `/terms` are marked placeholders and are kept
   out of search. Add approved text in `content/legal.ts` and set `status` to
   `'approved'`. The privacy policy should cover the form data, the webhook
   destination and the short-lived `ca_receipt` confirmation cookie.
3. **Public origin.** Set `NEXT_PUBLIC_SITE_URL` on the production deployment
   only. Without it the site is a preview: noindex everywhere, robots.txt
   disallows crawling, empty sitemap, no canonical URLs.
4. **Pricing.** `content/pages.ts → pricing.offer` shows “Pricing details to be
   confirmed.” until approved prices are added there.

## Where things live

```
content/        ALL public copy: site/nav, home, pages, forms, legal
app/            routes, metadata, robots, sitemap, icon, share card
  api/forms/    the one submission endpoint (/api/forms/demo, /contact)
components/
  site/         header, mobile menu, footer, motion controller
  home/         the hero composition
  editorial/    page intro, numbered rows, trio, closing CTA, word split
  art/          ribbon renderer, ribbon centrelines, bubbles
  forms/        the shared form and the contact/demo page layout
  legal/        legal document layout
lib/
  ribbon.ts     centreline + width profile → filled ribbon outline
  forms/        validation, transport, state machine, server decision,
                webhook delivery, rate limiting — framework-free and tested
  seo.ts        per-page metadata
styles/         tokens, base, chrome, editorial, home, pages, forms, motion
tests/          node --test suites
scripts/        form-sink.mjs (local test destination)
```

**Edit words in `content/`, not in components.**

## Design system

The approved homepage image is the reference. Colours were sampled from it:
paper `#F2EFE7`, ink `#0D0D0B`, vermilion `#CD3926` (display and ribbon only;
small red text uses `#B32E1D` for contrast), beige and blush bubbles, warm
hairlines. Tokens live in `styles/tokens.css`.

**Type.** DM Serif Display for display type — the closest openly licensed
match found for the reference headline; it is a substitution, not the
reference's exact face. Source Serif 4 (400/600) for reading and interface
text; DM Serif was drawn from Source Serif, so they pair naturally. Both are
self-hosted through `next/font` with metric-matched fallbacks.

**The ribbon.** Every ribbon is a centreline plus a width profile
(`components/art/ribbons.ts`), turned into one filled outline at build time by
`lib/ribbon.ts`, so it tapers like a brush stroke and the arrowhead always sits
on the real end tangent. The homepage ribbon was traced from the reference at
its native 1513 × 1040 size. Wide screens scale the whole hero in units of the
headline size (`--hs`), so type, ribbon and bubbles keep the reference's
relationships; small screens have their own art direction and path.

**Motion.** CSS-first, one vocabulary (`--ease-editorial`, `--ease-ui`,
`--ease-draw`, durations in `tokens.css`):

- Homepage entrance, first visit per session: lede and CTAs settle, the ribbon
  is revealed along its curve by a mask (it is never a thin line that
  thickens), then the two bubbles land. Headline and header never animate.
- One-time reveals (`data-reveal`) and scroll-drawn ribbons
  (`data-draw="scroll"`) share a single IntersectionObserver.
- Content is only hidden while `html.js-reveal` is set; a failsafe removes it if
  the app script never runs. Without JavaScript, or with reduced motion,
  everything is simply there in its finished state.
- Native scrolling throughout; smooth only for in-page anchors.

## Forms

- Client and server share one validation module; the server's check is the
  one that counts. Labels are persistent; errors are specific and never rely
  on colour.
- Success is shown only after `POST /api/forms/<kind>` returns HTTP 200 with
  `{"status":"ok"}`, which happens only after the webhook answered 2xx. The
  endpoint then sets a short-lived, HttpOnly `ca_receipt` cookie scoped to
  `/thank-you`; without it that page shows a neutral invitation, never
  “received”. Nothing the visitor typed goes in a URL.
- Failures (invalid, unavailable, rejected, network, timeout, rate-limited)
  each have their own plain message, and entered text is kept.
- Without JavaScript the same endpoint accepts a normal form post and
  redirects to the confirmation page or back to the form with an explanation.
- Abuse protection: a honeypot field, a per-address rate limit (in-memory,
  per instance), cross-site post refusal and a body size cap. Server logs
  record outcomes only, never names, emails or messages.
- To test locally: `npm run forms:sink`, then run the site with
  `FORMS_WEBHOOK_URL=http://127.0.0.1:4455/`. A success there proves the
  site's behaviour, not a production integration.

## Honesty

No testimonials, logos, customer counts, ratings, integrations, AI claims,
results, prices, timelines or compliance claims appear anywhere. Conversation
bubbles on How it works are labelled as illustrative examples. Structured data
is limited to `Organization` and `WebSite`, and only once a public origin is
configured.
