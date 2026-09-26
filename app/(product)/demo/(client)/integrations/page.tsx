import { IntegrationsView } from '@/components/dashboard/client/IntegrationsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Integrations', 'Connect lead sources, calendars and inboxes in the sample workspace.')

export default function IntegrationsPage() {
  return <IntegrationsView />
}
