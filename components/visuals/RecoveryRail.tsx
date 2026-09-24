'use client'

import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { heroWaypoints } from '@/data/scenarios'

const stateDot: Record<string, string> = {
  neutral: 'bg-graphite-3',
  lost: 'bg-dormant',
  engaged: 'bg-engaged',
  recovered: 'bg-recover',
}

const stateText: Record<string, string> = {
  neutral: 'text-graphite-3',
  lost: 'text-dormant',
  engaged: 'text-engaged',
  recovered: 'text-recover',
}

/**
 * The full-bleed rail an opportunity travels across the hero.
 *
 * The rail carries a physical break between Missed and Engaged. Until
 * CloseAgain intervenes the path simply stops there; when it does, the gap is
 * bridged in recovery green and the marker continues to Booked. This is the
 * site's central claim rendered as one line.
 */
export function RecoveryRail({ waypoint }: { waypoint: number }) {
  const reached = heroWaypoints[waypoint]
  const bridged = waypoint >= 2
  const recovered = waypoint >= 3

  return (
    <div aria-hidden="true" className="relative">
      {/* the rail */}
      <div className="relative h-px">
        <div className="rail-sheen absolute inset-0" />

        {/* travelled portion */}
        <div
          className="absolute inset-y-0 left-0 origin-left transition-[width] duration-[1150ms] [transition-timing-function:var(--ease-in-out-quiet)]"
          style={{
            width: `${reached.at}%`,
            backgroundImage: recovered
              ? 'linear-gradient(to right, transparent, var(--color-graphite)/0.35 20%, var(--color-recover) 100%)'
              : 'linear-gradient(to right, transparent, rgba(18,21,19,0.35) 25%, rgba(18,21,19,0.45))',
          }}
        />

        {/* the break, and the bridge across it */}
        <div className="absolute inset-y-0" style={{ left: '33%', width: '28%' }}>
          <div
            className="absolute inset-0 bg-paper transition-opacity duration-700"
            style={{ opacity: bridged ? 0 : 1 }}
          />
          <div
            className="absolute inset-0 origin-left bg-recover/70 transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-quiet)]"
            style={{ transform: `scaleX(${bridged ? 1 : 0})` }}
          />
        </div>

        {/* waypoint nodes */}
        {heroWaypoints.map((point, i) => (
          <span
            key={point.label}
            className={`absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-[4px] ring-paper transition-colors duration-700 ${
              i <= waypoint ? stateDot[point.state] : 'bg-graphite/15'
            }`}
            style={{ left: `${point.at}%` }}
          />
        ))}

        {/* the opportunity, travelling */}
        <span
          className="travel absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${reached.at}%` }}
        >
          <span className="relative block">
            <RecoveryPulse fire={recovered} />
            <span
              className={`relative block h-3 w-3 rounded-full ring-1 ring-paper transition-colors duration-700 ${
                recovered
                  ? 'bg-recover'
                  : waypoint >= 2
                    ? 'bg-engaged'
                    : waypoint >= 1
                      ? 'bg-dormant'
                      : 'bg-graphite-2'
              }`}
            />
          </span>
        </span>
      </div>

      {/* waypoint labels, on the rail's own positions */}
      <div className="relative mt-5 h-10">
        {heroWaypoints.map((point, i) => {
          const active = i <= waypoint
          const last = i === heroWaypoints.length - 1
          return (
            <span
              key={point.label}
              className="absolute flex flex-col gap-1 transition-opacity duration-700"
              style={{
                left: `${point.at}%`,
                transform: last ? 'translateX(-100%)' : i === 0 ? 'none' : 'translateX(-50%)',
                opacity: active ? 1 : 0.32,
              }}
            >
              <span
                className={`tnum font-mono text-mono-xs whitespace-nowrap uppercase transition-colors duration-700 ${
                  active ? stateText[point.state] : 'text-graphite-3'
                }`}
              >
                {point.label}
              </span>
              <span className="tnum font-mono text-[0.625rem] whitespace-nowrap text-graphite-3/70">
                {point.time}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
