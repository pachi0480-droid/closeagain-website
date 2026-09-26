import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { clientById, clients } from '@/content/demo/clients'
import { demoMetadata } from '@/components/dashboard/metadata'
import { ClientCommandCenter } from '@/components/dashboard/operator/ClientCommandCenter'

/** Only the sample clients exist; anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return clients.map((client) => ({ id: client.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const client = clientById(id)
  return demoMetadata(client ? client.name : 'Client', client ? `Command center for the sample client ${client.name}.` : undefined)
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!clientById(id)) notFound()
  return <ClientCommandCenter clientId={id} />
}
