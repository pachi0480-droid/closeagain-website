import { demoMetadata } from '@/components/dashboard/metadata'
import { SystemView } from '@/components/dashboard/operator/SystemView'

export const metadata = demoMetadata('System', 'Sample service status, queues and background jobs.')

export default function SystemPage() {
  return <SystemView />
}
