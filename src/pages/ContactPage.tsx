import { useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Turnstile, type TurnstileHandle } from '../components/Turnstile'
import { CONTACT_TOPICS } from '../lib/contactTopics'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

type Status = 'idle' | 'sending' | 'done' | 'error' | 'limited'

export function ContactPage() {
  const [params] = useSearchParams()
  const requested = params.get('topic')
  const initialTopic = CONTACT_TOPICS.some((t) => t.id === requested)
    ? (requested as string)
    : ''
  const [status, setStatus] = useState<Status>('idle')
  const [token, setToken] = useState<string | null>(null)
  const turnstile = useRef<TurnstileHandle>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return
    setStatus('sending')
    const data = {
      ...Object.fromEntries(new FormData(event.currentTarget)),
      turnstileToken: token,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'done' : res.status === 429 ? 'limited' : 'error')
    } catch {
      setStatus('error')
    }
    // トークンは使い切りなので、結果に関わらず取り直して再試行できるようにする
    turnstile.current?.reset()
  }

  if (status === 'done') {
    return (
      <div className="page-block contact-page">
        <p className="page-kicker">Contact</p>
        <h1>送信しました</h1>
        <p className="lede">
          お問い合わせありがとうございます。
          <br />
          内容を確認のうえ、ご入力いただいたメールアドレスへご連絡します。
        </p>
        <p className="lede">
          1週間ほど経っても返信が届かない場合は、迷惑メールフォルダをご確認のうえ、
          <a className="text-link" href="mailto:info@mirai-study.com">
            info@mirai-study.com
          </a>{' '}
          まで直接ご連絡ください。
        </p>
      </div>
    )
  }

  return (
    <div className="page-block contact-page">
      <p className="page-kicker">Contact</p>
      <h1>お問い合わせ</h1>
      <p className="lede">
        制作・登壇・タイピングラボなどのご相談は、こちらのフォームからどうぞ。
      </p>

      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          <span>お問い合わせの件名</span>
          <select name="topic" defaultValue={initialTopic} required>
            <option value="" disabled>
              選択してください
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>お名前</span>
          <input type="text" name="name" maxLength={100} required autoComplete="name" />
        </label>
        <label>
          <span>メールアドレス</span>
          <input type="email" name="email" maxLength={200} required autoComplete="email" />
        </label>
        <label>
          <span>内容</span>
          <textarea name="message" rows={7} maxLength={5000} required />
        </label>
        <input
          className="contact-hp"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        {SITE_KEY ? (
          <Turnstile ref={turnstile} siteKey={SITE_KEY} onToken={setToken} />
        ) : (
          <p className="contact-error" role="alert">
            スパム対策の設定が未完了のため、現在フォームは利用できません。
          </p>
        )}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === 'sending' || !token}
        >
          {status === 'sending' ? '送信中…' : '送信する'}
        </button>
        {status === 'limited' && (
          <p className="contact-error" role="alert">
            短時間に送信が続いたため、いったん受け付けられませんでした。しばらくしてからもう一度お試しください。
          </p>
        )}
        {status === 'error' && (
          <p className="contact-error" role="alert">
            送信に失敗しました。時間をおいて再度お試しいただくか、info@mirai-study.com まで直接ご連絡ください。
          </p>
        )}
      </form>
    </div>
  )
}
