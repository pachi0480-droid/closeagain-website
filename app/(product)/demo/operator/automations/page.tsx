import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorAutomations } from '@/components/dashboard/operator/AutomationsView'

export const metadata = demoMetadata('All automations', 'Every sample automation across client workspaces, with on and off switches.')

export default function OperatorAutomationsPage() {
  return <OperatorAutomations />
}
