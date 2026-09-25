import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'CloseAgain — Turn demand into booked jobs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The share card.
 *
 * The background is the Signal Room's own atmosphere — a low horizon, a
 * receding grid and one bright node with its filaments running out to the
 * right. Every word on the card is drawn here, as real text, over it.
 */
const background = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), 'app', 'og-background.jpg'),
).toString('base64')}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#080A09',
          backgroundImage: `url(${background})`,
          backgroundSize: '1200px 630px',
          padding: '68px 76px',
          color: '#F4F1E9',
        }}
      >
        {/* the lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <svg width="37" height="26" viewBox="0 0 26 18" fill="none">
            <g
              stroke="#B7FF6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 13H8" />
              <path d="M8 13L13 5" />
              <path d="M13 5H18" />
            </g>
            <circle cx="22" cy="5" r="2.4" fill="#B7FF6A" />
          </svg>
          <span style={{ fontSize: 31, letterSpacing: '-0.03em', fontWeight: 600 }}>
            CloseAgain
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 18,
              letterSpacing: '0.17em',
              color: '#9BA39D',
              textTransform: 'uppercase',
            }}
          >
            Demand-to-revenue infrastructure for home services
          </span>
          <span
            style={{
              marginTop: 24,
              fontSize: 86,
              lineHeight: 1.0,
              letterSpacing: '-0.045em',
              fontWeight: 600,
              textTransform: 'uppercase',
              maxWidth: 900,
            }}
          >
            Turn demand into booked jobs.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              backgroundColor: '#B7FF6A',
            }}
          />
          <span style={{ fontSize: 22, color: '#9BA39D' }}>
            Every opportunity gets a next action.
          </span>
        </div>
      </div>
    ),
    size,
  )
}
