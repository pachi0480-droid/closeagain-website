import { AutomationsView } from '@/components/dashboard/client/AutomationsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Automations', 'Sample campaigns and follow-up sequences, with a step-by-step builder.')

export default function AutomationsPage() {
  return <AutomationsView />
}
