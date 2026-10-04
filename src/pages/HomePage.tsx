import { Link } from 'react-router-dom'
import { WorkGrid } from '../components/works/WorkGrid'
import { getAllWorks } from '../lib/works'

export function HomePage() {
  const works = getAllWorks()

  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-brand">
        <div className="hero-copy">
          <p className="hero-kicker">works.mirai-study.com</p>
          <h1 id="hero-brand" className="hero-brand">
            Works
            <span className="hero-brand-ja">やったこと</span>
          </h1>
          <p className="hero-lede">
            ロボコン、ものづくり、教育まわりで手がけた制作の記録。
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#works">
              作品一覧を見る
            </a>
            <Link className="btn btn-ghost" to="/about">
              著者について
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-panel">
            <span className="hero-panel-label">Archive</span>
            <strong>{works.length}</strong>
            <span>published works</span>
          </div>
          <div className="hero-orbit" />
        </div>
      </section>

      <section id="works" className="works-section" aria-labelledby="works-heading">
        <div className="section-head">
          <h2 id="works-heading">作品一覧</h2>
          <p>新しい順に並べています。カードを開くと詳細ページへ進みます。</p>
        </div>
        <WorkGrid works={works} />
      </section>
    </div>
  )
}
