import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { MarkdownRenderer } from './MarkdownRenderer'

async function renderMarkdown(source: string) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <MarkdownRenderer source={source} />,
  })
  const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: () => <div>about</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, aboutRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('MarkdownRenderer', () => {
  it('renders heading from markdown source', async () => {
    const screen = await renderMarkdown('# Hello\n\nbody text')
    await expect.element(screen.getByRole('heading', { level: 1, name: 'Hello' })).toBeVisible()
  })

  it('uses TanStack Link for internal links (path starts with /)', async () => {
    const screen = await renderMarkdown('[Go to about](/about)')
    const link = screen.getByRole('link', { name: 'Go to about' })
    await expect.element(link).toHaveAttribute('href', '/about')
    await expect.element(link).not.toHaveAttribute('target')
  })

  it('renders external links with target=_blank and noopener', async () => {
    const screen = await renderMarkdown('[Example](https://example.com)')
    const link = screen.getByRole('link', { name: 'Example' })
    await expect.element(link).toHaveAttribute('href', 'https://example.com')
    await expect.element(link).toHaveAttribute('target', '_blank')
    const rel = (await link.element()).getAttribute('rel') ?? ''
    expect(rel).toContain('noopener')
    expect(rel).toContain('noreferrer')
  })

  it('adds id to headings via rehype-slug', async () => {
    const screen = await renderMarkdown('# 自己紹介')
    const heading = screen.getByRole('heading', { level: 1, name: '自己紹介' })
    await expect.element(heading).toHaveAttribute('id', '自己紹介')
  })

  it('wraps content in markdown-body article', async () => {
    const screen = await renderMarkdown('hello')
    const article = screen.container.querySelector('article.markdown-body')
    expect(article).not.toBeNull()
  })
})
