# CloseAgain — public website

Demand-to-revenue infrastructure for home services. This repository is the
**marketing site only**. The application is not built here, and nothing in it
should be mistaken for one.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.
No animation library: every transition here is CSS, driven either by state, by
one `IntersectionObserver` primitive, or by a single scroll-linked custom
property. That was a deliberate call — nothing in the design needed a runtime
animation engine, so the bundle does not carry one. Smooth scrolling is the
browser's own `scroll-behavior`, which costs nothing and never fights the
scrollbar.

## The design concept — The Signal Room

Every opportunity that reaches a home-service business enters as a **signal**
carrying six facts: what the work is, where it came from, what state it is in,
how long since it moved, what it might be worth, and the one next action
assigned to it. New inquiries and reopened ones use the same vocabulary,
because the product's argument is that they are the same queue.

That vocabulary is defined once, in `data/signals.ts`, and every module on the
site renders from it — the hero field, the radar, and the command centre. A
visitor learns the language once.

**State is never carried by colour alone.** Each of the six states has a word
and a glyph alongside its colour (`stateMeta` in `data/signals.ts`).

## Routes

| Route | What it is |
| --- | --- |
| `/` | Eight chapters, end to end. The narrative lives here. |
| `/product` | Each capability as four comparable facts, plus the command centre. |
| `/pricing` | Plans, the full capability matrix, and pricing-specific questions. |
| `/calculator` | Standalone and shareable. Assumptions are mirrored into the URL. |
| `/privacy`, `/terms` | Pre-launch drafts, marked as such on the page. |
| `/404` | Designed, not the framework default. |

The homepage chapters, in order:

1. **Signal Room hero** — demand arrives, one node assigns each signal an action
2. **Watch a lead get closed** — one inquiry, step by step, three scenarios
3. **Two revenue motions** — new and recovered demand converging on booked work
4. **Revenue Radar** — everything in play, filterable, placed by value
5. **Revenue Command Center** — the queue a team actually works
6. **Growth-gap calculator** — what the follow-up gap is worth
7. **Industries and differentiation** — who it is for, what it sits beside
8. **Plans, audit and final CTA** — what it costs, and what happens first

## Where things live

```
app/            routes, metadata, OG image, robots, sitemap, design tokens
components/
  layout/       header, footer, page intro, legal shell
  sections/     the eight homepage chapters, in narrative order
  signal/       the Signal Room field (hero) and its mobile strip
  product/      capability records
  pricing/      plan grid, capability matrix, pricing questions
  calculator/   the growth-gap stage, shared state, sensitivity, caveats
  ui/           button, field, slider, reveal, signal, mark, type primitives
data/           ALL copy, signals, pricing, scenarios and form options
lib/            calculator model, analytics, form boundary, hooks, formatting
public/         the one raster asset on the site
```

**Edit copy in `data/`, not in components.** Brand, navigation, CTA labels and
contact details are in `data/site.ts`; pricing in `data/pricing.ts`; the signal
vocabulary and demo populations in `data/signals.ts`; the three lead scenarios
in `data/lead-scenarios.ts`.

The three honesty labels are centralised in `site.ts` as `labels`, so the
wording cannot multiply across the page.

## Design system

Tokens are defined once in `app/globals.css` under `@theme`.

- **Surfaces** — five graphite steps from `void` to `steel`. Never pure black.
- **Type** — warm white on graphite. Geist for everything, Geist Mono for
  technical labels and data. No serif, no italic display type.
- **Signal green** (`--color-signal`) is semantic, not decorative: active
  opportunities, booked paths, progress, and CTAs. **At-risk orange**
  (`--color-risk`) appears only where momentum is being lost.
- **Tabular numerals** (`.tnum`) on every figure that changes.

### Motion

Motion communicates product state, never decoration. Four primitives:

| Primitive | Where |
| --- | --- |
| `[data-reveal]` | one entrance transition, `IntersectionObserver`-driven |
| `.path-draw` | a path drawing along its own length |
| `--p` (`useScrollVar`) | scroll-linked geometry, one style write per frame |
| `useProximity` | the hero field's restrained pointer response |

`prefers-reduced-motion: reduce` is honoured throughout: reveals resolve
instantly, scroll-linked scenes pin to their end state, the lead scenario shows
every step at once, and the pointer response is never attached.

> **`.path-draw` gotcha.** With `preserveAspectRatio="none"` and
> `vector-effect="non-scaling-stroke"`, the dash pattern is measured in screen
> pixels while `getTotalLength()` reports user units. Set `--len` comfortably
> larger than the path's *on-screen* length or the tail silently dashes off.

## The calculator

`lib/calculator.ts` holds the single model, shared by the homepage chapter and
the `/calculator` route. Six inputs, plain multiplication, nothing hidden:

```
opportunity value = leads x job value
booked            = leads x booking rate x job value
follow-up gap     = unbooked demand receiving no consistent follow-up
conversion upside = follow-up gap x recovery rate
new-demand upside = added leads x booking rate x job value
```

The last two are deliberately kept apart: the point of the calculator is to
show an operator whether **buying more demand** or **working the demand they
already have** is the larger number for them.

`/calculator` adds three things the homepage does not:

- **URL state.** Mirrored with `history.replaceState` — shareable, no history
  entries, no bailout from static rendering. Short keys: `?l=320&v=680&b=38…`
- **Sensitivity.** The same arithmetic across a range of recovery rates.
- **What the model ignores.** Capacity, close rate on recovered leads, ticket
  variance and seasonality, stated plainly.

## Honesty

- No customer logos, testimonials, ratings, badges, counts, case studies,
  integration claims, certifications or awards exist anywhere in the codebase.
- Every conceptual product view carries **one** label, at the module header:
  `Interactive product scenario` or `Illustrative product preview`.
- Demo figures are obvious demo figures inside a conceptual interface. None of
  them is presented as a customer result.
- Structured data is limited to `Organization` and `WebSite`. No review schema.
- **The audit form will not fake a success state.** See `lib/early-access.ts`:
  with no `NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT` set it returns `not-configured`,
  and the UI says plainly that nothing was sent, with an email fallback.

## Before this goes live

1. `NEXT_PUBLIC_EARLY_ACCESS_ENDPOINT` — a URL accepting a JSON POST of
   `EarlyAccessPayload`. Until this is set the form is honest but
   non-functional, and shows a small preview notice. (`lib/early-access.ts`)
2. `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, Open Graph and the
   sitemap. Defaults to `https://closeagain.com`. (`data/site.ts`)
3. `site.email` in `data/site.ts` is the placeholder `hello@closeagain.com`.
   Replace it with the real inbox — it appears in the footer, the form and the
   structured data.
4. Confirm the plan prices in `data/pricing.ts` are still the approved ones
   before launch.

## Analytics

No provider is installed. `lib/analytics.ts` defines the event names and
forwards to `window.dataLayer` if one exists. Point `track()` at the chosen
tool and the whole site starts reporting without touching a component. Events
only fire on real interaction — the calculator does not report a completion the
visitor never asked for.
