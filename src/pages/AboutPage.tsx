import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="page-block about-page">
      <p className="page-kicker">About</p>
      <h1>村田飛翔（mrtb）</h1>
      <p className="lede">
        みらい教育システムまわりのものづくりと、ロボコン現場向けソフトウェア、
        学習ツールの制作をしています。このサイト「Works / やったこと」は、その制作記録です。
      </p>

      <section>
        <h2>このサイトについて</h2>
        <p>
          旧サイト「むらつばのやったこと」（WordPress /
          mrtb.challenge-lab.com）を、Markdown + Git で作り直して移行しています。
          屋号・サービス側の顔は Works、著者名はここで明示します。
        </p>
      </section>

      <section>
        <h2>関連リンク</h2>
        <ul className="plain-list">
          <li>
            <a href="https://tools.mirai-study.com/" rel="noreferrer">
              tools.mirai-study.com
            </a>
            — ブラウザ向け小ツール
          </li>
          <li>
            <a href="https://github.com/rnrtb" rel="noreferrer">
              GitHub @rnrtb
            </a>
          </li>
          <li>
            <a href="https://mrtb.challenge-lab.com/" rel="noreferrer">
              旧サイト（移行元）
            </a>
          </li>
        </ul>
      </section>

      <p>
        <Link className="btn btn-primary" to="/contact">
          お問い合わせへ
        </Link>
      </p>
    </div>
  )
}
