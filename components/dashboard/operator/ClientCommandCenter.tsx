'use client'

import { ArrowUpRight, CircleAlert, LoaderCircle, Pause, Play, Rocket, TriangleAlert, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { canDeploy, datasets, tickets as baseTickets, upsellOpportunities } from '@/content/demo/operator'
import { automationStats, dailySeries, windowFor, within } from '@/content/demo/metrics'
import { fmtAgo, fmtCurrency, fmtDate, fmtDateYear, fmtNumber, fmtPercent, fmtWeekdayDate } from '@/content/demo/format'
import { kits } from '@/content/demo/kits'
import { FEATURED_CLIENT_ID } from '@/content/demo/clients'
import { attentionNotes, integrationCatalog } from '@/content/demo/workspace'
import type { IntegrationId, IntegrationStatus, Person } from '@/content/demo/types'
import { planById } from '@/content/pricing'
import { TimeChart } from '../charts'
import { Dialog } from '../Dialog'
import { integrationIcon } from '../integrationIcons'
import { integrationStatusLabel } from '../labels'
import { useToast, usePending } from '../Toasts'
import { Avatar, Badge, EmptyState, Metric, PageHeader, SelectField, Switch, TabPanel, Tabs, TextField, cx } from '../ui'
import { integrationTone } from '../client/IntegrationsView'
import { ClientStatusBadge, HealthMeter, PlanBadge } from './shared'
import { useAlerts, useClientAutomations, useClientRows, useDeployments, useOperator, useTemplates } from './state'

type Tab = 'overview' | 'automations' | 'campaigns' | 'integrations' | 'usage' | 'support' | 'users'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ClientCommandCenter({ clientId }: { clientId: string }) {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  const { run, busy } = usePending()
  const rows = useClientRows()
  const row = rows.find((item) => item.client.id === clientId)
  const automations = useClientAutomations(clientId)
  const deployments = useDeployments()
  const templates = useTemplates()
  const alerts = useAlerts().filter((alert) => alert.clientId === clientId)
  const [tab, setTab] = useState<Tab>('overview')
  const [confirmPause, setConfirmPause] = useState(false)

  const { leads, appointments } = datasets[clientId]
  const period = useMemo(() => windowFor(30), [])
  const stats = useMemo(
    () => new Map(automations.map((automation) => [automation.id, automationStats(automation, leads, appointments, period)])),
    [automations, leads, appointments, period],
  )
  const series = useMemo(() => dailySeries(leads, appointments, 30), [leads, appointments])

  if (!row) return null
  const { client, current, health } = row
  const plan = planById(client.plan)
  const paused = client.status === 'paused'
  const kit = kits[client.kit]
  const upsell = upsellOpportunities(rows).find((item) => item.clientId === clientId)

  const setIntegration = (id: IntegrationId, status: IntegrationStatus, name: string) =>
    run(`int-${id}`, () => {
      dispatch({ type: 'setIntegration', clientId, id, status })
      notify({
        title: status === 'connected' ? `${name} connected for ${client.short}` : `${name} disconnected for ${client.short}`,
        tone: status === 'connected' ? 'success' : 'info',
      })
    })

  const deploy = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId)
    const check = canDeploy(templateId, client)
    if (!check.ok) {
      notify({ title: `Couldn’t deploy ${template?.name ?? 'template'}`, detail: check.reason, tone: 'error' })
      return
    }
    run(`deploy-${templateId}`, () => {
      dispatch({ type: 'deploy', templateId, clientIds: [clientId] })
      notify({ title: `${template?.name} deployed to ${client.short}`, detail: 'It starts with the next matching lead.' })
    })
  }

  // Recommended actions, computed from the account's actual state.
  const recommendations: Array<{ id: string; title: string; detail: string; action: string; onClick: () => void; busyKey: string }> = []
  if (paused) {
    recommendations.push({
      id: 'resume',
      title: 'Resume the account',
      detail: client.statusNote ?? 'Automations are stopped while the account is paused.',
      action: 'Resume',
      onClick: () => setConfirmPause(true),
      busyKey: 'status',
    })
  }
  for (const item of integrationCatalog) {
    const status = client.integrations[item.id]
    if (status === 'attention') {
      recommendations.push({
        id: `fix-${item.id}`,
        title: `Reconnect ${item.name.toLowerCase()}`,
        detail: attentionNotes[`${client.id}.${item.id}`] ?? 'The connection needs attention.',
        action: 'Reconnect',
        onClick: () => setIntegration(item.id, 'connected', item.name),
        busyKey: `int-${item.id}`,
      })
    }
  }
  if (client.status === 'onboarding' && client.integrations.calendar === 'available') {
    recommendations.push({
      id: 'calendar',
      title: 'Connect the calendar',
      detail: 'Needed before appointment reminders can run.',
      action: 'Connect',
      onClick: () => setIntegration('calendar', 'connected', 'Calendar'),
      busyKey: 'int-calendar',
    })
  }
  const deployed = deployments[clientId] ?? []
  const missing = templates.find((template) => !deployed.includes(template.id) && canDeploy(template.id, client).ok)
  if (missing) {
    recommendations.push({
      id: `deploy-${missing.id}`,
      title: `Deploy ${missing.name}`,
      detail: missing.description,
      action: 'Deploy',
      onClick: () => deploy(missing.id),
      busyKey: `deploy-${missing.id}`,
    })
  }
  if (upsell && !state.upsells[clientId]) {
    recommendations.push({
      id: 'upsell',
      title: `Propose ${upsell.to} (+${fmtCurrency(upsell.delta)}/mo)`,
      detail: upsell.reason,
      action: 'Draft proposal',
      onClick: () =>
        run('upsell', () => {
          dispatch({ type: 'proposeUpsell', clientId })
          notify({ title: `Upgrade proposal drafted for ${client.short}`, detail: 'Nothing was sent to the client.' })
        }),
      busyKey: 'upsell',
    })
  }

  const recent = leads
    .flatMap((lead) => lead.thread.map((message) => ({ lead, message })))
    .sort((a, b) => b.message.at - a.message.at)
    .slice(0, 8)

  const channels: Array<{ label: string; id: IntegrationId }> = [
    { label: 'Text messages', id: 'phone-text' },
    { label: 'Email', id: 'email-inbox' },
    { label: 'Website forms', id: 'web-forms' },
    { label: 'Calendar', id: 'calendar' },
    { label: 'CRM sync', id: 'crm' },
  ]

  const sequences = automations.filter((automation) => automation.type === 'sequence')
  const campaigns = automations.filter((automation) => automation.type === 'campaign')
  const running = automations.filter((automation) => automation.enabled).length

  const sentByChannel = { text: 0, email: 0 }
  for (const lead of leads) for (const message of lead.thread) if (message.from === 'closeagain' && within(message.at, period)) sentByChannel[message.channel === 'email' ? 'email' : 'text']++
  const previousSent = row.previous.messagesSent

  const clientTickets = baseTickets.filter((ticket) => ticket.clientId === clientId)
  const openTickets = clientTickets.filter((ticket) => (state.tickets[ticket.id] ?? ticket.status) !== 'resolved').length
  const invites = state.clientInvites[clientId] ?? []
  const multiUser = client.plan === 'scale' || client.plan === 'enterprise'

  return (
    <>
      <PageHeader title={client.name} description={`${client.industry} · ${client.location} · client since ${fmtDateYear(client.since)}`}>
        <ClientStatusBadge status={client.status} />
        <PlanBadge plan={client.plan} />
        {client.id === FEATURED_CLIENT_ID && (
          <Link href="/demo" className="ui-btn ui-btn--quiet">
            Open client workspace
            <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
        <button type="button" className={cx('ui-btn', !paused && 'ui-btn--quiet')} onClick={() => setConfirmPause(true)} disabled={busy('status')} aria-busy={busy('status')}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {paused ? 'Resume account' : 'Pause account'}
        </button>
      </PageHeader>

      <div className="app-page">
        {paused && (
          <div className="op-banner app-rise" role="status">
            <CircleAlert aria-hidden="true" />
            <p>
              <strong>{client.short} is paused.</strong> {client.statusNote ?? 'Automations are stopped and nothing is sent.'}
            </p>
          </div>
        )}

        <div className="app-grid app-grid--metrics">
          <Metric index={0} label="Monthly usage" value={fmtNumber(current.messagesSent)} note="Automated messages, 30 days" />
          <Metric index={1} label="Account health" value={`${health.score}`} note={<HealthMeter health={health} hideScore />} />
          <Metric index={2} label="Leads · 30 days" value={fmtNumber(current.newLeads)} note={`${fmtNumber(row.previous.newLeads)} the 30 days before`} />
          <Metric index={3} label="Recovered · 30 days" value={fmtNumber(current.recovered)} emphasis note="Older or quiet leads that replied" />
          <Metric index={4} label="Response rate" value={fmtPercent(current.responseRate)} note={`${fmtNumber(current.responded)} of ${fmtNumber(current.enrolled)} replied`} />
          <Metric index={5} label="Appointments" value={fmtNumber(current.appointments)} note="Booked, 30 days" />
        </div>

        <div className="ui-panel app-rise op-command" style={{ '--i': 1 } as CSSProperties}>
          <Tabs
            idBase="command"
            label={`${client.short} sections`}
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'automations', label: 'Automations', count: sequences.length },
              { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
              { id: 'integrations', label: 'Integrations' },
              { id: 'usage', label: 'Usage' },
              { id: 'support', label: 'Support', count: openTickets },
              { id: 'users', label: 'Users', count: client.team.length + invites.length },
            ]}
          />
          <TabPanel idBase="command" id={tab}>
            {tab === 'overview' && (
              <div className="op-command__grid">
                <div className="op-command__main">
                  <section className="op-section" aria-labelledby="rec-title">
                    <h2 id="rec-title" className="op-section__title">
                      Recommended actions
                    </h2>
                    {recommendations.length === 0 ? (
                      <p className="app-panel-note app-panel-note--flush">Nothing to do right now — the account is set up and healthy.</p>
                    ) : (
                      <ul className="ui-list op-recs">
                        {recommendations.slice(0, 4).map((item) => (
                          <li key={item.id} className="ui-row op-rec">
                            <span className="op-rec__text">
                              <span className="app-cell-title">{item.title}</span>
                              <span className="app-cell-sub">{item.detail}</span>
                            </span>
                            <button type="button" className="ui-btn ui-btn--quiet" onClick={item.onClick} disabled={busy(item.busyKey)} aria-busy={busy(item.busyKey)}>
                              {busy(item.busyKey) && <LoaderCircle className="app-spin" aria-hidden="true" />}
                              {item.action}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="op-section" aria-labelledby="activity-title">
                    <h2 id="activity-title" className="op-section__title">
                      Recent activity
                    </h2>
                    <ol className="op-activity">
                      {recent.map(({ lead, message }) => (
                        <li key={message.id}>
                          <span className={cx('op-activity__dot', message.from === 'lead' && 'is-reply', message.from === 'closeagain' && 'is-auto')} aria-hidden="true" />
                          <span className="op-activity__text">
                            <span>
                            {message.from === 'lead' ? (
                              <>
                                <strong>{lead.name}</strong> replied by {message.channel === 'email' ? 'email' : message.channel === 'web' ? 'web form' : 'text'}
                              </>
                            ) : message.from === 'closeagain' ? (
                              <>
                                CloseAgain {message.channel === 'email' ? 'emailed' : 'texted'} <strong>{lead.name}</strong>
                              </>
                            ) : (
                              <>
                                {message.author} {message.channel === 'call' ? 'logged a call with' : 'wrote to'} <strong>{lead.name}</strong>
                              </>
                            )}
                            </span>
                            <span className="op-activity__quote">“{message.body}”</span>
                          </span>
                          <span className="op-activity__time">{fmtAgo(message.at)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>

                <div className="op-command__side">
                  <section className="op-section" aria-labelledby="alerts-title">
                    <h2 id="alerts-title" className="op-section__title">
                      Alerts
                    </h2>
                    {alerts.length === 0 ? (
                      <p className="app-panel-note app-panel-note--flush">No alerts for this client.</p>
                    ) : (
                      <ul className="op-mini-alerts">
                        {alerts.map((alert) => (
                          <li key={alert.id} className={`op-mini-alert op-mini-alert--${alert.severity}`}>
                            <TriangleAlert aria-hidden="true" size={15} />
                            <span>
                              <span className="app-cell-title">{alert.title.replace(`${client.short}: `, '')}</span>
                              <span className="app-cell-sub">{alert.detail}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className="op-section" aria-labelledby="channels-title">
                    <h2 id="channels-title" className="op-section__title">
                      Channel health
                    </h2>
                    <ul className="op-channels">
                      {channels.map((channel) => {
                        const status = client.integrations[channel.id]
                        return (
                          <li key={channel.id}>
                            <span>{channel.label}</span>
                            <Badge tone={paused && status === 'connected' ? 'cold' : integrationTone[status]}>
                              {paused && status === 'connected' ? 'Paused' : status === 'connected' ? 'Healthy' : status === 'available' ? 'Not connected' : 'Needs attention'}
                            </Badge>
                          </li>
                        )
                      })}
                    </ul>
                  </section>

                  <section className="op-section" aria-labelledby="health-title">
                    <h2 id="health-title" className="op-section__title">
                      Health breakdown
                    </h2>
                    <ul className="op-factors">
                      {health.factors.map((factor) => (
                        <li key={factor.label}>
                          <span className="op-factors__label">
                            {factor.label}
                            <span className="app-cell-sub">{factor.value}</span>
                          </span>
                          <span className="op-factors__points">
                            {factor.points}/{factor.max}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="ui-meta">
                      {running} of {automations.length} automations running
                    </p>
                  </section>
                </div>
              </div>
            )}

            {tab === 'automations' && (
              <div className="app-table-wrap">
                <table className="ui-table app-table op-table app-table--stack">
                  <caption className="app-sr">{client.short} automations</caption>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="app-sr">On or off</span>
                      </th>
                      <th scope="col">Automation</th>
                      <th scope="col">Template</th>
                      <th scope="col" className="ui-num">
                        Enrolled · 30d
                      </th>
                      <th scope="col" className="ui-num">
                        Reply rate
                      </th>
                      <th scope="col" className="ui-num">
                        Sent · 30d
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sequences.map((automation) => {
                      const s = stats.get(automation.id)
                      return (
                        <tr key={automation.id}>
                          <td data-label="Status" className="app-autotable__switch">
                            <Switch
                              checked={automation.enabled}
                              disabled={paused}
                              label={`${automation.name} for ${client.short}`}
                              onChange={(next) => {
                                dispatch({ type: 'setAutomation', id: automation.id, enabled: next })
                                notify({ title: `${automation.name} ${next ? 'turned on' : 'paused'} for ${client.short}`, tone: next ? 'success' : 'info' })
                              }}
                            />
                          </td>
                          <th scope="row">
                            <span className="app-cell-title">{automation.name}</span>
                            <span className="app-cell-sub">{automation.audience}</span>
                          </th>
                          <td data-label="Template">{templates.find((template) => template.id === automation.templateId)?.name ?? 'Custom'}</td>
                          <td className="ui-num" data-label="Enrolled">
                            {fmtNumber(s?.enrolled ?? 0)}
                          </td>
                          <td className="ui-num" data-label="Reply rate">
                            {s?.enrolled ? fmtPercent(s.replyRate) : '—'}
                          </td>
                          <td className="ui-num" data-label="Sent">
                            {fmtNumber(s?.sent ?? 0)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {paused && <p className="app-panel-foot ui-meta">Switches are disabled while the account is paused. Resume the account to turn automations back on.</p>}
              </div>
            )}

            {tab === 'campaigns' && (
              <div className="op-campaigns">
                {campaigns.length === 0 ? (
                  <EmptyState title="No campaigns yet">Deploy Old Lead Reactivation or Customer Win-Back from Templates to start one.</EmptyState>
                ) : (
                  campaigns.map((campaign) => {
                    const s = stats.get(campaign.id)
                    const everEnrolled = leads.filter((lead) => lead.automationId === campaign.id).length
                    const audience = campaign.audienceSize ?? everEnrolled
                    const waves = state.waves[campaign.id] ?? 0
                    return (
                      <article key={campaign.id} className="op-campaign">
                        <div className="op-campaign__head">
                          <div>
                            <h3 className="op-campaign__name">{campaign.name}</h3>
                            <p className="app-cell-sub">
                              {campaign.audience} · launched {campaign.launchedAt ? fmtDate(campaign.launchedAt) : '—'}
                              {waves > 0 ? ` · ${waves} new ${waves === 1 ? 'wave' : 'waves'} queued` : ''}
                            </p>
                          </div>
                          <Switch
                            checked={campaign.enabled}
                            disabled={paused}
                            label={`${campaign.name} for ${client.short}`}
                            onChange={(next) => {
                              dispatch({ type: 'setAutomation', id: campaign.id, enabled: next })
                              notify({ title: `${campaign.name} ${next ? 'resumed' : 'paused'} for ${client.short}`, tone: next ? 'success' : 'info' })
                            }}
                          />
                        </div>
                        <div className="op-campaign__progress">
                          <span className="ui-track" aria-hidden="true">
                            <span style={{ width: `${Math.min(100, (everEnrolled / Math.max(1, audience)) * 100)}%` }} />
                          </span>
                          <span className="ui-meta">
                            {fmtNumber(everEnrolled)} of {fmtNumber(audience)} contacted
                          </span>
                        </div>
                        <dl className="app-facts">
                          <div>
                            <dt>Replies · 30d</dt>
                            <dd>{fmtNumber(s?.replied ?? 0)}</dd>
                          </div>
                          <div>
                            <dt>Recovered · 30d</dt>
                            <dd className="app-num-red">{fmtNumber(s?.recovered ?? 0)}</dd>
                          </div>
                          <div>
                            <dt>Booked</dt>
                            <dd>{fmtNumber(s?.booked ?? 0)}</dd>
                          </div>
                        </dl>
                        <div className="op-campaign__actions">
                          <button
                            type="button"
                            className="ui-btn ui-btn--quiet"
                            disabled={paused || !campaign.enabled || busy(`wave-${campaign.id}`)}
                            aria-busy={busy(`wave-${campaign.id}`)}
                            onClick={() =>
                              run(`wave-${campaign.id}`, () => {
                                dispatch({ type: 'launchWave', automationId: campaign.id })
                                notify({ title: `Next wave queued for ${campaign.name}`, detail: `${client.short} · 40 older leads, starting tomorrow at 10 AM.` })
                              })
                            }
                          >
                            {busy(`wave-${campaign.id}`) ? <LoaderCircle className="app-spin" aria-hidden="true" /> : <Rocket aria-hidden="true" />}
                            Queue next wave
                          </button>
                          {(paused || !campaign.enabled) && <span className="ui-meta">{paused ? 'Account paused' : 'Campaign paused'}</span>}
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            )}

            {tab === 'integrations' && (
              <ul className="ui-list op-intlist">
                {integrationCatalog.map((item) => {
                  const status = client.integrations[item.id]
                  const Icon = integrationIcon[item.id]
                  const pending = busy(`int-${item.id}`)
                  return (
                    <li key={item.id} className="ui-row op-introw">
                      <span className="app-integration__icon" aria-hidden="true">
                        <Icon size={17} />
                      </span>
                      <span className="op-introw__text">
                        <span className="app-cell-title">{item.name}</span>
                        <span className={cx('app-cell-sub', status === 'attention' && 'app-num-red')}>
                          {status === 'attention' ? attentionNotes[`${client.id}.${item.id}`] ?? 'Needs attention' : item.description}
                        </span>
                      </span>
                      <Badge tone={integrationTone[status]}>{integrationStatusLabel[status]}</Badge>
                      <button
                        type="button"
                        className={cx('ui-btn', status !== 'available' && status !== 'attention' && 'ui-btn--quiet')}
                        disabled={pending}
                        aria-busy={pending}
                        onClick={() => setIntegration(item.id, status === 'connected' ? 'available' : 'connected', item.name)}
                      >
                        {pending && <LoaderCircle className="app-spin" aria-hidden="true" />}
                        {status === 'connected' ? 'Disconnect' : status === 'attention' ? 'Reconnect' : 'Connect'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {tab === 'usage' && (
              <div className="op-usage">
                <dl className="app-facts app-facts--boxed">
                  <div>
                    <dt>Messages · 30 days</dt>
                    <dd>
                      {fmtNumber(current.messagesSent)} <span className="app-cell-sub">{fmtNumber(previousSent)} the 30 days before</span>
                    </dd>
                  </div>
                  <div>
                    <dt>By text</dt>
                    <dd>{fmtNumber(sentByChannel.text)}</dd>
                  </div>
                  <div>
                    <dt>By email</dt>
                    <dd>{fmtNumber(sentByChannel.email)}</dd>
                  </div>
                  <div>
                    <dt>Plan</dt>
                    <dd>
                      {plan?.name} · {client.plan === 'enterprise' ? `${fmtCurrency(client.contractMonthly ?? 0)}/mo sample contract` : `${plan?.priceLabel}/mo`}
                    </dd>
                  </div>
                </dl>
                <TimeChart
                  kind="columns"
                  summary={`${client.short} sent ${fmtNumber(current.messagesSent)} automated messages in the last 30 days.`}
                  labels={series.map((point) => fmtDate(point.start))}
                  longLabels={series.map((point) => fmtWeekdayDate(point.start))}
                  height={200}
                  series={[{ id: 'sent', label: 'Messages sent', values: series.map((point) => point.sent), tone: 'ink' }]}
                />
                <p className="ui-meta">
                  Usage counts automated texts and emails. {kit.valueLabel} figures elsewhere are sample estimates.
                </p>
              </div>
            )}

            {tab === 'support' && <SupportTab clientId={clientId} />}

            {tab === 'users' && (
              <UsersTab
                clientName={client.short}
                team={client.team}
                invites={invites}
                multiUser={multiUser}
                planName={plan?.name ?? client.plan}
                onInvite={(person) => {
                  dispatch({ type: 'inviteClientUser', clientId, person })
                  notify({ title: `Invite added for ${person.name}`, detail: `${client.short} · no email was sent.` })
                }}
                onUpsell={
                  upsell && !state.upsells[clientId]
                    ? () =>
                        run('upsell', () => {
                          dispatch({ type: 'proposeUpsell', clientId })
                          notify({ title: `Upgrade proposal drafted for ${client.short}`, detail: 'Nothing was sent to the client.' })
                        })
                    : undefined
                }
              />
            )}
          </TabPanel>
        </div>
      </div>

      <Dialog
        open={confirmPause}
        onClose={() => setConfirmPause(false)}
        size="sm"
        title={paused ? `Resume ${client.short}?` : `Pause ${client.short}?`}
        description={
          paused
            ? 'Automations restart with the next scheduled step, and billing resumes.'
            : 'Automations stop and nothing is sent until you resume. Paused accounts are not billed.'
        }
        footer={
          <>
            <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setConfirmPause(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="ui-btn"
              onClick={() => {
                setConfirmPause(false)
                run('status', () => {
                  dispatch({ type: 'setClientStatus', clientId, status: paused ? 'active' : 'paused' })
                  notify({ title: paused ? `${client.short} resumed` : `${client.short} paused`, tone: paused ? 'success' : 'info' })
                })
              }}
            >
              {paused ? 'Resume account' : 'Pause account'}
            </button>
          </>
        }
      >
        <p className="app-dialog__text">
          {paused && client.paused ? `Paused ${fmtDate(client.paused.at)}: ${client.paused.reason.toLowerCase()}. ` : ''}This only changes the sample workspace in this tab.
        </p>
      </Dialog>
    </>
  )
}

function SupportTab({ clientId }: { clientId: string }) {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const list = baseTickets.filter((ticket) => ticket.clientId === clientId)
  if (list.length === 0) return <EmptyState title="No support tickets">This client hasn’t needed help recently.</EmptyState>
  return (
    <ul className="op-tickets">
      {list.map((ticket) => {
        const status = state.tickets[ticket.id] ?? ticket.status
        const notes = state.ticketNotes[ticket.id] ?? []
        const draft = drafts[ticket.id] ?? ''
        const addNote = (event: FormEvent) => {
          event.preventDefault()
          if (!draft.trim()) return
          dispatch({ type: 'addNote', id: ticket.id, note: draft.trim() })
          setDrafts((current) => ({ ...current, [ticket.id]: '' }))
          notify({ title: `Note added to ${ticket.id}` })
        }
        return (
          <li key={ticket.id} className="op-ticket">
            <div className="op-ticket__head">
              <span>
                <span className="app-cell-title">{ticket.subject}</span>
                <span className="app-cell-sub">
                  {ticket.id} · opened {fmtAgo(ticket.opened)}
                  {ticket.priority === 'high' ? ' · high priority' : ''}
                </span>
              </span>
              <Badge tone={status === 'resolved' ? 'positive' : status === 'waiting' ? 'caution' : 'red'}>
                {status === 'resolved' ? 'Resolved' : status === 'waiting' ? 'Waiting on client' : 'Open'}
              </Badge>
            </div>
            <p className="op-ticket__update">{ticket.lastUpdate}</p>
            {notes.length > 0 && (
              <ul className="op-ticket__notes">
                {notes.map((note, index) => (
                  <li key={index}>
                    <Avatar name="Riley Brooks" size="sm" tone="ink" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="op-ticket__actions">
              {status !== 'resolved' && (
                <form className="op-ticket__form" onSubmit={addNote}>
                  <label className="app-sr" htmlFor={`note-${ticket.id}`}>
                    Add a note to {ticket.id}
                  </label>
                  <input
                    id={`note-${ticket.id}`}
                    className="ui-input"
                    placeholder="Add an internal note…"
                    value={draft}
                    onChange={(event) => setDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
                  />
                  <button type="submit" className="ui-btn ui-btn--quiet" disabled={!draft.trim()}>
                    Add note
                  </button>
                </form>
              )}
              <button
                type="button"
                className={cx('ui-btn', status !== 'resolved' ? '' : 'ui-btn--quiet')}
                onClick={() => {
                  dispatch({ type: 'setTicket', id: ticket.id, status: status === 'resolved' ? 'open' : 'resolved' })
                  notify({ title: status === 'resolved' ? `${ticket.id} reopened` : `${ticket.id} resolved`, tone: status === 'resolved' ? 'info' : 'success' })
                }}
              >
                {status === 'resolved' ? 'Reopen' : 'Mark resolved'}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function UsersTab({
  clientName,
  team,
  invites,
  multiUser,
  planName,
  onInvite,
  onUpsell,
}: {
  clientName: string
  team: Person[]
  invites: Person[]
  multiUser: boolean
  planName: string
  onInvite: (person: Person) => void
  onUpsell?: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Agent')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const everyone = [...team, ...invites]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Enter their name.'
    if (!EMAIL.test(email.trim())) next.email = 'Enter a valid email address.'
    else if (everyone.some((person) => person.email.toLowerCase() === email.trim().toLowerCase())) next.email = 'That person already has access.'
    setErrors(next)
    if (Object.keys(next).length) return
    onInvite({ name: name.trim(), email: email.trim(), role: `${role} · invited` })
    setName('')
    setEmail('')
  }

  return (
    <div className="app-settings__split">
      <ul className="ui-list app-members" aria-label={`${clientName} users`}>
        {everyone.map((person) => (
          <li key={person.email} className="ui-row app-member">
            <Avatar name={person.name} size="sm" />
            <span className="app-member__text">
              <span className="app-cell-title">{person.name}</span>
              <span className="app-cell-sub">{person.email}</span>
            </span>
            <Badge tone="plain">{person.role}</Badge>
          </li>
        ))}
      </ul>
      <form className="app-form app-invite" onSubmit={submit} noValidate aria-labelledby="client-invite-title">
        <h2 id="client-invite-title" className="app-form__title">
          Add a user
        </h2>
        {multiUser ? (
          <p className="ui-meta">Multi-user collaboration is included on {planName}.</p>
        ) : (
          <p className="op-gate" role="note">
            Multi-user collaboration is included from Scale. {clientName} is on {planName}, so it has one login.
          </p>
        )}
        <fieldset className="app-fieldset" disabled={!multiUser}>
          <legend className="app-sr">New user details</legend>
          <TextField label="Name" value={name} onChange={setName} error={errors.name} required autoComplete="off" />
          <TextField label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required autoComplete="off" />
          <SelectField
            label="Role"
            value={role}
            onChange={setRole}
            options={['Admin', 'Agent', 'Viewer'].map((value) => ({ value, label: value }))}
          />
          <button type="submit" className="ui-btn">
            <UserPlus aria-hidden="true" />
            Add user
          </button>
        </fieldset>
        {!multiUser && onUpsell && (
          <button type="button" className="ui-btn ui-btn--quiet" onClick={onUpsell}>
            Draft a Scale proposal
          </button>
        )}
      </form>
    </div>
  )
}
