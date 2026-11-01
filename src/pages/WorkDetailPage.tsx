import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CategoryList } from '../components/works/CategoryList'
import { CreditList } from '../components/works/CreditList'
import { MarkdownBody } from '../components/works/MarkdownBody'
import type { WorkLocationState } from '../lib/homeScroll'
import { formatWorkDate, getWorkBySlug } from '../lib/works'

export function WorkDetailPage() {
  const { slug = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const work = getWorkBySlug(slug)
  const fromList = Boolean(
    (location.state as WorkLocationState | null)?.fromList,
  )

  const goBackToList = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (fromList) {
      navigate(-1)
      return
    }
    navigate('/works', { state: { restoreWorksListScroll: true } })
  }

  if (!work) {
    return (
      <div className="page-block">
        <h1>作品が見つかりません</h1>
        <p>URL を確認するか、一覧から選び直してください。</p>
        <Link
          className="btn btn-primary"
          to="/works"
          state={{ restoreWorksListScroll: true }}
        >
          一覧へ戻る
        </Link>
      </div>
    )
  }

  const creditsBlock =
    work.credits.length > 0 ? (
      <section className="work-credits" aria-label="クレジット">
        <CreditList credits={work.credits} stacked />
      </section>
    ) : null

  return (
    <article className="work-detail">
      <a className="back-link" href="/works" onClick={goBackToList}>
        ← Works 一覧
      </a>

      {work.thumbnail && (
        <div className="work-detail-hero">
          <img src={work.thumbnail} alt="" />
        </div>
      )}

      <header className="work-detail-header">
        <time dateTime={work.date}>{formatWorkDate(work.date)}</time>
        <h1>{work.title}</h1>
        <CategoryList categories={work.categories} />
      </header>

      {work.bodyHtmlBefore && (
        <MarkdownBody className="markdown-body" html={work.bodyHtmlBefore} />
      )}

      {work.hasCreditsMarker ? creditsBlock : null}

      {work.bodyHtmlAfter && (
        <MarkdownBody className="markdown-body" html={work.bodyHtmlAfter} />
      )}

      {!work.hasCreditsMarker ? creditsBlock : null}
    </article>
  )
}
