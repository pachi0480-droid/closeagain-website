'use client'

import { Check, CircleAlert, Copy, LoaderCircle, Mail, MessageSquare, Minus, Pencil, Plus, Rocket, Send } from 'lucide-react'
import { useState, type CSSProperties, type FormEvent } from 'react'
import { planAllows, type Template } from '@/content/demo/automations'
import { fmtDate } from '@/content/demo/format'
import { canDeploy, isPlural } from '@/content/demo/operator'
import { DEMO_NOW } from '@/content/demo/time'
import type { Client, Step } from '@/content/demo/types'
import { planById, plans } from '@/content/pricing'
import { AutomationBuilder } from '../AutomationBuilder'
import { Dialog } from '../Dialog'
import { useToast, usePending } from '../Toasts'
import { Avatar, Badge, PageHeader, SelectField, TextField, cx } from '../ui'
import { useClients, useDeployments, useOperator, useTemplates } from './state'

type DeployResult = { clientId: string; outcome: 'deployed' | 'already' | 'failed'; reason?: string }

const CATEGORIES = ['Speed to lead', 'Recovery', 'Reactivation', 'Appointments', 'Sales', 'Retention']

const starterSteps = (id: string): Step[] => [
  { id: `${id}.1`, kind: 'trigger', event: 'new-lead' },
  { id: `${id}.2`, kind: 'message', channel: 'text', body: 'Hi {first}, thanks for reaching out to {business}. How can we help?' },
  { id: `${id}.3`, kind: 'wait', amount: 1, unit: 'days' },
  { id: `${id}.4`, kind: 'condition', check: 'replied' },
  { id: `${id}.5`, kind: 'message', channel: 'text', body: 'Just checking in, {first} — still interested?' },
]

function channelsOf(template: Template) {
  const set = new Set(template.steps.filter((step) => step.kind === 'message').map((step) => (step.kind === 'message' ? step.channel : 'text')))
  return [...set]
}

export function eligibility(template: Template, client: Client, deployed: string[]): { tone: 'ok' | 'already' | 'blocked'; text: string } {
  if (deployed.includes(template.id)) return { tone: 'already', text: 'Already running' }
  const check = canDeploy(template, client)
  if (!check.ok) return { tone: 'blocked', text: client.status === 'paused' ? 'Account paused' : `Needs ${planById(template.minPlan)?.name ?? 'a higher plan'}` }
  return { tone: 'ok', text: 'Ready' }
}

/** “Core and Growth”: the plans below a template's minimum plan. */
function plansBelow(minPlan: Template['minPlan']) {
  const names = plans.slice(0, plans.findIndex((plan) => plan.id === minPlan)).map((plan) => plan.name)
  return names.length <= 1 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

export function TemplatesView() {
  const templates = useTemplates()
  const deployments = useDeployments()
  const clients = useClients()
  const { dispatch } = useOperator()
  const notify = useToast()
  const { run, busy } = usePending()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [single, setSingle] = useState<string | null>(null)
  const [multi, setMulti] = useState<string | null>(null)

  const deployedTo = (templateId: string) => clients.filter((client) => (deployments[client.id] ?? []).includes(templateId))

  const duplicate = (template: Template) => {
    const id = `tpl-custom-${templates.length + 1}`
    const copy: Template = {
      ...template,
      id,
      name: `${template.name} (copy)`,
      steps: template.steps.map((step, index) => ({ ...step, id: `${id}.${index + 1}` })),
      updatedAt: DEMO_NOW,
      updatedBy: 'Riley Brooks',
    }
    dispatch({ type: 'addTemplate', template: copy })
    notify({ title: `Duplicated as “${copy.name}”`, detail: 'The copy isn’t deployed anywhere yet.' })
  }

  const editingTemplate = templates.find((template) => template.id === editing) ?? null
  const singleTemplate = templates.find((template) => template.id === single) ?? null
  const multiTemplate = templates.find((template) => template.id === multi) ?? null

  return (
    <>
      <PageHeader title="Templates" description={`Master automation library · ${templates.length} templates deployed across ${clients.length} clients`}>
        <button type="button" className="ui-btn" onClick={() => setCreating(true)}>
          <Plus aria-hidden="true" />
          New template
        </button>
      </PageHeader>

      <div className="app-page">
        <ul className="op-templates">
          {templates.map((template, index) => {
            const running = deployedTo(template.id)
            const channels = channelsOf(template)
            return (
              <li key={template.id} className="ui-panel op-template app-rise" style={{ '--i': index } as CSSProperties}>
                <div className="op-template__top">
                  <p className="ui-label">{template.category}</p>
                  {template.minPlan !== 'core' && <Badge tone="plain">{planById(template.minPlan)?.name} and up</Badge>}
                </div>
                <h2 className="op-template__name">{template.name}</h2>
                <p className="op-template__desc">{template.description}</p>
                <p className="op-template__meta">
                  <span>{template.steps.length} steps</span>
                  {channels.map((channel) => (
                    <span key={channel} className="op-template__channel">
                      {channel === 'text' ? <MessageSquare aria-hidden="true" size={14} /> : <Mail aria-hidden="true" size={14} />}
                      {channel === 'text' ? 'Text' : 'Email'}
                    </span>
                  ))}
                  <span>{template.type === 'campaign' ? 'Campaign' : 'Sequence'}</span>
                </p>
                <div className="op-template__deployed">
                  <span className="ui-meta">{running.length ? `Running for ${running.length} ${running.length === 1 ? 'client' : 'clients'}` : 'Not deployed yet'}</span>
                  <span className="op-template__avatars" aria-hidden="true">
                    {running.slice(0, 6).map((client) => (
                      <Avatar key={client.id} name={client.short} size="sm" />
                    ))}
                    {running.length > 6 && <span className="app-tags__more">+{running.length - 6}</span>}
                  </span>
                </div>
                <p className="ui-meta op-template__edited">
                  Edited {fmtDate(template.updatedAt)} by {template.updatedBy}
                </p>
                <div className="op-template__actions">
                  <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setEditing(template.id)}>
                    <Pencil aria-hidden="true" size={15} />
                    Edit
                    <span className="app-sr"> {template.name}</span>
                  </button>
                  <button type="button" className="ui-btn ui-btn--quiet" onClick={() => duplicate(template)}>
                    <Copy aria-hidden="true" size={15} />
                    Duplicate
                    <span className="app-sr"> {template.name}</span>
                  </button>
                </div>
                <div className="op-template__deploy">
                  <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setSingle(template.id)}>
                    <Send aria-hidden="true" size={15} />
                    Deploy to client
                    <span className="app-sr">: {template.name}</span>
                  </button>
                  <button type="button" className="ui-btn" onClick={() => setMulti(template.id)}>
                    <Rocket aria-hidden="true" size={15} />
                    Deploy to multiple clients
                    <span className="app-sr">: {template.name}</span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <CreateDialog
        open={creating}
        templates={templates}
        onClose={() => setCreating(false)}
        onCreate={(template) => {
          dispatch({ type: 'addTemplate', template })
          setCreating(false)
          setEditing(template.id)
          notify({ title: `Created “${template.name}”`, detail: 'Add its steps, then deploy it to clients.' })
        }}
      />

      <Dialog open={editingTemplate !== null} onClose={() => setEditing(null)} variant="drawer" size="lg" eyebrow="Edit template" title={editingTemplate?.name ?? ''} description={editingTemplate?.description}>
        {editingTemplate && (
          <TemplateEditor
            key={editingTemplate.id}
            template={editingTemplate}
            saving={busy('save')}
            onSave={(next) =>
              run('save', () => {
                dispatch({ type: 'saveTemplate', template: { ...next, updatedAt: DEMO_NOW, updatedBy: 'Riley Brooks' } })
                notify({ title: `“${next.name}” saved`, detail: `Clients running it pick up the new steps for new enrollments.` })
              })
            }
          />
        )}
      </Dialog>

      {singleTemplate && (
        <SingleDeploy
          template={singleTemplate}
          clients={clients}
          deployments={deployments}
          onClose={() => setSingle(null)}
          onDeployed={(client) => {
            dispatch({ type: 'deploy', templateId: singleTemplate.id, clientIds: [client.id] })
            notify({ title: `${singleTemplate.name} deployed to ${client.short}` })
          }}
          onFailed={(client, reason) => notify({ title: `Couldn’t deploy to ${client.short}`, detail: reason, tone: 'error' })}
        />
      )}

      {multiTemplate && (
        <MultiDeploy
          template={multiTemplate}
          clients={clients}
          deployments={deployments}
          onClose={() => setMulti(null)}
          onDeploy={(clientIds) => dispatch({ type: 'deploy', templateId: multiTemplate.id, clientIds })}
          onSummary={(results) => {
            const ok = results.filter((result) => result.outcome === 'deployed').length
            const failed = results.filter((result) => result.outcome === 'failed').length
            notify({
              title: `${multiTemplate.name}: deployed to ${ok} ${ok === 1 ? 'client' : 'clients'}`,
              detail: failed ? `${failed} couldn’t be deployed — see the details in the dialog.` : undefined,
              tone: failed && !ok ? 'error' : 'success',
            })
          }}
        />
      )}
    </>
  )
}

function TemplateEditor({ template, onSave, saving }: { template: Template; onSave: (template: Template) => void; saving: boolean }) {
  const [name, setName] = useState(template.name)
  const [description, setDescription] = useState(template.description)
  const [category, setCategory] = useState(template.category)
  const metaDirty = name !== template.name || description !== template.description || category !== template.category
  return (
    <div className="op-editor">
      <div className="app-form__grid">
        <TextField label="Name" value={name} onChange={setName} required error={name.trim() ? undefined : 'A template needs a name.'} />
        <SelectField label="Category" value={category} onChange={setCategory} options={[...new Set([...CATEGORIES, template.category])].map((value) => ({ value, label: value }))} />
      </div>
      <TextField label="Description" value={description} onChange={setDescription} multiline />
      {metaDirty && (
        <div className="op-editor__meta">
          <p className="ui-meta">Name, category or description changed.</p>
          <button
            type="button"
            className="ui-btn ui-btn--quiet"
            disabled={!name.trim() || saving}
            onClick={() => onSave({ ...template, name: name.trim(), description: description.trim(), category })}
          >
            Save details
          </button>
        </div>
      )}
      <div className="op-editor__builder">
        <AutomationBuilder
          title={name || template.name}
          subtitle={`Available from ${planById(template.minPlan)?.name ?? template.minPlan}${template.planFeature ? ` · ${template.planFeature}` : ''}`}
          steps={template.steps}
          saving={saving}
          onSave={(steps) => onSave({ ...template, name: name.trim() || template.name, description: description.trim(), category, steps })}
        />
      </div>
    </div>
  )
}

function CreateDialog({
  open,
  templates,
  onClose,
  onCreate,
}: {
  open: boolean
  templates: Template[]
  onClose: () => void
  onCreate: (template: Template) => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [from, setFrom] = useState('blank')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | undefined>()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give the template a name.')
      return
    }
    if (templates.some((template) => template.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('A template with that name already exists.')
      return
    }
    const id = `tpl-custom-${templates.length + 1}`
    const source = templates.find((template) => template.id === from)
    onCreate({
      id,
      name: name.trim(),
      category,
      description: description.trim() || (source ? source.description : 'A custom follow-up sequence.'),
      minPlan: source?.minPlan ?? 'growth',
      planFeature: source?.planFeature ?? 'Advanced follow-up sequences',
      type: source?.type ?? 'sequence',
      steps: source ? source.steps.map((step, index) => ({ ...step, id: `${id}.${index + 1}` })) : starterSteps(id),
      updatedAt: DEMO_NOW,
      updatedBy: 'Riley Brooks',
    })
    setName('')
    setDescription('')
    setFrom('blank')
    setError(undefined)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New template"
      description="Start from a blank sequence or copy one from the library."
      footer={
        <>
          <button type="button" className="ui-btn ui-btn--quiet" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="create-template" className="ui-btn">
            Create and edit
          </button>
        </>
      }
    >
      <form id="create-template" className="app-form" onSubmit={submit} noValidate>
        <TextField label="Name" value={name} onChange={(value) => {
          setName(value)
          setError(undefined)
        }} error={error} required />
        <SelectField label="Category" value={category} onChange={setCategory} options={CATEGORIES.map((value) => ({ value, label: value }))} />
        <SelectField label="Start from" value={from} onChange={setFrom} options={[{ value: 'blank', label: 'A blank sequence' }, ...templates.map((template) => ({ value: template.id, label: `Copy of ${template.name}` }))]} />
        <TextField label="Description" value={description} onChange={setDescription} multiline hint="Optional. Shown on the template card." />
        <p className="ui-meta">A blank template is an advanced follow-up sequence, included from {planById('growth')?.name}. A copy keeps its source’s plan.</p>
      </form>
    </Dialog>
  )
}

function ClientChoice({ client, deployed, template }: { client: Client; deployed: string[]; template: Template }) {
  const state = eligibility(template, client, deployed)
  return (
    <span className="op-choice__text">
      <span className="app-cell-title">{client.name}</span>
      <span className="app-cell-sub">
        {planById(client.plan)?.name} · {client.status === 'paused' ? 'Paused' : client.status === 'onboarding' ? 'Onboarding' : 'Active'}
      </span>
      <span className={cx('op-choice__state', `is-${state.tone}`)}>{state.text}</span>
    </span>
  )
}

function SingleDeploy({
  template,
  clients,
  deployments,
  onClose,
  onDeployed,
  onFailed,
}: {
  template: Template
  clients: Client[]
  deployments: Record<string, string[]>
  onClose: () => void
  onDeployed: (client: Client) => void
  onFailed: (client: Client, reason: string) => void
}) {
  const { run, busy } = usePending()
  const [choice, setChoice] = useState<string>(clients.find((client) => eligibility(template, client, deployments[client.id] ?? []).tone === 'ok')?.id ?? clients[0].id)
  const [result, setResult] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)

  const deploy = () => {
    const client = clients.find((item) => item.id === choice)
    if (!client) return
    setResult(null)
    run('deploy', () => {
      if ((deployments[client.id] ?? []).includes(template.id)) {
        setResult({ tone: 'info', text: `${template.name} is already running for ${client.short}. Nothing changed.` })
        return
      }
      const check = canDeploy(template, client)
      if (!check.ok) {
        setResult({ tone: 'error', text: check.reason })
        onFailed(client, check.reason)
        return
      }
      onDeployed(client)
      onClose()
    }, 520)
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Deploy ${template.name}`}
      description="Choose one client. The sequence starts with their next matching lead."
      footer={
        <>
          <button type="button" className="ui-btn ui-btn--quiet" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ui-btn" onClick={deploy} disabled={busy('deploy')} aria-busy={busy('deploy')}>
            {busy('deploy') && <LoaderCircle className="app-spin" aria-hidden="true" />}
            {busy('deploy') ? 'Deploying…' : 'Deploy'}
          </button>
        </>
      }
    >
      <fieldset className="op-choices">
        <legend className="app-sr">Client</legend>
        {clients.map((client) => (
          <label key={client.id} className={cx('op-choice', choice === client.id && 'is-checked')}>
            <input
              type="radio"
              name="deploy-client"
              value={client.id}
              checked={choice === client.id}
              onChange={() => {
                setChoice(client.id)
                setResult(null)
              }}
            />
            <ClientChoice client={client} deployed={deployments[client.id] ?? []} template={template} />
          </label>
        ))}
      </fieldset>
      {result && (
        <p className={cx('op-result', `op-result--${result.tone}`)} role={result.tone === 'error' ? 'alert' : 'status'}>
          <CircleAlert aria-hidden="true" size={16} />
          {result.text}
        </p>
      )}
    </Dialog>
  )
}

function MultiDeploy({
  template,
  clients,
  deployments,
  onClose,
  onDeploy,
  onSummary,
}: {
  template: Template
  clients: Client[]
  deployments: Record<string, string[]>
  onClose: () => void
  onDeploy: (clientIds: string[]) => void
  onSummary: (results: DeployResult[]) => void
}) {
  const { run, busy } = usePending()
  const [selected, setSelected] = useState<string[]>([])
  const [results, setResults] = useState<DeployResult[] | null>(null)
  const eligible = clients.filter((client) => eligibility(template, client, deployments[client.id] ?? []).tone === 'ok').map((client) => client.id)

  const toggle = (id: string) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const deploy = () =>
    run(
      'deploy',
      () => {
        const out: DeployResult[] = selected.map((clientId) => {
          const client = clients.find((item) => item.id === clientId)
          if (!client) return { clientId, outcome: 'failed', reason: 'Unknown client.' }
          if ((deployments[clientId] ?? []).includes(template.id)) return { clientId, outcome: 'already' }
          const check = canDeploy(template, client)
          return check.ok ? { clientId, outcome: 'deployed' } : { clientId, outcome: 'failed', reason: check.reason }
        })
        const ok = out.filter((result) => result.outcome === 'deployed').map((result) => result.clientId)
        if (ok.length) onDeploy(ok)
        setResults(out)
        onSummary(out)
      },
      580,
    )

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={`Deploy ${template.name} to several clients`}
      description={results ? 'Here is what happened for each client.' : `Available from ${planById(template.minPlan)?.name}. Paused accounts can’t receive new automations.`}
      footer={
        results ? (
          <button type="button" className="ui-btn" onClick={onClose}>
            Done
          </button>
        ) : (
          <>
            <span className="ui-meta op-multi__count">{selected.length} selected</span>
            <button type="button" className="ui-btn ui-btn--quiet" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="ui-btn" onClick={deploy} disabled={selected.length === 0 || busy('deploy')} aria-busy={busy('deploy')}>
              {busy('deploy') && <LoaderCircle className="app-spin" aria-hidden="true" />}
              {busy('deploy') ? 'Deploying…' : selected.length ? `Deploy to ${selected.length} ${selected.length === 1 ? 'client' : 'clients'}` : 'Deploy'}
            </button>
          </>
        )
      }
    >
      {results ? (
        <ul className="op-results" aria-label="Deployment results">
          {results.map((result) => {
            const client = clients.find((item) => item.id === result.clientId)
            return (
              <li key={result.clientId} className={cx('op-results__row', `is-${result.outcome}`)}>
                {result.outcome === 'deployed' ? <Check aria-hidden="true" size={16} /> : result.outcome === 'already' ? <Minus aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
                <span>
                  <span className="app-cell-title">{client?.name}</span>
                  <span className="app-cell-sub">
                    {result.outcome === 'deployed' ? 'Deployed — starts with the next matching lead.' : result.outcome === 'already' ? 'Already running. Nothing changed.' : result.reason}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <>
          <div className="op-multi__tools">
            <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setSelected(eligible)} disabled={eligible.length === 0}>
              Select all ready ({eligible.length})
            </button>
            <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setSelected(clients.map((client) => client.id))}>
              Select every client
            </button>
            <button type="button" className="ui-btn ui-btn--ghost" onClick={() => setSelected([])} disabled={selected.length === 0}>
              Clear
            </button>
          </div>
          <fieldset className="op-choices op-choices--grid">
            <legend className="app-sr">Clients</legend>
            {clients.map((client) => (
              <label key={client.id} className={cx('op-choice', selected.includes(client.id) && 'is-checked')}>
                <input type="checkbox" checked={selected.includes(client.id)} onChange={() => toggle(client.id)} />
                <ClientChoice client={client} deployed={deployments[client.id] ?? []} template={template} />
              </label>
            ))}
          </fieldset>
          {!planAllows('core', template.minPlan) && (
            <p className="ui-meta">
              {template.planFeature ?? template.name} {isPlural(template.planFeature ?? template.name) ? 'are' : 'is'} included from {planById(template.minPlan)?.name}, so clients on{' '}
              {plansBelow(template.minPlan)} can’t run this template.
            </p>
          )}
        </>
      )}
    </Dialog>
  )
}
