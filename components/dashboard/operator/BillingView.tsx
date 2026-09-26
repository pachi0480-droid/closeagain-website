'use client'

import { ArrowDownRight, ArrowUpRight, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { monthlyPrice, planDistribution, planMovements } from '@/content/demo/billing'
import { fmtCurrency, fmtDate, fmtDateYear, fmtNumber } from '@/content/demo/format'
import { allInvoices, clientName, clientShort, renewals, upsellOpportunities } from '@/content/demo/operator'
import { DAY, DEMO_NOW } from '@/content/demo/time'
import { planById } from '@/content/pricing'
import { StackedBar } from '../charts'
import { useToast, usePending } from '../Toasts'
import { Badge, EmptyState, Metric, PageHeader, Pager, Panel, SelectField, cx } from '../ui'
import { useClientRows, useClients, useOperator } from './state'

type InvoiceFilter = 'all' | 'paid' | 'open' | 'failed'
const INVOICE_PAGE = 12

export function BillingView() {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  const { run, busy } = usePending()
  const rows = useClientRows()
  const clients = useClients()
  const [filter, setFilter] = useState<InvoiceFilter>('all')
  const [page, setPage] = useState(0)

  const mrr = rows.reduce((sum, row) => sum + row.mrr, 0)
  const billing = clients.filter((client) => client.status !== 'paused')
  const distribution = planDistribution(clients)
  const movements = planMovements(clients)
  const since = DEMO_NOW - 90 * DAY
  const newClients = clients.filter((client) => client.since >= since && client.status !== 'paused')
  const pausedClients = clients.filter((client) => client.status === 'paused' && (client.paused?.at ?? DEMO_NOW) >= since)
  const expansion = movements.filter((move) => move.delta > 0).reduce((sum, move) => sum + move.delta, 0)
  const contraction = movements.filter((move) => move.delta < 0).reduce((sum, move) => sum + move.delta, 0)
  const newMrr = newClients.reduce((sum, client) => sum + monthlyPrice(client), 0)
  const pausedMrr = pausedClients.reduce((sum, client) => sum + monthlyPrice(client), 0)
  const net = newMrr + expansion + contraction - pausedMrr

  const invoices = useMemo(() => allInvoices.filter((invoice) => filter === 'all' || invoice.status === filter), [filter])
  const pages = Math.max(1, Math.ceil(invoices.length / INVOICE_PAGE))
  const currentPage = Math.min(page, pages - 1)
  const pageRows = invoices.slice(currentPage * INVOICE_PAGE, (currentPage + 1) * INVOICE_PAGE)
  const failed = allInvoices.filter((invoice) => invoice.status === 'failed')
  const upcoming = renewals.filter((item) => item.at < DEMO_NOW + 30 * DAY && clients.find((client) => client.id === item.client.id)?.status !== 'paused')
  const upsells = upsellOpportunities(rows)

  const usageByPlan = distribution.map((slice) => {
    const messages = rows.filter((row) => row.client.plan === slice.plan.id && row.client.status !== 'paused').reduce((sum, row) => sum + row.current.messagesSent, 0)
    return { plan: slice.plan, clients: slice.count, messages }
  })

  return (
    <>
      <PageHeader title="Billing" description="Subscriptions, invoices and revenue, computed from each client’s plan on the pricing page">
        <Link href="/pricing" className="ui-btn ui-btn--quiet">
          View plans
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </PageHeader>
      <div className="app-page">
        <div className="app-grid app-grid--metrics">
          <Metric index={0} label="MRR" value={fmtCurrency(mrr)} note={`${billing.length} billing accounts`} />
          <Metric index={1} label="Active subscriptions" value={fmtNumber(billing.length)} note={`${clients.length - billing.length} paused`} />
          <Metric index={2} label="Avg. revenue per account" value={fmtCurrency(billing.length ? mrr / billing.length : 0)} note="MRR ÷ billing accounts" />
          <Metric index={3} label="Net new MRR · 90 days" value={`${net >= 0 ? '+' : '−'}${fmtCurrency(Math.abs(net))}`} note="New + upgrades − downgrades − paused" />
          <Metric index={4} label="Failed payments" value={fmtNumber(failed.length)} note={failed.length ? `${fmtCurrency(failed.reduce((sum, invoice) => sum + invoice.amount, 0))} outstanding` : 'All clear'} />
          <Metric index={5} label="Renewals · 30 days" value={fmtNumber(upcoming.length)} note={`${fmtCurrency(upcoming.reduce((sum, item) => sum + item.amount, 0))} due`} />
        </div>

        <div className="app-grid app-grid--halves">
          <Panel index={1} title="Plan distribution" meta="Share of MRR by plan">
            <StackedBar
              label="Plan distribution"
              parts={distribution.map((slice, index) => ({
                id: slice.plan.id,
                label: slice.plan.name,
                value: slice.mrr,
                display: fmtCurrency(slice.mrr),
                detail: `${slice.count} ${slice.count === 1 ? 'client' : 'clients'} · ${slice.plan.monthly ? `${slice.plan.priceLabel}/mo each` : 'custom contract (sample value)'}${mrr ? ` · ${Math.round((slice.mrr / mrr) * 100)}% of MRR` : ''}`,
                shade: (index + 1) as 1 | 2 | 3 | 4,
              }))}
            />
          </Panel>
          <Panel index={2} title="MRR movement" meta="Last 90 days">
            <dl className="op-movement">
              <div>
                <dt>New clients</dt>
                <dd className="op-up">+{fmtCurrency(newMrr)}</dd>
                <dd className="app-cell-sub">{newClients.map((client) => client.short).join(', ') || '—'}</dd>
              </div>
              <div>
                <dt>Upgrades</dt>
                <dd className="op-up">+{fmtCurrency(expansion)}</dd>
                <dd className="app-cell-sub">{movements.filter((move) => move.delta > 0).length} plan changes</dd>
              </div>
              <div>
                <dt>Downgrades</dt>
                <dd className="op-down">−{fmtCurrency(Math.abs(contraction))}</dd>
                <dd className="app-cell-sub">{movements.filter((move) => move.delta < 0).length} plan change</dd>
              </div>
              <div>
                <dt>Paused</dt>
                <dd className="op-down">−{fmtCurrency(pausedMrr)}</dd>
                <dd className="app-cell-sub">{pausedClients.map((client) => client.short).join(', ') || '—'}</dd>
              </div>
            </dl>
            <ul className="ui-list op-moves">
              {movements.map((move) => (
                <li key={move.id} className="op-move">
                  {move.delta >= 0 ? <ArrowUpRight aria-hidden="true" size={16} className="op-up" /> : <ArrowDownRight aria-hidden="true" size={16} className="op-down" />}
                  <span className="op-move__text">
                    <span className="app-cell-title">{clientName(move.clientId)}</span>
                    <span className="app-cell-sub">
                      {planById(move.from)?.name} → {planById(move.to)?.name} · {fmtDate(move.at)}
                    </span>
                  </span>
                  <span className={cx('op-move__delta', move.delta >= 0 ? 'op-up' : 'op-down')}>
                    {move.delta >= 0 ? '+' : '−'}
                    {fmtCurrency(Math.abs(move.delta))}/mo
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="app-grid app-grid--split">
          <Panel index={3} title="Failed payments" meta={failed.length ? 'Needs follow-up' : 'None'} flush>
            {failed.length === 0 ? (
              <EmptyState title="No failed payments" />
            ) : (
              <ul className="ui-list">
                {failed.map((invoice) => {
                  const retrying = state.invoices[invoice.id] === 'retrying'
                  return (
                    <li key={invoice.id} className="ui-row op-failed">
                      <span className="op-failed__text">
                        <span className="app-cell-title">
                          {clientName(invoice.clientId)} · {fmtCurrency(invoice.amount)}
                        </span>
                        <span className="app-cell-sub">
                          {invoice.id} · {invoice.period} · {invoice.note}
                        </span>
                      </span>
                      {retrying ? (
                        <Badge tone="caution">Retry scheduled · {fmtDate(DEMO_NOW + DAY)}</Badge>
                      ) : (
                        <button
                          type="button"
                          className="ui-btn ui-btn--quiet"
                          disabled={busy(invoice.id)}
                          aria-busy={busy(invoice.id)}
                          onClick={() =>
                            run(invoice.id, () => {
                              dispatch({ type: 'retryInvoice', id: invoice.id })
                              notify({ title: `Retry scheduled for ${clientShort(invoice.clientId)}`, detail: `${fmtCurrency(invoice.amount)} will be attempted again tomorrow at 9 AM.` })
                            })
                          }
                        >
                          {busy(invoice.id) && <LoaderCircle className="app-spin" aria-hidden="true" />}
                          Retry payment
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
            <div className="op-subhead">
              <h3 className="op-section__title">Upsell opportunities</h3>
            </div>
            {upsells.length === 0 ? (
              <p className="app-panel-note">No upsell signals right now.</p>
            ) : (
              <ul className="ui-list">
                {upsells.map((item) => {
                  const proposed = state.upsells[item.clientId] === 'proposed'
                  return (
                    <li key={item.clientId} className="ui-row op-failed">
                      <span className="op-failed__text">
                        <span className="app-cell-title">
                          {clientShort(item.clientId)}: {item.from} → {item.to} <span className="op-up">+{fmtCurrency(item.delta)}/mo</span>
                        </span>
                        <span className="app-cell-sub">{item.reason}</span>
                      </span>
                      {proposed ? (
                        <Badge tone="positive">Proposal drafted</Badge>
                      ) : (
                        <button
                          type="button"
                          className="ui-btn ui-btn--quiet"
                          disabled={busy(`up-${item.clientId}`)}
                          onClick={() =>
                            run(`up-${item.clientId}`, () => {
                              dispatch({ type: 'proposeUpsell', clientId: item.clientId })
                              notify({ title: `Upgrade proposal drafted for ${clientShort(item.clientId)}`, detail: 'Nothing was sent to the client.' })
                            })
                          }
                        >
                          Draft proposal
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel index={4} title="Renewals" meta="Next 30 days · monthly billing" flush>
            <ul className="ui-list">
              {upcoming.map((item) => (
                <li key={item.client.id} className="ui-row op-renewal">
                  <span className="op-renewal__date">{fmtDate(item.at)}</span>
                  <span className="op-failed__text">
                    <span className="app-cell-title">{item.client.name}</span>
                    <span className="app-cell-sub">{planById(item.client.plan)?.name}</span>
                  </span>
                  <span className="op-renewal__amount">{fmtCurrency(item.amount)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          index={5}
          title="Invoices"
          meta="July to October 2026 · amounts from each month’s plan"
          flush
          actions={
            <SelectField
              label="Status"
              hideLabel
              value={filter}
              onChange={(value) => {
                setFilter(value)
                setPage(0)
              }}
              options={[
                { value: 'all', label: 'All invoices' },
                { value: 'paid', label: 'Paid' },
                { value: 'open', label: 'Upcoming' },
                { value: 'failed', label: 'Failed' },
              ]}
            />
          }
        >
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table app-table--stack">
              <caption className="app-sr">Invoices</caption>
              <thead>
                <tr>
                  <th scope="col">Invoice</th>
                  <th scope="col">Client</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="ui-num">
                    Amount
                  </th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((invoice) => {
                  const retrying = state.invoices[invoice.id] === 'retrying'
                  return (
                    <tr key={invoice.id}>
                      <th scope="row">
                        <span className="app-cell-title app-cell-title--plain">{invoice.id}</span>
                        <span className="app-cell-sub">{invoice.period}</span>
                      </th>
                      <td data-label="Client">{clientShort(invoice.clientId)}</td>
                      <td data-label="Plan">{planById(invoice.plan)?.name}</td>
                      <td data-label="Date">{fmtDateYear(invoice.issuedAt)}</td>
                      <td className="ui-num" data-label="Amount">
                        {fmtCurrency(invoice.amount)}
                      </td>
                      <td data-label="Status">
                        <Badge tone={invoice.status === 'paid' ? 'positive' : invoice.status === 'open' ? 'plain' : retrying ? 'caution' : 'red'}>
                          {invoice.status === 'paid' ? 'Paid' : invoice.status === 'open' ? 'Upcoming' : retrying ? 'Retrying' : 'Failed'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pager page={currentPage} pageSize={INVOICE_PAGE} total={invoices.length} onPage={setPage} noun="invoices" />
        </Panel>

        <Panel index={6} title="Usage by plan" meta="Automated messages, last 30 days · billing accounts" flush>
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table app-table--stack">
              <caption className="app-sr">Usage by plan</caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  <th scope="col" className="ui-num">
                    Clients
                  </th>
                  <th scope="col" className="ui-num">
                    Messages
                  </th>
                  <th scope="col" className="ui-num">
                    Per client
                  </th>
                  <th scope="col">Usage on plan</th>
                </tr>
              </thead>
              <tbody>
                {usageByPlan.map((row) => (
                  <tr key={row.plan.id}>
                    <th scope="row">{row.plan.name}</th>
                    <td className="ui-num" data-label="Clients">
                      {row.clients}
                    </td>
                    <td className="ui-num" data-label="Messages">
                      {fmtNumber(row.messages)}
                    </td>
                    <td className="ui-num" data-label="Per client">
                      {row.clients ? fmtNumber(Math.round(row.messages / row.clients)) : '—'}
                    </td>
                    <td data-label="Usage on plan">{row.plan.features.find((feature) => /usage/i.test(feature)) ?? (row.plan.id === 'core' ? 'Standard' : '—')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}
