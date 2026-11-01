import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/works', label: 'Works', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" to="/">
          <span className="site-brand-mark">みらい教育システム</span>
          <span className="site-brand-sub">mirai-study.com</span>
        </Link>
        <nav className="site-nav" aria-label="メイン">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
