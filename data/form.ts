/** Field options for the early-access form. */

export const trades = ['HVAC', 'Plumbing', 'Electrical', 'Multi-trade', 'Other'] as const

export const teamSizes = [
  '1–5 people',
  '6–15 people',
  '16–40 people',
  '40+ people',
] as const

export const leadVolumes = [
  'Under 100 / month',
  '100–300 / month',
  '300–750 / month',
  '750+ / month',
  'Not sure',
] as const

export const leakSources = [
  'Missed calls',
  'Slow lead response',
  'Estimate follow-up',
  'No-shows',
  'Old leads',
  'Not sure yet',
] as const
