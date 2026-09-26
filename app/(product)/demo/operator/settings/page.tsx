import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorSettings } from '@/components/dashboard/operator/SettingsView'

export const metadata = demoMetadata('Operator settings', 'The sample operations team, roles and notifications.')

export default function OperatorSettingsPage() {
  return <OperatorSettings />
}
