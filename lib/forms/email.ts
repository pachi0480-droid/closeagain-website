/**
 * Inquiries as email.
 *
 * `inquiryEmailLink` is the hand-off used before any delivery destination is
 * connected: a `mailto:` link that opens the visitor's own email app with every
 * answer filled in. The visitor reviews it and presses send; the site sends
 * nothing. The lines and subject are shared with the notification email the
 * server sends once email delivery is configured (see delivery.ts).
 */

import type { FieldDefinition } from '../../content/forms.ts'
import { planById } from '../../content/pricing.ts'

/** Every answer as a readable “Label: value” line, with “—” for blanks. */
export function inquiryLines(fields: readonly FieldDefinition[], values: Record<string, string>): string[] {
  return fields.map((field) => {
    const value = values[field.name] ?? ''
    const shown = field.options?.find((option) => option.value === value)?.label ?? value
    return `${field.label}: ${shown || '—'}`
  })
}

/** “CloseAgain — Growth inquiry from Rivera & Co” */
export function inquirySubject(values: Record<string, string>): string {
  const plan = planById(values.plan)
  return `CloseAgain — ${plan ? `${plan.name} ` : ''}inquiry from ${values.business || 'a new business'}`
}

export function inquiryEmailLink(
  to: string,
  fields: readonly FieldDefinition[],
  values: Record<string, string>,
): string {
  const body = `Hi CloseAgain,\n\n${inquiryLines(fields, values).join('\n')}\n`
  return `mailto:${to}?subject=${encodeURIComponent(inquirySubject(values))}&body=${encodeURIComponent(body)}`
}
