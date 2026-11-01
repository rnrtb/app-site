import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export interface TurnstileHandle {
  /** トークンは一度しか使えないため、送信のたびに呼んで再取得する */
  reset: () => void
}

interface Props {
  siteKey: string
  onToken: (token: string | null) => void
  ref?: Ref<TurnstileHandle>
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('turnstile script failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function Turnstile({ siteKey, onToken, ref }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current(null)
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: siteKey,
          language: 'ja',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => onTokenRef.current(null))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = undefined
    }
  }, [siteKey])

  return <div ref={container} className="contact-turnstile" />
}
