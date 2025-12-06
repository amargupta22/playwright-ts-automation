import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { testCredentials } from './fixtures/testCredentials';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'https://development.prism.deepstain.com';
  
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await login.open();
  await login.startAuth0();
  await login.login(testCredentials.email, testCredentials.password);

  // Wait for navigation to complete and ensure all cookies are set
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
   // Verify we're on the dashboard (successful login)
  try {
    await dashboard.verifyOrganizationActivityVisible();
    console.log('✅ Dashboard loaded successfully');
  } catch (error) {
    console.error('❌ Dashboard verification failed - Authentication may have failed');
    throw new Error('GlobalSetup failed: Dashboard not loaded. Please check credentials and try again.');
  }
  
  // Additional wait to ensure session cookies are set
  await page.waitForTimeout(2000);

  // Save storage state so all tests skip login
  await context.storageState({ path: 'storageState.json' });

  await browser.close();
}

export default globalSetup;
