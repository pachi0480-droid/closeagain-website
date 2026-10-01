# CloseAgain — website and sample demo

CloseAgain captures new leads, follows up automatically, and re-engages old
opportunities — so more conversations become customers.

This repository holds the public website — where people learn what
CloseAgain does, compare plans and contact the team to buy — and a clickable
demo of the client and owner dashboards on sample data. It does not contain
the CloseAgain service itself.

```bash
npm ci
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
HTML; contact, the form endpoint and the confirmation page render on the server.
GSAP (loaded only on the homepage) plays its two timed stories; the hero's
red arrow is static SVG built at compile time (lib/ribbon.ts). Light and dark
themes share one token set.

See `RESEARCH-AND-CHANGES.md` for the design decisions and `DEPLOYMENT-NOTES.md`
for current delivery behavior, verification and launch requirements.

## Before this goes live

1. **Where inquiries go — the one required step.** Set `RESEND_API_KEY` (email
   to the business through Resend) and/or `FORMS_WEBHOOK_URL` (a CRM or
   automation webhook) on the production deployment. `.env.example` explains
   both. With neither, the buying form can only open a pre-filled email in the
   visitor's own email app — a draft is never reported as a sent inquiry.
   After deploying, send one test inquiry and check it arrives.
2. **Public origin.** Nothing to do on Vercel: a production build uses the
   project's production domain (custom domain once added, else `.vercel.app`),
   and previews stay noindex. Set `NEXT_PUBLIC_SITE_URL` only to override it.
3. **Legal copy.** `/privacy` and `/terms` describe what this site actually
   does (`content/legal.ts`). Have them reviewed, and update them if the site
   starts collecting more (for example analytics).
4. **Optional switches.** Analytics (`VERCEL_WEB_ANALYTICS`), a booking link
   (`NEXT_PUBLIC_BOOKING_URL`) and prospect confirmation emails (with
   `FORMS_EMAIL_FROM`) are explained in `.env.example` and `DEPLOYMENT-NOTES.md`.
5. **Unconfirmed facts.** `docs/open-questions.md` lists what the owner has
   confirmed and what is still open — Core's channel, usage allowances and
   fees, the Scale badge, how appointments are booked — and how each is worded
   meanwhile. Answer them there, then update `content/`.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero · Again · New + Old opportunities · From lead to customer · follow-up automation · old lead recovery · dashboard showcase · pricing · next step |
| `/how-it-works` | Six steps, each beside its product view and labelled automatic or your team, then what stays in your hands |
| `/features` | Nine capabilities, each with its product view and the plans that include it |
| `/who-its-for` | Eight lead-driven industries, each with a one-line value statement, linking to its own page |
| `/who-its-for/<industry>` | One landing page per industry (`real-estate`, `home-services`, `med-spas`, `law-firms`, `agencies`, `saas-technology`, `e-commerce`, `lead-driven-businesses`): where its leads slip, sample wording, a product view, plans, and Contact to buy with the industry pre-selected |
| `/pricing` | Core · Growth · Scale · Enterprise, a plan finder, what every plan shares, the full comparison and a break-even check |
| `/after-you-buy` | What happens after you buy: six steps to go live (`/getting-started` redirects here) |
| `/faq`, `/about` | Eleven buying questions; the short brand story |
| `/contact` | Contact to buy — the buying form (`?plan=growth`, `?industry=…` pre-fill) |
| `/thank-you` | Confirmation, shown only after a confirmed submission; neutral otherwise |
| `/privacy`, `/terms` | Marked placeholders |
| `/demo` | Sample client dashboard (noindex) — linked from the footer, features page and the homepage showcase |
| `/demo/operator` | Sample owner “Master control” dashboard (noindex) — not linked from the buying journey |
| `/getting-started`, `/book-a-demo` | Permanent redirects to `/after-you-buy` and `/contact` |

## Where things live

```
content/          Shared public copy and data
  site.ts         brand, navigation, the primary call to action
  pricing.ts      the ONLY place prices and plan facts live
  home.ts         homepage copy: hero, paths, the lead-to-customer flow, showcase
  pages.ts        supporting pages; FAQ (by id, reused on home and pricing)
  industries.ts   the industry landing pages (names and images from pages.ts)
  contact.ts      the buying page and confirmation copy
  industries.ts   the eight industry landing pages
  people.ts       who's behind CloseAgain (About shows it once filled in)
  proof.ts        real customer stories, with permission (homepage shows them once added)
  forms.ts        buying-form fields, options and messages
  legal.ts        privacy and terms (placeholders)
  demo/           sample data for the demo
docs/
  open-questions.md   unconfirmed product and pricing facts
app/(marketing)/  public pages (header + footer layout)
app/(product)/    the sample demo (its own shell; loads styles/dashboard.css)
app/api/forms/    the submission endpoint (/api/forms/inquiry)
components/
  home/           hero, connected paths, lead flow, automation, old leads,
                  dashboard showcase, control band
  pricing/        plan cards, comparison, break-even check
  previews/       small product views used on marketing pages (sample data)
  art/            the hero ribbon, message bubbles and the step layout (Trail)
  moments/        the product moment beside each page's title, played beat by beat
  editorial/      intro, rows, trio, accordion, closing CTA, word split
  forms/          the inquiry form and its page layout
  site/           header, mobile menu, theme toggle, footer, page transition, motion
  dashboard/      the demo UI; dashboard/showcase/ is the homepage's scaled
                  dashboard and phone cards (loads only styles/showcase.css)
lib/
  breakeven.ts    break-even arithmetic (visitor's numbers only)
  forms/          validation, transport, state, receipt, server decision,
                  webhook delivery, rate limiting — framework-free and tested
```

## Rules the code enforces

- **One source for prices.** `tests/pricing.test.ts` fails if a dollar amount
  or a plan price appears in any content, component or library file other than
  `content/pricing.ts`. Labels, the starting price, form options, metadata and
  plan availability on the features page are all derived from it.
- **Honest plan comparison.** Every plan has a best-for sentence and its
  headline facts; no plan repeats a benefit from the plan below as if it were
  an upgrade; no popularity claims — a recommendation must state its reason.
  The owner's commercial terms are asserted: monthly billing, no annual
  commitment, setup assistance included.
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

- The homepage opens once per session in a set order: navigation, the two
  headline lines, the copy and buttons settling into place, the red arrow
  drawing through the headline to land on the last of the four product beats
  beside it — a lead arrives, CloseAgain replies,
  follows up when it goes quiet, and the lead types back and books. The copy
  and buttons move but are never hidden, so they are readable and clickable
  from the first frame. On wide screens the beats then drift gently.
- Stories play once they are on screen: the New + Old columns fill and both
  replies fly into one inbox; the lead-to-customer events complete in order.
  Sample conversations arrive like a live chat (typing, then the reply).
  Product views rise into place on a soft glow. Scrolling is always the
  browser's own — nothing is pinned or hijacked.
- The dashboard showcase: on wide screens the dashboard stays in view while
  its six areas scroll past beside it, and the area being read is ringed.
  Tablets pair each area with its own card; phones swipe through them.
- Every supporting page has a product moment beside its title — a lead's
  path, features switching on, replies arriving, the tier meter, a chat,
  setup ticking to live — played beat by beat as it arrives, then drifting
  gently on wide screens.
- Other content rises into place once, as it arrives.
- Page changes dissolve in 180ms; the header holds still.
- Themes: light is the brand default; the toggle (header, mobile menu,
  dashboard) switches to the warm dark theme with a short cross-fade, set
  before first paint so nothing flashes.
- `prefers-reduced-motion` and no-JavaScript both show the finished page.

## The buying form

All ten fields are visible, in reading order: full name, business name, work
email, phone, industry, monthly lead volume, current CRM, preferred plan
(defaulting to "not sure", pre-selected from `?plan=`), main goal and a
message. Only name, business, email and goal are required. Client and server
share one validation module.

- **With a destination (`RESEND_API_KEY` and/or `FORMS_WEBHOOK_URL`):** the
  form submits in the background and moves on only after the server confirms
  delivery. Unavailable, rejected, network,
  timeout and rate-limited states each have a plain message and keep what was
  typed; without JavaScript the endpoint accepts a normal form post.
- **Without it:** a valid form opens the visitor's email app with every detail
  filled in, addressed to the business. The page says the visitor sends it —
  it never claims anything was sent.

Protection: honeypot, per-address rate limit (in-memory, per instance),
cross-site refusal, a streamed body-size cap. Logs record outcomes only.

Local testing: `npm run forms:sink`, then run with
`FORMS_WEBHOOK_URL=http://127.0.0.1:4455/`. A success there proves the site's
behaviour, not a production integration.

## Honesty

No testimonials, logos, customer counts, results or ratings. Product views
and the dashboard showcase are labelled sample, with fictional people and
businesses; the demo's figures are computed from sample accounts.
The industry images are generated editorial stills, labelled on the page.
