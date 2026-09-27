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
   carrier registration (A2P 10DLC)?

## Before public launch

- **`FORMS_WEBHOOK_URL`:** where inquiries are delivered. Until it is set, the
  buying form opens a pre-filled email to the business address instead.
- **Privacy and Terms:** approved text is needed. Both pages are marked
  placeholders and are not indexed.
- **`NEXT_PUBLIC_SITE_URL`:** set on the production deployment only.
- **Fictional names:** check that the names in the sample views and the demo
  don't match real businesses in your market.
- **Industry images:** these are AI-generated editorial stills, labelled on the
  page.
