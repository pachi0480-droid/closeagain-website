/**
 * Pricing is stated once and derived everywhere else, plans are compared
 * honestly, and the break-even check only does arithmetic on the visitor's
 * own numbers. Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, it } from 'node:test'
import {
  availability,
  comparison,
  formatPrice,
  planById,
  planSummary,
  plans,
  priceLabel,
  startingMonthly,
  startingPriceText,
} from '../content/pricing.ts'
import { breakEven, parseAmount } from '../lib/breakeven.ts'

const root = join(import.meta.dirname, '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

describe('one source for prices', () => {
  // The demo's sample data (fictional contract values) is the one exception.
  const files = ['app', 'components', 'content', 'lib']
    .flatMap((dir) => sourceFiles(join(root, dir)))
    .map((path) => relative(root, path))
    .filter((path) => path !== 'content/pricing.ts' && !path.startsWith('content/demo/'))

  it('finds files to check', () => {
    assert.ok(files.length > 40, `only ${files.length} files found`)
  })

  it('never types a dollar amount outside content/pricing.ts', () => {
    const offenders = files.filter((path) => /\$\s?\d/.test(readFileSync(join(root, path), 'utf8')))
    assert.deepEqual(offenders, [], `hard-coded dollar amounts in: ${offenders.join(', ')}`)
  })

  it('never repeats a plan price as a bare number outside content/pricing.ts', () => {
    const prices = plans.flatMap((plan) => (plan.monthly === null ? [] : [plan.monthly]))
    const patterns = prices.map((price) => new RegExp(`(?<![\\d.,])(${price}|${price.toLocaleString('en-US')})(?![\\d,])`))
    const offenders = files.filter((path) => {
      const text = readFileSync(join(root, path), 'utf8')
      return patterns.some((pattern) => pattern.test(text))
    })
    assert.deepEqual(offenders, [], `plan prices typed in: ${offenders.join(', ')}`)
  })

  it('derives labels and the starting price from the plan data', () => {
    assert.equal(startingMonthly, Math.min(...plans.flatMap((plan) => (plan.monthly === null ? [] : [plan.monthly]))))
    assert.equal(startingPriceText, `Plans start at ${formatPrice(startingMonthly)}/month`)
    const growth = planById('growth')!
    assert.equal(priceLabel(growth), formatPrice(growth.monthly!))
    assert.equal(planSummary(growth), `Growth — ${formatPrice(growth.monthly!)}/month`)
    assert.equal(planSummary(planById('enterprise')!), 'Enterprise — custom pricing')
  })
})

describe('plans are compared honestly', () => {
  it('gives every plan an audience and a reason to step up', () => {
    for (const plan of plans) {
      assert.ok(plan.bestFor.length > 20, `${plan.name} needs a best-for sentence`)
      assert.ok(plan.step.length > 20, `${plan.name} needs a step-up sentence`)
    }
  })

  it('makes no popularity claims', () => {
    for (const plan of plans) {
      const text = JSON.stringify(plan).toLowerCase()
      assert.ok(!/popular|best[- ]?seller|most (chosen|loved)/.test(text), `${plan.name} makes a popularity claim`)
      if (plan.recommendation) assert.ok(plan.recommendation.basis.length > 20, 'a recommendation must say why')
    }
  })

  it('never lists an included benefit again as an upgrade', () => {
    const tiers = plans.filter((plan) => plan.id !== 'enterprise')
    for (let i = 1; i < tiers.length; i++) {
      const below = new Set(tiers.slice(0, i).flatMap((plan) => plan.features))
      const repeated = tiers[i].features.filter((feature) => below.has(feature))
      assert.deepEqual(repeated, [], `${tiers[i].name} repeats ${repeated.join(', ')}`)
    }
  })

  it('fills every comparison cell for every plan', () => {
    for (const row of comparison.flatMap((group) => group.rows)) {
      for (const plan of plans) assert.ok(plan.id in row.values, `${row.label} has no value for ${plan.name}`)
    }
  })

  it('derives plan availability from the comparison', () => {
    assert.equal(availability('New inquiry capture').summary, 'Every plan')
    assert.equal(availability('Appointment workflows').summary, 'Growth and up')
    assert.equal(availability('Multi-user collaboration').summary, 'Scale and up')
    assert.equal(availability('Multi-location support').summary, 'Enterprise')
    assert.deepEqual(availability('Reporting level').levels, [
      'Core: basic',
      'Growth: advanced analytics',
      'Scale: advanced reporting',
      'Enterprise: custom reporting',
    ])
    assert.throws(() => availability('No such row'))
  })
})

describe('break-even check', () => {
  it('reads amounts the way people type them', () => {
    assert.equal(parseAmount('1,200'), 1200)
    assert.equal(parseAmount('$950.50'), 950.5)
    assert.equal(parseAmount(' 899 '), 899)
    assert.equal(parseAmount(''), null)
    assert.equal(parseAmount('-5'), null)
    assert.equal(parseAmount('12a'), null)
    assert.equal(parseAmount('1.234'), null)
  })

  it('rounds up to whole customers', () => {
    assert.deepEqual(breakEven({ price: '499', other: '', profit: '300' }), { status: 'ok', customers: 2, totalCost: 499 })
    assert.deepEqual(breakEven({ price: '900', other: '', profit: '300' }), { status: 'ok', customers: 3, totalCost: 900 })
    assert.deepEqual(breakEven({ price: '899', other: '101', profit: '2,000' }), {
      status: 'ok',
      customers: 1,
      totalCost: 1000,
    })
  })

  it('shows nothing it cannot compute', () => {
    assert.deepEqual(breakEven({ price: '499', other: '', profit: '' }), { status: 'incomplete' })
    assert.deepEqual(breakEven({ price: '', other: '', profit: '300' }), { status: 'incomplete' })
    assert.deepEqual(breakEven({ price: '499', other: '', profit: '0' }), { status: 'invalid', field: 'profit' })
    assert.deepEqual(breakEven({ price: '499', other: 'lots', profit: '300' }), { status: 'invalid', field: 'other' })
    assert.deepEqual(breakEven({ price: 'abc', other: '', profit: '300' }), { status: 'invalid', field: 'price' })
  })
})
