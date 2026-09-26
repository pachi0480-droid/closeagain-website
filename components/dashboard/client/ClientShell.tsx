'use client'

import { CalendarDays, ChartLine, LayoutDashboard, MessagesSquare, Plug, Settings, Users, Workflow } from 'lucide-react'
import type { ReactNode } from 'react'
import { integrationCatalog, workspaceClient } from '@/content/demo/workspace'
import { planById } from '@/content/pricing'
import { AppShell, type NavItem } from '../Shell'
import { useToast } from '../Toasts'
import { useClientDemo, useUnreadCount } from './state'

export function ClientShell({ children }: { children: ReactNode }) {
  const { state, reset } = useClientDemo()
  const notify = useToast()
  const unread = useUnreadCount()
  const attention = integrationCatalog.some(
    (item) => (state.integrations[item.id] ?? workspaceClient.integrations[item.id]) === 'attention',
  )

  const nav: NavItem[] = [
    { href: '/demo', label: 'Overview', icon: LayoutDashboard },
    { href: '/demo/conversations', label: 'Conversations', icon: MessagesSquare, count: unread },
    { href: '/demo/leads', label: 'Leads', icon: Users },
    { href: '/demo/automations', label: 'Automations', icon: Workflow },
    { href: '/demo/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/demo/analytics', label: 'Analytics', icon: ChartLine },
    { href: '/demo/integrations', label: 'Integrations', icon: Plug, alert: attention },
    { href: '/demo/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <AppShell
      variant="client"
      nav={nav}
      home="/demo"
      workspace={{
        name: workspaceClient.name,
        meta: `${planById(workspaceClient.plan)?.name ?? ''} plan · ${workspaceClient.location}`,
        mark: 'JR',
      }}
      user={{ name: 'Dana Whitfield', role: 'Owner · Broker' }}
      onReset={() => {
        reset()
        notify({ title: 'Sample data reset', detail: 'Every change made in this tab has been undone.', tone: 'info' })
      }}
    >
      {children}
    </AppShell>
  )
}
