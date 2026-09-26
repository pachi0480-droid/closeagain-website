import { demoMetadata } from '@/components/dashboard/metadata'
import { OperatorConversations } from '@/components/dashboard/operator/ConversationsView'

export const metadata = demoMetadata('All conversations', 'Sample conversations across every client workspace.')

export default function OperatorConversationsPage() {
  return <OperatorConversations />
}
