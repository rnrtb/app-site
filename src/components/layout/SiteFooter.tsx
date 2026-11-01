import { Link } from 'react-router-dom'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-nav" aria-label="フッター">
          <Link to="/works">Works</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <p className="site-footer-meta">{year} みらい教育システム</p>
      </div>
    </footer>
  )
}
