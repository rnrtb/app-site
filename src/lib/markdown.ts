import { parse as parseYaml } from 'yaml'

export interface Frontmatter {
  title: string
  date: string
  summary?: string
  tags?: string[]
  thumbnail?: string
  draft?: boolean
}

export interface ParsedMarkdown {
  data: Frontmatter
  content: string
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

  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map(String)
    : typeof parsed.tags === 'string'
      ? [parsed.tags]
      : []

  return {
    data: {
      title: String(parsed.title ?? 'Untitled'),
      date: String(parsed.date ?? '1970-01-01'),
      summary: parsed.summary != null ? String(parsed.summary) : undefined,
      tags,
      thumbnail: parsed.thumbnail != null ? String(parsed.thumbnail) : undefined,
      draft: Boolean(parsed.draft),
    },
    content: body,
  }
}
