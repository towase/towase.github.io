import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/')({
  loader: () => loadMarkdown({ data: 'index' }),
  component: HomePage,
})

function HomePage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
