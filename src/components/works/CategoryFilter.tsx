interface Props {
  categories: string[]
  value: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, value, onChange }: Props) {
  if (categories.length === 0) return null

  return (
    <div className="category-filter" role="group" aria-label="カテゴリ">
      <button
        type="button"
        className={value == null ? 'category-chip is-active' : 'category-chip'}
        onClick={() => onChange(null)}
      >
        すべて
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={
            value === category ? 'category-chip is-active' : 'category-chip'
          }
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
