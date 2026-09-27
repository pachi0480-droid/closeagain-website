# CloseAgain — website and sample demo

Turn more of the leads you already have into paying customers. CloseAgain
follows up with new inquiries and re-engages older leads, helping your team
book more appointments and close more sales.

This repository holds the public website — where people learn what
CloseAgain does and send an inquiry — and an optional clickable demo on sample
data. It does not contain the CloseAgain service itself.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the build
npm run lint
npm run typecheck
npm test             # forms, pricing rules, demo data (Node's built-in runner)
npm run forms:sink   # local stand-in form destination, for testing only
```

Next.js 16 (App Router) · React 19 · TypeScript · lucide-react for interface
icons · Tailwind v4 for the reset only. Marketing pages are prerendered static
HTML; the form endpoint and the confirmation page are the only server-rendered
pieces.

## Before this goes live

1. **Inquiry destination.** Set `FORMS_WEBHOOK_URL` (server-side) to an HTTPS
   endpoint that accepts the JSON described in `.env.example`, optionally with
   `FORMS_WEBHOOK_SECRET`. Until then the form truthfully says requests are
   temporarily unavailable and nothing is recorded.
2. **Legal copy.** `/privacy` and `/terms` are marked placeholders, kept out of
   search. Add approved text in `content/legal.ts` and set `status` to
   `'approved'`.
3. **Public origin.** Set `NEXT_PUBLIC_SITE_URL` on the production deployment
   only. Without it the site is a preview: noindex everywhere, robots.txt
   disallows crawling, empty sitemap, no canonical URLs.
4. **Unconfirmed facts.** `docs/open-questions.md` lists everything the site
   deliberately does not claim yet — channels, usage allowances, users per
   plan, contract terms, how appointments are booked — and how each is worded
   meanwhile. Answer them there, then update `content/`.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero · Again · the two jobs (new inquiries, older leads) · one worked example · four jobs · pricing overview · buying questions · next step |
| `/how-it-works` | Six steps, each labelled automatic or your team |
| `/features` | Four buyer jobs: the problem, what CloseAgain does, what you control, limits, and plan availability |
| `/who-its-for` | Fit and not-fit, then eight lead-driven industries with concrete use cases |
| `/pricing` | Core · Growth · Scale · Enterprise, what every plan shares, what the proposal confirms, the full comparison and a break-even check |
| `/getting-started` | Inquiry → fit and scope → approve plan and terms → setup → review → launch |
| `/faq`, `/about` | Straight answers; the short brand story |
| `/contact` | Find the right plan — the inquiry form (`?plan=growth`, `?industry=…` pre-fill) |
| `/thank-you` | Confirmation, shown only after a confirmed submission; neutral otherwise |
| `/privacy`, `/terms` | Marked placeholders |
| `/demo` | Sample client dashboard (noindex) — optional, linked from the footer and features page |
| `/demo/operator` | Sample operator views (noindex) — kept working, not linked from the public journey |
| `/after-you-buy`, `/book-a-demo` | Permanent redirects to `/getting-started` and `/contact` |

## Where things live

```
content/          ALL public copy and data
  site.ts         brand, navigation, the primary call to action
  pricing.ts      the ONLY place prices and plan facts live
  home.ts         homepage copy, including the worked example
  pages.ts        supporting pages; FAQ (by id, reused on home and pricing)
  contact.ts      the inquiry page and confirmation copy
  forms.ts        inquiry fields, options and messages
  legal.ts        privacy and terms (placeholders)
  demo/           sample data for the demo
docs/
  open-questions.md   unconfirmed product and pricing facts
app/(marketing)/  public pages (header + footer layout)
app/(product)/    the sample demo (its own shell; loads styles/dashboard.css)
app/api/forms/    the submission endpoint (/api/forms/inquiry)
components/
  home/           hero, two jobs, worked example, jobs summary
  pricing/        plan cards, comparison, break-even check
  previews/       small product views used on marketing pages (sample data)
  art/            ribbon renderer and shapes, trail, bubbles
  editorial/      intro, rows, trio, accordion, closing CTA, word split
  forms/          the inquiry form and its page layout
  site/           header, mobile menu, footer, page transition, motion
  dashboard/      the demo UI
lib/
  ribbon.ts       centreline + width profile → filled ribbon outline
  breakeven.ts    break-even arithmetic (visitor's numbers only)
  forms/          validation, transport, state, receipt, server decision,
                  webhook delivery, rate limiting — framework-free and tested
```

## Rules the code enforces

- **One source for prices.** `tests/pricing.test.ts` fails if a dollar amount
  or a plan price appears in any content, component or library file other than
  `content/pricing.ts`. Labels, the starting price, form options, metadata and
  plan availability on the features page are all derived from it.
- **Honest plan comparison.** Every plan has a best-for and a step-up sentence;
  no plan repeats a benefit from the plan below as if it were an upgrade; no
  popularity claims — a recommendation must state its reason.
- **Honest forms.** Success is shown only after `POST /api/forms/inquiry`
  returns HTTP 200 with `{"status":"ok"}`, which happens only after the webhook
  answered 2xx. The endpoint then sets a short-lived, HttpOnly receipt cookie
  (`inquiry:<plan>`) scoped to `/thank-you`; without it that page is neutral.
  Nothing the visitor typed goes in a URL.

- **Baseline security headers** (`next.config.ts`): no framing, same-origin
  form posts only, `nosniff`, strict referrer and permissions policies. A
  script-restricting CSP would need per-request nonces, which means dynamic
  rendering; the site stays statically prerendered instead.

## Design and motion

The approved homepage is the reference: warm paper, black editorial serif,
one vermilion ribbon. Tokens live in `styles/tokens.css`. DM Serif Display
(display) and Source Serif 4 (text) are self-hosted via `next/font`; DM Serif
Display is the closest openly licensed match for the reference headline, a
substitution rather than its exact face.

Motion decorates finished content and never gates it:

- The hero's headline, explanation and calls to action are there on first
  paint. Only the ribbon draws and the two bubbles arrive — on the first
  homepage visit of a session.
- Selected content rises into place once, as it arrives, and is never hidden
  again when scrolling back. Scrolling is always the browser's own.
- Page changes dissolve in 180ms; the header holds still.
- `prefers-reduced-motion` and no-JavaScript both show the finished page.

## The inquiry form

Name, work email, business, main goal and plan (defaulting to "not sure") are
visible; phone, industry, lead volume, CRM and a message sit in an optional
section. Client and server share one validation module. Unavailable, rejected,
network, timeout and rate-limited states each have a plain message and keep
what was typed; without JavaScript the endpoint accepts a normal form post.
Protection: honeypot, per-address rate limit (in-memory, per instance),
cross-site refusal, a streamed body-size cap. Logs record outcomes only.

Local testing: `npm run forms:sink`, then run with
`FORMS_WEBHOOK_URL=http://127.0.0.1:4455/`. A success there proves the site's
behaviour, not a production integration.

## Honesty

No testimonials, logos, customer counts, results or ratings. The worked
example and product views are labelled illustrative or sample, with fictional
people and businesses; the demo's figures are computed from sample accounts.
The industry images are generated editorial stills, labelled on the page.
