import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/about')({
  loader: () => loadMarkdown({ data: 'about' }),
  component: AboutPage,
})

function AboutPage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
