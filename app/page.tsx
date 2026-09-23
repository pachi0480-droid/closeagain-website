import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Calculator } from '@/components/sections/Calculator'
import { Comparison } from '@/components/sections/Comparison'
import { CoreStatement } from '@/components/sections/CoreStatement'
import { EarlyAccess } from '@/components/sections/EarlyAccess'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { Intelligence } from '@/components/sections/Intelligence'
import { Pricing } from '@/components/sections/Pricing'
import { Product } from '@/components/sections/Product'
import { ProductPreview } from '@/components/sections/ProductPreview'
import { RecoveryLoop } from '@/components/sections/RecoveryLoop'
import { RevenueLeak } from '@/components/sections/RevenueLeak'
import { Verticals } from '@/components/sections/Verticals'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* recognition */}
        <Hero />
        {/* tension */}
        <RevenueLeak />
        {/* realization → clarity */}
        <CoreStatement />
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
      </main>
      <Footer />
    </>
  )
}
