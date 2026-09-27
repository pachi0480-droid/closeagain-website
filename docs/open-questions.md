# Open questions — internal

Facts the public site deliberately does **not** state, because nobody has
confirmed them yet. Where a buyer needs the answer, the site says it is
settled during scoping or in the written proposal. It never invents one.

When one of these is answered, update the named file (usually
`content/pricing.ts` or `content/pages.ts`) and delete the item from this list.

## Product behaviour

1. **Channels.** Which channels does CloseAgain send and receive on (email, text
   messages, others)? The site says channels are confirmed during scoping (FAQ
   `channels`). The sample views and the demo show email and text.
2. **Lead sources.** Which sources connect out of the box: website forms, landing
   pages, phone or call tracking, CRMs? The site only uses "website forms" as an
   example.
3. **Stopping on reply.** Confirm that follow-up stops when a lead replies. The
   worked example, How it works and the FAQ say that it does.
4. **Re-engagement rules.** How are "eligible" older leads chosen, how often are
   they contacted, and when does outreach stop?
5. **Appointments.** How does booking work: a booking link, a calendar
   integration, or the team books? Are reminders and no-show follow-up part of
   "Appointment workflows"? The sample previews show them, but public copy stays
   generic.
6. **Handoff.** Does automation pause when a person takes over a conversation?
   The sample handoff preview shows it doing so.
7. **Reporting.** What does each level include (Basic / Advanced analytics /
   Advanced reporting / Custom reporting)? Can won business or revenue be
   tracked, for example through the CRM? The site says only that reports keep
   replies and appointments apart from sales.
8. **Message approval.** Confirm that messages are written with the customer and
   approved before launch. The site says so, based on the owner's "Review your
   setup" step.
9. **Consent and compliance.** Who is responsible for messaging consent, for
   example for text messages? The site says only that older-lead outreach is for
   "leads you already have and are allowed to contact".

## Pricing and terms

The four prices, monthly billing and setup assistance on every plan are
confirmed. The following are not, and the pricing page groups them under
"What your proposal confirms":

1. **Usage.** Allowances per plan and what happens above them. The owner's words
   are "Higher usage", "Higher usage limits" and "Custom usage"; there are no
   numbers.
2. **Users.** How many users each plan includes. Multi-user collaboration starts
   at Scale, but is Core/Growth one user?
3. **Locations.** Are Core to Scale limited to a single location?
   (Multi-location support is listed only for Enterprise.)
4. **Integrations.** What counts as standard, additional and custom?
5. **Support.** What "standard" and "priority" support mean: hours, response
   times, channels.
6. **Onboarding.** What priority and dedicated onboarding add, and typical setup
   time ranges. The site says timing "depends on your integrations and
   requirements".
7. **Additional charges.** Setup fees, messaging or carrier fees, usage charges.
8. **Contract.** Minimum term, cancellation terms, any annual option, and
   Enterprise billing. The site says only "billed monthly", with the term and
   cancellation set out in the proposal.
9. **Enterprise cells.** Cells marked "Custom" in the comparison (for example
   pipeline customization) are inferred from the Enterprise list.
10. **Recommendation.** Scale is labelled "Recommended for teams" because it is
    the first plan with multi-user collaboration. It is no longer described as
    "Most popular", which would need evidence. Remove the label if that is not
    the intended positioning.

## Before public launch

- **`FORMS_WEBHOOK_URL` (optional):** where form inquiries are delivered. With
  no valid destination, `/contact` shows a direct-email card addressed to the
  confirmed business email, `Closeagainhq@gmail.com`. Opening a draft does not
  send it. A valid destination enables the inquiry form at request time; a
  direct-email alternative remains available. Verify downstream inbox/CRM
  delivery before relying on the form.
- **Privacy and Terms:** approved text is needed. Both pages are marked
  placeholders and are not indexed.
- **`NEXT_PUBLIC_SITE_URL`:** set on the production deployment only. Without it
  the site stays in preview/noindex mode.
- **Fictional names:** check that the names in the sample views and demo
  (Jordan Ellis, Juniper Row Realty, Blue Heron Property Group and others) do
  not match real businesses in your market.
- **Industry images:** these are AI-generated editorial stills, labelled as such
  on the page.
