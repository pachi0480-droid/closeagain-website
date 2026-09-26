import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorOverview } from '@/components/dashboard/operator/OverviewView'

export const metadata = demoMetadata('Operator overview', 'The sample operator overview: revenue, client health and alerts across every client workspace.')

export default function OperatorOverviewPage() {
  return <OperatorOverview />
}
