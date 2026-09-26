'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { clients } from '@/content/demo/clients'
import { fmtNumber, fmtPercent, fmtUntil } from '@/content/demo/format'
import { automationStats, windowFor } from '@/content/demo/metrics'
import { clientShort, datasets } from '@/content/demo/operator'
import { useToast } from '../Toasts'
import { EmptyState, Metric, PageHeader, Panel, SelectField, Switch } from '../ui'
import { useAllAutomations, useClients, useOperator, useTemplates } from './state'

export function OperatorAutomations() {
  const { dispatch } = useOperator()
  const notify = useToast()
  const automations = useAllAutomations()
  const clientList = useClients()
  const templates = useTemplates()
  const [client, setClient] = useState('all')
  const [template, setTemplate] = useState('all')
  const [status, setStatus] = useState<'all' | 'on' | 'off'>('all')

  const period = useMemo(() => windowFor(30), [])
  const stats = useMemo(
    () => new Map(automations.map((automation) => [automation.id, automationStats(automation, datasets[automation.clientId].leads, datasets[automation.clientId].appointments, period)])),
    [automations, period],
  )
  const rows = automations.filter(
    (automation) =>
      (client === 'all' || automation.clientId === client) &&
      (template === 'all' || automation.templateId === template) &&
      (status === 'all' || (status === 'on' ? automation.enabled : !automation.enabled)),
  )
  const running = automations.filter((automation) => automation.enabled).length
  const sent = [...stats.values()].reduce((sum, item) => sum + item.sent, 0)
  const queued = [...stats.values()].reduce((sum, item) => sum + item.queued, 0)
  const leadFlows = automations.filter((automation) => automation.templateId !== 'tpl-reminder' && automation.templateId !== 'tpl-no-show')
  const enrolled = leadFlows.reduce((sum, automation) => sum + (stats.get(automation.id)?.enrolled ?? 0), 0)
  const replied = leadFlows.reduce((sum, automation) => sum + (stats.get(automation.id)?.replied ?? 0), 0)
  const filtersOn = client !== 'all' || template !== 'all' || status !== 'all'

  return (
    <>
      <PageHeader title="Automations" description="Every automation running for every client · last 30 days">
        <Link href="/demo/operator/templates" className="ui-btn ui-btn--quiet">
          Master library
        </Link>
      </PageHeader>
      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-4">
          <Metric index={0} label="Running" value={`${running} of ${automations.length}`} note={`Across ${clients.length} clients`} />
          <Metric index={1} label="Messages sent" value={fmtNumber(sent)} note="Automated, 30 days" />
          <Metric index={2} label="Reply rate" value={fmtPercent(enrolled ? replied / enrolled : 0)} note={`${fmtNumber(replied)} of ${fmtNumber(enrolled)} enrolled`} />
          <Metric index={3} label="Queued · 24h" value={fmtNumber(queued)} note="Scheduled follow-ups" />
        </div>
        <div className="app-filters app-rise" role="search" aria-label="Filter automations">
          <SelectField label="Client" hideLabel value={client} onChange={setClient} options={[{ value: 'all', label: 'All clients' }, ...clients.map((item) => ({ value: item.id, label: item.name }))]} />
          <SelectField label="Template" hideLabel value={template} onChange={setTemplate} options={[{ value: 'all', label: 'All templates' }, ...templates.map((item) => ({ value: item.id, label: item.name }))]} />
          <SelectField
            label="Status"
            hideLabel
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'On and off' },
              { value: 'on', label: 'Running' },
              { value: 'off', label: 'Paused' },
            ]}
          />
          {filtersOn && (
            <button
              type="button"
              className="ui-btn ui-btn--ghost"
              onClick={() => {
                setClient('all')
                setTemplate('all')
                setStatus('all')
              }}
            >
              Clear filters
            </button>
          )}
          <p className="ui-meta app-filters__count">{rows.length} automations</p>
        </div>
        <Panel index={1} flush>
          {rows.length === 0 ? (
            <EmptyState title="No automations match">Try another client or template.</EmptyState>
          ) : (
            <div className="app-table-wrap">
              <table className="ui-table app-table op-table app-table--stack">
                <caption className="app-sr">Automations across clients</caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="app-sr">On or off</span>
                    </th>
                    <th scope="col">Automation</th>
                    <th scope="col">Client</th>
                    <th scope="col" className="ui-num">
                      Enrolled
                    </th>
                    <th scope="col" className="ui-num">
                      Reply rate
                    </th>
                    <th scope="col" className="ui-num">
                      Sent
                    </th>
                    <th scope="col">Next send</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((automation) => {
                    const s = stats.get(automation.id)
                    const owner = clientList.find((item) => item.id === automation.clientId)
                    const paused = owner?.status === 'paused'
                    return (
                      <tr key={automation.id}>
                        <td className="app-autotable__switch" data-label="Status">
                          <Switch
                            checked={automation.enabled}
                            disabled={paused}
                            label={`${automation.name} for ${clientShort(automation.clientId)}`}
                            onChange={(next) => {
                              dispatch({ type: 'setAutomation', id: automation.id, enabled: next })
                              notify({ title: `${automation.name} ${next ? 'turned on' : 'paused'} for ${clientShort(automation.clientId)}`, tone: next ? 'success' : 'info' })
                            }}
                          />
                        </td>
                        <th scope="row">
                          <span className="app-cell-title">{automation.name}</span>
                          <span className="app-cell-sub">
                            {automation.type === 'campaign' ? 'Campaign' : 'Sequence'}
                            {paused ? ' · account paused' : ''}
                          </span>
                        </th>
                        <td data-label="Client">
                          <Link href={`/demo/operator/clients/${automation.clientId}`} className="app-textlink">
                            {clientShort(automation.clientId)}
                          </Link>
                        </td>
                        <td className="ui-num" data-label="Enrolled">
                          {fmtNumber(s?.enrolled ?? 0)}
                        </td>
                        <td className="ui-num" data-label="Reply rate">
                          {s?.enrolled ? fmtPercent(s.replyRate) : '—'}
                        </td>
                        <td className="ui-num" data-label="Sent">
                          {fmtNumber(s?.sent ?? 0)}
                        </td>
                        <td data-label="Next send">{!automation.enabled ? <span className="app-muted">Paused</span> : s?.nextSend ? fmtUntil(s.nextSend) : <span className="app-muted">When triggered</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
