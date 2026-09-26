import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorAnalytics } from '@/components/dashboard/operator/AnalyticsView'

export const metadata = demoMetadata('Platform analytics', 'Sample follow-up performance across every client, over 7, 30 or 90 days.')

export default function OperatorAnalyticsPage() {
  return <OperatorAnalytics />
}
