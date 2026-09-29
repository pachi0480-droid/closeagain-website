import { stories } from '@/content/proof'

/**
 * From CloseAgain customers: real stories, published with permission. Renders
 * nothing until content/proof.ts has one.
 */
export function Proof() {
  if (stories.length === 0) return null
  return (
    <section className="section proof" aria-labelledby="proof-title">
      <div className="wrap">
        <p className="eyebrow">From CloseAgain customers</p>
        <h2 id="proof-title" className="section__title proof__title">
          What changed for them.
        </h2>
        <ul className="proof__list">
          {stories.map((story) => (
            <li key={`${story.business}-${story.person}`} className="proof__item" data-reveal>
              <figure className="proof__figure">
                {story.result && <p className="proof__result">{story.result}</p>}
                <blockquote className="proof__quote">
                  <p>“{story.quote}”</p>
                </blockquote>
                <figcaption className="proof__who">
                  <span className="proof__person">{story.person}</span>
                  <span className="proof__meta">
                    {story.role}, {story.business}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
