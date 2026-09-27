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

When no valid `FORMS_WEBHOOK_URL` is configured, `/contact` shows a direct-email card. Its button opens an editable draft addressed to the business. The visitor must send the draft from their own email app; the website never claims that opening a draft sends an inquiry. The visible address also supports copying into webmail. Valid plan and industry choices from the site are included in that draft.

When a valid webhook is configured, `/contact` renders the inquiry form and keeps a direct-email alternative. The choice is made on the server at request time. The form endpoint validates the submission and reports success only after the destination returns a successful response. No existing email delivery account has been connected or verified.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Set to the verified public origin only when publishing. Rebuild after changing it. With no value, pages remain `noindex`, robots disallow crawling, canonical links are omitted, and the sitemap is empty. |
| `FORMS_WEBHOOK_URL` | Optional server-only destination for submitted inquiry JSON. HTTPS is required outside local testing. Leave empty to use direct email contact. |
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

- Production build and TypeScript completed successfully; ESLint passed; all 78 tests passed.
- Inspected the homepage, new conversation demo, pricing tiers and contact layouts at 320px, 390px, 960px and 1440px as applicable. No page-level horizontal overflow was found. The wide comparison scrolls inside its own labeled region.
- Verified scenario switching, all four conversation steps, immediate play feedback, pause, plan selection, comparison disclosure, and the break-even calculator.
- Verified mobile menu focus, Escape dismissal and focus return. Reduced-motion mode disables ribbon choreography and leaves every reveal visible. With JavaScript disabled, content stays readable and the mobile menu links to footer navigation.
- Verified exact price/CTA alignment across the three desktop tiers and repaired Enterprise heading/focus contrast.
- Fresh production-browser testing reported no console errors or warnings during the final checked interactions.

The local preview is http://127.0.0.1:5387 while the preview server is running. It is not a public deployment. Desktop/mobile browser checks are not a claim of cross-browser certification or measured conversion improvement.
