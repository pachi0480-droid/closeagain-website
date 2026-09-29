/**
 * Real customer stories — the strongest thing this site can show, and the one
 * thing it must never make up.
 *
 * Add a story only when it is true, the customer said it (or confirmed the
 * numbers), and they gave you written permission to publish it with their
 * name and business. The homepage shows "From CloseAgain customers" as soon as
 * there is one story; while the list is empty, nothing is shown. A test
 * refuses any story without `permission: true`.
 *
 *   {
 *     business: 'Rivera Roofing',
 *     person: 'Sam Rivera',
 *     role: 'Owner',
 *     quote: 'We went back to 40 old quotes in the first month. Six replied and two booked.',
 *     result: '2 jobs booked from old quotes in month one',
 *     permission: true,
 *   }
 */

export type CustomerStory = {
  business: string
  person: string
  role: string
  /** In the customer's own words. */
  quote: string
  /** A measured result, confirmed with the customer. Optional. */
  result?: string
  /** You have the customer's written permission to publish this. */
  permission: true
}

export const stories: CustomerStory[] = []
