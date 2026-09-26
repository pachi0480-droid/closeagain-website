'use client'

import { ArrowUpRight, Check, CreditCard, LoaderCircle, Minus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { invoicesFor, monthlyPrice, nextRenewal } from '@/content/demo/billing'
import { fmtAgo, fmtCurrency, fmtDateYear } from '@/content/demo/format'
import { workspaceAccount, workspaceClient, workspaceNotifications, workspaceTeam } from '@/content/demo/workspace'
import { billingNote, planById, planSummary, setupNote } from '@/content/pricing'
import { useToast, usePending } from '../Toasts'
import { Avatar, Badge, PageHeader, SelectField, Switch, TabPanel, Tabs, TextField } from '../ui'
import { useClientDemo, type InvitedMember } from './state'

type Tab = 'account' | 'team' | 'billing' | 'notifications' | 'permissions'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SettingsView() {
  const [tab, setTab] = useState<Tab>('account')
  const { state } = useClientDemo()
  return (
    <>
      <PageHeader title="Settings" description="Workspace, team, billing and notifications for Juniper Row Realty" />
      <div className="app-page">
        <div className="ui-panel app-rise app-settings">
          <Tabs
            idBase="settings"
            label="Settings sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'account', label: 'Account' },
              { id: 'team', label: 'Team', count: workspaceTeam.length + state.invites.length },
              { id: 'billing', label: 'Billing' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'permissions', label: 'Permissions' },
            ]}
          />
          <TabPanel idBase="settings" id={tab}>
            {tab === 'account' && <AccountTab />}
            {tab === 'team' && <TeamTab />}
            {tab === 'billing' && <BillingTab />}
            {tab === 'notifications' && <NotificationsTab />}
            {tab === 'permissions' && <PermissionsTab />}
          </TabPanel>
        </div>
      </div>
    </>
  )
}

function AccountTab() {
  const { state, dispatch } = useClientDemo()
  const notify = useToast()
  const { run, busy } = usePending()
  const saved = state.account ?? workspaceAccount
  const [form, setForm] = useState(saved)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof workspaceAccount, string>>>({})
  const dirty = JSON.stringify(form) !== JSON.stringify(saved)

  const set = (key: keyof typeof workspaceAccount) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!form.businessName.trim()) next.businessName = 'Enter the business name leads will see.'
    if (!form.senderName.trim()) next.senderName = 'Enter a sender name.'
    if (!EMAIL.test(form.replyTo.trim())) next.replyTo = 'Enter a reply-to address like hello@yourbusiness.com.'
    setErrors(next)
    if (Object.keys(next).length) return
    run('account', () => {
      dispatch({ type: 'saveAccount', account: { ...form, businessName: form.businessName.trim(), senderName: form.senderName.trim(), replyTo: form.replyTo.trim() } })
      notify({ title: 'Account settings saved' })
    })
  }

  return (
    <form className="app-form" onSubmit={submit} noValidate>
      <div className="app-form__grid">
        <TextField label="Business name" value={form.businessName} onChange={set('businessName')} error={errors.businessName} required autoComplete="organization" />
        <TextField label="Sender name" value={form.senderName} onChange={set('senderName')} error={errors.senderName} required hint="Shown on texts and emails." />
        <TextField label="Reply-to email" type="email" value={form.replyTo} onChange={set('replyTo')} error={errors.replyTo} required autoComplete="email" />
        <SelectField
          label="Timezone"
          value={form.timezone}
          onChange={set('timezone')}
          options={['Eastern Time (ET)', 'Central Time (CT)', 'Mountain Time (MT)', 'Pacific Time (PT)'].map((value) => ({ value, label: value }))}
        />
        <TextField label="Business hours" value={form.hours} onChange={set('hours')} hint="Follow-ups wait for these hours." />
        <SelectField
          label="Quiet hours for texts"
          value={form.quietHours}
          onChange={set('quietHours')}
          options={['9 PM to 8 AM', '8 PM to 9 AM', 'Off'].map((value) => ({ value, label: value }))}
        />
      </div>
      <div className="app-form__foot">
        <p className="ui-meta">{dirty ? 'You have unsaved changes.' : 'Replies to new inquiries go out right away; follow-ups respect quiet hours.'}</p>
        <button type="button" className="ui-btn ui-btn--ghost" disabled={!dirty || busy('account')} onClick={() => setForm(saved)}>
          Discard
        </button>
        <button type="submit" className="ui-btn" disabled={!dirty || busy('account')} aria-busy={busy('account')}>
          {busy('account') && <LoaderCircle className="app-spin" aria-hidden="true" />}
          {busy('account') ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function TeamTab() {
  const { state, dispatch } = useClientDemo()
  const notify = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InvitedMember['role']>('Agent')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const members = [...workspaceTeam, ...state.invites]

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Enter their name.'
    if (!EMAIL.test(email.trim())) next.email = 'Enter an email address like name@yourbusiness.com.'
    else if (members.some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) next.email = 'That person is already on the team.'
    setErrors(next)
    if (Object.keys(next).length) return
    dispatch({
      type: 'invite',
      member: { name: name.trim(), email: email.trim(), role, title: role === 'Viewer' ? 'Viewer' : 'Invited teammate', lastActive: 0, invited: true },
    })
    notify({ title: `Invite added for ${name.trim()}`, detail: 'In the sample workspace no email is sent.' })
    setName('')
    setEmail('')
    setRole('Agent')
  }

  return (
    <div className="app-settings__split">
      <ul className="ui-list app-members" aria-label="Team members">
        {members.map((member) => {
          const invited = 'invited' in member
          return (
            <li key={member.email} className="ui-row app-member">
              <Avatar name={member.name} tone={invited ? undefined : member.role === 'Owner' ? 'ink' : undefined} />
              <span className="app-member__text">
                <span className="app-cell-title">{member.name}</span>
                <span className="app-cell-sub">
                  {member.email} · {invited ? 'Invite pending' : `Active ${fmtAgo(member.lastActive)}`}
                </span>
              </span>
              <Badge tone={member.role === 'Owner' ? 'ink' : 'plain'}>{member.role}</Badge>
              {invited && (
                <button
                  type="button"
                  className="ui-btn ui-btn--ghost"
                  onClick={() => {
                    dispatch({ type: 'revokeInvite', email: member.email })
                    notify({ title: `Invite for ${member.name} revoked`, tone: 'info' })
                  }}
                >
                  Revoke
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <form className="app-form app-invite" onSubmit={submit} noValidate aria-labelledby="invite-title">
        <h2 id="invite-title" className="app-form__title">
          Invite a teammate
        </h2>
        <p className="ui-meta">Multi-user collaboration is included on the {planById(workspaceClient.plan)?.name} plan.</p>
        <TextField label="Name" value={name} onChange={setName} error={errors.name} required autoComplete="off" />
        <TextField label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required autoComplete="off" />
        <SelectField
          label="Role"
          value={role}
          onChange={setRole}
          options={[
            { value: 'Admin', label: 'Admin' },
            { value: 'Agent', label: 'Agent' },
            { value: 'Viewer', label: 'Viewer' },
          ]}
        />
        <button type="submit" className="ui-btn">
          <UserPlus aria-hidden="true" />
          Send invite
        </button>
      </form>
    </div>
  )
}

function BillingTab() {
  const plan = planById(workspaceClient.plan)
  const invoices = invoicesFor(workspaceClient)
  const renewal = nextRenewal(workspaceClient)
  if (!plan) return null
  return (
    <div className="app-settings__split">
      <section className="app-plan" aria-labelledby="plan-title">
        <p className="ui-label">Current plan</p>
        <h2 id="plan-title" className="app-plan__name">
          {plan.name}
        </h2>
        <p className="app-plan__price">
          <span className="app-plan__amount">{plan.priceLabel}</span>
          <span className="ui-meta">/month · {billingNote.toLowerCase()}</span>
        </p>
        <p className="ui-meta">{planSummary(plan)} · {setupNote}</p>
        <p className="app-plan__includes ui-label">{plan.includesLabel}</p>
        <ul className="app-plan__features">
          {plan.features.map((feature) => (
            <li key={feature}>
              <Check aria-hidden="true" size={15} />
              {feature}
            </li>
          ))}
        </ul>
        <div className="app-plan__actions">
          <Link href="/pricing" className="ui-btn">
            Change plan
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/contact" className="app-textlink">
            Talk to us about Enterprise
          </Link>
        </div>
      </section>
      <div className="app-billing-side">
        <dl className="app-facts app-facts--boxed">
          <div>
            <dt>Next invoice</dt>
            <dd>
              {fmtCurrency(monthlyPrice(workspaceClient))} on {fmtDateYear(renewal)}
            </dd>
          </div>
          <div>
            <dt>Payment method</dt>
            <dd className="app-inline-icon">
              <CreditCard aria-hidden="true" size={16} />
              Card on file (sample)
            </dd>
          </div>
        </dl>
        <div className="app-table-wrap">
          <table className="ui-table app-table app-table--stack">
            <caption className="app-caption">Invoices</caption>
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Plan</th>
                <th scope="col" className="ui-num">
                  Amount
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...invoices].reverse().map((invoice) => (
                <tr key={invoice.id}>
                  <th scope="row">
                    <span className="app-cell-title app-cell-title--plain">{invoice.period}</span>
                    <span className="app-cell-sub">{invoice.id}</span>
                  </th>
                  <td data-label="Plan">{planById(invoice.plan)?.name}</td>
                  <td className="ui-num" data-label="Amount">
                    {fmtCurrency(invoice.amount)}
                  </td>
                  <td data-label="Status">
                    <Badge tone={invoice.status === 'paid' ? 'positive' : invoice.status === 'open' ? 'plain' : 'red'}>
                      {invoice.status === 'open' ? `Due ${fmtDateYear(invoice.issuedAt)}` : invoice.status === 'paid' ? 'Paid' : 'Failed'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const { state, dispatch } = useClientDemo()
  const notify = useToast()
  return (
    <ul className="ui-list app-toggles" aria-label="Notifications">
      {workspaceNotifications.map((item) => {
        const on = state.notifications[item.id] ?? item.on
        return (
          <li key={item.id} className="ui-row app-toggle">
            <span className="app-toggle__text">
              <span className="app-cell-title app-cell-title--plain">{item.label}</span>
              <span className="app-cell-sub">{item.detail}</span>
            </span>
            <Switch
              checked={on}
              label={item.label}
              onChange={(next) => {
                dispatch({ type: 'setNotification', id: item.id, on: next })
                notify({ title: `${item.label}: notifications ${next ? 'on' : 'off'}`, tone: next ? 'success' : 'info' })
              }}
            />
          </li>
        )
      })}
    </ul>
  )
}

const roles = ['Owner', 'Admin', 'Agent', 'Viewer'] as const
const matrix: Array<{ label: string; allowed: ReadonlyArray<(typeof roles)[number]> }> = [
  { label: 'View conversations and leads', allowed: ['Owner', 'Admin', 'Agent', 'Viewer'] },
  { label: 'Reply to leads', allowed: ['Owner', 'Admin', 'Agent'] },
  { label: 'Move leads between stages', allowed: ['Owner', 'Admin', 'Agent'] },
  { label: 'Edit automations', allowed: ['Owner', 'Admin'] },
  { label: 'Connect integrations', allowed: ['Owner', 'Admin'] },
  { label: 'Invite teammates', allowed: ['Owner', 'Admin'] },
  { label: 'Export data', allowed: ['Owner', 'Admin'] },
  { label: 'Manage billing', allowed: ['Owner'] },
]

function PermissionsTab() {
  return (
    <div className="app-perms">
      <div className="app-table-wrap">
        <table className="ui-table app-table app-perms__table">
          <caption className="app-sr">What each role can do</caption>
          <thead>
            <tr>
              <th scope="col">Permission</th>
              {roles.map((role) => (
                <th key={role} scope="col" className="app-perms__role">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {roles.map((role) => (
                  <td key={role} className="app-perms__cell">
                    {row.allowed.includes(role) ? (
                      <>
                        <Check aria-hidden="true" size={16} />
                        <span className="app-sr">Allowed</span>
                      </>
                    ) : (
                      <>
                        <Minus aria-hidden="true" size={16} className="app-perms__no" />
                        <span className="app-sr">Not allowed</span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="app-panel-foot ui-meta">Roles are fixed on {planById(workspaceClient.plan)?.name}. Custom roles come with Enterprise’s advanced permissions.</p>
    </div>
  )
}

