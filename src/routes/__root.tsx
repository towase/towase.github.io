import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { css } from 'styled-system/css'

import { NavBar } from '~/components/NavBar'

import 'github-markdown-css/github-markdown-dark-dimmed.css'
import '~/styles/index.css'

const pageStyles = css({
  minHeight: '100vh',
  backgroundColor: 'gray.1',
  color: 'gray.12',
})

const mainStyles = css({
  maxWidth: '4xl',
  marginX: 'auto',
  paddingX: '6',
  paddingY: '8',
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'towase.github.io' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" data-theme="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className={pageStyles}>
          <NavBar />
          <main className={mainStyles}>{children}</main>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
