export function ContactPage() {
  return (
    <div className="page-block contact-page">
      <p className="page-kicker">Contact</p>
      <h1>お問い合わせ</h1>
      <p className="lede">
        制作・登壇・ツール連携などのご相談は、次の導線からどうぞ。
      </p>

      <ul className="contact-list">
        <li>
          <a className="btn btn-primary" href="mailto:hello@mirai-study.com">
            メール（hello@mirai-study.com）
          </a>
        </li>
        <li>
          <a
            className="btn btn-ghost"
            href="https://github.com/rnrtb"
            rel="noreferrer"
          >
            GitHub @rnrtb
          </a>
        </li>
      </ul>

      <p className="muted">
        メールアドレスは仮の連絡先です。運用に合わせて README / このページを更新してください。
      </p>
    </div>
  )
}
