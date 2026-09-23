# CloseAgain — public website

Revenue recovery for home services. This repository is the **marketing site only**.
The application is not built here, and nothing in it should be mistaken for one.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.
No animation library: every transition here is CSS, driven by state or by one
`IntersectionObserver` primitive. That was a deliberate call — nothing in the
design needed a runtime animation engine, so the bundle does not carry one.

## Where things live

```
app/            route, metadata, OG image, robots, sitemap, design tokens
components/
  layout/       header (adapts to the surface under it) and footer
  sections/     one file per section of the page, in narrative order
  recovery/     the product visualisations: hero sequence, loop, feed, calculator parts
  ui/           button, field, slider, reveal, status, type primitives
data/           ALL copy, pricing, FAQ, scenarios and form options
lib/            calculator model, analytics, form boundary, hooks, formatting
```

**Edit copy in `data/`, not in components.** Brand, navigation, CTA labels and
contact details are in `data/site.ts`; pricing in `data/pricing.ts`; the
recovery scenarios that drive the hero and the product feed in
`data/scenarios.ts`.

## Design system

Tokens are defined once in `app/globals.css` under `@theme`.

- **Surfaces** — warm paper / bone / limestone, and deep ink environments.
  Never pure white, never pure black.
- **Recovery green** is semantic, not decorative. It appears only where an
  opportunity has actually been recovered.
- **State colours** — `dormant` (lost), `engaged` (in recovery), `recover`
  (recovered). Colour is never the only signal; every state carries a label.
- **Type** — Instrument Sans for everything, Instrument Serif for rare
  single-word emphasis, IBM Plex Mono for timestamps, statuses and figures.
- **Motion** — reveals are a single CSS primitive (`components/ui/Reveal.tsx`).
  `prefers-reduced-motion` is honoured: the hero sequence renders in its final
  recovered state and all reveals are visible.

## Honesty constraints

CloseAgain is pre-launch, and the site is built so it cannot drift into
claiming otherwise:

- Every conceptual product view carries a visible "illustrative" label.
- There are no customer logos, testimonials, ratings, badges, counts or
  integration claims anywhere in the codebase.
- Structured data is limited to `Organization` and `WebSite`. No review or
  rating schema.
- **The early-access form will not fake a success state.** See
  `lib/early-access.ts`: with no `NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT` set it
  returns `not-configured` and the UI says plainly that nothing was sent, with
  an email fallback.

## Before this goes live

1. `NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT` — a URL accepting a JSON POST. Until
   this is set the form is honest but non-functional. (`lib/early-access.ts`)
2. `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, Open Graph and the
   sitemap. Defaults to `https://closeagain.com`. (`data/site.ts`)
3. `site.email` in `data/site.ts` is the placeholder `hello@closeagain.com`.
   Replace it with the real inbox — it appears in the footer, the FAQ, the
   form and the structured data.

## Analytics

No provider is installed. `lib/analytics.ts` defines the event names and
forwards to `window.dataLayer` if one exists. Point `track()` at the chosen
tool and the whole site starts reporting without touching a component.
Events only fire on real interaction — the calculator does not report a
completion the visitor never asked for.

## The calculator

`lib/calculator.ts` holds the model. It is deliberately one multiplication:

```
opportunities × leakage rate × recovery rate × average job value
```

There is no hidden benchmark and no industry average. The equation and the
operator's own inputs are both shown on the page under the result. Inputs are
clamped, and the two widest ranges use a response curve so the slider is
usable at the low end where real ticket values sit.
