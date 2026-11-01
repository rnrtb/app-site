import { marked } from 'marked'
import { parseMarkdownFile } from './markdown'
import { getAllPeople, getPerson, type Person } from './people'

export interface PersonProfile {
  person: Person
  image?: string
  bodyHtml: string
}

const modules = import.meta.glob('../../content/people/*.md', {
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

function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\uFEFF?\s*#\s+[^\n]+\r?\n*/, '')
}

const profiles = new Map<string, PersonProfile>()

for (const [path, raw] of Object.entries(modules)) {
  const slug = slugFromPath(path)
  const person = getPerson(slug)
  if (!person) continue
  if (person.id !== slug) continue

  const { data, content } = parseMarkdownFile(raw)
  profiles.set(person.id, {
    person,
    image: data.image,
    bodyHtml: toHtml(stripLeadingH1(content)),
  })
}

export function getPersonProfile(idOrName: string): PersonProfile | undefined {
  const person = getPerson(idOrName)
  if (!person) return undefined
  return profiles.get(person.id)
}

export function listPeopleWithProfiles(): Person[] {
  return getAllPeople().filter((person) => profiles.has(person.id))
}
