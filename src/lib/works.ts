import { marked } from 'marked'
import { parseMarkdownFile, type CreditRef, type Frontmatter } from './markdown'
import { getPerson, type Person } from './people'

/** 本文中のこの位置にクレジット一覧を差し込む */
export const CREDITS_MARKER = '<!-- credits -->'

export interface Work extends Frontmatter {
  slug: string
  bodyHtmlBefore: string
  bodyHtmlAfter: string
  hasCreditsMarker: boolean
  credits: CreditRef[]
  categories: string[]
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

function toHtml(markdown: string): string {
  const trimmed = markdown.trim()
  if (!trimmed) return ''
  return marked.parse(trimmed, { async: false }) as string
}

/** ページ見出しは frontmatter の title を使うので、本文先頭の # 見出しは除く */
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\uFEFF?\s*#\s+[^\n]+\r?\n*/, '')
}

function splitContent(content: string): {
  before: string
  after: string
  hasCreditsMarker: boolean
} {
  const index = content.indexOf(CREDITS_MARKER)
  if (index === -1) {
    return { before: content, after: '', hasCreditsMarker: false }
  }

  return {
    before: content.slice(0, index),
    after: content.slice(index + CREDITS_MARKER.length),
    hasCreditsMarker: true,
  }
}

function loadWorks(): Work[] {
  const works: Work[] = []

  for (const [path, raw] of Object.entries(modules)) {
    const slug = slugFromPath(path)
    if (slug.startsWith('_')) continue

    const { data, content } = parseMarkdownFile(raw)
    if (data.draft) continue

    const { before, after, hasCreditsMarker } = splitContent(
      stripLeadingH1(content),
    )

    works.push({
      ...data,
      credits: data.credits ?? [],
      categories: data.categories ?? [],
      slug,
      bodyHtmlBefore: toHtml(before),
      bodyHtmlAfter: toHtml(after),
      hasCreditsMarker,
    })
  }

  return works.sort((a, b) => b.date.localeCompare(a.date))
}

const works = loadWorks()

export function getAllWorks(): Work[] {
  return works
}

export function getAllCategories(): string[] {
  const set = new Set<string>()
  for (const work of works) {
    for (const category of work.categories) {
      set.add(category)
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ja'))
}

export function getWorksByCategory(category: string): Work[] {
  return works.filter((work) => work.categories.includes(category))
}

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug)
}

export function getWorksByPersonId(personId: string): Work[] {
  return works.filter((work) =>
    work.credits.some((credit) => credit.id === personId),
  )
}

export function getPersonWithWorks(
  idOrName: string,
): { person: Person; works: Work[] } | undefined {
  const person = getPerson(idOrName)
  if (!person) return undefined
  return { person, works: getWorksByPersonId(person.id) }
}

export function formatWorkDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
  if (!match) return date
  return `${match[1]}.${match[2]}.${match[3]}`
}
