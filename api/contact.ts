import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOPIC_LABELS: Record<string, string> = {
  work: '制作・開発のご相談',
  talk: '登壇・ワークショップのご相談',
  'typing-lab': 'タイピングラボについて',
  other: 'その他',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = '10 m'
const RATE_LIMIT_TIMEOUT_MS = 3000

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function header(req: VercelRequest, name: string): string | undefined {
  const value = req.headers[name]
  return Array.isArray(value) ? value[0] : value
}

/**
 * 接続元 IP。Vercel は x-forwarded-for を上書きし、利用者が付けた値を転送しない。
 * x-vercel-forwarded-for を優先し、無ければ x-forwarded-for を使う。
 * その他のヘッダー（x-real-ip など）は信用しない。
 */
function clientIp(req: VercelRequest): string | undefined {
  for (const name of ['x-vercel-forwarded-for', 'x-forwarded-for']) {
    const candidate = header(req, name)?.split(',')[0]?.trim()
    if (candidate && isIP(candidate)) return candidate
  }
  return undefined
}

/** true: 成功 / false: 失敗・期限切れ・使用済み / 'error': Cloudflare に到達できない */
async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string | undefined,
): Promise<boolean | 'error'> {
  try {
    const form = new URLSearchParams({ secret, response: token })
    if (ip) form.set('remoteip', ip)
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    if (!r.ok) return 'error'
    const result = (await r.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return 'error'
  }
}

interface RateLimitConfig {
  url: string
  token: string
  secret: string
}

/** Vercel Marketplace の Upstash 連携は UPSTASH_REDIS_REST_* か KV_REST_API_* のどちらかを入れる */
function rateLimitConfig(): RateLimitConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  const secret = process.env.RATE_LIMIT_SECRET
  return url && token && secret ? { url, token, secret } : null
}

let limiter: { key: string; instance: Ratelimit } | undefined

function getLimiter(config: RateLimitConfig): Ratelimit {
  const key = `${config.url}|${config.token}`
  if (limiter?.key !== key) {
    limiter = {
      key,
      instance: new Ratelimit({
        // 障害時に黙って許可されないよう、ライブラリ側の timeout と再試行は無効にして自前で扱う
        redis: new Redis({ url: config.url, token: config.token, retry: false }),
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW),
        prefix: 'ratelimit:contact',
        timeout: 0,
        analytics: false,
      }),
    }
  }
  return limiter.instance
}

/** 生の IP は保存せず、サーバー側の秘密値による HMAC を識別子にする */
function identifier(secret: string, ip: string | undefined): string {
  return createHmac('sha256', secret)
    .update(ip ?? 'unknown')
    .digest('hex')
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('rate limit timeout')), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
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

  // 環境変数の設定漏れは一時的な障害と区別し、送信せずに 500 を返す
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  const rateConfig = rateLimitConfig()
  if (!turnstileSecret || !apiKey || !to || !from || !rateConfig) {
    const missing = [
      !turnstileSecret && 'TURNSTILE_SECRET_KEY',
      !apiKey && 'RESEND_API_KEY',
      !to && 'CONTACT_TO_EMAIL',
      !from && 'CONTACT_FROM_EMAIL',
      !rateConfig &&
        'UPSTASH_REDIS_REST_URL/TOKEN (or KV_REST_API_URL/TOKEN) / RATE_LIMIT_SECRET',
    ].filter(Boolean)
    console.error('contact: missing env:', missing.join(', '))
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  // Turnstile: サーバー側で必ず検証し、通らなければ送信しない
  const turnstileToken = str(body.turnstileToken, 2048)
  if (!turnstileToken) {
    return res.status(400).json({ error: 'captcha_required' })
  }
  const ip = clientIp(req)
  const verified = await verifyTurnstile(turnstileSecret, turnstileToken, ip)
  if (verified === 'error') {
    return res.status(502).json({ error: 'captcha_unavailable' })
  }
  if (!verified) {
    return res.status(400).json({ error: 'captcha_failed' })
  }

  // 送信回数制限（Turnstile 成功後のみ）。Redis の一時障害時は制限だけをスキップする
  try {
    const result = await withTimeout(
      getLimiter(rateConfig).limit(identifier(rateConfig.secret, ip)),
      RATE_LIMIT_TIMEOUT_MS,
    )
    if (!result.success) {
      return res.status(429).json({ error: 'rate_limited' })
    }
  } catch (error) {
    console.error('contact: rate limiter unavailable, skipping limit:', error)
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
