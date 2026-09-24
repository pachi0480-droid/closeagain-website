import type { Metadata } from 'next'
import { CalculatorWorkbench } from '@/components/calculator/CalculatorWorkbench'
import { PageIntro } from '@/components/layout/PageIntro'
import { EarlyAccess } from '@/components/sections/EarlyAccess'

export const metadata: Metadata = {
  title: 'Revenue recovery calculator',
  description:
    'Put in your own inbound volume, leakage and average job value, and see what follow-up leakage could be costing you each month. Illustrative, transparent arithmetic — no benchmark, no borrowed average.',
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'Revenue recovery calculator — CloseAgain',
    description:
      'What could follow-up leakage be costing you? Use your numbers, see the arithmetic, share the link.',
    url: '/calculator',
  },
}

export default function CalculatorPage() {
  return (
    <>
      <PageIntro
        eyebrow="Calculator"
        title="What could follow-up leakage be costing you?"
        lede="Four assumptions, one multiplication, and the whole thing shown in the open. Change any of them and the link at the top of your browser changes with it, so you can send this to whoever signs off."
      />
      <CalculatorWorkbench />
      <EarlyAccess />
    </>
  )
}
