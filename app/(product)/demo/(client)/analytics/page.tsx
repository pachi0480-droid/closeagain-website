import { AnalyticsView } from '@/components/dashboard/client/AnalyticsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Analytics', 'Sample follow-up performance over 7, 30 or 90 days.')

export default function AnalyticsPage() {
  return <AnalyticsView />
}
