import type { Metadata } from 'next'
import { AuditForm } from '@/components/sections/AuditForm'
import { CommandCenter } from '@/components/sections/CommandCenter'
import { FinalSignalCTA } from '@/components/sections/FinalSignalCTA'
import { GrowthGapCalculator } from '@/components/sections/GrowthGapCalculator'
import { IndustrySignals } from '@/components/sections/IndustrySignals'
import { LeadScenario } from '@/components/sections/LeadScenario'
import { Offer } from '@/components/sections/Offer'
import { RevenueMotions } from '@/components/sections/RevenueMotions'
import { RevenueRadar } from '@/components/sections/RevenueRadar'
import { SignalRoomHero } from '@/components/sections/SignalRoomHero'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * Eight chapters, one system.
 *
 *   01  Signal Room        demand arrives, and gets a next action
 *   02  Watch a lead close  one inquiry, all the way through
 *   03  Two motions         new demand and recovered demand converge
 *   04  Revenue Radar       everything in play, at a glance
 *   05  Command Center      the queue the team works
 *   06  Growth gap          what the follow-up gap is worth
 *   07  Industries          who it is for, and what it sits beside
 *   08  Plans and audit     what it costs, and what happens first
 */
export default function HomePage() {
  return (
    <>
      <SignalRoomHero />
      <LeadScenario />
      <RevenueMotions />
      <RevenueRadar />
      <CommandCenter />
      <GrowthGapCalculator />
      <IndustrySignals />
      <Offer />
      <AuditForm />
      <FinalSignalCTA />
    </>
  )
}
