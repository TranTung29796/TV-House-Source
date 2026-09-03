export function ProductTemplateAuthLoadingState() {
  return (
    <section className="xsolt-auth-loading" aria-live="polite" aria-busy="true">
      <div className="xsolt-auth-card">
        <div className="xsolt-auth-card__body">
          <div className="xsolt-auth-card__intro">
            <div className="xsolt-auth-card__hero">
              <div className="xsolt-loading-pill xsolt-auth-loading__badge" />
              <div className="xsolt-loading-stack">
                <div className="xsolt-loading-line xsolt-loading-line--account-title" />
                <div className="xsolt-loading-line xsolt-loading-line--account-copy" />
              </div>
            </div>
          </div>

          <div className="xsolt-loading-stack">
            <div className="xsolt-loading-line xsolt-loading-line--account-label" />
            <div className="xsolt-loading-input" />
          </div>

          <div className="xsolt-loading-stack">
            <div className="xsolt-loading-line xsolt-loading-line--account-label" />
            <div className="xsolt-loading-input" />
          </div>

          <div className="xsolt-loading-button xsolt-auth-loading__button" />
        </div>
      </div>
    </section>
  );
}
