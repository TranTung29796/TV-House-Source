export function ProductTemplateLoadingState() {
  return (
    <section className="xsolt-view xsolt-loading-view" aria-live="polite" aria-busy="true">
      <header className="xsolt-view__header">
        <div>
          <div className="xsolt-view__eyebrow">Loading</div>
          <h1>Preparing your workspace</h1>
          <p>Fetching the latest data and assembling the current view.</p>
        </div>
      </header>

      <div className="xsolt-loading-shell xsolt-loading-grid">
        <section className="xsolt-panel xsolt-loading-panel xsolt-panel--metric">
          <div className="xsolt-loading-line xsolt-loading-line--sm" />
          <div className="xsolt-loading-line xsolt-loading-line--lg" />
          <div className="xsolt-loading-line xsolt-loading-line--xs" />
        </section>

        <section className="xsolt-panel xsolt-loading-panel xsolt-panel--chart">
          <div className="xsolt-loading-panel__row">
            <div className="xsolt-loading-line xsolt-loading-line--sm" />
            <div className="xsolt-loading-pill" />
          </div>
          <div className="xsolt-loading-chart" />
        </section>

        <section className="xsolt-panel xsolt-loading-panel">
          <div className="xsolt-loading-line xsolt-loading-line--sm" />
          <div className="xsolt-loading-stack">
            <div className="xsolt-loading-item" />
            <div className="xsolt-loading-item" />
            <div className="xsolt-loading-item" />
          </div>
        </section>

        <section className="xsolt-panel xsolt-loading-panel">
          <div className="xsolt-loading-panel__row">
            <div className="xsolt-loading-line xsolt-loading-line--sm" />
            <div className="xsolt-loading-line xsolt-loading-line--xs" />
          </div>
          <div className="xsolt-loading-stack">
            <div className="xsolt-loading-activity" />
            <div className="xsolt-loading-activity" />
            <div className="xsolt-loading-activity" />
          </div>
        </section>
      </div>
    </section>
  );
}
