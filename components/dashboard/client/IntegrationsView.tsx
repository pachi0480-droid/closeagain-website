'use client'

import { LoaderCircle } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { fmtAgo, fmtNumber, fmtUntil } from '@/content/demo/format'
import { DAY, DEMO_NOW, MINUTE } from '@/content/demo/time'
import type { IntegrationId, IntegrationStatus } from '@/content/demo/types'
import { attentionNotes, integrationCatalog, workspaceClient } from '@/content/demo/workspace'
import { Dialog } from '../Dialog'
import { integrationIcon } from '../integrationIcons'
import { integrationStatusLabel } from '../labels'
import { useToast, usePending } from '../Toasts'
import { Badge, EmptyState, PageHeader, Segmented, cx, type BadgeTone } from '../ui'
import { useAppointments, useClientDemo, useLeads } from './state'

type Filter = 'all' | IntegrationStatus

export const integrationTone: Record<IntegrationStatus, BadgeTone> = {
  connected: 'positive',
  available: 'plain',
  attention: 'red',
}

export function IntegrationsView() {
  const { state, dispatch } = useClientDemo()
  const leads = useLeads()
  const appointments = useAppointments()
  const notify = useToast()
  const { run, busy } = usePending()
  const [filter, setFilter] = useState<Filter>('all')
  const [confirming, setConfirming] = useState<IntegrationId | null>(null)

  const statusOf = (id: IntegrationId): IntegrationStatus => state.integrations[id] ?? workspaceClient.integrations[id]

  const details = useMemo(() => {
    const last = (source: string) => leads.filter((lead) => lead.source === source).reduce((latest, lead) => Math.max(latest, lead.createdAt), 0)
    const nextAppointment = appointments.find((appointment) => appointment.start > DEMO_NOW && appointment.status !== 'cancelled')
    const textsThisWeek = leads.reduce(
      (sum, lead) => sum + lead.thread.filter((message) => message.channel === 'text' && message.at > DEMO_NOW - 7 * DAY).length,
      0,
    )
    const imported = leads.filter((lead) => lead.source === 'import').length
    const fromCrm = leads.filter((lead) => lead.source === 'crm').length
    return {
      'web-forms': `3 forms · last inquiry ${fmtAgo(last('web-form'))}`,
      'landing-pages': `2 pages · last inquiry ${fmtAgo(last('landing-page'))}`,
      crm: `Two-way sync · ${fmtNumber(fromCrm)} older leads re-engaged · synced ${fmtAgo(DEMO_NOW - 30 * MINUTE)}`,
      calendar: `4 team calendars${nextAppointment ? ` · next booking ${fmtUntil(nextAppointment.start)}` : ''}`,
      'email-inbox': `Sending as ${workspaceClient.team[0].email}`,
      'phone-text': `Missed-call text-back on · ${fmtNumber(textsThisWeek)} texts this week`,
      webhooks: 'Send lead and stage events to your own tools.',
      spreadsheet: `${fmtNumber(imported)} older leads imported for re-engagement`,
    } satisfies Record<IntegrationId, string>
  }, [leads, appointments])

  const counts = { connected: 0, available: 0, attention: 0 }
  for (const item of integrationCatalog) counts[statusOf(item.id)]++
  const visible = integrationCatalog.filter((item) => filter === 'all' || statusOf(item.id) === filter)
  const confirmItem = integrationCatalog.find((item) => item.id === confirming)

  const connect = (id: IntegrationId, name: string, verb: 'Connected' | 'Reconnected') =>
    run(id, () => {
      dispatch({ type: 'setIntegration', id, status: 'connected' })
      notify({ title: `${name} ${verb.toLowerCase()}`, detail: 'In a live workspace you would approve access in the other tool first.' })
    })

  const disconnect = (id: IntegrationId, name: string) => {
    setConfirming(null)
    run(id, () => {
      dispatch({ type: 'setIntegration', id, status: 'available' })
      notify({ title: `${name} disconnected`, detail: 'Anything that depends on it pauses until you connect it again.', tone: 'info' })
    })
  }

  return (
    <>
      <PageHeader
        title="Integrations"
        description={`${counts.connected} connected · ${counts.attention} ${counts.attention === 1 ? 'needs' : 'need'} attention · ${counts.available} available`}
      >
        <Segmented
          label="Show integrations"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All', count: integrationCatalog.length },
            { value: 'connected', label: 'Connected', count: counts.connected },
            { value: 'attention', label: 'Needs attention', count: counts.attention },
            { value: 'available', label: 'Available', count: counts.available },
          ]}
        />
      </PageHeader>

      <div className="app-page">
        {visible.length === 0 ? (
          <div className="ui-panel app-rise">
            <EmptyState
              title="Nothing in this group"
              action={
                <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setFilter('all')}>
                  Show all integrations
                </button>
              }
            >
              {filter === 'attention' ? 'Every connection is healthy.' : 'Try another filter.'}
            </EmptyState>
          </div>
        ) : (
          <ul className="app-integrations">
            {visible.map((item, index) => {
              const status = statusOf(item.id)
              const Icon = integrationIcon[item.id]
              const pending = busy(item.id)
              const note = status === 'attention' ? attentionNotes[`${workspaceClient.id}.${item.id}`] : status === 'connected' ? details[item.id] : undefined
              return (
                <li key={item.id} className={cx('ui-panel app-integration app-rise', status === 'attention' && 'is-attention')} style={{ '--i': index } as CSSProperties}>
                  <div className="app-integration__top">
                    <span className="app-integration__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <Badge tone={integrationTone[status]}>{integrationStatusLabel[status]}</Badge>
                  </div>
                  <h2 className="app-integration__name">{item.name}</h2>
                  <p className="app-integration__desc">{item.description}</p>
                  {note && <p className={cx('app-integration__note', status === 'attention' && 'is-attention')}>{note}</p>}
                  <div className="app-integration__actions">
                    {status === 'available' && (
                      <button type="button" className="ui-btn" disabled={pending} aria-busy={pending} onClick={() => connect(item.id, item.name, 'Connected')}>
                        {pending && <LoaderCircle className="app-spin" aria-hidden="true" />}
                        {pending ? 'Connecting…' : 'Connect'}
                      </button>
                    )}
                    {status === 'attention' && (
                      <button type="button" className="ui-btn" disabled={pending} aria-busy={pending} onClick={() => connect(item.id, item.name, 'Reconnected')}>
                        {pending && <LoaderCircle className="app-spin" aria-hidden="true" />}
                        {pending ? 'Reconnecting…' : 'Reconnect'}
                      </button>
                    )}
                    {status !== 'available' && (
                      <button type="button" className="ui-btn ui-btn--quiet" disabled={pending} onClick={() => setConfirming(item.id)}>
                        Disconnect
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Dialog
        open={confirmItem !== undefined}
        onClose={() => setConfirming(null)}
        size="sm"
        title={`Disconnect ${confirmItem?.name ?? ''}?`}
        description="Follow-ups that rely on this connection pause until it is connected again. You can reconnect at any time."
        footer={
          <>
            <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setConfirming(null)}>
              Keep connected
            </button>
            <button type="button" className="ui-btn" onClick={() => confirmItem && disconnect(confirmItem.id, confirmItem.name)}>
              Disconnect
            </button>
          </>
        }
      >
        <p className="app-dialog__text">This only changes the sample workspace in this tab.</p>
      </Dialog>
    </>
  )
}
