import { defineConfig } from '@playwright/test';

// Runs the tests against the checked-out source, served locally. This is the
// config CI uses on push/PR so we validate the code in the change — not the
// already-deployed production site. Uses Python's stdlib static server so we
// don't add an npm dependency (available on GitHub runners and dev machines).
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://127.0.0.1:8888',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'python3 -m http.server 8888',
    url: 'http://127.0.0.1:8888',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    { name: 'desktop-chrome', use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 375, height: 812 } } },
  ],
});
