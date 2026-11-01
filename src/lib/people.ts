export interface Person {
  id: string
  /** クレジット上のメインの呼び方 */
  name: string
  /** 同一人物の別表記（frontmatter の id / name 解決用） */
  aliases: string[]
  /** 人物ページの見出し（未設定なら name） */
  pageName?: string
  /** 肩書き */
  title?: string
  /** 人物ページに出す別名表記（例: mrtb / むらつば） */
  handles?: string
}

/** クレジットに出す人・ユニットの定義。id が /people/{id} になる */
export const PEOPLE: Person[] = [
  {
    id: 'mrtb',
    name: 'むらつば',
    pageName: '村田 飛翔',
    aliases: [
      'muratsuba',
      '村田飛翔',
      '村田 飛翔',
      '村田飛翔（むらつば）',
      '村田 飛翔（むらつば）',
    ],
    title: 'みらい教育システム 代表',
    handles: 'mrtb / むらつば',
  },
  {
    id: 'hanachan',
    name: 'はなちゃん',
    aliases: [],
  },
  {
    id: 'noa',
    name: 'のあ',
    aliases: [],
  },
  {
    id: 'wakamesoup',
    name: 'わかめすうぷ',
    aliases: [],
  },
]

const byKey = new Map<string, Person>()

for (const person of PEOPLE) {
  byKey.set(person.id, person)
  byKey.set(person.id.toLowerCase(), person)
  byKey.set(person.name, person)
  if (person.pageName) {
    byKey.set(person.pageName, person)
  }
  for (const alias of person.aliases) {
    byKey.set(alias, person)
    byKey.set(alias.toLowerCase(), person)
  }
}

export function getPerson(idOrName: string): Person | undefined {
  return byKey.get(idOrName) ?? byKey.get(idOrName.toLowerCase())
}

export function getAllPeople(): Person[] {
  return PEOPLE
}
