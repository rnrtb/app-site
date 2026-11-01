interface Props {
  html: string
  className?: string
}

/** Markdown HTML を描画する（iframe 埋め込みはそのまま表示できる） */
export function MarkdownBody({ html, className }: Props) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
