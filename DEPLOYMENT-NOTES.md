# CloseAgain delivery notes

This is an improved, isolated copy of the supplied website. It has not been deployed, connected to an external form provider, or used to send email.

## Run locally

```sh
npm ci
npm run dev
```

For a production server, run `npm run build` followed by `npm start`. The contact route and form API require a Next.js server; this is not a static HTML export. `npm run lint`, `npm run typecheck`, and `npm test` are available for verification.

## Business contact

The confirmed business address is **Closeagainhq@gmail.com**, defined once in `content/site.ts`. It appears on the contact page, in the shared footer, and in the contact sections of the unfinished legal pages.

`/contact` always shows the buying form. What its button does depends on the server's configuration, decided at request time:

- **No valid `FORMS_WEBHOOK_URL`:** the button reads "Email my details". After the form validates, it opens a pre-filled draft in the visitor's email app, addressed to the business, with every answer (including the chosen plan) as `Label: value` lines. The visitor sends the draft themselves. The page says the email app should now open and that nothing has been sent yet; it never shows a success message. The draft is built by `lib/forms/email.ts`, which has unit tests.
- **A valid webhook:** the form posts to `/api/forms/inquiry`, which validates the submission and reports success only after the destination returns a successful response.

In both modes the address is also shown under the form for anyone who prefers to write directly. No existing email delivery account has been connected or verified.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Set to the verified public origin only when publishing. Rebuild after changing it. With no value, pages remain `noindex`, robots disallow crawling, canonical links are omitted, and the sitemap is empty. |
| `FORMS_WEBHOOK_URL` | Optional server-only destination for submitted inquiry JSON. HTTPS is required outside local testing. Leave empty and the form opens a pre-filled email draft instead. |
| `FORMS_WEBHOOK_SECRET` | Optional server-only bearer secret sent to the webhook. Never use a `NEXT_PUBLIC_` prefix for this secret. |

The webhook payload and timeout behavior are documented in `lib/forms/delivery.ts`. A successful webhook response confirms receipt by that destination; the owner should verify its downstream inbox/CRM behavior before relying on it. `npm run forms:sink` is a local testing sink, not a production delivery service.

## Before publishing

- **Privacy and Terms are unfinished.** `content/legal.ts` keeps both documents at `status: 'placeholder'`, without an effective date. They remain visibly marked and excluded from indexing. Obtain the applicable approved text, replace the empty sections, add the effective date, and set the status to `approved`. This package does not invent legal policies.
- **Verify product statements against the actual service.** The supplied `docs/open-questions.md` still identifies stopping on reply, pausing on human handoff, message approval, channel availability, eligible-lead rules, appointment behavior, integrations, and reporting scope as items to confirm. Illustrative demonstrations are not evidence of a deployed capability.
- **Confirm commercial details in the proposal.** The supplied plan prices, monthly billing, and setup assistance were retained. Exact usage allowances, overage charges, user counts, location limits, supported integrations, support response times, onboarding timing, additional fees, minimum term, cancellation terms, and Enterprise billing are not established by this website.
- **Use actual customer evidence when available.** The conversation and dashboard examples are fictional. No customer results, endorsements, or performance guarantees have been added. The industry images are supplied AI-generated editorial illustrations.
- **Check the production origin and email workflow.** Test the final deployment’s canonical URLs, sitemap, social share image, mailto recipient, and—if enabled—the webhook and confirmation route before pointing visitors at it.

No live domain, hosting account, external inbox, webhook, payment processor, or customer service was changed as part of this local website work.

## Local verification

All 12 marketing routes returned HTTP 200 from the local production server. Their rendered markup had one H1, unique IDs, language metadata, page titles, and preview indexing restrictions. The audit found no missing anchor targets among 446 rendered links and successfully loaded all eight industry images plus the social share image.

Both contact modes were checked against the same production build: direct email with no webhook, and the real form with a temporary local-only webhook URL supplied to a separate server process. Valid plan and industry selections survive in server-rendered markup, including before JavaScript runs. Unknown plans are ignored. No inquiry was submitted during that mode check, and the temporary server was stopped afterward. External delivery remains unverified.

## Final visual and interaction verification

Checked against the local production build (`npm run build`, `next start`):

- Lint, typecheck, all 95 tests and the production build pass.
- Headless Chrome: 19 routes — every marketing page, the buying form with a plan pre-selected, the 404, and the main client and owner dashboard views — at 1440, 1280, 1024, 768, 430, 390, 375 and 320px, in light and dark (304 runs). No page scrolls sideways, no text escapes its box, and there are no console errors. The one exception was at 320px, below the smallest required width, and it has been fixed.
- WebKit (Safari's engine): 16 routes at 1440, 1280, 768, 390 and 375px in both themes (160 runs), all clean.
- Loading: on every page the main content paints within 0.6s locally, with zero layout shift. On a throttled connection, the homepage headline paints at about 0.85s.
- The accessibility audit (headings, landmarks, names, labels, image text) is clean on the marketing pages. The dashboards are app screens without a marketing footer, and their inline table links follow the table's row spacing.
- Reduced motion shows the finished page with no animation. Without JavaScript, content stays readable.

These checks were run locally. They do not certify every browser or device, and they do not measure conversion.
