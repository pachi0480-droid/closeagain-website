import { CalendarDays, ClipboardList, Contact, FileSpreadsheet, Inbox, LayoutTemplate, MessageSquare, Webhook, type LucideIcon } from 'lucide-react'
import type { IntegrationId } from '@/content/demo/types'

/** Generic category icons — never a vendor's logo. */
export const integrationIcon: Record<IntegrationId, LucideIcon> = {
  'web-forms': ClipboardList,
  'landing-pages': LayoutTemplate,
  crm: Contact,
  calendar: CalendarDays,
  'email-inbox': Inbox,
  'phone-text': MessageSquare,
  webhooks: Webhook,
  spreadsheet: FileSpreadsheet,
}
