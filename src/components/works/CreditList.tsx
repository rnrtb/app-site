import { Link } from 'react-router-dom'
import type { CreditRef } from '../../lib/markdown'

interface Props {
  credits: CreditRef[]
  /** カード上など、役割を出さず名前だけにする */
  namesOnly?: boolean
  /** 記事末尾のクレジット欄向け（縦並び） */
  stacked?: boolean
}

export function CreditList({
  credits,
  namesOnly = false,
  stacked = false,
}: Props) {
  if (credits.length === 0) return null

  return (
    <ul
      className={stacked ? 'credit-list credit-list-stacked' : 'credit-list'}
      aria-label="クレジット"
    >
      {credits.map((credit) => (
        <li key={`${credit.id}-${credit.role ?? ''}`}>
          <Link to={`/people/${credit.id}`} className="credit-chip">
            {credit.name}
          </Link>
          {!namesOnly && credit.role ? (
            <span className="credit-role">：{credit.role}</span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
