/**
 * Who's behind CloseAgain.
 *
 * Buyers paying hundreds of dollars a month want to know who they are dealing
 * with. Fill in `founder` and the About page shows a "Who's behind CloseAgain"
 * section; while it is null, nothing is shown. Use your real name, your real
 * role and a real photo (put it in /public, e.g. /public/team/you.jpg, about
 * 800×800). Never a stock photo or an invented person.
 *
 *   export const founder: Founder | null = {
 *     name: 'Your Name',
 *     role: 'Founder',
 *     photo: { src: '/team/you.jpg', alt: 'Your Name' },
 *     story: [
 *       'One or two sentences on why you built CloseAgain.',
 *       'What you do for every customer, in plain words.',
 *     ],
 *   }
 */

export type Founder = {
  name: string
  role: string
  photo?: { src: string; alt: string }
  /** A short paragraph or two, in your own words. */
  story: string[]
}

export const founder: Founder | null = null
