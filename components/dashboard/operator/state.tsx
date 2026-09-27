'use client'

/**
 * State for the operator demo (“Master control”). Like the client dashboard,
 * the sample records are fixed and this store keeps only what changed in the
 * tab: paused accounts, toggled automations, deployed or edited templates…
 */

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { buildAutomations, initialDeployments, templates as baseTemplates, type Template } from '@/content/demo/automations'
import { monthlyPrice } from '@/content/demo/billing'
import { clients as baseClients } from '@/content/demo/clients'
import { buildAlerts, clientRows as baseRows, healthFor, type ClientRow, type Job, type Ticket } from '@/content/demo/operator'
import type { Automation, Client, ClientStatus, IntegrationId, IntegrationStatus, Person, Step } from '@/content/demo/types'
import { createPersistentStore } from '../store'
import { ToastProvider } from '../Toasts'

export type OperatorState = {
  clientStatus: Record<string, ClientStatus>
  automations: Record<string, boolean>
  deployments: Record<string, string[]>
  templates: Template[] | null
  integrations: Record<string, IntegrationStatus>
  waves: Record<string, number>
  tickets: Record<string, Ticket['status']>
  ticketNotes: Record<string, string[]>
  jobs: Record<string, Job['status']>
  invoices: Record<string, 'retrying'>
  upsells: Record<string, 'proposed'>
  dismissed: Record<string, true>
  clientInvites: Record<string, Person[]>
  teamInvites: Array<{ name: string; email: string; role: 'Admin' | 'Manager' | 'Viewer' }>
  notifications: Record<string, boolean>
}

export type OperatorAction =
  | { type: 'setClientStatus'; clientId: string; status: ClientStatus }
  | { type: 'setAutomation'; id: string; enabled: boolean }
  | { type: 'deploy'; templateId: string; clientIds: string[] }
  | { type: 'saveTemplate'; template: Template }
  | { type: 'addTemplate'; template: Template }
  | { type: 'setIntegration'; clientId: string; id: IntegrationId; status: IntegrationStatus }
  | { type: 'launchWave'; automationId: string }
  | { type: 'setTicket'; id: string; status: Ticket['status'] }
  | { type: 'addNote'; id: string; note: string }
  | { type: 'setJob'; id: string; status: Job['status'] }
  | { type: 'retryInvoice'; id: string }
  | { type: 'proposeUpsell'; clientId: string }
  | { type: 'dismissAlert'; id: string }
  | { type: 'inviteClientUser'; clientId: string; person: Person }
  | { type: 'inviteTeam'; member: OperatorState['teamInvites'][number] }
  | { type: 'setNotification'; id: string; on: boolean }

const initialState: OperatorState = {
  clientStatus: {},
  automations: {},
  deployments: {},
  templates: null,
  integrations: {},
  waves: {},
  tickets: {},
  ticketNotes: {},
  jobs: {},
  invoices: {},
  upsells: {},
  dismissed: {},
  clientInvites: {},
  teamInvites: [],
  notifications: {},
}

function reducer(state: OperatorState, action: OperatorAction): OperatorState {
  switch (action.type) {
    case 'setClientStatus':
      return { ...state, clientStatus: { ...state.clientStatus, [action.clientId]: action.status } }
    case 'setAutomation':
      return { ...state, automations: { ...state.automations, [action.id]: action.enabled } }
    case 'deploy': {
      const deployments = { ...state.deployments }
      for (const clientId of action.clientIds) {
        const current = deployments[clientId] ?? initialDeployments[clientId] ?? []
        if (!current.includes(action.templateId)) deployments[clientId] = [...current, action.templateId]
      }
      return { ...state, deployments }
    }
    case 'saveTemplate': {
      const list = state.templates ?? baseTemplates
      return { ...state, templates: list.map((template) => (template.id === action.template.id ? action.template : template)) }
    }
    case 'addTemplate':
      return { ...state, templates: [...(state.templates ?? baseTemplates), action.template] }
    case 'setIntegration':
      return { ...state, integrations: { ...state.integrations, [`${action.clientId}.${action.id}`]: action.status } }
    case 'launchWave':
      return { ...state, waves: { ...state.waves, [action.automationId]: (state.waves[action.automationId] ?? 0) + 1 } }
    case 'setTicket':
      return { ...state, tickets: { ...state.tickets, [action.id]: action.status } }
    case 'addNote':
      return { ...state, ticketNotes: { ...state.ticketNotes, [action.id]: [...(state.ticketNotes[action.id] ?? []), action.note] } }
    case 'setJob':
      return { ...state, jobs: { ...state.jobs, [action.id]: action.status } }
    case 'retryInvoice':
      return { ...state, invoices: { ...state.invoices, [action.id]: 'retrying' } }
    case 'proposeUpsell':
      return { ...state, upsells: { ...state.upsells, [action.clientId]: 'proposed' } }
    case 'dismissAlert':
      return { ...state, dismissed: { ...state.dismissed, [action.id]: true } }
    case 'inviteClientUser':
      return { ...state, clientInvites: { ...state.clientInvites, [action.clientId]: [...(state.clientInvites[action.clientId] ?? []), action.person] } }
    case 'inviteTeam':
      return { ...state, teamInvites: [...state.teamInvites, action.member] }
    case 'setNotification':
      return { ...state, notifications: { ...state.notifications, [action.id]: action.on } }
  }
}

const store = createPersistentStore<OperatorState, OperatorAction>('closeagain-demo:operator:v1', initialState, reducer)

type ContextValue = { state: OperatorState; dispatch: (action: OperatorAction) => void; reset: () => void }
const OperatorContext = createContext<ContextValue | null>(null)

export function OperatorDemoProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  const value = useMemo(() => ({ state, dispatch: store.dispatch, reset: store.reset }), [state])
  return (
    <OperatorContext.Provider value={value}>
      <ToastProvider note="Sample operator workspace — nothing was sent or saved beyond this tab.">{children}</ToastProvider>
    </OperatorContext.Provider>
  )
}

export function useOperator(): ContextValue {
  const value = useContext(OperatorContext)
  if (!value) throw new Error('useOperator must be used inside OperatorDemoProvider')
  return value
}

// ── Selectors ─────────────────────────────────────────────────────────────

/** Clients with this tab's status and integration changes applied. */
export function useClients(): Client[] {
  const { state } = useOperator()
  const { clientStatus, integrations } = state
  return useMemo(
    () =>
      baseClients.map((client) => {
        const status = clientStatus[client.id] ?? client.status
        const changed = Object.entries(integrations).filter(([key]) => key.startsWith(`${client.id}.`))
        if (status === client.status && changed.length === 0) return client
        const next = { ...client.integrations }
        for (const [key, value] of changed) next[key.slice(client.id.length + 1) as IntegrationId] = value
        return { ...client, status, integrations: next }
      }),
    [clientStatus, integrations],
  )
}

export function useClientRows(): ClientRow[] {
  const clients = useClients()
  return useMemo(
    () =>
      baseRows.map((row) => {
        const client = clients.find((item) => item.id === row.client.id) ?? row.client
        if (client === row.client) return row
        return {
          ...row,
          client,
          mrr: client.status === 'paused' ? 0 : monthlyPrice(client),
          health: healthFor(client, row.current, row.previous, client.integrations, client.status),
        }
      }),
    [clients],
  )
}

export function useAlerts() {
  const { state } = useOperator()
  const rows = useClientRows()
  return useMemo(() => buildAlerts(rows).filter((alert) => !state.dismissed[alert.id]), [rows, state.dismissed])
}

export function useTemplates(): Template[] {
  const { state } = useOperator()
  return state.templates ?? baseTemplates
}

export function useDeployments(): Record<string, string[]> {
  const { state } = useOperator()
  return useMemo(() => ({ ...initialDeployments, ...state.deployments }), [state.deployments])
}

/** A client's automations: its deployed templates, with toggles, stopped while the account is paused. */
export function useClientAutomations(clientId: string): Automation[] {
  const { state } = useOperator()
  const clients = useClients()
  const deployments = useDeployments()
  const templates = useTemplates()
  return useMemo(() => {
    const client = clients.find((item) => item.id === clientId)
    if (!client) return []
    const lookup = (id: string) => templates.find((template) => template.id === id)
    return buildAutomations(client, deployments[clientId] ?? [], lookup).map((automation) => {
      const template = templates.find((item) => item.id === automation.templateId)
      const steps: Step[] = template ? template.steps.map((step) => ({ ...step, id: `${client.id}.${step.id}` })) : automation.steps
      return { ...automation, steps, enabled: client.status === 'paused' ? false : (state.automations[automation.id] ?? automation.enabled) }
    })
  }, [clients, clientId, deployments, templates, state.automations])
}

/** Every client's automations with this tab's changes, for the cross-client views. */
export function useAllAutomations(): Automation[] {
  const { state } = useOperator()
  const clients = useClients()
  const deployments = useDeployments()
  const templates = useTemplates()
  return useMemo(
    () =>
      clients.flatMap((client) =>
        buildAutomations(client, deployments[client.id] ?? [], (id) => templates.find((template) => template.id === id)).map((automation) => {
          const template = templates.find((item) => item.id === automation.templateId)
          const steps: Step[] = template ? template.steps.map((step) => ({ ...step, id: `${client.id}.${step.id}` })) : automation.steps
          return { ...automation, steps, enabled: client.status === 'paused' ? false : (state.automations[automation.id] ?? automation.enabled) }
        }),
      ),
    [clients, deployments, templates, state.automations],
  )
}
