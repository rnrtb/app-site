import { Link, useParams } from 'react-router-dom'
import { formatWorkDate, getWorkBySlug } from '../lib/works'

export function WorkDetailPage() {
  const { slug = '' } = useParams()
  const work = getWorkBySlug(slug)

  if (!work) {
    return (
      <div className="page-block">
        <h1>作品が見つかりません</h1>
        <p>URL を確認するか、一覧から選び直してください。</p>
        <Link className="btn btn-primary" to="/">
          一覧へ戻る
        </Link>
      </div>
    )
  }

  return (
    <article className="work-detail">
      <Link className="back-link" to="/">
        ← Works 一覧
      </Link>

      {work.thumbnail && (
        <div className="work-detail-hero">
          <img src={work.thumbnail} alt="" />
        </div>
      )}

      <header className="work-detail-header">
        <time dateTime={work.date}>{formatWorkDate(work.date)}</time>
        <h1>{work.title}</h1>
        {work.summary && <p className="work-detail-summary">{work.summary}</p>}
        {work.tags && work.tags.length > 0 && (
          <ul className="tag-list" aria-label="タグ">
            {work.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </header>

      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: work.bodyHtml }}
      />
    </article>
  )
}
