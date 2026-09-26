import { LeadsView } from '@/components/dashboard/client/LeadsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Leads', 'Every sample lead with its source, score, status and next action.')

export default function LeadsPage() {
  return <LeadsView />
}
