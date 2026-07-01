import { describe, expect, it } from 'vitest'

import { loadMarkdown } from './loadMarkdown'

describe('loadMarkdown', () => {
  it('reads index.md from content/', () => {
    expect(loadMarkdown('index')).toContain('はじめに')
  })

  it('reads about.md from content/', () => {
    expect(loadMarkdown('about')).toContain('自己紹介')
  })

  it('reads career.md from content/', () => {
    expect(loadMarkdown('career')).toContain('職務経歴書')
  })

  it('documents full-time employment through 2026-02-17', () => {
    expect(loadMarkdown('index')).toContain('2015/04/01〜2026/02/17 の職歴は、すべて正社員')
    expect(loadMarkdown('career')).toContain('2015年04月01日〜2026年02月17日までの職歴は、すべて正社員')
  })

  it('reads behavior.md from content/', () => {
    expect(loadMarkdown('behavior')).toContain('スタンス')
  })

  it('reads manual.md from content/', () => {
    expect(loadMarkdown('manual')).toContain('ワークスタイル')
  })

  it('rejects slug containing traversal characters', () => {
    expect(() => loadMarkdown('../package')).toThrow('Invalid slug')
  })

  it('rejects empty slug', () => {
    expect(() => loadMarkdown('')).toThrow('Invalid slug')
  })

  it('throws when file does not exist', () => {
    expect(() => loadMarkdown('nonexistent')).toThrow('Markdown not found')
  })
})
