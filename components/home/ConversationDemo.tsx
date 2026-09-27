'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownLeft, ArrowRight, Check, CheckCheck, ChevronRight, Clock3, Inbox, MessageCircle, Pause, Play, RotateCcw, ShieldCheck, UsersRound } from 'lucide-react'

type Scenario = 'new' | 'quiet'

const scenarios = {
  new: {
    label: 'New inquiry',
    source: 'Website inquiry',
    opening: 'Hi — could you quote a kitchen remodel? We’re hoping to start this summer.',
    openingTime: 'Monday · 9:12 AM',
    message: 'Thanks for reaching out, Jordan. Are you still looking for help with your kitchen remodel? Happy to talk through the next steps.',
    messageTime: 'An approved follow-up',
    reply: 'Yes! We’re still looking. Could someone give me a call?',
    steps: [
      { label: 'Inquiry arrives', title: 'Interest arrives. Your team is busy.', body: 'Someone has taken the first step. Make sure their inquiry gets an answer, even while your team is focused elsewhere.', status: 'New inquiry' },
      { label: 'Follow-up goes out', title: 'The next message is already handled.', body: 'CloseAgain follows up in wording you approve, on the schedule you choose. One less thing for your team to remember.', status: 'Following up' },
      { label: 'A reply comes back', title: '“Yes” changes the conversation.', body: 'When Jordan replies, the automated follow-up stops. The conversation is ready for a person to take it forward.', status: 'Reply received' },
      { label: 'Your team takes over', title: 'Now it’s your team’s moment.', body: 'Pick up the thread with the context in front of you. Answer the question, arrange the next step and build the relationship.', status: 'With your team' },
    ],
  },
  quiet: {
    label: 'Quiet lead',
    source: 'An earlier inquiry',
    opening: 'Thanks for the information. We’re going to think about the kitchen remodel and get back to you.',
    openingTime: '92 days earlier',
    message: 'Hi Jordan — just checking back. Is the kitchen remodel still on your mind? Happy to pick up where we left off.',
    messageTime: 'Scheduled re-engagement',
    reply: 'Actually, yes. The timing is much better now. Let’s talk.',
    steps: [
      { label: 'A lead goes quiet', title: 'Quiet doesn’t always mean “no.”', body: 'Plans change. People get busy. An earlier inquiry can still be a conversation worth returning to.', status: 'Quiet lead' },
      { label: 'Check back in', title: 'Give the conversation another opening.', body: 'A relevant message goes out on a schedule you approve. The opportunity gets a thoughtful follow-up.', status: 'Re-engaging' },
      { label: 'Interest returns', title: 'This time, the timing is right.', body: 'Jordan replies. CloseAgain stops the automated follow-up and brings the conversation back to your team.', status: 'Reply received' },
      { label: 'Your team takes over', title: 'An old thread. A new next step.', body: 'Your team takes it from here, with the conversation in context. Another chance to understand what the customer needs.', status: 'With your team' },
    ],
  },
} as const

const stepIcons = [Inbox, ArrowDownLeft, MessageCircle, UsersRound]

/** An explicitly controlled, fictional walkthrough. It never starts or loops on its own. */
export function ConversationDemo() {
  const [scenario, setScenario] = useState<Scenario>('new')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const current = scenarios[scenario]
  const active = current.steps[step]

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      const next = Math.min(step + 1, 3)
      setStep(next)
      if (next === 3) setPlaying(false)
    }, 4800)
    return () => window.clearTimeout(timer)
  }, [playing, step])

  useEffect(() => {
    if (!playing) return
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false)
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false)
    })
    const section = sectionRef.current
    if (section) observer.observe(section)
    return () => {
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      observer.disconnect()
    }
  }, [playing])

  function selectScenario(value: Scenario) {
    setScenario(value)
    setStep(0)
    setPlaying(false)
  }

  function selectStep(value: number) {
    setStep(value)
    setPlaying(false)
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false)
    } else {
      if (step === 3) setStep(0)
      else if (step === 0) setStep(1)
      setPlaying(true)
    }
  }

  return (
    <section id="conversation-demo" className="conversation-demo" aria-labelledby="conversation-demo-title" ref={sectionRef}>
      <div className="wrap">
        <header className="conversation-demo__heading">
          <div>
            <p className="eyebrow">A little follow-up. A new possibility.</p>
            <h2 id="conversation-demo-title">See the conversation<br /><em>come back to life.</em></h2>
          </div>
          <p>From the first inquiry to the one that went quiet. See how a well-timed message can open the door again.</p>
        </header>

        <div className="conversation-demo__layout">
          <div className="conversation-demo__story">
            <div className="conversation-demo__scenarios" role="group" aria-label="Choose an illustrative scenario">
              {(Object.keys(scenarios) as Scenario[]).map((value) => (
                <button type="button" key={value} aria-pressed={scenario === value} onClick={() => selectScenario(value)}>
                  {scenarios[value].label}
                </button>
              ))}
            </div>

            <div className="conversation-demo__narrative" key={`${scenario}-${step}`}>
              <p className="conversation-demo__chapter"><span>0{step + 1}</span> / 04</p>
              <h3>{active.title}</h3>
              <p>{active.body}</p>
            </div>

            <ol className="conversation-demo__steps" aria-label="Walkthrough steps">
              {current.steps.map((item, index) => (
                <li key={index}>
                  <button type="button" onClick={() => selectStep(index)} aria-current={step === index ? 'step' : undefined} className={index < step ? 'is-complete' : undefined}>
                    <span className="conversation-demo__step-number" aria-hidden="true">{index < step ? <Check size={13} strokeWidth={2} /> : `0${index + 1}`}</span>
                    <span>{item.label}</span>
                    {step === index && <ArrowRight size={15} aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="conversation-demo__board" aria-label={`${current.label}: illustrative conversation`}>
            <div className="conversation-demo__board-top">
              <div className="conversation-demo__board-brand"><span aria-hidden="true">c</span> closeagain</div>
              <span className="conversation-demo__sample"><span aria-hidden="true" />Illustrative walkthrough</span>
            </div>

            <div className="conversation-demo__contact">
              <span className="conversation-demo__avatar" aria-hidden="true">JE</span>
              <div><strong>Jordan Ellis</strong><span>Kitchen remodel · {current.source}</span></div>
              <span className={`conversation-demo__status${step >= 2 ? ' conversation-demo__status--positive' : ''}`}><span aria-hidden="true" />{active.status}</span>
            </div>

            <div className="conversation-demo__thread" key={scenario}>
              <p className="conversation-demo__date">{current.openingTime}</p>
              <div className="conversation-demo__message conversation-demo__message--incoming">
                <span>Jordan</span><p>{current.opening}</p>
              </div>

              {step === 0 && (
                <div className="conversation-demo__waiting">
                  <Clock3 size={17} strokeWidth={1.5} aria-hidden="true" />
                  <p>{scenario === 'quiet' ? 'An old thread, waiting for a new opening.' : 'A new opportunity, waiting for a reply.'}</p>
                  <button type="button" onClick={togglePlayback}>Watch what happens <ArrowRight size={15} aria-hidden="true" /></button>
                </div>
              )}

              {step >= 1 && (
                <div className="conversation-demo__message conversation-demo__message--outgoing">
                  <span><ShieldCheck size={13} aria-hidden="true" /> {current.messageTime}</span>
                  <p>{current.message}</p>
                  <small>Sent automatically <CheckCheck size={14} aria-hidden="true" /></small>
                </div>
              )}

              {step >= 2 && (
                <div className="conversation-demo__message conversation-demo__message--incoming conversation-demo__message--reply">
                  <span>Jordan replied</span><p>{current.reply}</p>
                </div>
              )}

              {step >= 2 && (
                <p className="conversation-demo__stopped"><Check size={13} strokeWidth={2} aria-hidden="true" /> Reply received. Automated follow-up stopped.</p>
              )}

              {step === 3 && (
                <div className="conversation-demo__handoff">
                  <span className="conversation-demo__handoff-icon"><UsersRound size={21} strokeWidth={1.5} aria-hidden="true" /></span>
                  <div><strong>Your team takes it from here.</strong><span>A real conversation. A clear next step.</span></div>
                  <ArrowRight size={20} aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="conversation-demo__timeline" aria-hidden="true">
              {stepIcons.map((Icon, index) => <span key={index} className={step >= index ? 'is-active' : undefined}><Icon size={14} strokeWidth={1.7} /><i /></span>)}
            </div>

            <div className="conversation-demo__controls">
              <span className="conversation-demo__count">Step 0{step + 1} <span>of 04</span></span>
              <div>
                <button type="button" className="conversation-demo__play" onClick={togglePlayback} aria-label={playing ? 'Pause walkthrough' : step === 3 ? 'Replay walkthrough' : 'Play walkthrough'}>
                  {playing ? <Pause size={13} aria-hidden="true" /> : step === 3 ? <RotateCcw size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                  {playing ? 'Pause' : step === 3 ? 'Replay' : 'Play'}
                </button>
                <button type="button" className="conversation-demo__next" onClick={() => selectStep(step === 3 ? 0 : step + 1)} aria-label={step === 3 ? 'Back to the first step' : 'Show the next step'}>
                  {step === 3 ? 'Start again' : 'Next step'} <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{current.label}. Step {step + 1} of 4. {active.title} {active.status}.</p>
        <div className="conversation-demo__footnote">
          <p>Fictional lead, messages and timing. An illustration of the workflow, not a customer result.</p>
          <span><ShieldCheck size={15} aria-hidden="true" /> Your wording. Your schedule. Your relationships.</span>
        </div>
        <noscript><p className="conversation-demo__nojs">CloseAgain sends follow-ups in wording you approve, stops when a lead replies and hands the conversation to your team. Enable JavaScript to explore both illustrative conversations step by step.</p></noscript>
      </div>
    </section>
  )
}
