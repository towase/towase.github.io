import { describe, expect, it } from 'vitest'

import { readMarkdownFromFs } from './loadMarkdown'

describe('readMarkdownFromFs', () => {
  it('reads index.md from content/', async () => {
    const result = await readMarkdownFromFs('index')
    expect(result).toContain('はじめに')
  })

  it('reads about.md from content/', async () => {
    const result = await readMarkdownFromFs('about')
    expect(result).toContain('自己紹介')
  })

  it('reads career.md from content/', async () => {
    const result = await readMarkdownFromFs('career')
    expect(result).toContain('職務経歴書')
  })

  it('reads behavior.md from content/', async () => {
    const result = await readMarkdownFromFs('behavior')
    expect(result).toContain('スタンス')
  })

  it('reads manual.md from content/', async () => {
    const result = await readMarkdownFromFs('manual')
    expect(result).toContain('ワークスタイル')
  })

  it('rejects slug containing traversal characters', async () => {
    await expect(readMarkdownFromFs('../package')).rejects.toThrow('Invalid slug')
  })

  it('rejects empty slug', async () => {
    await expect(readMarkdownFromFs('')).rejects.toThrow('Invalid slug')
  })
})
