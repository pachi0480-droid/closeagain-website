'use client'

import {
  Building2,
  CalendarDays,
  ChartLine,
  Gauge,
  Library,
  MessagesSquare,
  Plug,
  Receipt,
  Server,
  Settings,
  Users,
  Workflow,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { services } from '@/content/demo/operator'
import { AppShell, type NavItem } from '../Shell'
import { useToast } from '../Toasts'
import { useAlerts, useClients, useOperator } from './state'

export function OperatorShell({ children }: { children: ReactNode }) {
  const { state, reset } = useOperator()
  const notify = useToast()
  const alerts = useAlerts()
  const clients = useClients()
  const attention = clients.reduce((sum, client) => sum + Object.values(client.integrations).filter((status) => status === 'attention').length, 0)
  const failedPayment = clients.some((client) => client.status === 'paused') && Object.keys(state.invoices).length === 0
  const degraded = services.some((service) => service.status !== 'operational')

  const nav: NavItem[] = [
    { href: '/demo/operator', label: 'Overview', icon: Gauge, count: alerts.length },
    { href: '/demo/operator/clients', label: 'Clients', icon: Building2 },
    { href: '/demo/operator/leads', label: 'Leads', icon: Users },
    { href: '/demo/operator/conversations', label: 'Conversations', icon: MessagesSquare },
    { href: '/demo/operator/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/demo/operator/automations', label: 'Automations', icon: Workflow },
    { href: '/demo/operator/templates', label: 'Templates', icon: Library },
    { href: '/demo/operator/analytics', label: 'Analytics', icon: ChartLine },
    { href: '/demo/operator/billing', label: 'Billing', icon: Receipt, alert: failedPayment },
    { href: '/demo/operator/integrations', label: 'Integrations', icon: Plug, alert: attention > 0 },
    { href: '/demo/operator/system', label: 'System', icon: Server, alert: degraded },
    { href: '/demo/operator/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <AppShell
      variant="operator"
      nav={nav}
      home="/demo/operator"
      workspace={{ name: 'Master control', meta: `${clients.length} client workspaces`, mark: 'MC' }}
      user={{ name: 'Riley Brooks', role: 'Operations lead' }}
      onReset={() => {
        reset()
        notify({ title: 'Sample data reset', detail: 'Every change made in this tab has been undone.', tone: 'info' })
      }}
    >
      {children}
    </AppShell>
  )
}
