import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorAppointments } from '@/components/dashboard/operator/AppointmentsView'

export const metadata = demoMetadata('All appointments', 'Sample appointments across every client workspace.')

export default function OperatorAppointmentsPage() {
  return <OperatorAppointments />
}
