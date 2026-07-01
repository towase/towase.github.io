import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { css } from 'styled-system/css'

import { NavBar } from '~/components/NavBar'

import 'github-markdown-css/github-markdown-dark-dimmed.css'
import '~/styles/index.css'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const GA_ID = 'G-E6VT5SSC90'

const pageStyles = css({
  minHeight: '100vh',
  backgroundColor: 'gray.1',
  color: 'gray.12',
})

const mainStyles = css({
  maxWidth: '3xl',
  marginX: 'auto',
  paddingX: { base: '5', md: '8' },
  paddingY: { base: '8', md: '12' },
  fontSize: 'md',
  lineHeight: '1.7',
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'towase.github.io' },
    ],
    scripts: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}', { send_page_view: false });`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter()

  useEffect(() => {
    const send = (path: string) => {
      window.gtag?.('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
    send(window.location.pathname)
    return router.subscribe('onResolved', ({ toLocation }) => {
      send(toLocation.pathname)
    })
  }, [router])

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" className="dark">
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
