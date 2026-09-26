/**
 * Form fields: labels, limits and messages.
 *
 * Shared by the browser (instant feedback) and the submission endpoint (the
 * check that actually counts), so the two can never disagree.
 */

export type FieldKind = 'text' | 'email' | 'multiline' | 'choice'

export type FieldDefinition = {
  name: string
  label: string
  kind: FieldKind
  required: boolean
  max: number
  autoComplete?: string
  hint?: string
  options?: readonly string[]
  placeholderOption?: string
  messages: { required?: string; invalid?: string }
}

export const revisitOptions = [
  'Missed inquiries',
  'Unanswered quotes',
  'Older leads',
  'A mix of these',
  'I’m not sure yet',
] as const

const name: FieldDefinition = {
  name: 'name',
  label: 'Your name',
  kind: 'text',
  required: true,
  max: 120,
  autoComplete: 'name',
  messages: { required: 'Please enter your name.' },
}

const email: FieldDefinition = {
  name: 'email',
  label: 'Work email',
  kind: 'email',
  required: true,
  max: 254,
  autoComplete: 'email',
  messages: {
    required: 'Please enter your email address.',
    invalid: 'Please enter a complete email address, like name@company.com.',
  },
}

export const demoFields: readonly FieldDefinition[] = [
  name,
  email,
  {
    name: 'company',
    label: 'Company or website',
    kind: 'text',
    required: true,
    max: 200,
    autoComplete: 'organization',
    messages: { required: 'Please enter your company name or website.' },
  },
  {
    name: 'revisit',
    label: 'What would you like to revisit?',
    kind: 'choice',
    required: true,
    max: 60,
    options: revisitOptions,
    placeholderOption: 'Choose one',
    messages: {
      required: 'Please choose what you would like to revisit.',
      invalid: 'Please choose one of the listed options.',
    },
  },
  {
    name: 'notes',
    label: 'Anything else we should know?',
    kind: 'multiline',
    required: false,
    max: 2000,
    hint: 'Optional.',
    messages: {},
  },
]

export const contactFields: readonly FieldDefinition[] = [
  name,
  email,
  {
    name: 'company',
    label: 'Company',
    kind: 'text',
    required: false,
    max: 200,
    autoComplete: 'organization',
    hint: 'Optional.',
    messages: {},
  },
  {
    name: 'message',
    label: 'What would you like to know?',
    kind: 'multiline',
    required: true,
    max: 4000,
    messages: { required: 'Please tell us what you would like to know.' },
  },
]

/** Plain-language status messages. Never expose server details to visitors. */
export const formMessages = {
  invalid: 'Please check the highlighted fields and try again.',
  submitting: 'Sending…',
  success: 'Received. Taking you to the confirmation page…',
  failed: 'Something went wrong, so we could not confirm your request was received. Your details are still here — please try again.',
  // A timeout is not proof of failure, so this message makes no claim either way.
  timeout: 'We did not get a confirmation in time, so we cannot be sure your request arrived. Your details are still here — please try again in a moment.',
  network: 'We could not reach the server. Check your connection and try again. Your details are still here.',
  unavailable: 'Requests are temporarily unavailable. Please try again later.',
  busy: 'Too many attempts in a short time. Please wait a few minutes and try again.',
  /** Shown after a no-JavaScript post is sent back to the form. */
  returned: {
    invalid: 'Some details were missing or not quite right, so nothing was sent. Please check the form and try again.',
    failed: 'Something went wrong, so we could not confirm your request was received. Please try again.',
  },
  tooLong: (max: number) => `Please keep this under ${max.toLocaleString('en-US')} characters.`,
} as const
