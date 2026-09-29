# CloseAgain delivery notes

## Launch checklist

The site is ready to publish. One step is required: telling it where to send inquiries.

1. **Create the inbox connection (about 5 minutes, free).** Sign up at [resend.com](https://resend.com) using **Closeagainhq@gmail.com**. Until you verify a domain, Resend's default sender can only email the address the account was opened with, so use that one. Then go to API Keys → Create API key (sending access) and copy the key.
2. **Deploy on Vercel.** Import the GitHub repository at [vercel.com/new](https://vercel.com/new), or run `npx vercel@latest deploy --prod` from this folder. In Project → Settings → Environment Variables, add `RESEND_API_KEY` with that key for Production, then redeploy.
3. **Send yourself a test inquiry.** Open `/contact` on the live site, fill the form with your own details, and send it. It should arrive in Gmail within a minute, titled "CloseAgain — … inquiry from …". The first time, check Spam and mark it "Not spam". Replying to the email answers the person who asked.
4. **Search.** Nothing to configure. A production build on Vercel uses the project's production address, so pages are indexable, the sitemap lists them, and canonical URLs point there; previews stay hidden. Add the site in [Google Search Console](https://search.google.com/search-console) and submit `/sitemap.xml`.
5. **See who visits (optional, free).** In Vercel → Analytics, click Enable, then add `VERCEL_WEB_ANALYTICS=on` and redeploy. Visits to `/thank-you` are your sent inquiries. The privacy policy switches its wording by itself.
6. **Let buyers book a call (optional).** Add `NEXT_PUBLIC_BOOKING_URL` with your Calendly or Cal.com link and redeploy. Contact to buy then offers "Pick a time for a call".
7. **Put a face on it.** Add your name, role, photo and a few words to `content/people.ts`, and the About page shows "Who's behind CloseAgain".
8. **Add proof as it arrives.** When a customer gives you a real result and written permission, add it to `content/proof.ts`, and the homepage shows it. Never before.
9. **Later, with your own domain:**
   - Add it in Vercel → Domains and redeploy; the origin follows automatically.
   - Verify it in Resend and set `FORMS_EMAIL_FROM` (for example `CloseAgain <inquiries@yourdomain.com>`). Every prospect then also gets a "we got your details" email that replies to you, and you can send inquiries to any address with `FORMS_NOTIFY_EMAIL`.
   - A business address on your own domain will also read better to buyers than a Gmail address.

## Run locally

```sh
npm ci
npm run dev
```

For a production server, run `npm run build` followed by `npm start`. The contact route and form API require a Next.js server; this is not a static HTML export. `npm run lint`, `npm run typecheck`, and `npm test` are available for verification.

## How inquiries reach the business

The business address is **Closeagainhq@gmail.com**, defined once in `content/site.ts`. It appears on the contact page, in the footer, and in the legal pages.

`/contact` always shows the buying form. What its button does is decided on the server at request time:

- **With a destination** (`RESEND_API_KEY`, `FORMS_WEBHOOK_URL`, or both): the form posts to `/api/forms/inquiry`, which validates the submission and reports success only after a destination accepts it. With both configured, one acceptance is enough. By email, each inquiry lists every answer, and Reply goes to the prospect.
- **With neither:** the button reads "Email my details" and opens a pre-filled draft in the visitor's own email app, addressed to the business. The page never claims anything was sent. It works, but a visitor on webmail or on a phone without a mail app may not finish, so configure a destination before sending traffic.

In both modes the address is also shown under the form for anyone who prefers to write directly.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-only. Emails each inquiry to the business through Resend. |
| `FORMS_NOTIFY_EMAIL` | Optional. Where inquiry emails go. Defaults to the business address. |
| `FORMS_EMAIL_FROM` | Optional. The sender, once a domain is verified in Resend. Defaults to Resend's `onboarding@resend.dev`. With it set, prospects also get a confirmation email. |
| `FORMS_CONFIRM_PROSPECT` | Optional. `off` stops the prospect confirmation email. |
| `VERCEL_WEB_ANALYTICS` | Optional. `on` adds Vercel Web Analytics (enable it in the dashboard first). |
| `NEXT_PUBLIC_BOOKING_URL` | Optional. An https scheduling link shown on Contact to buy. |
| `FORMS_WEBHOOK_URL` | Optional server-only HTTPS destination for inquiry JSON (a CRM, Zapier or Make, Formspree, or your own endpoint). |
| `FORMS_WEBHOOK_SECRET` | Optional server-only bearer secret sent to the webhook. Never use a `NEXT_PUBLIC_` prefix for it. |
| `NEXT_PUBLIC_SITE_URL` | Optional override of the public origin. On Vercel production builds the project's production domain is used automatically. With no origin, pages are `noindex` and the sitemap is empty. |

The payloads and timeout behavior are documented in `lib/forms/delivery.ts`. `npm run forms:sink` is a local testing sink, not a production delivery service.

## Content notes

- **Legal pages** describe what this website actually does: the form fields, hosting logs, the theme and demo storage, the 30-minute confirmation cookie, and no trackers or analytics. They are published and indexable. Have them reviewed, and update them if the site starts collecting more.
- **Product statements.** `docs/open-questions.md` lists behaviors to confirm against the real service, such as stopping on reply, pausing on handoff and how booking works, plus commercial details the proposal settles: usage allowances, fees and support times.
- **Evidence.** The conversation and dashboard examples are fictional and labelled as samples. No customer results, endorsements or performance guarantees appear anywhere. Add real ones only when they exist. The industry images are AI-generated editorial illustrations.

## Final visual and interaction verification

Checked against the local production build (`npm run build`, `next start`):

- Lint, typecheck, all 95 tests and the production build pass.
- Headless Chrome: 19 routes — every marketing page, the buying form with a plan pre-selected, the 404, and the main client and owner dashboard views — at 1440, 1280, 1024, 768, 430, 390, 375 and 320px, in light and dark (304 runs). No page scrolls sideways, no text escapes its box, and there are no console errors. The one exception was at 320px, below the smallest required width, and it has been fixed.
- WebKit (Safari's engine): 16 routes at 1440, 1280, 768, 390 and 375px in both themes (160 runs), all clean.
- Loading: on every page the main content paints within 0.6s locally, with zero layout shift. On a throttled connection, the homepage headline paints at about 0.85s.
- The accessibility audit (headings, landmarks, names, labels, image text) is clean on the marketing pages. The dashboards are app screens without a marketing footer, and their inline table links follow the table's row spacing.
- Reduced motion shows the finished page with no animation. Without JavaScript, content stays readable.

These checks were run locally. They do not certify every browser or device, and they do not measure conversion.
