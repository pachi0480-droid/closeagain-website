'use client'

import { CircleCheck, LoaderCircle, RotateCw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { fmtAgo, fmtNumber, fmtTime } from '@/content/demo/format'
import { clientShort, jobs, queues, services, type Job } from '@/content/demo/operator'
import { useToast, usePending } from '../Toasts'
import { Badge, PageHeader, Panel, Segmented, cx, type BadgeTone } from '../ui'
import { useOperator } from './state'

const jobTone: Record<Job['status'], BadgeTone> = { succeeded: 'positive', failed: 'red', running: 'default', retrying: 'caution' }
const jobLabel: Record<Job['status'], string> = { succeeded: 'Succeeded', failed: 'Failed', running: 'Running', retrying: 'Retrying' }

export function SystemView() {
  const { state, dispatch } = useOperator()
  const notify = useToast()
  const { run, busy } = usePending()
  const [show, setShow] = useState<'all' | 'problems'>('all')

  const statusOf = (job: Job) => state.jobs[job.id] ?? job.status
  const list = jobs.filter((job) => show === 'all' || statusOf(job) === 'failed' || statusOf(job) === 'retrying')
  const operational = services.filter((service) => service.status === 'operational').length

  const retry = (job: Job) =>
    run(job.id, () => {
      // Two jobs fail again for reasons outside the platform; the rest recover.
      if (job.kind === 'Payment retry') {
        dispatch({ type: 'setJob', id: job.id, status: 'failed' })
        notify({ title: 'Payment retry failed again', detail: `${clientShort(job.clientId)}’s card was declined. Ask them to update it before retrying.`, tone: 'error' })
        return
      }
      if (job.kind === 'Form check' || job.kind === 'Webhook delivery') {
        dispatch({ type: 'setJob', id: job.id, status: 'failed' })
        notify({
          title: `${job.kind} still failing`,
          detail: job.kind === 'Form check' ? `${clientShort(job.clientId)}’s form still isn’t sending submissions. The fix is on their site.` : 'The client endpoint still returns 410 Gone.',
          tone: 'error',
        })
        return
      }
      dispatch({ type: 'setJob', id: job.id, status: 'succeeded' })
      notify({ title: `${job.kind} for ${clientShort(job.clientId)} succeeded on retry` })
    }, 560)

  return (
    <>
      <PageHeader title="System" description={`${operational} of ${services.length} services operational · sample status, not live monitoring`} />
      <div className="app-page">
        <div className="app-grid app-grid--halves">
          <Panel index={0} title="Service status" meta="Last 30 days uptime" flush>
            <ul className="ui-list">
              {services.map((service) => (
                <li key={service.id} className="ui-row op-service">
                  {service.status === 'operational' ? (
                    <CircleCheck aria-hidden="true" size={17} className="op-up" />
                  ) : (
                    <TriangleAlert aria-hidden="true" size={17} className="op-warn" />
                  )}
                  <span className="op-service__text">
                    <span className="app-cell-title">{service.name}</span>
                    <span className="app-cell-sub">{service.note}</span>
                  </span>
                  <span className="op-service__uptime">{service.uptime.toFixed(2)}%</span>
                  <Badge tone={service.status === 'operational' ? 'positive' : 'caution'}>{service.status === 'operational' ? 'Operational' : 'Degraded'}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel index={1} title="Queues" meta="Right now" flush>
            <ul className="ui-list">
              {queues.map((queue) => (
                <li key={queue.id} className="ui-row op-queue">
                  <span className="op-queue__depth">{fmtNumber(queue.depth)}</span>
                  <span className="op-service__text">
                    <span className="app-cell-title">{queue.name}</span>
                    <span className="app-cell-sub">{queue.detail}</span>
                  </span>
                  <span className="ui-meta">Oldest {queue.oldest}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          index={2}
          title="Recent jobs"
          meta="Background work across clients"
          flush
          actions={
            <Segmented
              label="Show jobs"
              size="sm"
              value={show}
              onChange={setShow}
              options={[
                { value: 'all', label: 'All' },
                { value: 'problems', label: 'Problems', count: jobs.filter((job) => statusOf(job) === 'failed' || statusOf(job) === 'retrying').length },
              ]}
            />
          }
        >
          <div className="app-table-wrap">
            <table className="ui-table app-table op-table app-table--stack">
              <caption className="app-sr">Recent background jobs</caption>
              <thead>
                <tr>
                  <th scope="col">Job</th>
                  <th scope="col">Client</th>
                  <th scope="col">Status</th>
                  <th scope="col">When</th>
                  <th scope="col" className="ui-num">
                    Took
                  </th>
                  <th scope="col">
                    <span className="app-sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((job) => {
                  const status = statusOf(job)
                  const canRetry = status === 'failed' || status === 'retrying'
                  return (
                    <tr key={job.id}>
                      <th scope="row">
                        <span className="app-cell-title">{job.kind}</span>
                        <span className="app-cell-sub">
                          {job.id} · {job.detail}
                        </span>
                      </th>
                      <td data-label="Client">{clientShort(job.clientId)}</td>
                      <td data-label="Status">
                        <Badge tone={jobTone[status]}>{jobLabel[status]}</Badge>
                      </td>
                      <td data-label="When">
                        {fmtAgo(job.at)}
                        <span className="app-cell-sub">{fmtTime(job.at)}</span>
                      </td>
                      <td className="ui-num" data-label="Took">
                        {job.duration}
                      </td>
                      <td className="app-autotable__edit">
                        {canRetry && (
                          <button type="button" className={cx('ui-btn ui-btn--quiet')} onClick={() => retry(job)} disabled={busy(job.id)} aria-busy={busy(job.id)}>
                            {busy(job.id) ? <LoaderCircle className="app-spin" aria-hidden="true" /> : <RotateCw aria-hidden="true" size={15} />}
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="app-panel-foot ui-meta">Sample jobs and statuses for the demo. They mirror the alerts on the overview.</p>
        </Panel>
      </div>
    </>
  )
}
