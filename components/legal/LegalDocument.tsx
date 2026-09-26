import type { LegalDocument as Doc } from '@/content/legal'

/**
 * Legal page layout: a large title, a reading column, numbered sections and
 * (on wide screens) a sticky table of contents.
 *
 * While a document is a placeholder, the page says so at the top and in every
 * section. Placeholder text is never styled to look like real policy.
 */
export function LegalDocument({ doc }: { doc: Doc }) {
  const draft = doc.status !== 'approved'

  return (
    <article className="legal" aria-labelledby="page-title">
      <header className="legal__head wrap">
        <p className="eyebrow">Legal</p>
        <h1 id="page-title" className="legal__title">
          {doc.title}
        </h1>
        {draft ? (
          <p className="legal__notice" role="note">
            <strong>Not yet published.</strong> {doc.notice}
          </p>
        ) : (
          doc.effectiveDate && <p className="legal__date">Effective {doc.effectiveDate}</p>
        )}
      </header>

      <div className="legal__body wrap">
        <nav className="legal__toc" aria-label="Contents">
          <p className="legal__toc-title">Contents</p>
          <ol>
            {doc.sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span className="legal__toc-num">{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal__sections">
          {doc.sections.map((section, i) => (
            <section key={section.id} id={section.id} className="legal__section" aria-labelledby={`${section.id}-h`}>
              <h2 id={`${section.id}-h`} className="legal__h">
                <span className="legal__num">{String(i + 1).padStart(2, '0')}</span>
                {section.heading}
              </h2>
              {section.body.length > 0 ? (
                section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p className="legal__placeholder">
                  Placeholder — approved wording for this section is required before publishing.
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
