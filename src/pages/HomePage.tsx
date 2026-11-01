import { Link } from 'react-router-dom'
import { getAllWorks } from '../lib/works'

export function HomePage() {
  const works = getAllWorks()
  const preview = works.slice(0, 3)
  const backdrop = preview.find((work) => work.thumbnail)?.thumbnail

  return (
    <div className="site-home">
      <section className="site-hero" aria-labelledby="site-brand">
        {backdrop && (
          <div className="site-hero-media" aria-hidden="true">
            <img src={backdrop} alt="" />
          </div>
        )}
        <div className="site-hero-shade" aria-hidden="true" />
        <div className="site-hero-copy">
          <p className="site-hero-kicker">mirai-study.com</p>
          <h1 id="site-brand" className="site-hero-brand">
            みらい教育システム
          </h1>
          <p className="site-hero-lede">
            教育・技術・心理をかけ合わせた個人事業。学びの現場づくりと、現場で使うものづくりに取り組んでいます。
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/works">
              Works を見る
            </Link>
            <Link className="btn btn-ghost site-hero-ghost" to="/about">
              About
            </Link>
          </div>
        </div>
      </section>

      <section className="site-panel" aria-labelledby="site-doing">
        <div className="site-panel-copy">
          <p className="section-kicker">About</p>
          <h2 id="site-doing">やっていること</h2>
          <p>
            学習塾「みらい教育ラボ」での学びの場づくりと、高専ロボコン向けタイマーをはじめとする現場向けの制作。どちらの現場でも、迷いにくいこと・特性に合わせることを大切にしています。
          </p>
          <Link className="text-link" to="/about">
            詳しく見る →
          </Link>
        </div>
      </section>

      <section className="site-panel site-panel-works" aria-labelledby="site-works">
        <div className="section-head">
          <p className="section-kicker">Works</p>
          <h2 id="site-works">やったこと</h2>
          <p>制作や活動の記録です。</p>
        </div>
        <ul className="site-work-preview">
          {preview.map((work, index) => (
            <li key={work.slug} style={{ animationDelay: `${index * 80}ms` }}>
              <Link to={`/works/${work.slug}`} className="site-work-preview-link">
                <span className="site-work-preview-media">
                  {work.thumbnail ? (
                    <img src={work.thumbnail} alt="" loading="lazy" />
                  ) : (
                    <span className="work-card-fallback" aria-hidden="true" />
                  )}
                </span>
                <span className="site-work-preview-body">
                  <span className="site-work-preview-title">{work.title}</span>
                  {work.summary && (
                    <span className="site-work-preview-summary">{work.summary}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="site-panel-actions">
          <Link className="btn btn-primary" to="/works">
            作品一覧へ
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            お問い合わせ
          </Link>
        </p>
      </section>
    </div>
  )
}
