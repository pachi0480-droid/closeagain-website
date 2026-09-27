/**
 * The inquiry form: labels, options, limits and messages.
 *
 * Shared by the browser (instant feedback) and the submission endpoint (the
 * check that actually counts), so the two can never disagree.
 *
 * The form asks for four things and offers the rest behind “Add details
 * (optional)”. Nothing inside that disclosure may ever be required — a test
 * holds that line — and the plan is never a forced choice: it starts at
 * “not sure yet” and stays there unless the visitor picks one.
 */

import { planSummary, plans } from './pricing.ts'

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
  /** An empty first option such as “Choose one”. Omit when the field has a default. */
  placeholderOption?: string
  /** What an empty answer becomes. Lets a choice start somewhere without forcing it. */
  defaultValue?: string
  /** Lay two short fields side by side on wide screens. */
  half?: boolean
  /** `details` fields sit inside the “Add details (optional)” disclosure. */
  group?: 'details'
  messages: { required?: string; invalid?: string }
}

const asOptions = (labels: readonly string[]): FieldOption[] => labels.map((label) => ({ value: label, label }))

/** Values are the labels themselves: “Who it’s for” links here with ?industry=<label>. */
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

/** Stable slugs: the webhook receives these, so relabel freely but never rename. */
export const goalOptions: readonly FieldOption[] = [
  { value: 'new-inquiries', label: 'Answer new inquiries faster' },
  { value: 'older-leads', label: 'Revisit quiet older leads' },
  { value: 'both', label: 'Both' },
  { value: 'appointments', label: 'Book more appointments' },
  { value: 'other', label: 'Something else' },
]

/** The plan value that means “help me choose”. It is the default. */
export const unsurePlan = 'unsure'

export const planOptions: readonly FieldOption[] = [
  { value: unsurePlan, label: 'Not sure — help me choose' },
  ...plans.map((plan) => ({ value: plan.id, label: planSummary(plan) })),
]

export const inquiryFields: readonly FieldDefinition[] = [
  {
    name: 'name',
    label: 'Your name',
    kind: 'text',
    required: true,
    max: 120,
    autoComplete: 'name',
    half: true,
    messages: { required: 'Please enter your name.' },
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
    name: 'business',
    label: 'Business name or website',
    kind: 'text',
    required: true,
    max: 160,
    autoComplete: 'organization',
    messages: { required: 'Please enter your business name or website.' },
  },
  {
    name: 'goal',
    label: 'Main goal',
    kind: 'choice',
    required: true,
    max: 40,
    options: goalOptions,
    placeholderOption: 'Choose one',
    messages: {
      required: 'Please choose your main goal.',
      invalid: 'Please choose one of the listed goals.',
    },
  },
  {
    name: 'plan',
    label: 'Plan you’re considering',
    kind: 'choice',
    required: false,
    max: 20,
    options: planOptions,
    defaultValue: unsurePlan,
    messages: { invalid: 'Please choose one of the listed plans, or “Not sure”.' },
  },
  {
    name: 'phone',
    label: 'Phone',
    kind: 'tel',
    required: false,
    max: 32,
    autoComplete: 'tel',
    group: 'details',
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
    group: 'details',
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
    group: 'details',
    messages: { invalid: 'Please choose one of the listed ranges.' },
  },
  {
    name: 'crm',
    label: 'Current CRM',
    kind: 'text',
    required: false,
    max: 120,
    group: 'details',
    messages: {},
  },
  {
    name: 'message',
    label: 'Anything else we should know?',
    kind: 'multiline',
    required: false,
    max: 3000,
    group: 'details',
    messages: {},
  },
]

/** The disclosure that holds every `details` field. */
export const inquiryDetails = { summary: 'Add details (optional)' } as const

/** Shown under the plan picker once a real plan is chosen. */
export const planNote = {
  lead: 'You selected',
  follow: 'We’ll confirm it fits before anything is agreed.',
} as const

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
  tooLong: (max: number) => `Please keep this to ${max.toLocaleString('en-US')} characters or fewer.`,
} as const
