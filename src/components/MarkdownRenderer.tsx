import { Link } from '@tanstack/react-router'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

type AnchorProps = ComponentPropsWithoutRef<'a'>

type MarkdownRendererProps = {
  source: string
  className?: string
  afterTitle?: ReactNode
}

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

export function MarkdownRenderer({ source, className, afterTitle }: MarkdownRendererProps) {
  const articleClassName = ['markdown-body', className].filter(Boolean).join(' ')

  return (
    <article className={articleClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        ]}
        components={{
          a: MarkdownLink,
          ...(afterTitle
            ? {
                h1: ({ children, ...rest }: ComponentPropsWithoutRef<'h1'>) => (
                  <>
                    <h1 {...rest}>{children}</h1>
                    {afterTitle}
                  </>
                ),
              }
            : {}),
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  )
}
