export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-brand">Works / やったこと</p>
        <p className="site-footer-meta">
          {year} みらい教育システム · 著者 村田飛翔（mrtb）
        </p>
        <p className="site-footer-note">
          関連:{' '}
          <a href="https://tools.mirai-study.com/" rel="noreferrer">
            tools
          </a>
          {' · '}
          <a href="https://github.com/rnrtb" rel="noreferrer">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
