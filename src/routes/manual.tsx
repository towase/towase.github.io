import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/manual')({
  loader: () => loadMarkdown({ data: 'manual' }),
  component: ManualPage,
})

function ManualPage() {
  const source = Route.useLoaderData()
  return <MarkdownRenderer source={source} />
}
