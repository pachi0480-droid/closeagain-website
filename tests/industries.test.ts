/**
 * Industry landing pages: one per industry on “Who it’s for”, each able to
 * pre-select its industry on the buying form, and each honest — no numbers,
 * no results, sample wording only. Run with `npm test`.
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { includedOn, industries, industryById, industryBySlug, industryPage } from '../content/industries.ts'
import { industryOptions } from '../content/forms.ts'
import { whoItsFor } from '../content/pages.ts'
import { availability } from '../content/pricing.ts'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

/** Every visitor-facing sentence an industry page carries. */
const pageWords = (industry: (typeof industries)[number]) => [
  industry.title,
  industry.description,
  industry.lede,
  industry.leaksTitle,
  ...industry.leaks.flatMap((leak) => [leak.title, leak.body, leak.fix]),
  ...industry.examples.flatMap((example) => [example.moment, example.message, example.reply ?? '']),
  industry.preview.title,
  industry.preview.body,
  industry.closingTitle,
]

describe('industry pages', () => {
  it('cover every industry on the overview, in the same order', () => {
    assert.deepEqual(
      industries.map((industry) => industry.id),
      whoItsFor.industries.map((industry) => industry.id),
    )
    assert.equal(industries.length, 8)
  })

  it('each have a unique, kebab-case slug under /who-its-for', () => {
    const slugs = industries.map((industry) => industry.slug)
    assert.equal(new Set(slugs).size, slugs.length, `duplicate slugs: ${slugs.join(', ')}`)
    for (const industry of industries) {
      assert.match(industry.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, industry.slug)
      assert.equal(industry.path, `/who-its-for/${industry.slug}`)
      assert.equal(industryBySlug(industry.slug), industry)
    }
    assert.equal(industryBySlug('no-such-industry'), undefined)
  })

  it('pre-select an existing option on the contact form', () => {
    const values = industryOptions.map((option) => option.value)
    for (const industry of industries) {
      assert.ok(values.includes(industry.industryValue), `${industry.name}: “${industry.industryValue}” is not a form option`)
      const query = new URL(industry.contactHref, 'https://example.com')
      assert.equal(query.pathname, '/contact')
      assert.equal(query.searchParams.get('industry'), industry.industryValue)
    }
  })

  it('each have a title and a search-length description', () => {
    for (const industry of industries) {
      assert.equal(industry.title, `${industryPage.titleLead} for ${industry.audience}`)
      assert.ok(industry.description.length >= 100 && industry.description.length <= 170, `${industry.name}: description is ${industry.description.length} characters`)
      assert.ok(industry.lede.length > 60, `${industry.name} needs a lede`)
      assert.ok(industry.leaksTitle.length > 0 && industry.closingTitle.length > 0)
    }
    const titles = industries.map((industry) => industry.title)
    const descriptions = industries.map((industry) => industry.description)
    assert.equal(new Set(titles).size, titles.length, 'titles must be unique')
    assert.equal(new Set(descriptions).size, descriptions.length, 'descriptions must be unique')
  })

  it('each name three places leads slip, with the plans that cover the fix', () => {
    for (const industry of industries) {
      assert.equal(industry.leaks.length, 3, `${industry.name} needs three leaks`)
      for (const leak of industry.leaks) {
        assert.ok(leak.title && leak.body && leak.fix, `${industry.name}: every leak needs a title, body and fix`)
        assert.doesNotThrow(() => availability(leak.row), `${industry.name}: no comparison row “${leak.row}”`)
      }
      assert.doesNotThrow(() => availability(industry.preview.row), `${industry.name}: no comparison row “${industry.preview.row}”`)
    }
    assert.equal(includedOn('Old lead re-engagement'), 'every plan')
    assert.equal(includedOn('Appointment workflows'), 'Growth and up')
  })

  it('each show at least two sample messages', () => {
    for (const industry of industries) {
      assert.ok(industry.examples.length >= 2, `${industry.name} needs at least two examples`)
      for (const example of industry.examples) {
        assert.ok(example.moment && example.message.length > 30, `${industry.name}: every example needs a moment and a message`)
        assert.doesNotMatch(example.message, /https?:|www\.|@/, `${industry.name}: sample messages carry no links or addresses`)
      }
    }
    assert.match(industryPage.examples.note, /^Sample wording with fictional people\./)
  })

  it('link to other industries that exist', () => {
    for (const industry of industries) {
      assert.ok(industry.related.length >= 2 && industry.related.length <= 3, `${industry.name}: two or three related industries`)
      assert.equal(new Set(industry.related).size, industry.related.length)
      assert.ok(!industry.related.includes(industry.id), `${industry.name} links to itself`)
      for (const id of industry.related) assert.doesNotThrow(() => industryById(id))
    }
  })
})

describe('industry pages stay honest', () => {
  it('state no numbers — no results, rates, counts or response times', () => {
    for (const industry of industries) {
      for (const text of pageWords(industry)) assert.doesNotMatch(text, /\d/, `${industry.name}: “${text}”`)
    }
  })

  it('make no testimonial, award or guarantee claims', () => {
    const claims = /testimonial|award|trusted by|customers (say|love)|guarantee|best[- ]in|number one|#1|leading|proven/i
    for (const industry of industries) {
      for (const text of pageWords(industry)) assert.doesNotMatch(text, claims, `${industry.name}: “${text}”`)
    }
  })

  it('is prerendered for known slugs only', () => {
    const route = read('app/(marketing)/who-its-for/[industry]/page.tsx')
    assert.match(route, /export const dynamicParams = false/)
    assert.match(route, /export function generateStaticParams/)
    assert.match(read('app/sitemap.ts'), /industries\.map\(/)
  })
})
