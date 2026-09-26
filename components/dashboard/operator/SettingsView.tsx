'use client'

import { Check, Minus, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { fmtAgo } from '@/content/demo/format'
import { operatorTeam } from '@/content/demo/operator'
import { useToast } from '../Toasts'
import { Avatar, Badge, PageHeader, SelectField, Switch, TabPanel, Tabs, TextField } from '../ui'
import { useOperator, type OperatorState } from './state'

type Tab = 'team' | 'roles' | 'notifications'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const notifications = [
  { id: 'payment-failed', label: 'A client payment fails', detail: 'Email to Billing and the operations lead', on: true },
  { id: 'integration', label: 'An integration needs attention', detail: 'Push to the client’s success manager', on: true },
  { id: 'health', label: 'A client drops to “at risk”', detail: 'Daily check at 8 AM', on: true },
  { id: 'deploy', label: 'A template is deployed', detail: 'Activity feed only', on: false },
  { id: 'weekly', label: 'Weekly portfolio summary', detail: 'Email every Monday', on: true },
]

const roles = ['Owner', 'Admin', 'Manager', 'Viewer'] as const
const matrix: Array<{ label: string; allowed: ReadonlyArray<(typeof roles)[number]> }> = [
  { label: 'View every client workspace', allowed: ['Owner', 'Admin', 'Manager', 'Viewer'] },
  { label: 'Pause and resume clients', allowed: ['Owner', 'Admin'] },
  { label: 'Edit and deploy templates', allowed: ['Owner', 'Admin', 'Manager'] },
  { label: 'Reconnect integrations', allowed: ['Owner', 'Admin', 'Manager'] },
  { label: 'Manage billing and invoices', allowed: ['Owner', 'Admin'] },
  { label: 'Invite operators', allowed: ['Owner'] },
]

export function OperatorSettings() {
  const [tab, setTab] = useState<Tab>('team')
  const { state } = useOperator()
  return (
    <>
      <PageHeader title="Settings" description="The CloseAgain operations team, roles and alerts" />
      <div className="app-page">
        <div className="ui-panel app-rise app-settings">
          <Tabs
            idBase="op-settings"
            label="Settings sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'team', label: 'Team', count: operatorTeam.length + state.teamInvites.length },
              { id: 'roles', label: 'Roles' },
              { id: 'notifications', label: 'Notifications' },
            ]}
          />
          <TabPanel idBase="op-settings" id={tab}>
            {tab === 'team' && <TeamTab />}
            {tab === 'roles' && <RolesTab />}
            {tab === 'notifications' && <NotificationsTab />}
          </TabPanel>
        </div>
      </div>
    </>
  )
}

function TeamTab() {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<OperatorState['teamInvites'][number]['role']>('Manager')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Enter their name.'
    if (!EMAIL.test(email.trim())) next.email = 'Enter a valid email address.'
    else if ([...operatorTeam, ...state.teamInvites].some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) next.email = 'Already on the team.'
    setErrors(next)
    if (Object.keys(next).length) return
    dispatch({ type: 'inviteTeam', member: { name: name.trim(), email: email.trim(), role } })
    notify({ title: `Invite added for ${name.trim()}`, detail: 'No email was sent.' })
    setName('')
    setEmail('')
  }

  return (
    <div className="app-settings__split">
      <ul className="ui-list app-members" aria-label="Operations team">
        {operatorTeam.map((member) => (
          <li key={member.email} className="ui-row app-member">
            <Avatar name={member.name} tone={member.role === 'Owner' ? 'ink' : undefined} />
            <span className="app-member__text">
              <span className="app-cell-title">{member.name}</span>
              <span className="app-cell-sub">
                {member.title} · active {fmtAgo(member.lastActive)}
              </span>
            </span>
            <Badge tone={member.role === 'Owner' ? 'ink' : 'plain'}>{member.role}</Badge>
          </li>
        ))}
        {state.teamInvites.map((member) => (
          <li key={member.email} className="ui-row app-member">
            <Avatar name={member.name} />
            <span className="app-member__text">
              <span className="app-cell-title">{member.name}</span>
              <span className="app-cell-sub">{member.email} · invite pending</span>
            </span>
            <Badge tone="plain">{member.role}</Badge>
          </li>
        ))}
      </ul>
      <form className="app-form app-invite" onSubmit={submit} noValidate aria-labelledby="op-invite-title">
        <h2 id="op-invite-title" className="app-form__title">
          Invite an operator
        </h2>
        <TextField label="Name" value={name} onChange={setName} error={errors.name} required autoComplete="off" />
        <TextField label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required autoComplete="off" />
        <SelectField
          label="Role"
          value={role}
          onChange={setRole}
          options={[
            { value: 'Admin', label: 'Admin' },
            { value: 'Manager', label: 'Manager' },
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

function RolesTab() {
  return (
    <div className="app-table-wrap">
      <table className="ui-table app-table app-perms__table">
        <caption className="app-sr">What each operator role can do</caption>
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
  )
}

function NotificationsTab() {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  return (
    <ul className="ui-list app-toggles" aria-label="Notifications">
      {notifications.map((item) => {
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
                notify({ title: `${item.label}: ${next ? 'on' : 'off'}`, tone: next ? 'success' : 'info' })
              }}
            />
          </li>
        )
      })}
    </ul>
  )
}
