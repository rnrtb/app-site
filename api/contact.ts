import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOPIC_LABELS: Record<string, string> = {
  work: '制作・開発のご相談',
  talk: '登壇・ワークショップのご相談',
  'typing-lab': 'タイピングラボについて',
  other: 'その他',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>

  // ハニーポット: bot には成功を返して捨てる
  if (str(body.website, 100)) {
    return res.status(200).json({ ok: true })
  }

  const topic = str(body.topic, 40)
  const name = str(body.name, 100)
  const email = str(body.email, 200)
  const message = str(body.message, 5000)

  if (!TOPIC_LABELS[topic] || !name || !EMAIL_RE.test(email) || !message) {
    return res.status(400).json({ error: 'invalid_input' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    console.error('contact: missing env (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)')
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  const label = TOPIC_LABELS[topic]
  const text = [`件名: ${label}`, `お名前: ${name}`, `メール: ${email}`, '', message].join('\n')

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[お問い合わせ] ${label} - ${name}`,
      text,
    }),
  })

  if (!sent.ok) {
    console.error('contact: resend failed', sent.status, await sent.text())
    return res.status(502).json({ error: 'send_failed' })
  }
  return res.status(200).json({ ok: true })
}
