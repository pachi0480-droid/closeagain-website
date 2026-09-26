import type { ReactNode } from 'react'
import { Ribbon } from '@/components/art/Ribbon'
import { formSweep } from '@/components/art/ribbons'

/**
 * Split layout shared by the contact and demo pages: copy and ribbon on the
 * left, the form on the right. Stacks copy-first on small screens.
 */
export function FormPage({
  id,
  eyebrow,
  title,
  lede,
  aside,
  form,
}: {
  id: string
  eyebrow: string
  title: string
  lede: string
  aside?: ReactNode
  form: ReactNode
}) {
  return (
    <section className="form-page" aria-labelledby="page-title">
      <div className="form-page__inner wrap">
        <div className="form-page__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="form-page__title">
            {title}
          </h1>
          <p className="form-page__lede">{lede}</p>
          {aside}
          <Ribbon
            id={`${id}-sweep`}
            className="form-page__ribbon"
            viewBox={formSweep.viewBox}
            spec={formSweep.spec}
            preserveAspectRatio="xMaxYMid meet"
            draw="scroll"
          />
        </div>
        <div className="form-page__form">{form}</div>
      </div>
    </section>
  )
}
