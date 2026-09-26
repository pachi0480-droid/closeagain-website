'use client'

import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type ToastTone = 'success' | 'error' | 'info'
export type ToastInput = { title: string; detail?: string; tone?: ToastTone }
type Toast = ToastInput & { id: number; tone: ToastTone }

const ToastContext = createContext<(toast: ToastInput) => void>(() => {})

/**
 * Confirmation toasts. Every toast carries a line that says the change only
 * happened in the sample workspace, so a demo can never read as a real send.
 * Successes are announced politely; errors assertively.
 */
export function ToastProvider({ children, note }: { children: ReactNode; note: string }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<number, number>())
  const seq = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) window.clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const notify = useCallback(
    (input: ToastInput) => {
      const id = ++seq.current
      const tone = input.tone ?? 'success'
      setToasts((current) => [...current.slice(-2), { ...input, tone, id }])
      timers.current.set(id, window.setTimeout(() => dismiss(id), tone === 'error' ? 8000 : 5000))
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => map.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const render = (tone: 'polite' | 'assertive') =>
    toasts
      .filter((toast) => (tone === 'assertive' ? toast.tone === 'error' : toast.tone !== 'error'))
      .map((toast) => {
        const Icon = toast.tone === 'error' ? CircleAlert : toast.tone === 'info' ? Info : CircleCheck
        return (
          <div key={toast.id} className={`ui-toast app-toast app-toast--${toast.tone}`}>
            <Icon className="app-toast__icon" aria-hidden="true" size={17} strokeWidth={1.5} />
            <div className="app-toast__text">
              <p className="app-toast__title">{toast.title}</p>
              {toast.detail && <p className="app-toast__detail">{toast.detail}</p>}
              <p className="app-toast__note">{note}</p>
            </div>
            <button type="button" className="app-toast__close" aria-label="Dismiss" onClick={() => dismiss(toast.id)}>
              <X aria-hidden="true" size={15} strokeWidth={1.5} />
            </button>
          </div>
        )
      })

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="app-toasts">
        <div role="status" aria-live="polite" className="app-toasts__region">
          {render('polite')}
        </div>
        <div role="alert" aria-live="assertive" className="app-toasts__region">
          {render('assertive')}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

/**
 * Simulated async work for the sample workspace: a short pending state,
 * then the change. Never longer than 600ms.
 */
export function usePending() {
  const [pending, setPending] = useState<Record<string, true>>({})
  const timers = useRef<number[]>([])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const run = useCallback((key: string, work: () => void, ms = 480) => {
    setPending((current) => ({ ...current, [key]: true }))
    timers.current.push(
      window.setTimeout(() => {
        setPending((current) => {
          const next = { ...current }
          delete next[key]
          return next
        })
        work()
      }, Math.min(ms, 600)),
    )
  }, [])

  return useMemo(() => ({ pending, run, busy: (key: string) => Boolean(pending[key]) }), [pending, run])
}
