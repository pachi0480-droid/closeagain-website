import { SettingsView } from '@/components/dashboard/client/SettingsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Settings', 'Account, team, billing, notifications and permissions for the sample workspace.')

export default function SettingsPage() {
  return <SettingsView />
}
