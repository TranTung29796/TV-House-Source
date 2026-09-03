export function ProductTemplateAccountLoadingState() {
  return (
    <main className="xsolt-account-page xsolt-account-loading" aria-live="polite" aria-busy="true">
      <section className="xsolt-account-grid">
        <section className="xsolt-account-card xsolt-account-card--profile">
          <div className="xsolt-account-card__header">
            <div className="xsolt-loading-line xsolt-loading-line--account-title" />
            <div className="xsolt-loading-line xsolt-loading-line--account-copy" />
          </div>
          <div className="xsolt-account-card__content">
            <div className="xsolt-account-profile-layout">
              <div className="xsolt-account-profile-head">
                <div className="xsolt-account-identity">
                  <div className="xsolt-loading-avatar" />
                  <div className="xsolt-loading-stack">
                    <div className="xsolt-loading-line xsolt-loading-line--account-name" />
                    <div className="xsolt-loading-line xsolt-loading-line--account-email" />
                  </div>
                </div>
              </div>
              <div className="xsolt-account-form xsolt-account-loading-form">
                <div className="xsolt-loading-line xsolt-loading-line--account-label" />
                <div className="xsolt-account-form__row">
                  <div className="xsolt-loading-input" />
                  <div className="xsolt-loading-button" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="xsolt-account-card xsolt-account-card--subscription">
          <div className="xsolt-account-card__header">
            <div className="xsolt-loading-line xsolt-loading-line--account-title" />
            <div className="xsolt-loading-line xsolt-loading-line--account-copy" />
          </div>
          <div className="xsolt-account-card__content">
            <div className="xsolt-account-table">
              <div className="xsolt-loading-table-row" />
              <div className="xsolt-loading-table-row" />
              <div className="xsolt-loading-table-row" />
              <div className="xsolt-loading-table-row" />
            </div>
            <div className="xsolt-account-actions">
              <div className="xsolt-loading-button" />
              <div className="xsolt-loading-button xsolt-loading-button--ghost" />
            </div>
          </div>
        </section>

        <section className="xsolt-account-card xsolt-account-card--security">
          <div className="xsolt-account-card__header">
            <div className="xsolt-loading-line xsolt-loading-line--account-title" />
            <div className="xsolt-loading-line xsolt-loading-line--account-copy" />
          </div>
          <div className="xsolt-account-card__content">
            <div className="xsolt-account-table">
              <div className="xsolt-loading-table-row" />
              <div className="xsolt-loading-table-row" />
            </div>
            <div className="xsolt-loading-divider" />
            <div className="xsolt-loading-stack">
              <div className="xsolt-loading-line xsolt-loading-line--account-label" />
              <div className="xsolt-loading-line xsolt-loading-line--account-copy" />
              <div className="xsolt-loading-button xsolt-loading-button--danger" />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
