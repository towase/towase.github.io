import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/working-with-me')({
  loader: () => loadMarkdown('working-with-me'),
  component: WorkingWithMePage,
})

function WorkingWithMePage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
