export interface ContactTopic {
  /** URL の ?topic= で指定する値 */
  id: string
  label: string
}

export const CONTACT_TOPICS: ContactTopic[] = [
  { id: 'work', label: '制作・開発のご相談' },
  { id: 'talk', label: '登壇・ワークショップのご相談' },
  { id: 'typing-lab', label: 'タイピングラボについて' },
  { id: 'other', label: 'その他' },
]
