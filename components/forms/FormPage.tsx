import type { ReactNode } from 'react'

/**
 * Split layout for a page built around a form. Reading order is intro, form,
 * then the supporting detail, so on a phone the form arrives right after the
 * introduction instead of below the fold. From 960px the intro and detail
 * share the left column and the form sits on the right.
 * The intro is a size container, so the title is sized to its column.
 */
export function FormPage({
  eyebrow,
  title,
  lede,
  aside,
  form,
  className,
}: {
  eyebrow: string
  title: string
  lede: string
  aside?: ReactNode
  form: ReactNode
  className?: string
}) {
  return (
    <section className={['form-page', className].filter(Boolean).join(' ')} aria-labelledby="page-title">
      <div className="form-page__inner wrap">
        <div className="form-page__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="form-page__title">
            {title}
          </h1>
          <p className="form-page__lede">{lede}</p>
        </div>
        <div className="form-page__form">{form}</div>
        {aside && (
          <div className="form-page__aside">
            {aside}
          </div>
        )}
      </div>
    </section>
  )
}
