import { Link } from 'react-router-dom'
import { formatWorkDate, type Work } from '../../lib/works'

interface Props {
  work: Work
  index: number
}

export function WorkCard({ work, index }: Props) {
  return (
    <Link
      to={`/works/${work.slug}`}
      className="work-card"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      <div className="work-card-media">
        {work.thumbnail ? (
          <img src={work.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className="work-card-fallback" aria-hidden="true" />
        )}
      </div>
      <div className="work-card-body">
        <time dateTime={work.date}>{formatWorkDate(work.date)}</time>
        <h2>{work.title}</h2>
        {work.summary && <p>{work.summary}</p>}
        {work.tags && work.tags.length > 0 && (
          <ul className="tag-list" aria-label="タグ">
            {work.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
