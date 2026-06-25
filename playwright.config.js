// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60000,

  use: {
    browserName: 'chromium',
    headless: false,
    //viewport: { width: 1920, height: 1080 },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  reporter: 'html',
});