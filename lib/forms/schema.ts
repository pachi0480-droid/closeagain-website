/**
 * Normalisation and validation for both forms.
 *
 * Pure functions with no framework imports, so the browser, the route handler
 * and the test suite all run exactly the same rules. Relative `.ts` imports
 * keep the module runnable by Node's built-in test runner.
 */

import { formMessages, purchaseFields, type FieldDefinition } from '../../content/forms.ts'

/** One form today: the buying inquiry. The endpoint is keyed by kind so more can follow. */
export type FormKind = 'purchase'

export const formKinds: readonly FormKind[] = ['purchase']

export const fieldsFor = (kind: FormKind): readonly FieldDefinition[] => {
  switch (kind) {
    case 'purchase':
      return purchaseFields
  }
}

export type FieldValues = Record<string, string>
export type FieldErrors = Record<string, string>

export type ValidationResult =
  | { ok: true; values: FieldValues }
  | { ok: false; values: FieldValues; errors: FieldErrors }

/**
 * A deliberately permissive address check: something@something.tld, no
 * spaces. Any provider is accepted — personal domains, free mail, whatever
 * the visitor actually uses.
 */
const emailPattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

/** Digits with the usual separators; 7–15 digits covers local and international numbers. */
const phonePattern = /^[+()\d\s.-]+$/

// Control characters other than tab and newline.
const controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export function normalizeValue(field: FieldDefinition, raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const cleaned = raw.replace(controlChars, '')
  if (field.kind === 'multiline') {
    return cleaned
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }
  return cleaned.replace(/\s+/g, ' ').trim()
}

export function validateField(field: FieldDefinition, value: string): string | null {
  if (!value) return field.required ? (field.messages.required ?? 'This field is required.') : null
  if (value.length > field.max) return formMessages.tooLong(field.max)
  if (field.kind === 'email') {
    const [local = ''] = value.split('@')
    if (!emailPattern.test(value) || local.length > 64 || value.includes('..')) {
      return field.messages.invalid ?? 'Please enter a valid email address.'
    }
  }
  if (field.kind === 'tel') {
    const digits = value.replace(/\D/g, '').length
    if (!phonePattern.test(value) || digits < 7 || digits > 15) {
      return field.messages.invalid ?? 'Please enter a valid phone number.'
    }
  }
  if (field.kind === 'choice' && field.options && !field.options.some((option) => option.value === value)) {
    return field.messages.invalid ?? 'Please choose one of the listed options.'
  }
  return null
}

/** Normalises every known field, ignores unknown ones, and reports errors. */
export function validateSubmission(
  kind: FormKind,
  raw: Record<string, unknown>,
): ValidationResult {
  const values: FieldValues = {}
  const errors: FieldErrors = {}

  for (const field of fieldsFor(kind)) {
    const value = normalizeValue(field, raw[field.name])
    values[field.name] = value
    const error = validateField(field, value)
    if (error) errors[field.name] = error
  }

  return Object.keys(errors).length > 0 ? { ok: false, values, errors } : { ok: true, values }
}
