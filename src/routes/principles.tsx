import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/principles')({
  loader: () => loadMarkdown('principles'),
  component: PrinciplesPage,
})

function PrinciplesPage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
