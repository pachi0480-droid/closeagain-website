/**
 * Marks conceptual product views. CloseAgain is pre-launch: nothing on this
 * site may read as a screenshot of live customer activity.
 */
export function Illustrative({
  children = 'Illustrative product flow',
  tone = 'light',
  className = '',
}: {
  children?: string
  tone?: 'light' | 'ink'
  className?: string
}) {
  return (
    <p
      className={`font-mono text-mono-xs uppercase ${
        tone === 'ink' ? 'text-chalk-3/80' : 'text-graphite-3'
      } ${className}`}
    >
      {children}
    </p>
  )
}
