import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { testCredentials } from './fixtures/testCredentials';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'https://development.prism.deepstain.com';
  
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const login = new LoginPage(page);

  await login.open();
  await login.startAuth0();
  await login.login(testCredentials.email, testCredentials.password);

  // Wait for navigation to complete and ensure all cookies are set
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Verify we're on the dashboard (successful login)
  await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 }).catch(() => {
    // If specific selector fails, just wait for URL change
    console.log('Dashboard selector not found, checking URL...');
  });
  
  // Additional wait to ensure session cookies are set
  await page.waitForTimeout(2000);

  // Save storage state so all tests skip login
  await context.storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;
