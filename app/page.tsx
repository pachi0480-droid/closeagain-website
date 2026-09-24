import type { Metadata } from 'next'
import { Calculator } from '@/components/sections/Calculator'
import { Comparison } from '@/components/sections/Comparison'
import { EarlyAccess } from '@/components/sections/EarlyAccess'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { Intelligence } from '@/components/sections/Intelligence'
import { MegaStatement } from '@/components/sections/MegaStatement'
import { Pricing } from '@/components/sections/Pricing'
import { Product } from '@/components/sections/Product'
import { ProductPreview } from '@/components/sections/ProductPreview'
import { RecoveryLoop } from '@/components/sections/RecoveryLoop'
import { RevenueLeak } from '@/components/sections/RevenueLeak'
import { Verticals } from '@/components/sections/Verticals'
import { Converge } from '@/components/visuals/Converge'
import { Multiply } from '@/components/visuals/Multiply'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * One continuous story in three acts, with the transitions between them
 * designed rather than left to a change of background colour.
 *
 *   recognition → the claim, proved once on a single opportunity
 *   tension     → that one becomes a month, and the month leaks
 *   resolution  → the month collapses to one again, and we follow it through
 *
 * `Multiply` and `Converge` are the hinges: the first carries you from the
 * warm world into the ink one while the count climbs, the second collapses the
 * field back to the single opportunity the engine takes apart.
 */
export default function HomePage() {
  return (
    <>
      {/* act one — recognition */}
      <Hero />
      <MegaStatement />

      {/* act two — one becomes a month, and the month leaks */}
      <Multiply />
      <RevenueLeak />

      {/* act three — back to one, and through the machinery */}
      <Converge />
      <RecoveryLoop />

      {/* product understanding */}
      <Product />
      <ProductPreview />
      <Intelligence />

      {/* self-calculation */}
      <Calculator />

      {/* confidence */}
      <Verticals />
      <Comparison />

      {/* commercial */}
      <Pricing />
      <Faq />

      {/* conversion */}
      <EarlyAccess />
    </>
  )
}
