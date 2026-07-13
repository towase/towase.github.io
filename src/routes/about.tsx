import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { ProfilePasswordGate } from '~/components/ProfilePasswordGate'
import { loadMarkdown } from '~/lib/loadMarkdown'

const PROFILE_PASSWORD_HASH = '70d1f960c02dac2f8a8c24d952929ab399fea11b7e42bf3d7787ab62508e2467'

export const Route = createFileRoute('/about')({
  loader: () => loadMarkdown('about'),
  component: AboutPage,
})

function AboutPage() {
  const source = Route.useLoaderData()
  return (
    <ProfilePasswordGate passwordHash={PROFILE_PASSWORD_HASH}>
      <MarkdownRenderer source={source} />
    </ProfilePasswordGate>
  )
}
