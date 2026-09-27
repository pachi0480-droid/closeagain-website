import type { ReactNode } from 'react'
import { Ribbon } from '@/components/art/Ribbon'
import { formSweep } from '@/components/art/ribbons'

/**
 * Split layout for a page built around a form. Reading order is intro, form,
 * then the supporting detail, so on a phone the form arrives right after the
 * introduction instead of below the fold. From 960px the intro and detail
 * share the left column (with the ribbon) and the form sits on the right.
 * The intro is a size container, so the title is sized to its column.
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
  const ribbon = (
    <Ribbon
      id={`${id}-sweep`}
      className="form-page__ribbon"
      viewBox={formSweep.viewBox}
      spec={formSweep.spec}
      preserveAspectRatio="xMaxYMid meet"
      draw="scroll"
    />
  )
  return (
    <section className="form-page" aria-labelledby="page-title">
      <div className="form-page__inner wrap">
        <div className="form-page__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="form-page__title">
            {title}
          </h1>
          <p className="form-page__lede">{lede}</p>
          {!aside && ribbon}
        </div>
        <div className="form-page__form">{form}</div>
        {aside && (
          <div className="form-page__aside">
            {aside}
            {ribbon}
          </div>
        )}
      </div>
    </section>
  )
}
