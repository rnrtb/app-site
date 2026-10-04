import type { Work } from '../../lib/works'
import { WorkCard } from './WorkCard'

interface Props {
  works: Work[]
}

export function WorkGrid({ works }: Props) {
  if (works.length === 0) {
    return <p className="empty-state">まだ公開中の作品がありません。</p>
  }

  return (
    <div className="work-grid">
      {works.map((work, index) => (
        <WorkCard key={work.slug} work={work} index={index} />
      ))}
    </div>
  )
}
