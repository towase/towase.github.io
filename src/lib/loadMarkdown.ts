const modules = import.meta.glob('/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const SLUG_PATTERN = /^[a-z]+$/

export function loadMarkdown(slug: string): string {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug: ${slug}`)
  }
  const content = modules[`/content/${slug}.md`]
  if (content === undefined) {
    throw new Error(`Markdown not found: ${slug}`)
  }
  return content
}
