/** Temporary stand-in until the product demo's DashboardPreview lands. */
export function DashboardStub({ view }: { view: string }) {
  return (
    <div className="ui dashboard-stub" aria-hidden="true">
      <span className="ui-label">{view}</span>
    </div>
  )
}
