import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /*
  webServer: [
    {
      command: 'cd ../backend && source venv/bin/activate && uvicorn app.main:app --port 8000',
      url: 'http://localhost:8000/docs',
      reuseExistingServer: !process.env.CI,
      cwd: './',
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: './',
    }
  ],
  */
});
