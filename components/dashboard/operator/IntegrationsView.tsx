'use client'

import { CircleAlert, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { attentionNotes, integrationCatalog } from '@/content/demo/workspace'
import type { IntegrationStatus } from '@/content/demo/types'
import { integrationIcon } from '../integrationIcons'
import { integrationStatusLabel } from '../labels'
import { useToast, usePending } from '../Toasts'
import { Metric, PageHeader, Panel, cx } from '../ui'
import { useClients, useOperator } from './state'

const glyph: Record<IntegrationStatus, string> = { connected: '●', attention: '!', available: '○' }

export function OperatorIntegrations() {
  const clients = useClients()
  const { dispatch } = useOperator()
  const notify = useToast()
  const { run, busy } = usePending()

  const all = clients.flatMap((client) => integrationCatalog.map((item) => ({ client, item, status: client.integrations[item.id] })))
  const connected = all.filter((cell) => cell.status === 'connected').length
  const attention = all.filter((cell) => cell.status === 'attention')
  const available = all.filter((cell) => cell.status === 'available').length

  return (
    <>
      <PageHeader title="Integrations" description="Connection health across every client workspace" />
      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-4">
          <Metric index={0} label="Connections" value={`${connected}`} note={`of ${all.length} possible`} />
          <Metric index={1} label="Need attention" value={`${attention.length}`} emphasis={attention.length > 0} note={attention.map((cell) => cell.client.short).join(', ') || 'All healthy'} />
          <Metric index={2} label="Not connected" value={`${available}`} note="Available to set up" />
          <Metric index={3} label="Clients fully healthy" value={`${clients.filter((client) => !Object.values(client.integrations).includes('attention')).length} of ${clients.length}`} />
        </div>

        <Panel index={1} title="Needs attention" meta={attention.length ? 'Fix these first' : 'Nothing broken'} flush>
          {attention.length === 0 ? (
            <p className="app-panel-note">Every connection is healthy.</p>
          ) : (
            <ul className="ui-list">
              {attention.map(({ client, item }) => {
                const key = `${client.id}.${item.id}`
                const Icon = integrationIcon[item.id]
                const isWebhook = item.id === 'webhooks'
                return (
                  <li key={key} className="ui-row op-introw">
                    <span className="app-integration__icon" aria-hidden="true">
                      <Icon size={17} />
                    </span>
                    <span className="op-introw__text">
                      <span className="app-cell-title">
                        <Link href={`/demo/operator/clients/${client.id}`} className="app-rowlink">
                          {client.name}
                        </Link>{' '}
                        · {item.name}
                      </span>
                      <span className="app-cell-sub app-num-red">{attentionNotes[key] ?? 'Needs attention.'}</span>
                    </span>
                    <button
                      type="button"
                      className="ui-btn ui-btn--quiet"
                      disabled={busy(key)}
                      aria-busy={busy(key)}
                      onClick={() =>
                        run(key, () => {
                          if (isWebhook) {
                            notify({
                              title: `Retry failed for ${client.short}’s webhook`,
                              detail: 'The endpoint still answers 410 Gone. Ask the client to update the URL, then retry.',
                              tone: 'error',
                            })
                            return
                          }
                          dispatch({ type: 'setIntegration', clientId: client.id, id: item.id, status: 'connected' })
                          notify({ title: `${item.name} reconnected for ${client.short}` })
                        }, 560)
                      }
                    >
                      {busy(key) && <LoaderCircle className="app-spin" aria-hidden="true" />}
                      {isWebhook ? 'Retry delivery' : 'Reconnect'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel index={2} title="Health by client" meta="Each generic integration category" flush>
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table op-matrix">
              <caption className="app-sr">Integration status for each client</caption>
              <thead>
                <tr>
                  <th scope="col">Client</th>
                  {integrationCatalog.map((item) => (
                    <th key={item.id} scope="col" className="op-matrix__head">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <th scope="row">
                      <Link href={`/demo/operator/clients/${client.id}`} className="app-rowlink">
                        <span className="app-cell-title">{client.short}</span>
                      </Link>
                    </th>
                    {integrationCatalog.map((item) => {
                      const status = client.integrations[item.id]
                      return (
                        <td key={item.id} className={cx('op-matrix__cell', `is-${status}`)}>
                          <span aria-hidden="true" className="op-matrix__glyph">
                            {status === 'attention' ? <CircleAlert size={15} /> : glyph[status]}
                          </span>
                          <span className="app-sr">{integrationStatusLabel[status]}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="app-calkey op-matrix__key" aria-label="Key">
            <li>
              <span className="op-matrix__glyph is-connected">●</span> Connected
            </li>
            <li>
              <span className="op-matrix__glyph is-attention">!</span> Needs attention
            </li>
            <li>
              <span className="op-matrix__glyph is-available">○</span> Not connected
            </li>
          </ul>
        </Panel>
      </div>
    </>
  )
}
