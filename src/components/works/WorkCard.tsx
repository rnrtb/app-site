import { Link, useNavigate } from 'react-router-dom'
import { saveWorksListScroll } from '../../lib/homeScroll'
import { formatWorkDate, type Work } from '../../lib/works'
import { CategoryList } from './CategoryList'

interface Props {
  work: Work
  index: number
}

export function WorkCard({ work, index }: Props) {
  const navigate = useNavigate()

  return (
    <article
      className="work-card"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      <Link
        to={`/works/${work.slug}`}
        className="work-card-main"
        state={{ fromList: true }}
        onClick={() => saveWorksListScroll()}
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
        </div>
      </Link>
      {work.categories.length > 0 && (
        <div className="work-card-categories">
          <CategoryList
            categories={work.categories}
            onSelect={(category) => {
              saveWorksListScroll()
              navigate(`/works?category=${encodeURIComponent(category)}`)
            }}
          />
        </div>
      )}
    </article>
  )
}
