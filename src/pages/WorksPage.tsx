import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
} from 'react-router-dom'
import { CategoryFilter } from '../components/works/CategoryFilter'
import { WorkGrid } from '../components/works/WorkGrid'
import {
  restoreWorksListScroll,
  saveWorksListScroll,
  type WorksListLocationState,
} from '../lib/homeScroll'
import { getAllCategories, getAllWorks } from '../lib/works'

export function WorksPage() {
  const allWorks = getAllWorks()
  const categories = getAllCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const listState = (location.state ?? null) as WorksListLocationState | null
  const [instantEntry, setInstantEntry] = useState(
    () => navigationType === 'POP' || Boolean(listState?.restoreWorksListScroll),
  )
  const previousPathnameRef = useRef(location.pathname)
  const gridKey = selectedCategory ?? 'all'

  const works = useMemo(() => {
    if (!selectedCategory) return allWorks
    return allWorks.filter((work) =>
      work.categories.includes(selectedCategory),
    )
  }, [allWorks, selectedCategory])

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current
    previousPathnameRef.current = location.pathname

    if (listState?.restoreWorksListScroll) {
      restoreWorksListScroll()
      navigate(
        {
          pathname: '.',
          search: location.search,
        },
        { replace: true, state: {} },
      )
      return
    }

    // カテゴリ切り替えだけならスクロール位置を維持し、カード登場アニメは有効化
    if (previousPathname === '/works' && location.pathname === '/works') {
      setInstantEntry(false)
      return
    }

    if (navigationType === 'PUSH') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [
    location.key,
    location.pathname,
    location.search,
    listState,
    navigate,
    navigationType,
  ])

  useLayoutEffect(() => {
    return () => {
      saveWorksListScroll()
    }
  }, [])

  const setCategory = (category: string | null) => {
    setInstantEntry(false)
    if (category == null) {
      setSearchParams({}, { replace: false })
      return
    }
    setSearchParams({ category }, { replace: false })
  }

  return (
    <div className={instantEntry ? 'works-page is-instant' : 'works-page'}>
      <section className="works-hero" aria-labelledby="works-brand">
        <div className="works-hero-copy">
          <p className="hero-kicker">Archive</p>
          <h1 id="works-brand" className="hero-brand">
            Works
            <span className="hero-brand-ja">やったこと</span>
          </h1>
          <p className="hero-lede">
            ロボコン、ものづくり、教育まわりで手がけた制作の記録。
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href="#works"
              onClick={(event) => {
                event.preventDefault()
                document
                  .getElementById('works')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              作品一覧を見る
            </a>
            <Link className="btn btn-ghost" to="/about">
              About
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-stack">
            {allWorks.slice(0, 3).map((work, index) => (
              <div
                key={work.slug}
                className={`hero-stack-card hero-stack-card-${index}`}
              >
                {work.thumbnail ? (
                  <img src={work.thumbnail} alt="" />
                ) : (
                  <div className="work-card-fallback" />
                )}
              </div>
            ))}
          </div>
          <p className="hero-count">
            <strong>{allWorks.length}</strong> works
          </p>
        </div>
      </section>

      <section id="works" className="works-section" aria-labelledby="works-heading">
        <div className="section-head">
          <p className="section-kicker">List</p>
          <h2 id="works-heading">作品一覧</h2>
          <CategoryFilter
            categories={categories}
            value={selectedCategory}
            onChange={setCategory}
          />
          {selectedCategory && (
            <p className="filter-status">
              「{selectedCategory}」 {works.length} 件
            </p>
          )}
        </div>
        <WorkGrid key={gridKey} works={works} />
      </section>
    </div>
  )
}
