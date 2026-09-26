import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorLeads } from '@/components/dashboard/operator/LeadsView'

export const metadata = demoMetadata('All leads', 'Sample leads across every client workspace, with a client filter.')

export default function OperatorLeadsPage() {
  return <OperatorLeads />
}
