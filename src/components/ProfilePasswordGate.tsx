import type { FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { css } from 'styled-system/css'

const SESSION_KEY = 'profile-authenticated'

const gateStyles = css({
  maxWidth: 'md',
  marginX: 'auto',
  marginY: { base: '8', md: '16' },
  padding: { base: '6', md: '8' },
  borderWidth: '1px',
  borderColor: 'gray.6',
  borderRadius: 'xl',
  backgroundColor: 'gray.2',
  boxShadow: 'md',
})

const iconStyles = css({
  width: '10',
  height: '10',
  marginBottom: '4',
  color: 'blue.9',
})

const headingStyles = css({ fontSize: '2xl', fontWeight: 'bold', lineHeight: '1.3' })
const descriptionStyles = css({ marginTop: '3', color: 'gray.11' })
const formStyles = css({ marginTop: '6' })
const labelStyles = css({ display: 'block', marginBottom: '2', fontWeight: 'semibold' })
const inputRowStyles = css({ display: 'flex', gap: '2' })
const inputStyles = css({
  flex: '1',
  minWidth: '0',
  minHeight: '12',
  paddingX: '3',
  borderWidth: '1px',
  borderColor: 'gray.7',
  borderRadius: 'md',
  backgroundColor: 'gray.1',
  fontSize: 'md',
  _focusVisible: { outline: '3px solid', outlineColor: 'blue.8', outlineOffset: '2px' },
})
const toggleStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '12',
  minHeight: '12',
  borderWidth: '1px',
  borderColor: 'gray.7',
  borderRadius: 'md',
  color: 'gray.11',
  cursor: 'pointer',
  _hover: { backgroundColor: 'gray.3' },
  _focusVisible: { outline: '3px solid', outlineColor: 'blue.8', outlineOffset: '2px' },
})
const errorStyles = css({ marginTop: '3', color: 'red.10', fontWeight: 'medium' })
const submitStyles = css({
  width: 'full',
  minHeight: '12',
  marginTop: '5',
  paddingX: '5',
  borderRadius: 'md',
  backgroundColor: 'blue.9',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  _hover: { backgroundColor: 'blue.10' },
  _focusVisible: { outline: '3px solid', outlineColor: 'blue.8', outlineOffset: '3px' },
  _disabled: { cursor: 'wait', opacity: '0.7' },
})

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hashesMatch(actual: string, expected: string): boolean {
  if (actual.length !== expected.length) return false

  let difference = 0
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index)
  }
  return difference === 0
}

type ProfilePasswordGateProps = {
  children: ReactNode
  passwordHash: string
}

export function ProfilePasswordGate({ children, passwordHash }: ProfilePasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(SESSION_KEY) === 'true')
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      const inputHash = await hashPassword(password)
      if (!hashesMatch(inputHash, passwordHash)) {
        setError('パスワードが違います。入力内容を確認して、もう一度お試しください。')
        return
      }

      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthenticated(true)
    } catch {
      setError('認証処理に失敗しました。ページを再読み込みして、もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (authenticated) return children

  return (
    <section className={gateStyles} aria-labelledby="profile-gate-title">
      <svg className={iconStyles} aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" stroke="currentColor" strokeWidth="2" />
      </svg>
      <h1 id="profile-gate-title" className={headingStyles}>
        プロフィールは限定公開です
      </h1>
      <p className={descriptionStyles}>パスワードを入力するとプロフィールを表示できます。</p>

      <form className={formStyles} onSubmit={handleSubmit}>
        <label className={labelStyles} htmlFor="profile-password">
          パスワード
        </label>
        <div className={inputRowStyles}>
          <input
            className={inputStyles}
            id="profile-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            autoComplete="current-password"
            enterKeyHint="done"
            aria-describedby={error ? 'profile-password-error' : undefined}
            required
          />
          <button
            className={toggleStyles}
            type="button"
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path
                  d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 6 9 6a17 17 0 0 1-2.1 2.8M6.6 6.6C4.2 8.2 3 10 3 10s3.5 6 9 6a9.7 9.7 0 0 0 3-.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path
                  d="M3 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
        {error ? (
          <p id="profile-password-error" className={errorStyles} aria-live="polite">
            {error}
          </p>
        ) : null}
        <button className={submitStyles} type="submit" disabled={submitting}>
          {submitting ? '確認中…' : 'プロフィールを見る'}
        </button>
      </form>
    </section>
  )
}
