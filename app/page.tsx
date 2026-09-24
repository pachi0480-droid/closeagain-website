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

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * The homepage carries the whole argument end to end. The dedicated routes
 * (/product, /pricing, /calculator) go deeper on individual parts of it —
 * they do not replace the narrative here.
 */
export default function HomePage() {
  return (
    <>
      {/* recognition */}
      <Hero />
      {/* tension */}
      <RevenueLeak />
      {/* realization → clarity */}
      <MegaStatement />
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
