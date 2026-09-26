import { OverviewView } from '@/components/dashboard/client/OverviewView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Overview', 'How follow-up is performing for the sample Juniper Row Realty workspace.')

export default function OverviewPage() {
  return <OverviewView />
}
