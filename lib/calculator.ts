/**
 * Revenue recovery model.
 *
 * Deliberately simple and fully visible to the user: four inputs, one
 * multiplication. No hidden benchmark, no industry average, no assumption the
 * operator cannot see and change.
 *
 *   opportunities x leakage rate x recovery rate x average job value
 */

import { clamp } from './format'

export type CalculatorInputs = {
  /** Inbound opportunities per month: calls, forms, chats, referrals. */
  opportunities: number
  /** Percentage that go unanswered, unbooked or cold. */
  leakageRate: number
  /** Percentage of those you assume are recoverable. */
  recoveryRate: number
  /** Average value of a booked job. */
  jobValue: number
}

export const bounds = {
  opportunities: { min: 20, max: 2000, step: 10 },
  leakageRate: { min: 1, max: 60, step: 1 },
  recoveryRate: { min: 1, max: 60, step: 1 },
  jobValue: { min: 150, max: 25000, step: 10 },
} as const

export const defaultInputs: CalculatorInputs = {
  opportunities: 320,
  leakageRate: 22,
  recoveryRate: 25,
  jobValue: 680,
}

export type CalculatorResult = {
  leakedPerMonth: number
  recoveredPerMonth: number
  monthlyValue: number
  annualValue: number
}

export function sanitise(inputs: CalculatorInputs): CalculatorInputs {
  return {
    opportunities: Math.round(
      clamp(inputs.opportunities, bounds.opportunities.min, bounds.opportunities.max),
    ),
    leakageRate: Math.round(
      clamp(inputs.leakageRate, bounds.leakageRate.min, bounds.leakageRate.max),
    ),
    recoveryRate: Math.round(
      clamp(inputs.recoveryRate, bounds.recoveryRate.min, bounds.recoveryRate.max),
    ),
    jobValue: Math.round(clamp(inputs.jobValue, bounds.jobValue.min, bounds.jobValue.max)),
  }
}

export function calculate(raw: CalculatorInputs): CalculatorResult {
  const i = sanitise(raw)
  const leakedPerMonth = i.opportunities * (i.leakageRate / 100)
  const recoveredPerMonth = leakedPerMonth * (i.recoveryRate / 100)
  const monthlyValue = recoveredPerMonth * i.jobValue

  return {
    leakedPerMonth,
    recoveredPerMonth,
    monthlyValue,
    annualValue: monthlyValue * 12,
  }
}
