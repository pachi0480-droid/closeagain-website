/**
 * A tiny reducer store that remembers changes for the rest of the browser
 * tab (sessionStorage) and renders identically on the server.
 *
 * Read it with useSyncExternalStore: the server snapshot is always the
 * untouched initial state, so hydration never mismatches; the browser then
 * switches to anything saved earlier in the tab.
 */

export type Store<S, A> = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => S
  getServerSnapshot: () => S
  dispatch: (action: A) => void
  reset: () => void
}

export function createPersistentStore<S, A>(key: string, initial: S, reducer: (state: S, action: A) => S): Store<S, A> {
  let state = initial
  let loaded = false
  const listeners = new Set<() => void>()

  const load = () => {
    if (loaded || typeof window === 'undefined') return
    loaded = true
    try {
      const raw = window.sessionStorage.getItem(key)
      if (raw) state = { ...initial, ...(JSON.parse(raw) as Partial<S>) }
    } catch {
      // Storage can be unavailable (private mode, blocked site data): keep the defaults.
    }
  }

  const save = () => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Nothing to do: the change still lives in memory for this page.
    }
  }

  const emit = () => listeners.forEach((listener) => listener())

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot() {
      load()
      return state
    },
    getServerSnapshot() {
      return initial
    },
    dispatch(action) {
      load()
      const next = reducer(state, action)
      if (next === state) return
      state = next
      save()
      emit()
    },
    reset() {
      state = initial
      loaded = true
      try {
        window.sessionStorage.removeItem(key)
      } catch {
        // ignore
      }
      emit()
    },
  }
}
