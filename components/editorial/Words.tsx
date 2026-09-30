import { Fragment, type CSSProperties } from 'react'

/**
 * A headline split into words so each can rise in on its own beat
 * (motion.css). The words stay ordinary text with ordinary spaces, so the
 * heading reads, wraps and copies exactly as before; with reduced motion
 * nothing moves.
 */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="word" style={{ '--w': start + i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  )
}

/** How many words a line holds, to continue the beat on the next line. */
export const wordCount = (text: string) => text.split(' ').length
