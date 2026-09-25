/**
 * The growth-gap model.
 *
 * Deliberately simple and fully visible to the operator: six inputs, plain
 * multiplication, no hidden benchmark and no industry average. Every figure
 * on screen can be reproduced by hand from the inputs shown beside it.
 *
 *   opportunity value = leads x job value
 *   booked            = leads x booking rate x job value
 *   unbooked          = opportunity value - booked
 *   follow-up gap     = unbooked demand receiving no consistent follow-up
 *   conversion upside = follow-up gap x recovery rate
 *   new-demand upside = added leads x booking rate x job value
 *
 * The last two are kept apart on purpose: the point of the calculator is to
 * show an operator whether buying more demand or working the demand they
 * already have is the larger number for them.
 */

import { clamp } from './format'

export type CalculatorInputs = {
  /** Inbound opportunities per month: calls, forms, chats, referrals. */
  leadsPerMonth: number
  /** Average value of a booked job. */
  jobValue: number
  /** Percentage of opportunities that become booked work today. */
  bookingRate: number
  /** Percentage of opportunities that receive consistent follow-up today. */
  followUpRate: number
  /** Additional opportunities per month from new demand work. */
  additionalLeads: number
  /** Percentage of the follow-up gap assumed to be recoverable. */
  recoveryRate: number
}

export const bounds = {
  leadsPerMonth: { min: 20, max: 2000, step: 10 },
  jobValue: { min: 150, max: 25000, step: 10 },
  bookingRate: { min: 5, max: 90, step: 1 },
  followUpRate: { min: 0, max: 100, step: 1 },
  additionalLeads: { min: 0, max: 600, step: 5 },
  recoveryRate: { min: 1, max: 50, step: 1 },
} as const

export const defaultInputs: CalculatorInputs = {
  leadsPerMonth: 320,
  jobValue: 680,
  bookingRate: 38,
  followUpRate: 35,
  additionalLeads: 60,
  recoveryRate: 22,
}

export type CalculatorResult = {
  /** Every opportunity in play, at the operator's own job value. */
  opportunityValue: number
  /** What is booked today. */
  bookedValue: number
  bookedJobs: number
  /** What is not booked today. */
  unbookedValue: number
  unbookedJobs: number
  /** Unbooked demand that receives no consistent follow-up. */
  followUpGapValue: number
  followUpGapJobs: number
  /** Upside from working the demand already there. */
  conversionUpside: number
  conversionJobs: number
  /** Upside from adding demand, at today's booking rate. */
  newDemandUpside: number
  newDemandJobs: number
  /** Both together. */
  totalUpside: number
  /** Booked today plus both upsides. */
  projectedValue: number
  /** Which motion is larger for these inputs. */
  larger: 'conversion' | 'newDemand' | 'even'
}

export function sanitise(inputs: CalculatorInputs): CalculatorInputs {
  const round = <K extends keyof CalculatorInputs>(key: K) =>
    Math.round(clamp(inputs[key], bounds[key].min, bounds[key].max))

  return {
    leadsPerMonth: round('leadsPerMonth'),
    jobValue: round('jobValue'),
    bookingRate: round('bookingRate'),
    followUpRate: round('followUpRate'),
    additionalLeads: round('additionalLeads'),
    recoveryRate: round('recoveryRate'),
  }
}

export function calculate(raw: CalculatorInputs): CalculatorResult {
  const i = sanitise(raw)

  const opportunityValue = i.leadsPerMonth * i.jobValue

  const bookedJobs = i.leadsPerMonth * (i.bookingRate / 100)
  const bookedValue = bookedJobs * i.jobValue

  const unbookedJobs = i.leadsPerMonth - bookedJobs
  const unbookedValue = unbookedJobs * i.jobValue

  // The gap is the unbooked demand nobody is consistently working.
  const followUpGapJobs = unbookedJobs * (1 - i.followUpRate / 100)
  const followUpGapValue = followUpGapJobs * i.jobValue

  const conversionJobs = followUpGapJobs * (i.recoveryRate / 100)
  const conversionUpside = conversionJobs * i.jobValue

  const newDemandJobs = i.additionalLeads * (i.bookingRate / 100)
  const newDemandUpside = newDemandJobs * i.jobValue

  const totalUpside = conversionUpside + newDemandUpside

  // "Even" only when the two are within a percent of each other, so the
  // comparison does not flip on a rounding difference nobody can see.
  const spread = Math.abs(conversionUpside - newDemandUpside)
  const scale = Math.max(conversionUpside, newDemandUpside, 1)
  const larger =
    spread / scale < 0.01
      ? 'even'
      : conversionUpside > newDemandUpside
        ? 'conversion'
        : 'newDemand'

  return {
    opportunityValue,
    bookedValue,
    bookedJobs,
    unbookedValue,
    unbookedJobs,
    followUpGapValue,
    followUpGapJobs,
    conversionUpside,
    conversionJobs,
    newDemandUpside,
    newDemandJobs,
    totalUpside,
    projectedValue: bookedValue + totalUpside,
    larger,
  }
}

/**
 * The same arithmetic across a range of recovery rates. Nobody knows their
 * recovery rate in advance, and defending a single number would be dishonest.
 */
export function sensitivity(
  inputs: CalculatorInputs,
  rates: number[] = [10, 15, 20, 25, 30, 35],
) {
  return rates.map((recoveryRate) => ({
    recoveryRate,
    ...calculate({ ...inputs, recoveryRate }),
  }))
}
