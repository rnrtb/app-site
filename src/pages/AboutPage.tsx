import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="page-block about-page">
      <header className="about-intro">
        <p className="page-kicker">About</p>
        <h1>みらい教育システム</h1>
        <p className="lede">
          みらい教育システムは、教育・技術・心理をかけ合わせた個人事業です。学びの現場づくりと、現場で使うものづくりの両方に取り組んでいます。
        </p>
        <p className="about-meta">
          <span className="about-meta-label">代表</span>
          <span className="about-meta-body">
            村田 飛翔（
            <Link to="/people/mrtb">むらつば</Link> / mrtb）
          </span>
        </p>
      </header>

      <section className="about-section" aria-labelledby="about-doing">
        <div className="about-section-head">
          <h2 id="about-doing">やっていること</h2>
          <p>学びの場と、現場で使うものづくり。</p>
        </div>
        <div className="about-topics">
          <article className="about-topic">
            <h3>みらい教育ラボ</h3>
            <p>
              学習塾「
              <a href="https://academy.mirai-study.com/" rel="noreferrer">
                みらい教育ラボ
              </a>
              」では、認知特性や一人ひとりの学び方に応じたアプローチで、思考力や自走する学び方を育てることを大切にしています。理数系を核にしながら、教科の学びからプログラミング・ものづくりまで幅広く扱います。
            </p>
          </article>
          <article className="about-topic">
            <h3>タイマー・アプリ制作</h3>
            <p>
              高専ロボコン向けタイマーのような競技・運営の現場で使うソフトウェアや、ブラウザで動く小さなアプリの制作も行っています。使う人の手元で迷いにくいこと、現場の都合に寄せられることを意識しています。
            </p>
          </article>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-values">
        <div className="about-section-head">
          <h2 id="about-values">大切にしていること</h2>
          <p>答えより、思考の組み立て方を。</p>
        </div>
        <div className="about-values">
          <article className="about-value">
            <p className="about-value-lead">思考をどう組み立てるか</p>
            <p>
              答えを覚えることより、「思考をどう組み立てるか」を身につけること。ものづくりでも勉強でも、本質は近いと考えています。AIが答えを出しやすい時代だからこそ、自分の頭で筋道を立てる力が、長く使える財産になるはずです。
            </p>
          </article>
          <article className="about-value">
            <p className="about-value-lead">特性に合わせたアプローチ</p>
            <p>
              そのために、工学的なシステム思考と、心理の視点を重ねています。つまずきを「努力不足」だけで見ず、一人ひとりの特性に合わせてアプローチを変えること。再現できるやり方として整え、学びにも制作にも活かしていくのが、みらい教育システムの立ち位置です。
            </p>
          </article>
        </div>
      </section>

      <section className="about-section about-section-soft" aria-labelledby="about-founder">
        <div className="about-section-head">
          <h2 id="about-founder">代表について</h2>
        </div>
        <p>
          代表の村田
          飛翔は、高専ロボコンやものづくり、教育の現場を経験したのち、公認心理師としても活動しています。事業としての取り組みはここに、個人の経歴や関わった作品の詳細は{' '}
          <Link to="/people/mrtb">/people/mrtb</Link> に分けてまとめています。
        </p>
      </section>

      <section className="about-section about-section-soft" aria-labelledby="about-site">
        <div className="about-section-head">
          <h2 id="about-site">このサイトについて</h2>
        </div>
        <p>
          このサイトは、みらい教育システムの公式サイトです。「Works /
          やったこと」では制作や活動の記録をまとめています。完成したプロダクトだけでなく、現場で試したことや、これまで手がけてきたことも含めて残していきます。
        </p>
        <p>
          ご相談や連携のご連絡は <Link to="/contact">Contact</Link> からどうぞ。
        </p>
      </section>

      <p className="about-cta">
        <Link className="btn btn-primary" to="/contact">
          お問い合わせへ
        </Link>
        <Link className="btn btn-ghost" to="/works">
          Works を見る
        </Link>
      </p>
    </div>
  )
}
