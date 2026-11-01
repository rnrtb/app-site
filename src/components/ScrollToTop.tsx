import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import type { WorksListLocationState } from '../lib/homeScroll'

/** 通常のページ遷移では先頭へ。一覧復元・ブラウザ戻るは除外 */
export function ScrollToTop() {
  const { pathname, state } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (navigationType === 'POP') return

    const listState = (state ?? null) as WorksListLocationState | null
    if (pathname === '/works' && listState?.restoreWorksListScroll) return

    if (navigationType === 'PUSH') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, navigationType, state])

  return null
}
