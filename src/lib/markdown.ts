import { parse as parseYaml } from 'yaml'
import { getPerson } from './people'

export interface CreditRef {
  id: string
  name: string
  role?: string
}

export interface Frontmatter {
  title: string
  date: string
  summary?: string
  /** カテゴリ（旧 tags も読み込む） */
  categories?: string[]
  credits?: CreditRef[]
  thumbnail?: string
  /** 人物ページ用の画像（/images/people/...） */
  image?: string
  draft?: boolean
}

export interface ParsedMarkdown {
  data: Frontmatter
  content: string
}

function parseCredits(raw: unknown): CreditRef[] {
  if (!Array.isArray(raw)) return []

  const credits: CreditRef[] = []

  for (const item of raw) {
    if (typeof item === 'string') {
      const person = getPerson(item)
      if (!person) continue
      credits.push({ id: person.id, name: person.name })
      continue
    }

    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>
      const key = String(record.id ?? record.name ?? '')
      const person = getPerson(key)
      if (!person) continue
      credits.push({
        id: person.id,
        name: person.name,
        role: record.role != null ? String(record.role) : undefined,
      })
    }
  }

  return credits
}

export function parseMarkdownFile(raw: string): ParsedMarkdown {
  const normalized = raw.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) {
    return {
      data: { title: 'Untitled', date: '1970-01-01' },
      content: normalized,
    }
  }

  const end = normalized.indexOf('\n---', 3)
  if (end === -1) {
    return {
      data: { title: 'Untitled', date: '1970-01-01' },
      content: normalized,
    }
  }

  const yamlBlock = normalized.slice(3, end).replace(/^\r?\n/, '')
  const body = normalized.slice(end + 4).replace(/^\r?\n/, '')
  const parsed = parseYaml(yamlBlock) as Record<string, unknown>

  const categorySource = parsed.categories ?? parsed.tags
  const categories = Array.isArray(categorySource)
    ? categorySource.map(String)
    : typeof categorySource === 'string'
      ? [categorySource]
      : []

  return {
    data: {
      title: String(parsed.title ?? 'Untitled'),
      date: String(parsed.date ?? '1970-01-01'),
      summary: parsed.summary != null ? String(parsed.summary) : undefined,
      categories,
      credits: parseCredits(parsed.credits),
      thumbnail: parsed.thumbnail != null ? String(parsed.thumbnail) : undefined,
      image: parsed.image != null ? String(parsed.image) : undefined,
      draft: Boolean(parsed.draft),
    },
    content: body,
  }
}
