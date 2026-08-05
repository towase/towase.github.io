import { createFileRoute } from '@tanstack/react-router'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { loadMarkdown } from '~/lib/loadMarkdown'

export const Route = createFileRoute('/')({
  loader: () => loadMarkdown('index'),
  component: HomePage,
})

function HomePage() {
  const source = Route.useLoaderData()
  return (
    <div className="home-profile-container">
      <MarkdownRenderer
        source={source}
        className="home-profile"
        afterTitle={
          <img
            className="home-profile__image"
            src="/profile.png"
            alt=""
            width="500"
            height="500"
            fetchPriority="high"
          />
        }
      />
    </div>
  )
}
