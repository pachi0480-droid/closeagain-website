import { ConversationsView } from '@/components/dashboard/client/ConversationsView'
import { demoMetadata } from '@/components/dashboard/metadata'

export const metadata = demoMetadata('Conversations', 'Every sample conversation, as an inbox or a pipeline board.')

export default function ConversationsPage() {
  return <ConversationsView />
}
