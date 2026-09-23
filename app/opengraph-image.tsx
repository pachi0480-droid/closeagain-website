import { ImageResponse } from 'next/og'

export const alt = 'CloseAgain — Revenue Recovery for Home Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
          backgroundColor: '#0D0F0E',
          padding: '72px 80px',
          color: '#EDEAE4',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.31 8.07A6.6 6.6 0 1 1 11.93 3.69"
              stroke="#7FB99B"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <circle cx="16.29" cy="3.71" r="1.75" fill="#7FB99B" />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: '-0.03em' }}>CloseAgain</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 19,
              letterSpacing: '0.16em',
              color: '#74776F',
              textTransform: 'uppercase',
            }}
          >
            Revenue recovery for home services
          </span>
          <span
            style={{
              marginTop: 26,
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              maxWidth: 940,
            }}
          >
            Recover the leads you already paid for.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 300, height: 1, backgroundColor: '#7FB99B' }} />
          <span style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: '#7FB99B' }} />
        </div>
      </div>
    ),
    size,
  )
}
