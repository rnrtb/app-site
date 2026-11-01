import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONTACT_TOPICS } from '../lib/contactTopics'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function ContactPage() {
  const [params] = useSearchParams()
  const requested = params.get('topic')
  const initialTopic = CONTACT_TOPICS.some((t) => t.id === requested)
    ? (requested as string)
    : ''
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="page-block contact-page">
        <p className="page-kicker">Contact</p>
        <h1>送信しました</h1>
        <p className="lede">お問い合わせありがとうございます。内容を確認のうえ、ご連絡します。</p>
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
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? '送信中…' : '送信する'}
        </button>
        {status === 'error' && (
          <p className="contact-error" role="alert">
            送信に失敗しました。時間をおいて再度お試しいただくか、info@mirai-study.com まで直接ご連絡ください。
          </p>
        )}
      </form>
    </div>
  )
}
