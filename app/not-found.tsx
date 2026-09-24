import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Type'
import { nav } from '@/data/site'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

/**
 * A missing page is its own small version of the brand idea: the path breaks,
 * and the thing to do is get it moving again rather than apologise about it.
 */
export default function NotFound() {
  return (
    <section className="grain relative isolate overflow-hidden bg-bone pt-36 pb-28 md:pt-44 md:pb-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="field-grid absolute inset-0 opacity-60"
          style={{
            maskImage: 'radial-gradient(90% 70% at 28% 10%, #000 0%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(90% 70% at 28% 10%, #000 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="shell">
        <Eyebrow>Error 404</Eyebrow>

        <h1 className="mt-5 max-w-[16ch] text-h2 text-graphite">
          This one got away.
        </h1>

        <p className="mt-6 max-w-[46ch] text-lede text-graphite-2">
          The page you were after is not here. Fitting, for a company built
          around things that go missing — but let us get you back on the path.
        </p>

        {/* the motif: a broken line, bridged */}
        <div aria-hidden="true" className="mt-12 flex max-w-xl items-center">
          <span className="h-px flex-1 bg-rule" />
          <span className="relative flex h-px w-24 items-center justify-center">
            <span className="absolute inset-0 bg-recover/60" />
            <span className="absolute h-[5px] w-[5px] rounded-full bg-recover" />
          </span>
          <span className="h-px flex-1 bg-rule" />
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/" size="lg" withArrow>
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/calculator" size="lg" variant="secondary">
            Calculate your revenue leak
          </ButtonLink>
        </div>

        <nav aria-label="Site" className="mt-16 border-t border-rule pt-8">
          <h2 className="font-mono text-mono-xs text-graphite-3 uppercase">
            Or head to
          </h2>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="link-rule text-[0.9375rem] text-graphite-2 transition-colors duration-300 hover:text-graphite"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
