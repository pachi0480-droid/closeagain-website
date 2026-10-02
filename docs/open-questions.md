# Open questions — internal

These are facts the public site does not state yet, because nobody has confirmed
them. Where a buyer needs an answer, the site says it is confirmed in the
proposal or during onboarding. It never invents one.

When you answer a question, update the named file (usually `content/pricing.ts`)
and delete the item from this list.

## Confirmed by the owner (now on the site)

- Prices: Core $499, Growth $899, Scale $1,499, Enterprise custom.
- Terms: monthly billing, no annual commitment, setup assistance on every plan.
- Users: Core 1, Growth 3–5, Scale 10+, Enterprise custom.
- Locations: Core 1, Scale multiple, Enterprise multi-location management.
- Email + SMS workflows from Growth, and missed-call follow-up on Scale.
- AI personalization (basic on Growth, advanced on Scale), plus API and webhook
  access on Scale.
- Each plan's full feature list, as supplied in the upgrade brief.
- Business email: Closeagainhq@gmail.com.

## Still open

### Plans and pricing

1. **Scale badge.** The owner asked for "Most popular". The site says
   "Recommended" because there are no customers yet to make "most popular"
   true. Change `recommendation.label` in `content/pricing.ts` once it is true.
2. **Core's channel.** Growth adds "Email + SMS workflows". Which single
   channel does Core use?
3. **Growth locations.** The site shows 1, inferred from "Everything in Core"
   plus a list with no location change.
4. **Usage.** What are the numeric allowances behind "Standard / Higher / Much
   higher / Custom", and what happens above them? The site says these are
   confirmed in the proposal.
5. **Fees.** Are there messaging, carrier or other usage fees? The site says any
   fees are confirmed in the proposal.
6. **Enterprise extras.** The brief listed white-label options, enterprise
   security/SSO and agency/sub-account support "if supported". None of them are
   published until they are confirmed.
7. **Enterprise comparison cells.** Where the Enterprise list is silent (for
   example missed-call follow-up and lead scoring), the comparison says
   "Custom".
8. **Support.** What do "Standard", "Priority", "Faster" and "SLA" support mean
   in hours or response times?

### Product behaviour

1. **Stopping on reply.** Confirm that follow-up stops when a lead replies. The
   How it works page, the FAQ and the sample views say that it does.
2. **Message approval.** Confirm that messages are approved before launch. The
   "After you buy" page says so.
3. **Appointment booking.** How does booking work in practice: a booking link, a
   calendar integration, or the team books?
4. **Pausing on handoff.** Does automation pause when a person takes over? The
   sample handoff view shows it doing so.
5. **Consent and compliance.** Who is responsible for text-message consent and
   carrier registration (A2P 10DLC)? Before sending business texts in the US,
   carriers require registration through your texting provider (for example
   Twilio). They typically ask for:
   - your legal business name and EIN (the brand);
   - the use case, such as follow-up with people who asked about a service;
   - two or three sample messages;
   - how people opt in, and the opt-out wording ("Reply STOP to opt out");
   - a privacy policy saying mobile numbers and consent aren't shared for
     marketing. `/privacy` already says this.

   Each customer business must also have consent from the leads it texts.

   The homepage ("Follow-up, not spam") and the FAQ now state these rules as
   how every campaign runs: only people who contacted the business or already
   know it, a short sequence the business approves, stop on reply, and STOP to
   opt out (removed for good). Confirm each one is how you operate.
   Confirm the exact requirements with your texting provider; this list is a
   starting point, not legal advice.

## Before public launch

- **Where inquiries go:** set `RESEND_API_KEY` (or `FORMS_WEBHOOK_URL`) on the
  production deployment, then send one test inquiry. Until then, the buying
  form can only open a pre-filled email in the visitor's own email app. See the
  launch checklist in `DEPLOYMENT-NOTES.md`.
- **Privacy and Terms:** written from what the site actually does and
  published. Have them reviewed. Add governing law or refund terms if you want
  them on the website rather than in the proposal.
- **Fictional names:** check that the names in the sample views and the demo
  don't match real businesses in your market.
- **Industry images:** these are AI-generated editorial stills, labelled on the
  page.
