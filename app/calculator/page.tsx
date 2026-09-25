import type { Metadata } from 'next'
import { AuditForm } from '@/components/sections/AuditForm'
import { CalculatorWorkbench } from '@/components/calculator/CalculatorWorkbench'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = {
  title: 'Growth-gap calculator',
  description:
    'Model what your follow-up gap is worth, and whether adding demand or working the demand you already have is the larger move.',
  alternates: { canonical: '/calculator' },
}

export default function CalculatorPage() {
  return (
    <>
      <PageIntro
        eyebrow="Calculator"
        title="What is your follow-up gap worth?"
        lede="Six assumptions and one multiplication. Share the link and the assumptions travel with it."
      />
      <CalculatorWorkbench />
      <AuditForm />
    </>
  )
}
