import marked from 'marked'
import katex from 'katex'
import DOMPurify from 'dompurify'

export const EQUATION_BLOCK_REGEX  = /^\${2}\s((?:.|\\\\\n)*)\s^\${2}$/gm
export const EQUATION_INLINE_REGEX = /\$([^$\n\r]+)\$/gm

export function renderInlineMatch(text: string): string {
  const match = text.match(EQUATION_INLINE_REGEX)
  // TODO: handle errors and don't crash
  if (match) return match.reduce((acc, cur) => {
    const eq = katex.renderToString(cur.replace(EQUATION_INLINE_REGEX, '$1'),
      { displayMode: false })
    return acc.replace(cur, eq)
  }, text)
  return text
}

export function renderBlockMatch(text: string): string {
  const match = text.match(EQUATION_BLOCK_REGEX)
  // TODO: handle errors and don't crash
  if (match) return match.reduce((acc, cur) => {
    const eq = katex.renderToString(cur.replace(EQUATION_BLOCK_REGEX, '$1'),
      { displayMode: true })
    return acc.replace(cur, eq)
  }, text)
  return text
}

export function renderMarkdown(text: string): string {
  return marked(renderBlockMatch(renderInlineMatch(text)), {
    sanitizer: DOMPurify.sanitize
  })
}
