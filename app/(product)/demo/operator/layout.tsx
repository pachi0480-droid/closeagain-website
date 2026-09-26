import type { Metadata } from 'next'
import { demoRobots } from '@/components/dashboard/metadata'
import { OperatorShell } from '@/components/dashboard/operator/OperatorShell'
import { OperatorDemoProvider } from '@/components/dashboard/operator/state'

export const metadata: Metadata = {
  title: { absolute: 'Master control — CloseAgain demo' },
  description: 'A sample CloseAgain operator workspace across ten fictional client businesses.',
  robots: demoRobots,
}

/** The operator demo (“Master control”): its own shell and state, one main landmark. */
export default function OperatorDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <OperatorDemoProvider>
      <OperatorShell>
        <main id="main" tabIndex={-1} className="app-main">
          {children}
        </main>
      </OperatorShell>
    </OperatorDemoProvider>
  )
}
