import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/behavior')({
  loader: () => loadMarkdown({ data: 'behavior' }),
  component: BehaviorPage,
})

function BehaviorPage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
