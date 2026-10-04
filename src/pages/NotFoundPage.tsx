import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page-block">
      <h1>ページが見つかりません</h1>
      <p>アドレスが古い、または移動した可能性があります。</p>
      <Link className="btn btn-primary" to="/">
        Works トップへ
      </Link>
    </div>
  )
}
