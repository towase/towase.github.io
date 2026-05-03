import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createServerFn } from '@tanstack/react-start'

const SLUG_PATTERN = /^[a-z]+$/

export async function readMarkdownFromFs(slug: string): Promise<string> {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`)
  }
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
  return await readFile(filePath, 'utf8')
}

export const loadMarkdown = createServerFn({ method: 'GET' })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== 'string') {
      throw new Error('slug must be a string')
    }
    return slug
  })
  .handler(async ({ data }) => {
    return await readMarkdownFromFs(data)
  })
