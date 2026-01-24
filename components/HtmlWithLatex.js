import DOMPurify from 'isomorphic-dompurify'
import renderMathInElement from 'katex/contrib/auto-render'
import { useEffect, useMemo, useRef } from 'react'

const HtmlWithLatex = ({ html = '', className }) => {
  const containerRef = useRef(null)
  const safeHtml = useMemo(() => DOMPurify.sanitize(html ?? ''), [html])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = safeHtml
    renderMathInElement(containerRef.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\\\(', right: '\\\\)', display: false },
        { left: '$', right: '$', display: false },
        { left: '\\\\[', right: '\\\\]', display: true },
      ],
      throwOnError: false,
    })
  }, [safeHtml])

  return <div ref={containerRef} className={className} />
}

export default HtmlWithLatex
