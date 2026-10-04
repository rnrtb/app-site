import { marked } from 'marked'
import { parseMarkdownFile, type Frontmatter } from './markdown'

export interface Work extends Frontmatter {
  slug: string
  bodyHtml: string
}

const modules = import.meta.glob('../../content/works/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/i, '')
}

function loadWorks(): Work[] {
  const works: Work[] = []

  for (const [path, raw] of Object.entries(modules)) {
    const slug = slugFromPath(path)
    if (slug.startsWith('_')) continue

    const { data, content } = parseMarkdownFile(raw)
    if (data.draft) continue

    works.push({
      ...data,
      slug,
      bodyHtml: marked.parse(content, { async: false }) as string,
    })
  }

  return works.sort((a, b) => b.date.localeCompare(a.date))
}

const works = loadWorks()

export function getAllWorks(): Work[] {
  return works
}

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug)
}

export function formatWorkDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
  if (!match) return date
  return `${match[1]}.${match[2]}.${match[3]}`
}
