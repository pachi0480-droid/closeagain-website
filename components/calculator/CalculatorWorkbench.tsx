import { GrowthGap } from '@/components/calculator/GrowthGap'

/** The dedicated calculator route: the homepage stage, plus the full model. */
export function CalculatorWorkbench() {
  return (
    <section className="border-t border-rule bg-void pt-14 pb-24 md:pb-28">
      <div className="shell-wide">
        <GrowthGap full />
      </div>
    </section>
  )
}
