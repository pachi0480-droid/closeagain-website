import { demoMetadata } from '@/components/dashboard/metadata'
import { ClientsView } from '@/components/dashboard/operator/ClientsView'

export const metadata = demoMetadata('Clients', 'Every sample client workspace with plan, revenue and account health.')

export default function ClientsPage() {
  return <ClientsView />
}
