# CloseAgain — website and product demo

CloseAgain captures new leads, follows up automatically, and re-engages old
opportunities — so more conversations become customers.

This repository holds the public website (where people learn about
CloseAgain and contact the team to buy) and a clickable product demo on
sample data. It does not contain the CloseAgain service itself.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build
npm run lint
npm run typecheck
npm test             # form and demo logic (Node's built-in runner)
npm run forms:sink   # local stand-in form destination, for testing only
```

Next.js 16 (App Router) · React 19 · TypeScript · lucide-react for interface
icons · Tailwind v4 for the reset only. Marketing pages are prerendered static
HTML; the only server-rendered pieces are the form endpoint and the
confirmation page.

## Before this goes live

The site is complete, but these are launch blockers:

1. **Form destination.** Set `FORMS_WEBHOOK_URL` (server-side) to an HTTPS
   endpoint that accepts the JSON in `.env.example`, optionally with
   `FORMS_WEBHOOK_SECRET`. Until then the “Contact to buy” form tells visitors
   requests are temporarily unavailable, and nothing is recorded.
2. **Legal copy.** `/privacy` and `/terms` are marked placeholders, kept out of
   search. Add approved text in `content/legal.ts` and set `status` to
   `'approved'`. The privacy policy should cover the form data, the webhook
   destination and the short-lived `ca_receipt` confirmation cookie.
3. **Public origin.** Set `NEXT_PUBLIC_SITE_URL` on the production deployment
   only. Without it the site is a preview: noindex everywhere, robots.txt
   disallows crawling, empty sitemap, no canonical URLs.
4. **Claims to confirm.** “Most popular” on Scale (`content/pricing.ts`) is a
   statement about customers — keep it only while it is true. The sample
   product views name channels such as email and text; confirm they match
   what you support. Enterprise cells marked “Custom” in the comparison are
   inferred from the Enterprise list.

## Routes

| Route | What it is |
| --- | --- |
| `/` | The approved hero, then Again · New + Old · lead-to-customer timeline · follow-up · old leads · dashboard showcase · pricing · close |
| `/how-it-works` | Six steps on one continuous ribbon |
| `/features` | Nine capabilities, each with the product view that delivers it |
| `/who-its-for` | Eight lead-driven industries; each card opens the buying form pre-filled |
| `/pricing` | Core $499 · Growth $899 · Scale $1,499 · Enterprise custom, plus a full comparison |
| `/after-you-buy` | The six setup steps |
| `/faq`, `/about` | Questions; the short brand story |
| `/contact` | Contact to buy — the buying form (`?plan=growth`, `?industry=…` pre-fill) |
| `/thank-you` | Confirmation, shown only after a confirmed submission |
| `/privacy`, `/terms` | Marked placeholders |
| `/demo`, `/demo/operator` | Product demo on sample data (noindex) |
| `/book-a-demo` | Permanently redirects to `/contact` |

## Where things live

```
content/          ALL public copy and data: site/nav, home, pages, pricing,
                  forms, legal — and demo/ sample data for the product demo
app/(marketing)/  public pages (header + footer layout)
app/(product)/    the product demo (its own app shell)
app/api/forms/    the submission endpoint (/api/forms/purchase)
components/
  site/           header, mobile menu, footer, page transition, motion
  home/           hero, New + Old, stories, dashboard showcase
  previews/       product views used on marketing pages (sample data)
  pricing/        plan cards and the comparison
  art/            ribbon renderer, ribbon shapes, trail, bubbles
  editorial/      intro, rows, trio, accordion, closing CTA, word split
  forms/          the buying form and its page layout
  dashboard/      the product demo UI
lib/
  ribbon.ts       centreline + width profile → filled ribbon outline
  forms/          validation, transport, state machine, server decision,
                  webhook delivery, rate limiting — framework-free and tested
styles/           tokens, base, chrome, editorial, home, pages, pricing,
                  forms, product (app primitives), previews, dashboard, motion
```

**Edit words and prices in `content/`, not in components.** Prices live only
in `content/pricing.ts`; the pricing page, homepage band, buying form and the
demo's billing views all read from it.

## Design system

The approved homepage image is the reference; the homepage hero still matches
it at 1513 × 1040. Tokens are in `styles/tokens.css`: paper `#F2EFE7`, ink
`#0D0D0B`, vermilion `#CD3926` (small red text uses `#B32E1D`), warm hairlines,
and a product-UI layer (cream surfaces, 10px panels, 3px controls).

**Type.** DM Serif Display for display type — the closest openly licensed
match found for the reference headline, a substitution rather than its exact
face. Source Serif 4 (400/600) for reading and interface text. Both are
self-hosted through `next/font` with metric-matched fallbacks.

**The ribbon** is the product story: a conversation moving through
CloseAgain. Every ribbon is a centreline plus a width profile
(`components/art/ribbons.ts`) turned into one filled outline at build time by
`lib/ribbon.ts`. Straight runs that must stretch with content are CSS bands
(`RibbonBand`) that meet the drawn turns exactly.

**Motion** is CSS-first:

- Homepage entrance, once per session: navigation, each headline line, the
  ribbon drawing through, the two bubbles, then copy and calls to action.
- Scroll-linked reveals and ribbon drawing use native scroll-driven animation
  where supported, with one IntersectionObserver fallback elsewhere.
- Page changes use a short masked wipe (View Transitions); the header holds
  still. Accordion and comparison open to their real height.
- `prefers-reduced-motion` and no-JavaScript both show the finished page.

## Forms

- One form, “Contact to buy”. Client and server share one validation module;
  the server's check is the one that counts.
- Success is shown only after `POST /api/forms/purchase` returns HTTP 200 with
  `{"status":"ok"}`, which happens only after the webhook answered 2xx. The
  endpoint then sets a short-lived, HttpOnly `ca_receipt` cookie scoped to
  `/thank-you`; without it that page shows a neutral invitation. Nothing the
  visitor typed goes in a URL.
- Unavailable, rejected, network, timeout and rate-limited states each have a
  plain message; entered text is kept. Without JavaScript the endpoint accepts
  a normal form post and redirects with an explanation.
- Abuse protection: honeypot, per-address rate limit (in-memory, per
  instance), cross-site refusal, body size cap. Logs record outcomes only.
- Local testing: `npm run forms:sink`, then run with
  `FORMS_WEBHOOK_URL=http://127.0.0.1:4455/`. A success there proves the
  site's behaviour, not a production integration.

## Honesty

No testimonials, logos, customer counts, results or ratings. Product views are
marked as sample data with fictional people; the operator demo's figures are
computed from sample accounts, not CloseAgain's business. The industry images
are generated editorial still lifes, labelled as such on the page.
