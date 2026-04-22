/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'

const useDockerStack = process.env.PLAYWRIGHT_USE_DOCKER === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: useDockerStack
    ? undefined
    : [
        {
          command: 'cd ../backend && npm run dev',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: true,
          timeout: 120000,
        },
        {
          command: 'npm run dev -- --host 127.0.0.1 --port 5173',
          url: 'http://127.0.0.1:5173',
          reuseExistingServer: true,
          timeout: 120000,
        },
      ],
})
