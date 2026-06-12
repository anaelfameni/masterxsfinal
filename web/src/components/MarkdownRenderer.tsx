import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
  /** Scroll to hash after render */
  scrollToHash?: boolean
}

export default function MarkdownRenderer({
  content,
  className,
  scrollToHash = true,
}: MarkdownRendererProps) {
  useEffect(() => {
    if (!scrollToHash) return
    const hash = window.location.hash.slice(1)
    if (!hash) return
    // Wait next tick for rendering
    const t = setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
    return () => clearTimeout(t)
  }, [content, scrollToHash])

  return (
    <div className={cn('prose-md', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              properties: { className: 'icon-link', ariaHidden: 'true' },
            },
          ],
          rehypeHighlight,
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
