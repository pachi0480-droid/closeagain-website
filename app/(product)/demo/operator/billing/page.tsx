import { demoMetadata } from '@/components/dashboard/metadata'
import { BillingView } from '@/components/dashboard/operator/BillingView'

export const metadata = demoMetadata('Billing', 'Sample subscriptions, invoices and MRR computed from the published plan prices.')

export default function BillingPage() {
  return <BillingView />
}
