// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // register tests share state (duplicate username), run in order
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'https://practice.expandtesting.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    // video recording needs a separate ffmpeg binary download; screenshots +
    // trace.zip already give full evidence (trace even includes a full replay),
    // so video is left off to avoid depending on that extra download.
  },
  projects: [
    // channel: 'chrome' tells Playwright to launch the Google Chrome that is
    // already installed on this machine, instead of downloading its own
    // bundled Chromium binary. This avoids network/firewall issues when
    // cdn.playwright.dev is slow or blocked. Requires Google Chrome to be
    // installed (google.com/chrome) — almost always already true on Windows.
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],
});
