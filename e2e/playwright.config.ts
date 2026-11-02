import { defineConfig, devices } from '@playwright/test';

const CI = Boolean(process.env.CI);
const visitorUrl = process.env.E2E_VISITOR_URL ?? 'http://localhost:5174';
const swiftshader = [
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : 4,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: visitorUrl,
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'mobile',
      testIgnore: 'no-webgl.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 360, height: 740 },
        isMobile: true,
        hasTouch: true,
        launchOptions: { args: swiftshader },
      },
    },
    {
      name: 'desktop',
      testMatch: ['landing.spec.ts', 'a11y.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: { args: swiftshader },
      },
    },
    {
      name: 'no-webgl',
      testMatch: 'no-webgl.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 360, height: 740 },
        isMobile: true,
        hasTouch: true,
        launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] },
      },
    },
  ],
  webServer: {
    command:
      'pnpm --filter @indoor/visitor exec vite build --outDir dist-e2e --emptyOutDir && pnpm --filter @indoor/visitor exec vite preview --outDir dist-e2e',
    url: visitorUrl,
    env: { VITE_TOUR_AUTOSTART: 'off' },
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
});
