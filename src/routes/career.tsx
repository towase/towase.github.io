import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/career')({
  loader: () => loadMarkdown({ data: 'career' }),
  component: CareerPage,
})

function CareerPage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
