import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? systemChrome;
const browserOverride = existsSync(executablePath) ? { channel: 'chrome' as const } : {};

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    ...browserOverride,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: 'list',
  webServer: {
    command:
      'cd ../.. && pnpm --filter @todo/web-react build && cd apps/web-react && pnpm exec vite preview --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
