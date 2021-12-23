import React, { useRef, useEffect } from 'react'
import { renderMarkdown } from '@scripts/markdown'

interface MemoMarkedownProps {
  markdown: string
  className?: string
}
export const MemoMarkdown: React.FC<MemoMarkedownProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (element && props.markdown)
      element.innerHTML = renderMarkdown(props.markdown)
    return () => {
      if (element) element.innerHTML = ''
    }
  }, [props])
  return (
    <div ref={ref} className={`memo-markdown`}>
    </div>
  )
}
