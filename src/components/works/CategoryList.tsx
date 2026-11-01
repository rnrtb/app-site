import { Link } from 'react-router-dom'

interface Props {
  categories: string[]
  /** クリックでカテゴリ絞り込みへ（一覧以外では省略可） */
  onSelect?: (category: string) => void
}

export function CategoryList({ categories, onSelect }: Props) {
  if (categories.length === 0) return null

  return (
    <ul className="category-list" aria-label="カテゴリ">
      {categories.map((category) => (
        <li key={category}>
          {onSelect ? (
            <button
              type="button"
              className="category-chip"
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          ) : (
            <Link
              className="category-chip"
              to={`/works?category=${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
