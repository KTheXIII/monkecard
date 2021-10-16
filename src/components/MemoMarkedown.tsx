import React, { useRef, useEffect } from 'react'
import marked from 'marked'
import katex from 'katex'
import DOMPurify from 'dompurify'

const EQUATION_BLOCK_REGEX  = /^\$\$\n([\s\S]+)\n\$\$|\\begin{equation}([\s\S]+)\\end{equation}/gm
const EQUATION_INLINE_REGEX = /\$([\S]+)\$/gm

interface MemoMarkedownProps {
  markdown: string
}

function inlineMath(text: string) {
  const match = text.match(EQUATION_INLINE_REGEX)
  if (match) return match.reduce((acc, cur) => {
    const eq = katex.renderToString(cur.replace(EQUATION_INLINE_REGEX, '$1'),
      { displayMode: true })
    return acc.replace(cur, eq)
  }, text)
  return text
}

function blockMath(text: string) {
  const match = text.match(EQUATION_BLOCK_REGEX)
  if (match) return match.reduce((acc, cur) => {
    const eq = katex.renderToString(cur.replace(EQUATION_BLOCK_REGEX, '$1$2'),
      { displayMode: false })
    return acc.replace(cur, eq)
  }, text)
  return text
}

function renderHTMLAndLatex(raw: string) {
  return marked(blockMath(inlineMath(raw)), { sanitizer: DOMPurify.sanitize })
}

export const MemoMarkedown: React.FC<MemoMarkedownProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (element && props.markdown) {
      element.innerHTML = renderHTMLAndLatex(props.markdown)
    }
    return () => {
      if (element) element.innerHTML = ''
    }
  }, [props])
  return (
    <div ref={ref} className="memo-markdown">
    </div>
  )
}
