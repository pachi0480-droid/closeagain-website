import { Arrow } from '@/components/ui/links'
import { contact } from '@/content/contact'
import { planSummary, type Plan } from '@/content/pricing'

/** A genuine contact route that works before a form delivery service is connected. */
export function DirectEmailCard({ plan, industry }: { plan?: Plan; industry?: string }) {
  const copy = contact.email
  const subject = plan ? `CloseAgain — ${plan.name} inquiry` : copy.subject
  const body = `${copy.draft}${plan ? `\nPlan I’m considering: ${planSummary(plan)}\n` : ''}${industry ? `\nIndustry: ${industry}\n` : ''}`
  const href = `mailto:${copy.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <section className="contact-email" aria-labelledby="contact-email-title">
      <div className="contact-email__top">
        <p className="eyebrow">{copy.eyebrow}</p>
        <svg className="contact-email__icon" width="32" height="26" viewBox="0 0 32 26" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="30" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="m2 3 14 11L30 3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <h2 id="contact-email-title" className="contact-email__title">{copy.title}</h2>
      <p className="contact-email__intro">{copy.intro}</p>
      <a className="contact-email__address" href={`mailto:${copy.address}`}>{copy.address}</a>

      {plan && (
        <p className="contact-email__plan">
          <span>You’re exploring</span>
          <strong>{planSummary(plan)}</strong>
        </p>
      )}

      <ul className="contact-email__prompts">
        {copy.prompts.map((prompt, index) => (
          <li key={prompt}>
            <span aria-hidden="true">0{index + 1}</span>
            {prompt}
          </li>
        ))}
      </ul>
      <a className="btn btn--lg contact-email__button" href={href}>
        <span>{copy.cta}</span>
        <Arrow />
      </a>
      <p className="contact-email__note">{copy.note}</p>
      <p className="contact-email__alternative">{copy.alternative}</p>
    </section>
  )
}
