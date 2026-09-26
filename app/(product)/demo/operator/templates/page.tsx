import { demoMetadata } from '@/components/dashboard/metadata'
import { TemplatesView } from '@/components/dashboard/operator/TemplatesView'

export const metadata = demoMetadata('Templates', 'The master automation library: create, edit, duplicate and deploy sample templates.')

export default function TemplatesPage() {
  return <TemplatesView />
}
