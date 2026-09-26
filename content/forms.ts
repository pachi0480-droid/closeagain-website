/**
 * The buying form: labels, options, limits and messages.
 *
 * Shared by the browser (instant feedback) and the submission endpoint (the
 * check that actually counts), so the two can never disagree.
 */

import { plans } from './pricing.ts'

export type FieldKind = 'text' | 'email' | 'tel' | 'multiline' | 'choice'

export type FieldOption = { value: string; label: string }

export type FieldDefinition = {
  name: string
  label: string
  kind: FieldKind
  required: boolean
  max: number
  autoComplete?: string
  hint?: string
  options?: readonly FieldOption[]
  placeholderOption?: string
  /** Lay two short fields side by side on wide screens. */
  half?: boolean
  messages: { required?: string; invalid?: string }
}

const asOptions = (labels: readonly string[]): FieldOption[] => labels.map((label) => ({ value: label, label }))

export const industryOptions = asOptions([
  'Real estate',
  'Home services',
  'Med spa',
  'Law firm',
  'Agency',
  'SaaS & technology',
  'E-commerce',
  'Other lead-driven business',
])

export const leadVolumeOptions = asOptions([
  'Under 50 a month',
  '50–200 a month',
  '200–500 a month',
  '500–1,000 a month',
  'More than 1,000 a month',
  'Not sure',
])

export const planOptions: FieldOption[] = [
  ...plans.map((plan) => ({
    value: plan.id,
    label: plan.monthly === null ? `${plan.name} — custom pricing` : `${plan.name} — ${plan.priceLabel}/month`,
  })),
  { value: 'unsure', label: 'Not sure yet — recommend one' },
]

export const goalOptions = asOptions([
  'Capture and follow up with new leads',
  'Re-engage old leads',
  'Both new and old leads',
  'Book more appointments',
  'Something else',
])

export const purchaseFields: readonly FieldDefinition[] = [
  {
    name: 'name',
    label: 'Full name',
    kind: 'text',
    required: true,
    max: 120,
    autoComplete: 'name',
    half: true,
    messages: { required: 'Please enter your name.' },
  },
  {
    name: 'business',
    label: 'Business name',
    kind: 'text',
    required: true,
    max: 160,
    autoComplete: 'organization',
    half: true,
    messages: { required: 'Please enter your business name.' },
  },
  {
    name: 'email',
    label: 'Work email',
    kind: 'email',
    required: true,
    max: 254,
    autoComplete: 'email',
    half: true,
    messages: {
      required: 'Please enter your email address.',
      invalid: 'Please enter a complete email address, like name@company.com.',
    },
  },
  {
    name: 'phone',
    label: 'Phone',
    kind: 'tel',
    required: false,
    max: 32,
    autoComplete: 'tel',
    hint: 'Optional.',
    half: true,
    messages: { invalid: 'Please enter a phone number using digits, spaces, +, - or brackets.' },
  },
  {
    name: 'industry',
    label: 'Industry',
    kind: 'choice',
    required: false,
    max: 60,
    options: industryOptions,
    placeholderOption: 'Choose one',
    hint: 'Optional.',
    half: true,
    messages: { invalid: 'Please choose one of the listed industries.' },
  },
  {
    name: 'volume',
    label: 'Monthly lead volume',
    kind: 'choice',
    required: false,
    max: 60,
    options: leadVolumeOptions,
    placeholderOption: 'Choose one',
    hint: 'Optional.',
    half: true,
    messages: { invalid: 'Please choose one of the listed ranges.' },
  },
  {
    name: 'crm',
    label: 'Current CRM',
    kind: 'text',
    required: false,
    max: 120,
    hint: 'Optional — or “none”.',
    messages: {},
  },
  {
    name: 'plan',
    label: 'Preferred plan',
    kind: 'choice',
    required: true,
    max: 20,
    options: planOptions,
    placeholderOption: 'Choose a plan',
    half: true,
    messages: {
      required: 'Please choose a plan — or “Not sure yet”.',
      invalid: 'Please choose one of the listed plans.',
    },
  },
  {
    name: 'goal',
    label: 'Main goal',
    kind: 'choice',
    required: true,
    max: 60,
    options: goalOptions,
    placeholderOption: 'Choose one',
    half: true,
    messages: {
      required: 'Please choose your main goal.',
      invalid: 'Please choose one of the listed goals.',
    },
  },
  {
    name: 'message',
    label: 'Anything else we should know?',
    kind: 'multiline',
    required: false,
    max: 3000,
    hint: 'Optional.',
    messages: {},
  },
]

/** Plain-language status messages. Never expose server details to visitors. */
export const formMessages = {
  invalid: 'Please check the highlighted fields and try again.',
  submitting: 'Sending…',
  success: 'Received. Taking you to the confirmation page…',
  failed: 'Something went wrong, so we could not confirm your details were received. Everything you entered is still here — please try again.',
  // A timeout is not proof of failure, so this message makes no claim either way.
  timeout: 'We did not get a confirmation in time, so we cannot be sure your details arrived. Everything you entered is still here — please try again in a moment.',
  network: 'We could not reach the server. Check your connection and try again. Everything you entered is still here.',
  unavailable: 'Requests are temporarily unavailable. Please try again later.',
  busy: 'Too many attempts in a short time. Please wait a few minutes and try again.',
  /** Shown after a no-JavaScript post is sent back to the form. */
  returned: {
    invalid: 'Some details were missing or not quite right, so nothing was sent. Please check the form and try again.',
    failed: 'Something went wrong, so we could not confirm your details were received. Please try again.',
  },
  tooLong: (max: number) => `Please keep this under ${max.toLocaleString('en-US')} characters.`,
} as const
