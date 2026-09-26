import type { Metadata } from 'next'
import { ClientShell } from '@/components/dashboard/client/ClientShell'
import { ClientDemoProvider } from '@/components/dashboard/client/state'
import { demoRobots } from '@/components/dashboard/metadata'

export const metadata: Metadata = {
  title: { absolute: 'Client dashboard — CloseAgain demo' },
  description: 'A sample CloseAgain client workspace with demo data.',
  robots: demoRobots,
}

/** The client dashboard demo: its own shell and state, one main landmark. */
export default function ClientDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientDemoProvider>
      <ClientShell>
        <main id="main" tabIndex={-1} className="app-main">
          {children}
        </main>
      </ClientShell>
    </ClientDemoProvider>
  )
}
