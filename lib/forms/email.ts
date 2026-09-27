/**
 * The email hand-off used before a delivery destination is connected: a
 * `mailto:` link that opens the visitor's own email app with every answer
 * filled in. The visitor reviews it and presses send; the site sends nothing.
 */

import type { FieldDefinition } from '../../content/forms.ts'
import { planById } from '../../content/pricing.ts'

export function inquiryEmailLink(
  to: string,
  fields: readonly FieldDefinition[],
  values: Record<string, string>,
): string {
  const lines = fields.map((field) => {
    const value = values[field.name] ?? ''
    const shown = field.options?.find((option) => option.value === value)?.label ?? value
    return `${field.label}: ${shown || '—'}`
  })
  const plan = planById(values.plan)
  const subject = `CloseAgain — ${plan ? `${plan.name} ` : ''}inquiry from ${values.business || 'a new business'}`
  const body = `Hi CloseAgain,\n\n${lines.join('\n')}\n`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
