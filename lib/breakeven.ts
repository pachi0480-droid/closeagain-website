/**
 * Break-even arithmetic for the pricing page. Deliberately simple, and only
 * ever fed numbers the visitor typed: there are no defaults, conversion rates
 * or assumed results anywhere in it.
 *
 *   additional customers needed = total monthly cost ÷ gross profit per
 *   additional customer, rounded up
 */

/** Parses “1,200”, “950.50”, “ 900 ” (with or without a leading dollar sign) into a number; anything else is null. */
export function parseAmount(input: string): number | null {
  const cleaned = input.trim().replace(/^\$/, '').replace(/,/g, '')
  if (cleaned === '') return null
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

export type BreakEven =
  | { status: 'ok'; customers: number; totalCost: number }
  | { status: 'incomplete' }
  | { status: 'invalid'; field: 'price' | 'other' | 'profit' }

export function breakEven({ price, other, profit }: { price: string; other: string; profit: string }): BreakEven {
  const planCost = parseAmount(price)
  const otherCost = other.trim() === '' ? 0 : parseAmount(other)
  const perCustomer = parseAmount(profit)

  if (price.trim() !== '' && planCost === null) return { status: 'invalid', field: 'price' }
  if (otherCost === null) return { status: 'invalid', field: 'other' }
  if (profit.trim() !== '' && (perCustomer === null || perCustomer === 0)) return { status: 'invalid', field: 'profit' }
  if (planCost === null || perCustomer === null) return { status: 'incomplete' }

  const totalCost = planCost + otherCost
  // Rounded to cents first, so 900 ÷ 300 is exactly 3, not 3.0000000001.
  const customers = Math.ceil(Math.round((totalCost / perCustomer) * 100) / 100)
  return { status: 'ok', customers, totalCost }
}
