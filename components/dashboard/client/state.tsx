'use client'

/**
 * State for the client dashboard demo. The sample records never change; the
 * store keeps only what a visitor changed (a stage, a checked task, a toggled
 * automation…) and the selectors below lay those changes over the records.
 * Changes last for the browser tab.
 */

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { DEMO_NOW } from '@/content/demo/time'
import type { AppointmentStatus, IntegrationId, IntegrationStatus, Lead, Message, Outcome, StageId, Step } from '@/content/demo/types'
import {
  initiallyDoneTasks,
  workspaceAccount,
  workspaceAppointments,
  workspaceAutomations,
  workspaceClient,
  workspaceLeads,
  workspaceTasks,
  workspaceTeam,
  type TeamMember,
} from '@/content/demo/workspace'
import { createPersistentStore } from '../store'
import { ToastProvider } from '../Toasts'

export type InvitedMember = TeamMember & { invited: true }

export type ClientState = {
  stages: Record<string, { stage: StageId; outcome?: Outcome }>
  handled: Record<string, boolean>
  read: Record<string, true>
  replies: Record<string, Message[]>
  tasks: Record<string, boolean>
  automations: Record<string, { enabled?: boolean; steps?: Step[] }>
  integrations: Partial<Record<IntegrationId, IntegrationStatus>>
  invites: InvitedMember[]
  notifications: Record<string, boolean>
  account: typeof workspaceAccount | null
  appointments: Record<string, AppointmentStatus>
  followUps: Record<string, true>
  reminders: Record<string, boolean>
  selected: string | null
}

export type ClientAction =
  | { type: 'moveStage'; leadId: string; stage: StageId; outcome?: Outcome }
  | { type: 'setHandled'; leadId: string; handled: boolean }
  | { type: 'markRead'; leadId: string }
  | { type: 'reply'; leadId: string; body: string; channel: 'text' | 'email' }
  | { type: 'toggleTask'; taskId: string }
  | { type: 'setAutomationEnabled'; id: string; enabled: boolean }
  | { type: 'saveSteps'; id: string; steps: Step[] }
  | { type: 'setIntegration'; id: IntegrationId; status: IntegrationStatus }
  | { type: 'invite'; member: InvitedMember }
  | { type: 'revokeInvite'; email: string }
  | { type: 'setNotification'; id: string; on: boolean }
  | { type: 'saveAccount'; account: typeof workspaceAccount }
  | { type: 'setAppointmentStatus'; id: string; status: AppointmentStatus }
  | { type: 'sendFollowUp'; appointmentId: string }
  | { type: 'setReminder'; appointmentId: string; on: boolean }
  | { type: 'select'; leadId: string | null }

const initialState: ClientState = {
  stages: {},
  handled: {},
  read: {},
  replies: {},
  tasks: {},
  automations: {},
  integrations: {},
  invites: [],
  notifications: {},
  account: null,
  appointments: {},
  followUps: {},
  reminders: {},
  selected: null,
}

const USER = workspaceTeam[0].name

function reducer(state: ClientState, action: ClientAction): ClientState {
  switch (action.type) {
    case 'moveStage':
      return { ...state, stages: { ...state.stages, [action.leadId]: { stage: action.stage, ...(action.outcome ? { outcome: action.outcome } : {}) } } }
    case 'setHandled':
      return { ...state, handled: { ...state.handled, [action.leadId]: action.handled } }
    case 'markRead':
      return state.read[action.leadId] ? state : { ...state, read: { ...state.read, [action.leadId]: true } }
    case 'reply': {
      const existing = state.replies[action.leadId] ?? []
      const message: Message = {
        id: `${action.leadId}.demo-${existing.length + 1}`,
        from: 'team',
        author: USER,
        channel: action.channel,
        at: DEMO_NOW,
        body: action.body,
      }
      return {
        ...state,
        replies: { ...state.replies, [action.leadId]: [...existing, message] },
        read: { ...state.read, [action.leadId]: true },
      }
    }
    case 'toggleTask': {
      const done = state.tasks[action.taskId] ?? initiallyDoneTasks.includes(action.taskId)
      return { ...state, tasks: { ...state.tasks, [action.taskId]: !done } }
    }
    case 'setAutomationEnabled':
      return { ...state, automations: { ...state.automations, [action.id]: { ...state.automations[action.id], enabled: action.enabled } } }
    case 'saveSteps':
      return { ...state, automations: { ...state.automations, [action.id]: { ...state.automations[action.id], steps: action.steps } } }
    case 'setIntegration':
      return { ...state, integrations: { ...state.integrations, [action.id]: action.status } }
    case 'invite':
      return { ...state, invites: [...state.invites, action.member] }
    case 'revokeInvite':
      return { ...state, invites: state.invites.filter((member) => member.email !== action.email) }
    case 'setNotification':
      return { ...state, notifications: { ...state.notifications, [action.id]: action.on } }
    case 'saveAccount':
      return { ...state, account: action.account }
    case 'setAppointmentStatus':
      return { ...state, appointments: { ...state.appointments, [action.id]: action.status } }
    case 'sendFollowUp':
      return { ...state, followUps: { ...state.followUps, [action.appointmentId]: true } }
    case 'setReminder':
      return { ...state, reminders: { ...state.reminders, [action.appointmentId]: action.on } }
    case 'select':
      return state.selected === action.leadId ? state : { ...state, selected: action.leadId }
  }
}

const store = createPersistentStore<ClientState, ClientAction>('closeagain-demo:client:v1', initialState, reducer)

type ContextValue = { state: ClientState; dispatch: (action: ClientAction) => void; reset: () => void }
const ClientContext = createContext<ContextValue | null>(null)

export function ClientDemoProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  const value = useMemo(() => ({ state, dispatch: store.dispatch, reset: store.reset }), [state])
  return (
    <ClientContext.Provider value={value}>
      <ToastProvider note="Sample workspace — nothing was sent or saved beyond this tab.">{children}</ToastProvider>
    </ClientContext.Provider>
  )
}

export function useClientDemo(): ContextValue {
  const value = useContext(ClientContext)
  if (!value) throw new Error('useClientDemo must be used inside ClientDemoProvider')
  return value
}

// ── Selectors ─────────────────────────────────────────────────────────────

export type LiveLead = Lead & { handled: boolean }

/** The sample leads with this tab's changes applied. */
export function useLeads(): LiveLead[] {
  const { state } = useClientDemo()
  const { stages, handled, read, replies } = state
  return useMemo(
    () =>
      workspaceLeads
        .map((lead): LiveLead => {
          const moved = stages[lead.id]
          const added = replies[lead.id]
          const isHandled = handled[lead.id] ?? false
          if (!moved && !added && !isHandled && !read[lead.id]) return { ...lead, handled: false }
          const thread = added ? [...lead.thread, ...added] : lead.thread
          const stage = moved?.stage ?? lead.stage
          return {
            ...lead,
            stage,
            outcome: stage === 'closed' ? (moved?.outcome ?? lead.outcome ?? 'won') : undefined,
            thread,
            lastContactAt: thread[thread.length - 1].at,
            unread: lead.unread && !read[lead.id] && !isHandled && !added,
            handled: isHandled,
          }
        })
        .sort((a, b) => b.lastContactAt - a.lastContactAt),
    [stages, handled, read, replies],
  )
}

export function useAppointments() {
  const { state } = useClientDemo()
  const { appointments } = state
  return useMemo(
    () => workspaceAppointments.map((appointment) => (appointments[appointment.id] ? { ...appointment, status: appointments[appointment.id] } : appointment)),
    [appointments],
  )
}

export function useAutomations() {
  const { state } = useClientDemo()
  const { automations } = state
  return useMemo(
    () =>
      workspaceAutomations.map((automation) => {
        const change = automations[automation.id]
        if (!change) return automation
        return { ...automation, enabled: change.enabled ?? automation.enabled, steps: change.steps ?? automation.steps }
      }),
    [automations],
  )
}

export function useTasks() {
  const { state } = useClientDemo()
  const { tasks } = state
  return useMemo(
    () => workspaceTasks.map((task) => ({ ...task, done: tasks[task.id] ?? initiallyDoneTasks.includes(task.id) })),
    [tasks],
  )
}

export function useIntegrationStatus(id: IntegrationId): IntegrationStatus {
  const { state } = useClientDemo()
  return state.integrations[id] ?? workspaceClient.integrations[id]
}

export function useUnreadCount() {
  const leads = useLeads()
  return leads.filter((lead) => lead.unread).length
}
