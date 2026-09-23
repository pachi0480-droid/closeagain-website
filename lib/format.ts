const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const plain = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export const formatCurrency = (n: number) => usd.format(Math.round(n))
export const formatNumber = (n: number) => plain.format(Math.round(n))

/** Splits a currency string so the symbol can be set at a smaller size. */
export function splitCurrency(n: number): { symbol: string; amount: string } {
  const formatted = formatCurrency(n)
  return { symbol: formatted.slice(0, 1), amount: formatted.slice(1) }
}

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))
