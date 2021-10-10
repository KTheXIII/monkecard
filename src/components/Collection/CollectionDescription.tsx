import React, { useRef, useEffect } from 'react'
import marked from 'marked'
import katex from 'katex'
import DOMPurify from 'dompurify'

import './collection-description.scss'

const EQUATION_BLOCK_REGEX = /^\$\$([\s\S]+)\$\$|\\begin{equation}([\s\S]+)\\end{equation}/gm
const EQUATION_REGEX = /\$([\s\S]+)\$/gm

interface IProps {
  text: string
}

export const CollectionDescription: React.FC<IProps> = (props) => {
  const textRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!textRef.current) return
    const el = textRef.current
    let text = props.text
    const blockMatch = text.match(EQUATION_BLOCK_REGEX)
    if (blockMatch) {
      text = blockMatch.reduce((acc, cur) => {
        const eq = katex.renderToString(cur.replace(EQUATION_BLOCK_REGEX, '$1$2'), { displayMode: true })
        return acc.replace(cur, eq)
      }, text)
    }
    const inlineMatch = text.match(EQUATION_REGEX)
    if (inlineMatch) {
      text = inlineMatch.reduce((acc, cur) => {
        const eq = katex.renderToString(cur.replace(EQUATION_REGEX, '$1'), { displayMode: false })
        return acc.replace(cur, eq)
      }, text)
    }
    el.innerHTML = marked(text, { sanitizer: DOMPurify.sanitize })
    return () => {
      el.innerHTML = ''
    }
  }, [props])

  return (
    <div className="collection-description">
      <div className="description-info">
        <span>description</span>
      </div>
      <div ref={textRef} className="description-text"></div>
    </div>
  )
}
