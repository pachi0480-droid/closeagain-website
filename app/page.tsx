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
import { Disperse } from '@/components/visuals/Disperse'
import { Multiply } from '@/components/visuals/Multiply'
import { Resolve } from '@/components/visuals/Resolve'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * One continuous story. Every act change is a transformation of the thing you
 * were just looking at, not a change of background colour:
 *
 *   Hero          one opportunity, recovered
 *   Multiply      that one becomes the eighteen of a month  (paper → ink)
 *   RevenueLeak   eleven of the eighteen stop at a gate
 *   Converge      the month collapses back to the one that broke
 *   RecoveryLoop  that one goes through the machinery
 *   Resolve       its finished record becomes a row on the board  (ink → bone)
 *   Product       the surface it was recovered by
 *   ProductPreview the interface that row lives in
 *   Disperse      the feed multiplies into the model  (limestone → ink)
 *   Calculator    the model, at your numbers
 *
 * The bridges read the same data as the sections they join, so none of them
 * can drift out of agreement with each other.
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

      {/* act four — the record becomes the product */}
      <Resolve />
      <Product />
      <ProductPreview />

      {/* act five — the feed becomes the model */}
      <Disperse />
      <Calculator />

      {/* confidence */}
      <Verticals />
      <Comparison />
      <Intelligence />

      {/* commercial */}
      <Pricing />
      <Faq />

      {/* conversion */}
      <EarlyAccess />
    </>
  )
}
