import type { Metadata } from 'next'

/** Demo pages are never indexed, and their titles say they are a demo. */
export const demoRobots: Metadata['robots'] = { index: false, follow: false }

export function demoMetadata(title: string, description?: string): Metadata {
  return {
    title: { absolute: `${title} — CloseAgain demo` },
    description,
    robots: demoRobots,
  }
}
