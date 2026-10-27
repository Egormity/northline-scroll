import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  workers: 1,
  reporter: 'list',
  outputDir: '.playwright/results',
  use: {
    baseURL: 'http://127.0.0.1:4410',
    viewport: { width: 1600, height: 1000 },
    screenshot: 'only-on-failure',
    launchOptions: { executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome' },
  },
  webServer: {
    command: 'python3 scripts/serve.py --port 4410',
    url: 'http://127.0.0.1:4410/__northline_health__',
    reuseExistingServer: false,
  },
});
