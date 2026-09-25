/**
 * Chapter seven: industries, and what CloseAgain is next to.
 */

export type Industry = {
  id: string
  name: string
  scenario: {
    newDemand: string
    atRisk: string
    recoverable: string
  }
}

export const industries: Industry[] = [
  {
    id: 'hvac',
    name: 'HVAC',
    scenario: {
      newDemand: '“No cooling” website inquiry',
      atRisk: 'Missed after-hours call',
      recoverable: 'Replacement estimate quiet 4 days',
    },
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    scenario: {
      newDemand: 'Leaking water heater, local search',
      atRisk: 'Call during a job, never returned',
      recoverable: 'Repipe quote quiet 7 days',
    },
  },
  {
    id: 'electrical',
    name: 'Electrical',
    scenario: {
      newDemand: 'Panel upgrade request',
      atRisk: 'Estimate opened, no reply',
      recoverable: 'Generator quote quiet 12 days',
    },
  },
  {
    id: 'roofing',
    name: 'Roofing',
    scenario: {
      newDemand: 'Storm inspection request',
      atRisk: 'Quote not reviewed',
      recoverable: 'Replacement estimate quiet 8 days',
    },
  },
  {
    id: 'restoration',
    name: 'Restoration',
    scenario: {
      newDemand: 'Water damage, 2:41 AM call',
      atRisk: 'Adjuster waiting on scope',
      recoverable: 'Mitigation job never scheduled',
    },
  },
  {
    id: 'remodeling',
    name: 'Remodeling',
    scenario: {
      newDemand: 'Kitchen consultation request',
      atRisk: 'Design appointment no-show',
      recoverable: 'Proposal quiet 3 weeks',
    },
  },
  {
    id: 'windows',
    name: 'Windows & doors',
    scenario: {
      newDemand: 'Whole-home quote request',
      atRisk: 'In-home appointment missed',
      recoverable: 'Estimate quiet 10 days',
    },
  },
  {
    id: 'garage',
    name: 'Garage doors',
    scenario: {
      newDemand: 'Door will not open, urgent',
      atRisk: 'Overflow call unanswered',
      recoverable: 'Opener upgrade quote dropped',
    },
  },
  {
    id: 'pest',
    name: 'Pest control',
    scenario: {
      newDemand: 'Termite inspection request',
      atRisk: 'Quote sent, no response',
      recoverable: 'Lapsed quarterly plan',
    },
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    scenario: {
      newDemand: 'Full yard redesign inquiry',
      atRisk: 'Walkthrough never booked',
      recoverable: 'Hardscape estimate quiet 2 weeks',
    },
  },
  {
    id: 'pool',
    name: 'Pool services',
    scenario: {
      newDemand: 'Resurfacing quote request',
      atRisk: 'Seasonal call missed',
      recoverable: 'Equipment quote quiet 9 days',
    },
  },
]

export const otherIndustries =
  'And other estimate-driven home services where the job is quoted before it is booked.'

/** One concise comparison. Each row is what that category actually does. */
export const difference = [
  {
    category: 'Lead-generation agency',
    does: 'Creates awareness and inquiries.',
  },
  {
    category: 'CRM or field-service platform',
    does: 'Stores records and manages operations.',
  },
  { category: 'Answering service', does: 'Handles the first conversation.' },
  { category: 'Basic automation', does: 'Runs isolated triggers.' },
]

export const closeAgainRow = {
  category: 'CloseAgain',
  does: 'Connects demand, conversion, recovery, and booked outcomes.',
} as const

export const compatibility =
  'Designed to work beside the systems, lead sources, phones, calendars, and customer data your team already uses.'
