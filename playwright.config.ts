import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './global-setup.ts',

  testDir: './tests',
  fullyParallel: true,

  timeout: 120000,                 // overall test timeout
  expect: { timeout: 60000 },      // expect assertion timeout

  use: {
    baseURL: 'https://development.prism.deepstain.com',
    browserName: 'chromium',
    storageState: 'storageState.json',
    screenshot: 'only-on-failure',
    trace: 'on',
    video: 'on',
    navigationTimeout: 60000,      // navigation wait timeout
    actionTimeout: 60000           // action timeout
  },

  workers: 4,
  reporter: [['html', { open: 'on-failure' }]],
});
