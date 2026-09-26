import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorIntegrations } from '@/components/dashboard/operator/IntegrationsView'

export const metadata = demoMetadata('Integration health', 'Sample connection health across every client workspace.')

export default function OperatorIntegrationsPage() {
  return <OperatorIntegrations />
}
