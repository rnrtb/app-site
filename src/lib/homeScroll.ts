const WORKS_LIST_SCROLL_KEY = 'app-site:works-list-scroll'

export type WorksListLocationState = {
  restoreWorksListScroll?: boolean
}

export type WorkLocationState = {
  fromList?: boolean
}

export function saveWorksListScroll(y = window.scrollY) {
  sessionStorage.setItem(WORKS_LIST_SCROLL_KEY, String(y))
}

export function restoreWorksListScroll() {
  const raw = sessionStorage.getItem(WORKS_LIST_SCROLL_KEY)
  if (raw == null) return

  const y = Number(raw)
  if (!Number.isFinite(y)) return

  window.scrollTo({ top: y, left: 0, behavior: 'instant' })
}
