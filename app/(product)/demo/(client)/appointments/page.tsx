import { AppointmentsView } from '@/components/dashboard/client/AppointmentsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Appointments', 'Sample showings and consultations on a month or week calendar.')

export default function AppointmentsPage() {
  return <AppointmentsView />
}
