import { Ribbon } from './Ribbon'
import { closingSweep } from './ribbons'

/** The ribbon that carries the eye into a closing call to action. */
export function ClosingRibbon({ id }: { id: string }) {
  return (
    <Ribbon
      id={id}
      className="closing__ribbon"
      viewBox={closingSweep.viewBox}
      preserveAspectRatio="xMaxYMid meet"
      spec={closingSweep.spec}
      draw="scroll"
    />
  )
}
