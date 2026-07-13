import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { hashPassword, ProfilePasswordGate } from './ProfilePasswordGate'

const password = 'correct-password'

async function renderGate() {
  sessionStorage.clear()
  const passwordHash = await hashPassword(password)
  return render(
    <ProfilePasswordGate passwordHash={passwordHash}>
      <p>非公開プロフィール</p>
    </ProfilePasswordGate>,
  )
}

it('does not render profile content before authentication', async () => {
  const screen = await renderGate()

  await expect.element(screen.getByLabelText('パスワード', { exact: true })).toBeVisible()
  expect(screen.getByText('非公開プロフィール').query()).toBeNull()
})

it('reveals profile content after entering the correct password', async () => {
  const screen = await renderGate()

  await screen.getByLabelText('パスワード', { exact: true }).fill(password)
  await screen.getByRole('button', { name: 'プロフィールを見る' }).click()

  await expect.element(screen.getByText('非公開プロフィール')).toBeVisible()
  expect(screen.getByLabelText('パスワード', { exact: true }).query()).toBeNull()
})

it('shows an actionable error and keeps content hidden for a wrong password', async () => {
  const screen = await renderGate()

  await screen.getByLabelText('パスワード', { exact: true }).fill('wrong-password')
  await screen.getByRole('button', { name: 'プロフィールを見る' }).click()

  await expect
    .element(screen.getByText('パスワードが違います。入力内容を確認して、もう一度お試しください。'))
    .toBeVisible()
  expect(screen.getByText('非公開プロフィール').query()).toBeNull()
})

it('restores authentication from session storage', async () => {
  sessionStorage.setItem('profile-authenticated', 'true')
  const passwordHash = await hashPassword(password)
  const screen = await render(
    <ProfilePasswordGate passwordHash={passwordHash}>
      <p>非公開プロフィール</p>
    </ProfilePasswordGate>,
  )

  await expect.element(screen.getByText('非公開プロフィール')).toBeVisible()
})

it('clears the error when the user edits the password', async () => {
  const screen = await renderGate()

  await screen.getByLabelText('パスワード', { exact: true }).fill('wrong-password')
  await screen.getByRole('button', { name: 'プロフィールを見る' }).click()
  await expect
    .element(screen.getByText('パスワードが違います。入力内容を確認して、もう一度お試しください。'))
    .toBeVisible()

  await screen.getByLabelText('パスワード', { exact: true }).fill('correct')

  expect(
    screen.getByText('パスワードが違います。入力内容を確認して、もう一度お試しください。').query(),
  ).toBeNull()
})

it('reports an unavailable browser crypto API', async () => {
  const screen = await renderGate()
  const digest = vi.spyOn(crypto.subtle, 'digest').mockRejectedValueOnce(new Error('unavailable'))

  await screen.getByLabelText('パスワード', { exact: true }).fill(password)
  await screen.getByRole('button', { name: 'プロフィールを見る' }).click()

  await expect
    .element(
      screen.getByText('認証処理に失敗しました。ページを再読み込みして、もう一度お試しください。'),
    )
    .toBeVisible()
  digest.mockRestore()
})
