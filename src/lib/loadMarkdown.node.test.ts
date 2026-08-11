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

  it('documents full-time employment through February 2026', () => {
    expect(loadMarkdown('index')).toContain('2015/04〜2026/02 の職歴は、すべて正社員')
    expect(loadMarkdown('career')).toContain('2015年04月〜2026年02月までの職歴は、すべて正社員')
  })

  it('reads principles.md from content/', () => {
    expect(loadMarkdown('principles')).toContain('原則')
  })

  it('reads working-with-me.md from content/', () => {
    expect(loadMarkdown('working-with-me')).toContain('一緒に働くうえで')
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
