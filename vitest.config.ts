import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const sharedAlias = {
  '~': fileURLToPath(new URL('./src', import.meta.url)),
  'styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
}

export default defineConfig({
  resolve: { alias: sharedAlias },
  test: {
    projects: [
      {
        resolve: { alias: sharedAlias },
        test: {
          name: 'node',
          environment: 'node',
          include: ['src/**/*.node.test.{ts,tsx}'],
        },
      },
      {
        plugins: [viteReact()],
        resolve: { alias: sharedAlias },
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      },
    ],
  },
})
