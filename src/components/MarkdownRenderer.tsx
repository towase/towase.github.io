import { Link } from '@tanstack/react-router'
import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

type AnchorProps = ComponentPropsWithoutRef<'a'>

function MarkdownLink({ href, children, ...rest }: AnchorProps) {
  if (typeof href === 'string' && href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

export function MarkdownRenderer({ source }: { source: string }) {
  return (
    <article className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        ]}
        components={{ a: MarkdownLink }}
      >
        {source}
      </ReactMarkdown>
    </article>
  )
}
