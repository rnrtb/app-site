import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Works', end: true },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" to="/">
        <span className="site-brand-mark">Works</span>
        <span className="site-brand-sub">やったこと</span>
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
    </header>
  )
}
