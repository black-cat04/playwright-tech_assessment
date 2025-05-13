import { PlaywrightTestConfig } from '@playwright/test';
import { env } from './utils/env';

const config: PlaywrightTestConfig = {
  testDir: './features',
  timeout: 30000,
  retries: env.CI ? 1 : 0,
  workers: env.CI ? 4 : undefined,
  reporter: [
    ['html', { 
      outputFolder: 'test-report',
      open: 'never'
    }],
    ['list']
  ],
  use: {
    baseURL: env.BASE_URL,
    headless: env.CI ? true : env.HEADLESS,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
        channel: 'chrome'
      }
    },
    {
      name: 'WebKit',
      use: {
        browserName: 'webkit'
      }
    }
  ],
  outputDir: 'test-results',
  preserveOutput: 'failures-only',
  reportSlowTests: {
    max: 5,
    threshold: 15000
  }
};

export default config; 