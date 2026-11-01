import { Link, Navigate, useParams } from 'react-router-dom'
import { MarkdownBody } from '../components/works/MarkdownBody'
import { WorkGrid } from '../components/works/WorkGrid'
import { getPersonProfile } from '../lib/personProfiles'
import { getPersonWithWorks } from '../lib/works'

export function PersonPage() {
  const { personId = '' } = useParams()
  const matched = getPersonWithWorks(personId)

  if (!matched) {
    return (
      <div className="page-block">
        <h1>クレジットが見つかりません</h1>
        <p>名前を確認するか、作品一覧から選び直してください。</p>
        <Link className="btn btn-primary" to="/works">
          Works 一覧へ
        </Link>
      </div>
    )
  }

  const { person, works } = matched

  if (person.id !== personId) {
    return <Navigate to={`/people/${person.id}`} replace />
  }

  const profile = getPersonProfile(person.id)
  const heading = person.pageName ?? person.name

  return (
    <div className="person-page">
      <Link
        className="back-link"
        to="/works"
        state={{ restoreWorksListScroll: true }}
      >
        ← Works 一覧
      </Link>

      <header className="person-head">
        {profile?.image && (
          <figure className="person-photo">
            <img src={profile.image} alt={heading} />
          </figure>
        )}
        <div className="person-head-copy">
          <p className="page-kicker">Credits</p>
          <h1>{heading}</h1>
          {person.title && <p className="person-title">{person.title}</p>}
          {person.handles && <p className="person-handles">{person.handles}</p>}
        </div>
      </header>

      {profile?.bodyHtml && (
        <MarkdownBody className="markdown-body person-body" html={profile.bodyHtml} />
      )}

      <section className="person-works" aria-labelledby="person-works-heading">
        <div className="section-head">
          <h2 id="person-works-heading">関わった作品</h2>
          <p>{works.length} 件</p>
        </div>
        <WorkGrid works={works} />
      </section>
    </div>
  )
}
